<?php
/**
 * PROTOOLS ADMINCP - PHP 8.2+ BACKWARD COMPATIBILITY BRIDGE & POLYFILL SHIM
 * Server: LiteSpeed Web Server / LSPHP 8.2+ / MariaDB 10.6
 *
 * Implements dual-engine (mysqli + PDO fallback) drop-in polyfills for ext/mysql functions,
 * ancient aliases (mysql_numrows, etc.), get_magic_quotes_gpc(), split(), and each() removed in PHP 7/8.
 */

// 1. Polyfill split() removed in PHP 7.0
if (!function_exists('split')) {
    function split($pattern, $string, $limit = -1) {
        $delimiter = '/' . str_replace('/', '\/', $pattern) . '/';
        return preg_split($delimiter, (string)$string, $limit);
    }
}

// 2. Polyfill each() removed in PHP 8.0
if (!function_exists('each')) {
    function each(&$arr) {
        $key = key($arr);
        if ($key === null) {
            return false;
        }
        $val = current($arr);
        next($arr);
        return array(1 => $val, 'value' => $val, 0 => $key, 'key' => $key);
    }
}

// 3. Polyfill get_magic_quotes_gpc() removed in PHP 8.0
if (!function_exists('get_magic_quotes_gpc')) {
    function get_magic_quotes_gpc() {
        return false;
    }
}

// 4. MySQL Constants
if (!defined('MYSQLI_ASSOC')) define('MYSQLI_ASSOC', 1);
if (!defined('MYSQLI_NUM'))   define('MYSQLI_NUM', 2);
if (!defined('MYSQLI_BOTH'))  define('MYSQLI_BOTH', 3);

if (!defined('MYSQL_ASSOC')) define('MYSQL_ASSOC', 1);
if (!defined('MYSQL_NUM'))   define('MYSQL_NUM', 2);
if (!defined('MYSQL_BOTH'))  define('MYSQL_BOTH', 3);

// 5. Dual-Engine Result Wrapper for PDO Fallback
class __LegacyPdoResultWrapper {
    private $rows;
    private $cursor = 0;
    public $num_rows = 0;

    public function __construct($stmt) {
        if ($stmt instanceof PDOStatement) {
            $this->rows = $stmt->fetchAll(PDO::FETCH_BOTH);
            $this->num_rows = count($this->rows);
        } else {
            $this->rows = array();
            $this->num_rows = 0;
        }
    }

    public function fetch_array($result_type = 3) {
        if ($this->cursor >= $this->num_rows) {
            return false;
        }
        $row = $this->rows[$this->cursor++];
        if ($result_type === 1) { // ASSOC
            $out = array();
            foreach ($row as $k => $v) {
                if (!is_int($k)) $out[$k] = $v;
            }
            return $out;
        } elseif ($result_type === 2) { // NUM
            $out = array();
            foreach ($row as $k => $v) {
                if (is_int($k)) $out[$k] = $v;
            }
            return $out;
        }
        return $row; // BOTH
    }

    public function data_seek($offset) {
        if ($offset >= 0 && $offset < $this->num_rows) {
            $this->cursor = $offset;
            return true;
        }
        return false;
    }

    public function result($row, $field = 0) {
        if (isset($this->rows[$row])) {
            $r = $this->rows[$row];
            if (isset($r[$field])) return $r[$field];
        }
        return false;
    }
}

// Global connection reference
if (!isset($GLOBALS['__legacy_mysql_link'])) {
    $GLOBALS['__legacy_mysql_link'] = null;
}
if (!isset($GLOBALS['__legacy_last_error'])) {
    $GLOBALS['__legacy_last_error'] = '';
}

if (!function_exists('__legacy_mysql_get_link')) {
    function __legacy_mysql_get_link($link = null) {
        if ($link !== null && (is_object($link) || is_resource($link))) {
            return $link;
        }
        if (!empty($GLOBALS['__legacy_mysql_link'])) {
            return $GLOBALS['__legacy_mysql_link'];
        }
        if (!empty($GLOBALS['con'])) {
            return $GLOBALS['con'];
        }
        return null;
    }
}

