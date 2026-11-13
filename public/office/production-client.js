/* Shared security envelope. Activity comes from human events, never camera polls. */
(() => {
  const nativeFetch = window.fetch.bind(window);
  const csrf = document.querySelector('meta[name="office-csrf"]')?.content || '';
  const key = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), x => x.toString(16).padStart(2, '0')).join('');
  window.fetch = (url, options = {}) => {
    const target = new URL(typeof url === 'string' ? url : url.url, location.href);
    if (target.origin === location.origin && target.pathname === '/office/api.php' && (options.method || 'GET').toUpperCase() === 'POST') {
      const headers = new Headers(options.headers || {});
      headers.set('X-CSRF-Token', csrf);
      if (!headers.has('Idempotency-Key')) headers.set('Idempotency-Key', key());
      options = { ...options, headers };
    }
    return nativeFetch(url, options);
  };
  let lastSent = Date.now();
  const activity = event => {
    if (!event.isTrusted || Date.now() - lastSent < 60000) return;
    lastSent = Date.now();
    window.fetch('/office/api.php?action=activity', { method: 'POST', body: '{}' }).then(response => { if (response.status === 401) location.assign('/office/'); }).catch(() => {});
  };
  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(name => document.addEventListener(name, activity, { passive: true }));
})();
