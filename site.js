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

// Try it: Wrapped launch-day support chat (seasonal readiness practice)
(function () {
  var opts = document.getElementById('simOptions');
  if (!opts) return;
  var moments = [
    {
      them: '“It says you don’t have my Wrapped this year?? I listen every day!”',
      coach: 'Check Private Session first.',
      replies: [
        { t: 'Try reinstalling the app, that usually fixes it.', d: -10, why: 'Sends them off to fail. A reinstall can’t create a Wrapped.' },
        { t: 'Was Private Session on? That listening doesn’t count.', d: 25, best: true, why: 'Top cause, checked first. Private Session listening never reaches Wrapped.' },
        { t: 'Sorry, I’ll escalate this to engineering.', d: -15, why: 'Not a bug. Escalating it clogs the queue on launch day.' }
      ]
    },
    {
      them: '“My #1 song is one I barely know. Is Wrapped broken?”',
      coach: 'Plays over 30 seconds count. Ask who else listens.',
      replies: [
        { t: 'Does anyone else use your account, or play it on a speaker?', d: 25, best: true, why: 'Shared listening is the usual culprit. Ask before you explain.' },
        { t: 'Wrapped is algorithmic, so sometimes it’s just wrong.', d: -10, why: 'Undermines the product and gives them nothing to do.' },
        { t: 'I can delete that song from your Wrapped.', d: -15, why: 'Advisors can’t edit Wrapped. Never promise a fix you can’t make.' }
      ]
    },
    {
      them: '“Can you just redo it so it’s right?”',
      coach: 'Can’t regenerate. Give a fix for next year.',
      replies: [
        { t: 'Unfortunately there’s nothing I can do.', d: -10, why: 'True, but it ends the chat on a dead end.' },
        { t: 'I’ll raise a ticket and someone will update it.', d: -15, why: 'Nobody will. That’s a repeat contact next week.' },
        { t: 'I can’t redo it, but Private Session or “exclude from Taste Profile” keeps this off next year’s.', d: 25, best: true, why: 'Honest no, plus something they can actually do.' }
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
    stepEl.textContent = 'Customer ' + (step + 1) + ' of ' + moments.length;
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
      next.textContent = 'See how the shift went →';
      next.hidden = false; next.focus({ preventScroll: true });
    }
  }

  function finish() {
    body.hidden = true; next.hidden = true;
    stepEl.textContent = 'Shift over';
    var out;
    if (bestCount === 3) out = 'All three solved first time. No escalations.';
    else if (bestCount === 2) out = 'Two solved. One will be back tomorrow.';
    else out = 'Repeat contacts and escalations. The queue grows.';
    result.textContent = out;
    end.hidden = false; again.hidden = false; talk.hidden = false;
    replay(end, 'fade-swap');
    if (window.ldTrack) window.ldTrack('try-wrapped-done', 'Finished Wrapped launch sim (' + bestCount + '/3 strong)');
  }

  next.addEventListener('click', function () {
    if (step < moments.length - 1) { step++; load(); replay(body, 'fade-swap'); }
    else finish();
  });
  again.addEventListener('click', function () {
    step = 0; bestCount = 0; bar.classList.remove('is-down'); setBar(40);
    next.textContent = 'Next customer →';
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