// 6. ext/mysql Polyfills
if (!function_exists('mysql_connect')) {
    function mysql_connect($server = null, $username = null, $password = null, $new_link = false, $client_flags = 0) {
        $host = $server ?: 'localhost';
        $user = $username ?: 'prod2e4e_user';
        $pass = $password ?: 'z2zxs5_B).9g';

        // Method A: Native MySQLi (if available)
        if (function_exists('mysqli_connect')) {
            $port = 3306;
            $socket = null;
            if (strpos($host, ':') !== false) {
                $parts = explode(':', $host, 2);
                $host = $parts[0];
                if (is_numeric($parts[1])) $port = (int)$parts[1];
                else $socket = $parts[1];
            }
            $conn = @mysqli_connect($host, $user, $pass, '', $port, $socket);
            if ($conn) {
                @mysqli_set_charset($conn, 'utf8mb4');
                $GLOBALS['__legacy_mysql_link'] = $conn;
                $GLOBALS['con'] = $conn;
                return $conn;
            }
        }

        // Method B: PDO Fallback (always available on PHP 8.2)
        try {
            $dsn = "mysql:host={$host};charset=utf8mb4";
            $pdo = new PDO($dsn, $user, $pass, array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_SILENT,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_BOTH
            ));
            $GLOBALS['__legacy_mysql_link'] = $pdo;
            $GLOBALS['con'] = $pdo;
            return $pdo;
        } catch (Exception $e) {
            $GLOBALS['__legacy_last_error'] = $e->getMessage();
            return false;
        }
    }
}

if (!function_exists('mysql_pconnect')) {
    function mysql_pconnect($server = null, $username = null, $password = null, $client_flags = 0) {
        return mysql_connect($server, $username, $password, false, $client_flags);
    }
}

if (!function_exists('mysql_select_db')) {
    function mysql_select_db($database_name, $link = null) {
        $conn = __legacy_mysql_get_link($link);
        if (!$conn) return false;

        if (function_exists('mysqli_select_db') && ($conn instanceof mysqli)) {
            return @mysqli_select_db($conn, $database_name);
        }
        if ($conn instanceof PDO) {
            try {
                $conn->exec("USE `{$database_name}`");
                return true;
            } catch (Exception $e) {
                $GLOBALS['__legacy_last_error'] = $e->getMessage();
                return false;
            }
        }
        return false;
    }
}

if (!function_exists('mysql_query')) {
    function mysql_query($query, $link = null) {
        $conn = __legacy_mysql_get_link($link);
        if (!$conn) return false;

        if (function_exists('mysqli_query') && ($conn instanceof mysqli)) {
            $res = @mysqli_query($conn, $query);
            if (!$res) $GLOBALS['__legacy_last_error'] = @mysqli_error($conn);
            return $res;
        }

        if ($conn instanceof PDO) {
            $trimmed = trim($query);
            $is_select = preg_match('/^(SELECT|SHOW|DESCRIBE|EXPLAIN)/i', $trimmed);
            try {
                if ($is_select) {
                    $stmt = $conn->query($query);
                    if ($stmt === false) {
                        $err = $conn->errorInfo();
                        $GLOBALS['__legacy_last_error'] = isset($err[2]) ? $err[2] : 'Query failed';
                        return false;
                    }
                    return new __LegacyPdoResultWrapper($stmt);
                } else {
                    $affected = $conn->exec($query);
                    if ($affected === false) {
                        $err = $conn->errorInfo();
                        $GLOBALS['__legacy_last_error'] = isset($err[2]) ? $err[2] : 'Exec failed';
                        return false;
                    }
                    return true;
                }
            } catch (Exception $e) {
                $GLOBALS['__legacy_last_error'] = $e->getMessage();
                return false;
            }
        }
        return false;
    }
}

if (!function_exists('mysql_fetch_array')) {
    function mysql_fetch_array($result, $result_type = 3) {
        if ($result instanceof __LegacyPdoResultWrapper) {
            return $result->fetch_array($result_type);
        }
        if (function_exists('mysqli_fetch_array') && ($result instanceof mysqli_result)) {
            return @mysqli_fetch_array($result, $result_type);
        }
        return false;
    }
}

if (!function_exists('mysql_fetch_assoc')) {
    function mysql_fetch_assoc($result) {
        return mysql_fetch_array($result, 1);
    }
}

if (!function_exists('mysql_fetch_row')) {
    function mysql_fetch_row($result) {
        return mysql_fetch_array($result, 2);
    }
}

