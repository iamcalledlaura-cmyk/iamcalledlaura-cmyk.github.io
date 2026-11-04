/* Choose-your-path landing: tailors the homepage to what the visitor is hiring for.
   Each path can be linked directly, e.g. index.html#for-sales */
(function () {
  var PATHS = {
    sales: {
      label: 'Sales and revenue enablement',
      kicker: 'For sales and revenue teams',
      title: 'Get people confident on the product before the customer asks.',
      intro: 'Most of my audiences have been customer-facing support teams. The craft carries over: I turn product change into role-based practice, then measure whether it stuck.',
      stats: [['2,000', '+', 'customer-facing advisors enabled across regions'], ['62', '+', 'programs delivered in one year, 100% stakeholder satisfaction'], ['33', '%', 'faster ramp for new advisors']],
      work: ['release-enablement-kit.html', 'feedback-in-the-moment.html', 'source-to-ship.html']
    },
    support: {
      label: 'Customer support and CX',
      kicker: 'For support and CX teams',
      title: 'Onboarding that gets advisors handling real contacts sooner.',
      intro: 'I have spent most of my career with support teams: new hire programs, compliance that shows up in the queue, and continuing education aimed at the gaps the data points to.',
      stats: [['33', '%', 'faster ramp for 2,000+ global support advisors'], ['25', '%', 'fewer critical privacy errors, measured on the job for 12 months'], ['60→40', '', 'days to proficiency after the onboarding redesign']],
      work: ['advisor-onboarding.html', 'privacy-fluency.html', 'release-enablement-kit.html']
    },
    technical: {
      label: 'Technical and product enablement',
      kicker: 'For technical and product enablement',
      title: 'Turning complex product change into learning people can use.',
      intro: 'I partner with Product and Engineering to translate what is shipping into role-based paths, and I build my own tools when off-the-shelf ones fall short.',
      stats: [['6', '', 'multi-day live courses rebuilt as self-paced eLearning'], ['~50', '%', 'less seat time after the conversion'], ['6', '', 'languages for a global recertification']],
      work: ['release-enablement-kit.html', 'source-to-ship.html', 'global-recertification.html']
    },
    ai: {
      label: 'AI in learning',
      kicker: 'For AI-forward learning teams',
      title: 'I build with AI every day, in real programs.',
      intro: 'Simulations, video, automations and dashboards I have shipped myself, with a human review gate wherever accuracy matters.',
      stats: [['$50K', '/yr', 'saved by modernizing and automating L&amp;D tools'], ['$680K', '+', 'projected first-year benefit from the AI-enabled learning platform'], ['~50', '%', 'less seat time with an AI-assisted pipeline']],
      work: ['source-to-ship.html', 'release-enablement-kit.html', 'feedback-in-the-moment.html']
    },
    onboarding: {
      label: 'Onboarding and certification',
      kicker: 'For onboarding and certification programs',
      title: 'Programs that get people productive, and prove it.',
      intro: 'From new hire onboarding to a worldwide recertification, I design end to end and judge the work by ramp time, pass rates and what people do on the job.',
      stats: [['60→40', '', 'days to proficiency for new support advisors'], ['850', '', 'certified professionals moved onto a new standard'], ['95.5', '%', 'eventual pass rate on the scenario-based exam']],
      work: ['advisor-onboarding.html', 'global-recertification.html', 'source-to-ship.html']
    }
  };

  var $ = function (id) { return document.getElementById(id); };
  var panel = $('path'), allMetrics = $('all-metrics');
  var grid = document.querySelector('.work-grid');
  if (!panel || !grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
  var originalOrder = cards.slice();

  function setCards(order) {
    var picks = order || [];
    var sorted = originalOrder.slice().sort(function (a, b) {
      var ia = picks.indexOf(a.getAttribute('href')), ib = picks.indexOf(b.getAttribute('href'));
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    sorted.forEach(function (c, i) {
      var picked = picks.indexOf(c.getAttribute('href')) >= 0;
      c.classList.toggle('is-pick', picked);
      // Keep the wide feature layout only on the first card
      c.classList.toggle('card-feature', i === 0 && (picked || !picks.length) && c.dataset.feature === '1');
      grid.appendChild(c);
      c.classList.add('visible');
    });
  }
  originalOrder.forEach(function (c) { if (c.classList.contains('card-feature')) c.dataset.feature = '1'; });

  function show(key, scroll) {
    document.querySelectorAll('[data-path]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.path === key ? 'true' : 'false');
    });
    var p = PATHS[key];
    if (!p) {
      panel.hidden = true;
      if (allMetrics) allMetrics.hidden = false;
      setCards(null);
      if (scroll && key === 'all') $('work').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    $('path-label').textContent = p.label;
    $('path-kicker').textContent = p.kicker;
    $('path-title').textContent = p.title;
    $('path-intro').textContent = p.intro;
    $('path-stats').innerHTML = p.stats.map(function (s) {
      return '<div class="metric"><b>' + s[0] + (s[1] ? '<em>' + s[1] + '</em>' : '') + '</b><span>' + s[2] + '</span></div>';
    }).join('');
    panel.hidden = false;
    if (allMetrics) allMetrics.hidden = true;
    setCards(p.work);
    if (scroll) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function fromHash() {
    var h = (location.hash || '').replace('#for-', '');
    return PATHS[h] ? h : null;
  }

  document.querySelectorAll('[data-path]').forEach(function (b) {
    b.addEventListener('click', function () {
      var key = b.dataset.path;
      try { history.replaceState(null, '', key === 'all' ? '#work' : '#for-' + key); } catch (e) {}
      show(key, true);
    });
  });
  $('path-change').addEventListener('click', function () {
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
    show(null, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('hashchange', function () { var k = fromHash(); if (k) show(k, true); });

  var start = fromHash();
  if (start) show(start, false);
})();
