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
      who: 'Maya · Premium', ini: 'MA',
      them: 'ok so everyone’s posting their Wrapped and mine just says you don’t have one?? I listen literally every day 😭',
      coach: 'Check Private Session first.',
      replies: [
        { t: 'Have you tried deleting and reinstalling the app?', d: -10, why: 'Feels helpful, but a reinstall can’t create a Wrapped. She’ll be back, and crosser.' },
        { t: 'Ugh, not on launch day! Quick question: did you use Private Session much this year? That listening doesn’t count.', d: 25, best: true, why: 'Empathy first, then the most likely cause. Private Session listening never reaches Wrapped.' },
        { t: 'I’ll pass this on to our technical team.', d: -15, why: 'It isn’t a bug. Escalating it clogs the queue and she waits for nothing.' }
      ]
    },
    {
      who: 'Dev · Family plan', ini: 'DV',
      them: 'my #1 song is a kids’ cartoon theme. I am 34. please explain 😂',
      coach: 'Shared listening? Ask, don’t assume.',
      replies: [
        { t: 'Ha, I believe you! Does anyone else listen on your account, maybe in the car or on a speaker?', d: 25, best: true, why: 'Match their humor, then ask the question that usually cracks it.' },
        { t: 'Wrapped is based on an algorithm, so it isn’t always accurate.', d: -10, why: 'Blames the product and leaves them with nothing to do.' },
        { t: 'I can remove that song from your Wrapped for you.', d: -15, why: 'Advisors can’t edit Wrapped. Never promise a fix you can’t make.' }
      ]
    },
    {
      who: 'Dev · Family plan', ini: 'DV',
      them: 'omg yes. my niece had my phone ALL summer. can you just redo it?',
      coach: 'Can’t regenerate. Give them next year’s fix.',
      replies: [
        { t: 'Unfortunately that’s not something I can do.', d: -10, why: 'True, but it ends the chat on a dead end.' },
        { t: 'Let me raise a ticket so someone can update it.', d: -15, why: 'No one will. That’s a repeat contact next week.' },
        { t: 'I can’t redo this one, sorry! Next time she borrows it, switch on Private Session and her songs won’t count.', d: 25, best: true, why: 'An honest no, plus something they can actually use.' }
      ]
    }
  ];
  var step = 0, momentum = 40, bestCount = 0;
  var $ = function (id) { return document.getElementById(id); };
  var quote = $('simQuote'), coach = $('simCoach'), coachText = $('simCoachText'),
      you = $('simYou'), youText = $('simYouText'), fb = $('simFeedback'),
      stepEl = $('simStep'), bar = $('simBar'), body = $('simBody'), end = $('simEnd'),
      result = $('simResult'), next = $('simNext'), again = $('simAgain'), talk = $('simTalk'),
      nameEl = $('simName'), avatarEl = $('simAvatar'), typingTimer = null,
      calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setBar(v) {
    momentum = Math.max(5, Math.min(100, v));
    bar.style.width = momentum + '%';
  }
  function say(html) { fb.classList.remove('pop'); void fb.offsetWidth; fb.innerHTML = html; fb.classList.add('pop'); }
  function replay(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  function load() {
    var m = moments[step];
    stepEl.textContent = 'Chat ' + (step + 1) + ' of ' + moments.length;
    nameEl.textContent = m.who;
    avatarEl.textContent = m.ini;
    you.hidden = true;
    next.hidden = true;
    opts.innerHTML = '';
    coach.hidden = true;
    fb.textContent = '';
    quote.innerHTML = '<span class="sim-typing" aria-label="typing"><i></i><i></i><i></i></span>';
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () { reveal(m); }, calm ? 0 : 1100);
  }

  function reveal(m) {
    quote.textContent = m.them;
    coach.hidden = false;
    coachText.textContent = m.coach;
    replay(coach, 'pop');
    fb.textContent = 'What do you say?';
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
      say('<b>Nice.</b> ' + r.why);
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
      next.textContent = 'See how your shift went →';
      next.hidden = false; next.focus({ preventScroll: true });
    }
  }

  function finish() {
    body.hidden = true; next.hidden = true;
    stepEl.textContent = 'Shift over';
    var out;
    if (bestCount === 3) out = 'Everyone sorted first time. Maya even sent a 🎉.';
    else if (bestCount === 2) out = 'Mostly sorted. One of them will be back tomorrow.';
    else out = 'Escalations piling up, and your team lead is walking over.';
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
    next.textContent = 'Next chat →';
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
