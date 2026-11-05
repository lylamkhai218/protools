$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$testRoot = Join-Path $projectRoot 'public/office/san-xuat/test'
$ocrRoot = Join-Path $testRoot 'vendor/ocr'
$manifestPath = Join-Path $projectRoot 'tools/office-assets/model.json'

foreach ($required in @(
    (Join-Path $testRoot 'index.html'),
    (Join-Path $testRoot '.htaccess'),
    (Join-Path $testRoot 'scan-test-20261105.css'),
    (Join-Path $testRoot 'scan-test-20261105.js'),
    (Join-Path $testRoot 'scan-engine-20261105.js'),
    (Join-Path $testRoot 'photo-scan-v5.js'),
    (Join-Path $testRoot 'barcode-scan-v1.js'),
    (Join-Path $testRoot 'vendor/barcode-v2/reader.js'),
    (Join-Path $testRoot 'vendor/barcode-v2/share.js'),
    (Join-Path $testRoot 'vendor/barcode-v2/zxing_reader.wasm'),
    (Join-Path $testRoot 'vendor/barcode-v2/LICENSE.txt'),
    (Join-Path $ocrRoot 'tesseract.min.js'),
    (Join-Path $ocrRoot 'worker.min.js'),
    (Join-Path $ocrRoot 'eng.traineddata.gz')
)) {
    if (!(Test-Path -LiteralPath $required -PathType Leaf)) {
        throw "Missing release input: $required"
    }
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$actualModelHash = (Get-FileHash -LiteralPath (Join-Path $ocrRoot 'eng.traineddata.gz') -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actualModelHash -ne $manifest.sha256.ToLowerInvariant()) {
    throw 'English OCR model checksum does not match the pinned local manifest.'
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$releaseRoot = Join-Path $projectRoot "scratch/office-scan-test-release-$stamp"
$publicHtml = Join-Path $releaseRoot 'public_html'
$officeRoot = Join-Path $publicHtml 'office'
$targetRoot = Join-Path $officeRoot 'san-xuat/test'
$archivePath = Join-Path $releaseRoot "office-san-xuat-test-$stamp.zip"

New-Item -ItemType Directory -Path $targetRoot -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $testRoot 'index.html') -Destination $targetRoot
Copy-Item -LiteralPath (Join-Path $testRoot '.htaccess') -Destination $targetRoot
Copy-Item -LiteralPath (Join-Path $testRoot 'scan-test-20261105.css') -Destination $targetRoot
Copy-Item -LiteralPath (Join-Path $testRoot 'scan-test-20261105.js') -Destination $targetRoot
Copy-Item -LiteralPath (Join-Path $testRoot 'scan-engine-20261105.js') -Destination $targetRoot
Copy-Item -LiteralPath (Join-Path $testRoot 'photo-scan-v5.js') -Destination $targetRoot
Copy-Item -LiteralPath (Join-Path $testRoot 'barcode-scan-v1.js') -Destination $targetRoot
$targetBarcode = Join-Path $targetRoot 'vendor/barcode-v2'
New-Item -ItemType Directory -Path $targetBarcode -Force | Out-Null
Get-ChildItem -LiteralPath (Join-Path $testRoot 'vendor/barcode-v2') -File | Copy-Item -Destination $targetBarcode -Force
$targetOcr = Join-Path $targetRoot 'vendor/ocr'
New-Item -ItemType Directory -Path $targetOcr -Force | Out-Null
Get-ChildItem -LiteralPath $ocrRoot -File | Copy-Item -Destination $targetOcr -Force

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory(
    $publicHtml,
    $archivePath,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
)
$archiveHash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
$archiveEntries = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
try {
    if (!$archiveEntries.Entries.FullName.Contains('office/san-xuat/test/.htaccess')) {
        throw 'Release archive is missing the route-specific .htaccess camera policy.'
    }
    if (!$archiveEntries.Entries.FullName.Contains('office/san-xuat/test/vendor/ocr/eng.traineddata.gz')) {
        throw 'Release archive is missing the pinned English OCR model.'
    }
    if (!$archiveEntries.Entries.FullName.Contains('office/san-xuat/test/vendor/barcode-v2/zxing_reader.wasm')) {
        throw 'Release archive is missing the barcode reader.'
    }
} finally {
    $archiveEntries.Dispose()
}
Write-Output "Package: $archivePath"
Write-Output "SHA256: $archiveHash"
Write-Output "Page: public_html/office/san-xuat/test/"
Write-Output "OCR model checksum: verified"
