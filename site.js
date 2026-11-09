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

// Try it: Protocol Match (requests and rights from the Privacy League course)
(function () {
  var card = document.getElementById('tryOptions');
  if (!card) return;
  var rounds = [
    { q: '“Delete all my Spotify data.”', a: 'erasure',
      why: 'They want their data gone. That’s the right to erasure under GDPR, and the right to delete under CCPA.' },
    { q: '“Can I download my listening history?”', a: 'access',
      why: 'They want a copy of what Spotify holds about them. That’s the right of access, and portability lets them take it elsewhere.' },
    { q: '“Stop using my data for ads.”', a: 'objection',
      why: 'They’re fine with Spotify keeping their data, just not using it for ads. That’s the right to object (under CCPA, opting out).' },
    { q: '“My birthdate is wrong.”', a: 'rectification',
      why: 'Something on file is inaccurate and they want it fixed. That’s the right to rectification.' }
  ];
  var names = { access: 'access', erasure: 'erasure', rectification: 'rectification', objection: 'objection' };
  var hints = {
    access: 'Access is about getting a copy of your data.',
    erasure: 'Erasure is about deleting data.',
    rectification: 'Rectification is about correcting data that’s wrong.',
    objection: 'Objection is about stopping a particular use of data.'
  };
  var i = 0, score = 0, firstTry = true;
  var quote = document.getElementById('tryQuote'), count = document.getElementById('tryCount'),
      fb = document.getElementById('tryFeedback'), next = document.getElementById('tryNext'),
      kase = document.getElementById('tryCase'), scoreEl = document.getElementById('tryScore');
  var btns = Array.prototype.slice.call(card.querySelectorAll('button'));

  function say(html) { fb.classList.remove('pop'); void fb.offsetWidth; fb.innerHTML = html; fb.classList.add('pop'); }
  function load() {
    var r = rounds[i]; firstTry = true;
    quote.textContent = r.q;
    count.textContent = 'Request ' + (i + 1) + ' of ' + rounds.length;
    fb.textContent = 'Tap the right this customer is using.';
    btns.forEach(function (b) { b.disabled = false; b.className = ''; });
    next.hidden = true;
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var r = rounds[i], pick = b.getAttribute('data-right');
      if (pick === r.a) {
        if (firstTry) score++;
        b.classList.add('is-right');
        btns.forEach(function (o) { o.disabled = true; if (o !== b) o.classList.add('is-dim'); });
        scoreEl.textContent = score + ' right first time';
        if (i < rounds.length - 1) {
          say('<b>Yes.</b> ' + r.why);
          next.hidden = false; next.focus({ preventScroll: true });
        } else {
          say('<b>Yes.</b> ' + r.why + ' In the real course, advisors then chose whether to answer, escalate, or ask a question.');
          kase.hidden = false;
          if (window.ldTrack) window.ldTrack('try-protocol-match-done', 'Finished Protocol Match (' + score + '/4)');
        }
      } else {
        firstTry = false;
        b.classList.add('is-wrong'); b.disabled = true;
        say('<b>Not quite.</b> ' + hints[pick] + ' Have another look at what they’re asking for.');
      }
    });
  });
  next.addEventListener('click', function () { i++; load(); });
  load();
})();

// Furniture before/after slider
(function () {
  var ba = document.getElementById('ba'), range = document.getElementById('baRange');
  if (!ba || !range) return;
  function set() { ba.style.setProperty('--pos', range.value + '%'); }
  range.addEventListener('input', function () { set(); ba.classList.add('touched'); });
  set();
})();
