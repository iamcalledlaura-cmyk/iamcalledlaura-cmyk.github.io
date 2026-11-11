// Wrapped launch-day practice workspace (portfolio rebuild, public Wrapped information only)
(function () {
  var ws = document.getElementById('ws');
  if (!ws) return;

  var AID = [
    { k: 'private session privacy mode hidden', t: 'Private Session', b: 'Listening in a Private Session never counts toward Wrapped. Customers often switch it on for sleep or focus playlists and forget it’s on.' },
    { k: 'count counted play stream 30 seconds skip', t: 'What counts as a play', b: 'A song counts once it’s played for more than 30 seconds. Skips don’t add up.' },
    { k: 'dates window cutoff january november december when', t: 'Which dates Wrapped covers', b: 'Wrapped covers listening from January 1 to about mid-November. Later listening isn’t in this year’s Wrapped.' },
    { k: 'offline download flight sync', t: 'Offline listening', b: 'Offline plays do count, once the device reconnects and syncs. Listening outside the date window still won’t appear.' },
    { k: 'edit redo regenerate change remove fix wrong', t: 'Changing a Wrapped', b: 'A finished Wrapped can’t be edited or regenerated. Be honest, explain why it looks that way, and share what helps next year.' },
    { k: 'shared family device speaker someone else taste profile exclude kids', t: 'Someone else’s listening', b: 'Other people using the account (a speaker, a tablet, a logged-in laptop) shape Wrapped. Check devices, suggest signing out unknown ones, and mention “exclude from Taste Profile” for playlists like kids’ music.' }
  ];

  var CHATS = [
    {
      name: 'Maya R.', plan: 'Premium Individual · since 2019', ini: 'MR',
      acct: [['Plan', 'Premium Individual'], ['Listening this year', 'Most days, all year'], ['Private Session', 'Used often since March'], ['App version', 'Up to date']],
      msg: 'ok so everyone’s posting their Wrapped and mine just says you don’t have one?? I listen literally every day 😭',
      replies: [
        { t: 'Have you tried deleting and reinstalling the app?', right: false, emp: false,
          back: '…still nothing. this is so annoying',
          why: 'A reinstall can’t create a Wrapped. Her account shows Private Session on since March: that’s the cause.' },
        { t: 'Ugh, not on launch day! I can see Private Session’s been on a lot since March, and that listening doesn’t count toward Wrapped. That’s almost certainly why.', right: true, emp: true,
          back: 'ohhh. I turned that on for my sleep playlist and forgot 🤦‍♀️',
          why: 'Empathy first, then the real cause, straight from her account.' },
        { t: 'I’ll pass this to our technical team to look into.', right: false, emp: true,
          back: 'how long will that take? everyone’s posting NOW',
          why: 'Kind, but it isn’t a bug. Escalating it clogs the queue and she waits for nothing.' }
      ]
    },
    {
      name: 'Dev K.', plan: 'Premium Individual', ini: 'DK',
      acct: [['Plan', 'Premium Individual'], ['Devices this year', 'Dev’s phone, living room speaker, tablet (added June)'], ['Private Session', 'Never used'], ['App version', 'Up to date']],
      msg: 'my #1 song is a kids’ cartoon theme. I am 34. please explain 😂',
      replies: [
        { t: 'Ha, I believe you! I can see a tablet was added in June. Does anyone else use that one?', right: true, emp: true,
          back: 'omg. my niece. she had it ALL summer',
          why: 'Matched his humor, then used the account to find the real answer fast.' },
        { t: 'Wrapped is based on an algorithm, so it isn’t always accurate.', right: false, emp: false,
          back: 'so it’s just… wrong? great',
          why: 'Blames the product and leaves him with nothing to do. The tablet explains it.' },
        { t: 'Oh no! I can remove that song from your Wrapped for you.', right: false, emp: true,
          back: 'amazing, thank you!!',
          why: 'He’s happy now, but advisors can’t edit Wrapped. This turns into an angry repeat contact.' }
      ]
    },
    {
      name: 'Priya S.', plan: 'Premium Duo', ini: 'PS',
      acct: [['Plan', 'Premium Duo'], ['Offline listening', 'Synced'], ['Most recent offline session', 'Late November (a long flight)'], ['Private Session', 'Never used']],
      msg: 'I did a 10 hour flight last week with all my downloads and none of it is in my Wrapped?? that was a LOT of listening',
      replies: [
        { t: 'Offline listening doesn’t count toward Wrapped, unfortunately.', right: false, emp: false,
          back: 'wait really? I download everything…',
          why: 'Not true: offline plays count once they sync. Now she thinks her whole year is missing.' },
        { t: 'Try going online so your downloads sync, then reopen Wrapped.', right: false, emp: false,
          back: 'it’s synced. still not there.',
          why: 'Reasonable guess, but the account already shows it synced. The real cause is the date.' },
        { t: 'That sounds like a great trip! Wrapped covers January to about mid-November, so last week’s flight falls just outside it. Your offline listening earlier in the year does count.', right: true, emp: true,
          back: 'ahh ok, that makes sense. bit gutted though',
          why: 'Warm, accurate, and it reassures her the rest of her year is there.' }
      ]
    },
    {
      name: 'Sam T.', plan: 'Free', ini: 'ST',
      acct: [['Plan', 'Free'], ['Devices this year', 'Sam’s phone, a laptop signed in since April'], ['Private Session', 'Never used'], ['App version', 'Up to date']],
      msg: 'can you just redo my Wrapped?? it’s all gym playlists and I don’t even go to the gym. want to post it tonight',
      replies: [
        { t: 'Let me raise a ticket so someone can update it for you.', right: false, emp: true,
          back: 'ok thanks! how long?',
          why: 'No one will. You’ve just created a repeat contact for next week.' },
        { t: 'Unfortunately that’s not something we can do.', right: false, emp: false,
          back: 'wow ok. helpful.',
          why: 'True, but cold, and it skips why it happened.' },
        { t: 'Sorry, I can’t redo a Wrapped once it’s made. I do see a laptop signed in since April, though. If that’s not you, sign it out so it stays off next year’s.', right: true, emp: true,
          back: 'ugh, my partner’s laptop. fine. signing them out lol',
          why: 'An honest no, the real cause from the account, and a fix for next year.' }
      ]
    }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var queueEl = $('wsQueue'), log = $('wsLog'), opts = $('wsOptions'), fb = $('wsFeedback'), next = $('wsNext'),
      nameEl = $('wsName'), planEl = $('wsPlan'), avatar = $('wsAvatar'), timerEl = $('wsTimer'), waitingEl = $('wsWaiting'),
      locked = $('wsLocked'), acct = $('wsAccount'), openBtn = $('wsOpenAccount'),
      tabA = $('tabAccount'), tabB = $('tabAid'), panA = $('panelAccount'), panB = $('panelAid'),
      search = $('wsSearch'), aidList = $('wsAid'), grid = $('wsGrid'), score = $('wsScore'), prompt = $('wsPrompt');
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var idx = 0, looked = false, tally, secs = 0, clock = null, waiting = 48, crowd = null, pending = null;

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  // Job aid
  function renderAid(q) {
    q = (q || '').trim().toLowerCase();
    var hits = AID.filter(function (a) { return !q || (a.k + ' ' + a.t + ' ' + a.b).toLowerCase().indexOf(q) > -1; });
    aidList.innerHTML = hits.length ? hits.map(function (a) {
      return '<li><b>' + esc(a.t) + '</b><span>' + esc(a.b) + '</span></li>';
    }).join('') : '<li class="ws-empty">No articles match. Try “private” or “offline”.</li>';
  }
  search.addEventListener('input', function () { renderAid(search.value); });

  function tab(which) {
    var a = which === 'account';
    tabA.setAttribute('aria-selected', a); tabB.setAttribute('aria-selected', !a);
    panA.hidden = !a; panB.hidden = a;
  }
  tabA.addEventListener('click', function () { tab('account'); });
  tabB.addEventListener('click', function () { tab('aid'); });
  openBtn.addEventListener('click', function () {
    looked = true; locked.hidden = true; acct.hidden = false;
  });

  function renderQueue() {
    queueEl.innerHTML = CHATS.map(function (c, i) {
      var st = i < idx ? 'done' : i === idx ? 'active' : 'waiting';
      var lab = st === 'done' ? 'Done' : st === 'active' ? 'Now' : 'Waiting';
      return '<li class="is-' + st + '"><span class="ws-avatar sm" aria-hidden="true">' + c.ini + '</span><span><b>' + esc(c.name) + '</b><em>' + lab + '</em></span></li>';
    }).join('');
  }

  function bubble(cls, html) {
    var p = document.createElement('div');
    p.className = 'ws-msg ' + cls;
    p.innerHTML = html;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  }
  function typing(then, delay) {
    var t = bubble('them', '<span class="sim-typing" aria-label="typing"><i></i><i></i><i></i></span>');
    pending = setTimeout(function () { t.remove(); then(); }, calm ? 0 : (delay || 1000));
  }

  function tick() { secs++; timerEl.textContent = Math.floor(secs / 60) + ':' + ('0' + secs % 60).slice(-2); }

  function load() {
    var c = CHATS[idx];
    clearTimeout(pending);
    looked = false; secs = -1; tick();
    clearInterval(clock); clock = setInterval(tick, 1000);
    renderQueue();
    nameEl.textContent = c.name; planEl.textContent = c.plan; avatar.textContent = c.ini;
    acct.innerHTML = c.acct.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
    acct.hidden = true; locked.hidden = false; tab('account');
    search.value = ''; renderAid('');
    log.innerHTML = ''; opts.innerHTML = ''; fb.innerHTML = ''; next.hidden = true;
    prompt.textContent = 'Your reply';
    typing(function () {
      bubble('them', esc(c.msg));
      c.replies.forEach(function (r) {
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = r.t;
        b.addEventListener('click', function () { choose(r, b); });
        opts.appendChild(b);
      });
    }, 900);
  }

  function choose(r, b) {
    var c = CHATS[idx];
    var btns = Array.prototype.slice.call(opts.querySelectorAll('button'));
    btns.forEach(function (o) { o.disabled = true; o.classList.add('is-dim'); });
    b.classList.remove('is-dim'); b.classList.add(r.right ? 'is-best' : 'is-weak');
    if (!r.right) c.replies.forEach(function (x, i) {
      if (x.right) { btns[i].classList.remove('is-dim'); btns[i].classList.add('is-best'); btns[i].insertAdjacentHTML('afterbegin', '<span class="sim-tag">Better</span>'); }
    });
    if (r.right) tally.right++;
    if (r.emp) tally.emp++;
    if (looked) tally.look++;
    clearInterval(clock);
    bubble('you', esc(r.t));
    prompt.textContent = 'How it went';
    typing(function () {
      bubble('them', esc(r.back));
      var tags = [];
      tags.push(r.right ? '<span class="ok">Right answer</span>' : '<span class="no">Not the fix</span>');
      tags.push(r.emp ? '<span class="ok">Warm</span>' : '<span class="no">Flat</span>');
      tags.push(looked ? '<span class="ok">Checked account</span>' : '<span class="no">Didn’t check account</span>');
      fb.innerHTML = '<span class="ws-tags">' + tags.join('') + '</span>' + esc(r.why);
      next.textContent = idx < CHATS.length - 1 ? 'Next chat →' : 'End shift →';
      next.hidden = false;
      next.focus({ preventScroll: true });
    }, 800);
  }

  next.addEventListener('click', function () {
    if (idx < CHATS.length - 1) { idx++; load(); }
    else finish();
  });

  function finish() {
    clearInterval(crowd); clearInterval(clock);
    idx = CHATS.length; renderQueue();
    grid.hidden = true; score.hidden = false;
    var n = CHATS.length;
    $('scRight').textContent = tally.right + '/' + n;
    $('scEmp').textContent = tally.emp + '/' + n;
    $('scLook').textContent = tally.look + '/' + n;
    var head;
    if (tally.right === n && tally.look === n) head = 'Launch-ready. Four customers sorted first time, and no escalations.';
    else if (tally.right >= n - 1) head = 'Nearly there. One customer will be back tomorrow.';
    else head = 'Rough shift. Repeat contacts and escalations are stacking up.';
    $('wsScoreHead').textContent = head;
    $('wsScoreNote').textContent = tally.look < n
      ? 'Every right answer here was sitting in the account panel. Look before you answer: that’s the habit launch-day practice is for.'
      : 'You looked before you answered every time. That’s the habit launch-day practice is for.';
    if (window.ldTrack) window.ldTrack('wrapped-practice-done', 'Finished Wrapped practice shift (' + tally.right + '/' + n + ' right)');
  }

  function start() {
    idx = 0; tally = { right: 0, emp: 0, look: 0 }; waiting = 48;
    grid.hidden = false; score.hidden = true;
    waitingEl.textContent = waiting;
    clearInterval(crowd);
    crowd = setInterval(function () { waiting += Math.random() < .7 ? 1 : -1; waitingEl.textContent = waiting; }, 2500);
    load();
  }
  $('wsAgain').addEventListener('click', start);

  // Start when the workspace scrolls into view, so the typing isn't missed
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { io.disconnect(); start(); }
    }, { threshold: 0.25 });
    io.observe(ws);
  } else start();
})();