if (!function_exists('mysql_num_rows')) {
    function mysql_num_rows($result) {
        if ($result instanceof __LegacyPdoResultWrapper) {
            return $result->num_rows;
        }
        if (function_exists('mysqli_num_rows') && ($result instanceof mysqli_result)) {
            return @mysqli_num_rows($result);
        }
        return 0;
    }
}

if (!function_exists('mysql_insert_id')) {
    function mysql_insert_id($link = null) {
        $conn = __legacy_mysql_get_link($link);
        if ($conn instanceof PDO) {
            return $conn->lastInsertId();
        }
        if (function_exists('mysqli_insert_id') && ($conn instanceof mysqli)) {
            return @mysqli_insert_id($conn);
        }
        return 0;
    }
}

if (!function_exists('mysql_real_escape_string')) {
    function mysql_real_escape_string($string, $link = null) {
        $conn = __legacy_mysql_get_link($link);
        if ($conn instanceof PDO) {
            $quoted = $conn->quote((string)$string);
            return substr($quoted, 1, -1);
        }
        if (function_exists('mysqli_real_escape_string') && ($conn instanceof mysqli)) {
            return @mysqli_real_escape_string($conn, (string)$string);
        }
        return addslashes((string)$string);
    }
}

if (!function_exists('mysql_escape_string')) {
    function mysql_escape_string($string) {
        return mysql_real_escape_string($string);
    }
}

if (!function_exists('mysql_error')) {
    function mysql_error($link = null) {
        $conn = __legacy_mysql_get_link($link);
        if ($conn instanceof PDO) {
            $err = $conn->errorInfo();
            return isset($err[2]) ? $err[2] : $GLOBALS['__legacy_last_error'];
        }
        if (function_exists('mysqli_error') && ($conn instanceof mysqli)) {
            return @mysqli_error($conn);
        }
        return $GLOBALS['__legacy_last_error'];
    }
}

if (!function_exists('mysql_close')) {
    function mysql_close($link = null) {
        $conn = __legacy_mysql_get_link($link);
        if ($conn instanceof PDO) {
            $GLOBALS['__legacy_mysql_link'] = null;
            $GLOBALS['con'] = null;
            return true;
        }
        if (function_exists('mysqli_close') && ($conn instanceof mysqli)) {
            $res = @mysqli_close($conn);
            $GLOBALS['__legacy_mysql_link'] = null;
            $GLOBALS['con'] = null;
            return $res;
        }
        return true;
    }
}

if (!function_exists('mysql_free_result')) {
    function mysql_free_result($result) {
        if (function_exists('mysqli_free_result') && ($result instanceof mysqli_result)) {
            @mysqli_free_result($result);
        }
        return true;
    }
}

if (!function_exists('mysql_data_seek')) {
    function mysql_data_seek($result, $row_number) {
        if ($result instanceof __LegacyPdoResultWrapper) {
            return $result->data_seek($row_number);
        }
        if (function_exists('mysqli_data_seek') && ($result instanceof mysqli_result)) {
            return @mysqli_data_seek($result, $row_number);
        }
        return false;
    }
}

if (!function_exists('mysql_result')) {
    function mysql_result($result, $row, $field = 0) {
        if ($result instanceof __LegacyPdoResultWrapper) {
            return $result->result($row, $field);
        }
        if (function_exists('mysqli_data_seek') && ($result instanceof mysqli_result)) {
            if (@mysqli_data_seek($result, $row)) {
                $row_data = @mysqli_fetch_array($result);
                if (isset($row_data[$field])) {
                    return $row_data[$field];
                }
            }
        }
        return false;
    }
}

// 7. Ancient ext/mysql Aliases
if (!function_exists('mysql_numrows')) {
    function mysql_numrows($result) {
        return mysql_num_rows($result);
    }
}
if (!function_exists('mysql_freeresult')) {
    function mysql_freeresult($result) {
        return mysql_free_result($result);
    }
}
if (!function_exists('mysql_selectdb')) {
    function mysql_selectdb($database_name, $link = null) {
        return mysql_select_db($database_name, $link);
    }
}
if (!function_exists('mysql_get_server_info')) {
    function mysql_get_server_info($link = null) {
        return '10.6.18-MariaDB';
    }
}
if (!function_exists('mysql_db_query')) {
    function mysql_db_query($database, $query, $link = null) {
        mysql_select_db($database, $link);
        return mysql_query($query, $link);
    }
}
