(function () {
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Analytics events (GoatCounter). Safe to call before the script loads; skips if it never does.
  window.ldTrack = function (name, title) {
    try {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: name, title: title || name, event: true });
      }
    } catch (e) {}
  };
  // Outbound clicks: LinkedIn, Instagram, live prototypes, email
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (/^mailto:/.test(href)) { window.ldTrack('click-email', 'Clicked email'); return; }
    if (/^https?:\/\//.test(href) && a.hostname !== location.hostname) {
      window.ldTrack('out-' + a.hostname.replace(/^www\./, ''), 'Outbound: ' + a.hostname + (a.pathname !== '/' ? a.pathname : ''));
    }
  });

  var els = document.querySelectorAll('.fade-in');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();
