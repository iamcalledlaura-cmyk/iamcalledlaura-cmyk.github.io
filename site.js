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

// Try it: live sales call simulation (in-workflow coaching, concept build)
(function () {
  var opts = document.getElementById('simOptions');
  if (!opts) return;
  var moments = [
    {
      them: '“Our spreadsheets work fine. Why change?”',
      coach: 'Status quo. Don’t pitch, dig.',
      replies: [
        { t: 'Spreadsheets can’t scale. We automate it all.', d: -10, why: 'That’s a pitch. She hasn’t named a problem yet.' },
        { t: 'What happens to your routes when a driver calls in sick?', d: 25, best: true, why: 'Now she’s describing the problem, not you.' },
        { t: 'Fair. I’ll send you a case study.', d: -15, why: 'You just gave her an easy exit.' }
      ]
    },
    {
      them: '“We redo routes by hand. Two hours, and we still miss windows.”',
      coach: 'Pain found. Get a number.',
      replies: [
        { t: 'Great news, we do that in seconds!', d: 5, why: 'No number yet, so the value stays vague.' },
        { t: 'Honestly, two hours isn’t bad.', d: -10, why: 'Never shrink the buyer’s pain.' },
        { t: 'How many missed windows a week, and what does each cost?', d: 25, best: true, why: 'Her numbers will sell it for you.' }
      ]
    },
    {
      them: '“Six a week, $400 each. But my CFO will balk at the price.”',
      coach: '6 × $400 × 52 ≈ $125K a year.',
      replies: [
        { t: '20% off if you sign this month.', d: -10, why: 'Discounting says your price is soft.' },
        { t: 'That’s about $125K a year. Want help pitching your CFO?', d: 25, best: true, why: 'Her numbers, now her business case.' },
        { t: 'We’re priced in line with the market.', d: 0, why: 'Gives her nothing for the CFO.' }
      ]
    }
  ];
  var step = 0, momentum = 40, bestCount = 0;
  var $ = function (id) { return document.getElementById(id); };
  var quote = $('simQuote'), coach = $('simCoach'), coachText = $('simCoachText'),
      you = $('simYou'), youText = $('simYouText'), fb = $('simFeedback'),
      stepEl = $('simStep'), bar = $('simBar'), body = $('simBody'), end = $('simEnd'),
      result = $('simResult'), next = $('simNext'), again = $('simAgain'), talk = $('simTalk');

  function setBar(v) {
    momentum = Math.max(5, Math.min(100, v));
    bar.style.width = momentum + '%';
  }
  function say(html) { fb.classList.remove('pop'); void fb.offsetWidth; fb.innerHTML = html; fb.classList.add('pop'); }
  function replay(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  function load() {
    var m = moments[step];
    stepEl.textContent = 'Moment ' + (step + 1) + ' of ' + moments.length;
    quote.textContent = m.them;
    coachText.textContent = m.coach;
    replay(coach, 'pop');
    you.hidden = true;
    fb.textContent = 'Pick your reply.';
    next.hidden = true;
    opts.innerHTML = '';
    m.replies.forEach(function (r) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = r.t;
      b.addEventListener('click', function () { choose(r, b); });
      opts.appendChild(b);
    });
  }

  function choose(r, b) {
    var m = moments[step];
    var btns = Array.prototype.slice.call(opts.querySelectorAll('button'));
    btns.forEach(function (o) { o.disabled = true; });
    youText.textContent = r.t;
    you.hidden = false;
    bar.classList.toggle('is-down', r.d < 0);
    setBar(momentum + r.d);
    if (r.best) {
      bestCount++;
      b.classList.add('is-best');
      btns.forEach(function (o) { if (o !== b) o.classList.add('is-dim'); });
      say('<b>Strong.</b> ' + r.why);
    } else {
      b.classList.add('is-weak');
      m.replies.forEach(function (x, i) {
        if (x.best) {
          btns[i].classList.add('is-best');
          btns[i].insertAdjacentHTML('afterbegin', '<span class="sim-tag">Better</span>');
        } else if (btns[i] !== b) { btns[i].classList.add('is-dim'); }
      });
      say('<b>' + (r.d > 0 ? 'Close.' : 'Ouch.') + '</b> ' + r.why);
    }
    if (step < moments.length - 1) {
      next.hidden = false; next.focus({ preventScroll: true });
    } else {
      next.textContent = 'See how the call ended →';
      next.hidden = false; next.focus({ preventScroll: true });
    }
  }

  function finish() {
    body.hidden = true; next.hidden = true;
    stepEl.textContent = 'Call ended';
    var out;
    if (bestCount === 3) out = 'CFO meeting booked.';
    else if (bestCount === 2) out = 'Follow-up agreed, no date.';
    else out = '“Send me some info.” Deal goes quiet.';
    result.textContent = out;
    end.hidden = false; again.hidden = false; talk.hidden = false;
    replay(end, 'fade-swap');
    if (window.ldTrack) window.ldTrack('try-sales-call-done', 'Finished sales call sim (' + bestCount + '/3 strong)');
  }

  next.addEventListener('click', function () {
    if (step < moments.length - 1) { step++; load(); replay(body, 'fade-swap'); }
    else finish();
  });
  again.addEventListener('click', function () {
    step = 0; bestCount = 0; bar.classList.remove('is-down'); setBar(40);
    next.textContent = 'Next moment →';
    end.hidden = true; again.hidden = true; talk.hidden = true; body.hidden = false;
    load(); replay(body, 'fade-swap');
  });
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
