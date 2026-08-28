/* Padoo stage engine.
   One desk, two devices. The phone is genuinely interactive: pointer events on
   its glass drive a cursor on the Mac beside it, through the same acceleration
   curve the app ships (sigmoid, min 0.45, max 5.5, knee 420 pt/s, precision
   1.25), with the same tap threshold (10 points of travel) and the same deck
   geometry (fifteen wells, three columns, first fifteen dock apps).

   The Mac is not a picture. The cursor hit-tests what is under it, so driving
   it onto the dock and tapping really does bring an app forward - and bringing
   an app forward really does change the phone's context strip, because that is
   the feature. An app with no entry in the strip table gets no strip, exactly
   as the Mac's hand-maintained allow-list behaves. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };

  /* ================================================================
     generic page bits
     ================================================================ */
  var nav = $('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 10); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (reduce) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.nrow').forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  // the latency bars fill from their measured widths
  document.querySelectorAll('.nrow').forEach(function (row) {
    var w = row.getAttribute('data-w');
    if (w) row.style.setProperty('--w', w);
    var bar = row.querySelector('.bar i');
    if (bar) bar.style.setProperty('--w', w);
  });
  if (!reduce) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); nio.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('.nrow').forEach(function (el) { nio.observe(el); });
  }

  // live menu-bar clock, because a frozen one is the first thing that reads fake
  (function () {
    var el = $('mbClock');
    if (!el) return;
    var DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function tick() {
      var d = new Date(), h = d.getHours(), m = d.getMinutes();
      el.textContent = DAY[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()] +
        '  ' + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
    }
    tick();
    setInterval(tick, 15000);
  })();

  // freeze + blur the gutter keys when the viewport is too narrow for them
  (function () {
    var keys = Array.prototype.slice.call(document.querySelectorAll('.fkey'));
    var wrap = document.querySelector('header .wrap');
    if (!keys.length || !wrap) return;
    var root = document.documentElement, raf = 0;
    function measure() {
      raf = 0;
      var w = wrap.getBoundingClientRect(), cs = getComputedStyle(wrap);
      var l = w.left + parseFloat(cs.paddingLeft), r = w.right - parseFloat(cs.paddingRight);
      var cramped = keys.some(function (k) {
        if (k.classList.contains('f4')) return false;
        var b = k.getBoundingClientRect();
        return b.width > 0 && b.right > l && b.left < r;
      });
      root.classList.toggle('keys-cramped', cramped);
    }
    function req() { if (!raf) raf = requestAnimationFrame(measure); }
    measure();
    window.addEventListener('resize', req);
  })();

  /* ================================================================
     the stage
     ================================================================ */
  var desk = $('desk');
  if (!desk) return;

  // The brightness dimmer is driven through a custom property on the Mac, and
  // the phone shell is pure CSS, so neither needs a handle here.
  var mac = $('macStage'), appWin = $('appWin'), winBody = $('winBody'),
      winTitle = $('winTitle'), mbApp = $('mbApp'), dockEl = $('dock'),
      cursorEl = $('cursor'), clickRing = $('clickRing'), haloEl = $('halo'),
      exposeEl = $('expose'), exGrid = $('exGrid'), exLabel = $('exLabel'),
      hud = $('hud'), hudIcon = $('hudIcon'), hudFill = $('hudFill'), spaceWrap = $('spaceWrap'),
      stripEl = $('strip'), appChip = $('appChip'), appChipName = $('appChipName'),
      switcher = $('switcher'), swCircle = $('swCircle'),
      sfPad = $('sfPad'), sfPointer = $('sfPointer'), sfDeck = $('sfDeck'),
      padHint = $('padHint'), padTouch = $('padTouch'), dPlate = $('dPlate'),
      drawerBtn = $('drawer'), wheel = $('wheel'), pDrag = $('pDrag'), pDragLabel = $('pDragLabel'),
      pRight = $('pRight'), sBright = $('sBright'), sBrightFill = $('sBrightFill'),
      sVol = $('sVol'), sVolFill = $('sVolFill'), coach = $('coach'),
      roFrames = $('roFrames'), roGain = $('roGain');

  /* ---------------- icons ---------------- */
  function sq(bg, inner) {
    return '<svg class="gi" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="11" fill="' + bg + '"/>' + inner + '</svg>';
  }
  var ICONS = {
    finder: sq('url(#fnd)',
      '<defs><linearGradient id="fnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3ec2ff"/><stop offset="1" stop-color="#1a7ff0"/></linearGradient></defs>' +
      '<path d="M24 8v32" stroke="#fff" stroke-opacity=".55" stroke-width="1.4"/>' +
      '<circle cx="16" cy="20" r="1.9" fill="#0b2b52"/><circle cx="32" cy="20" r="1.9" fill="#0b2b52"/>' +
      '<path d="M15 30c3 3.2 15 3.2 18 0" stroke="#0b2b52" stroke-width="2.4" fill="none" stroke-linecap="round"/>'),
    safari: sq('#f3f5f9',
      '<circle cx="24" cy="24" r="16" fill="#1f8cf0"/><circle cx="24" cy="24" r="13" fill="#e9eff8"/>' +
      '<path d="M31 17 21.5 21.5 17 31l9.5-4.5z" fill="#ff4d4d"/><path d="M26.5 26.5 17 31l4.5-9.5z" fill="#f5f7fb"/>'),
    xcode: sq('#1a7ff0',
      '<path d="M24 10 34 34h-4.6L24 20.2 18.6 34H14z" fill="#fff"/><circle cx="24" cy="36.5" r="2.4" fill="#fff"/>'),
    mail: sq('url(#ml)',
      '<defs><linearGradient id="ml" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fd0ff"/><stop offset="1" stop-color="#1a7ff0"/></linearGradient></defs>' +
      '<rect x="10" y="16" width="28" height="17" rx="3.2" fill="#fff"/><path d="M11.5 18 24 27l12.5-9" stroke="#1a7ff0" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
    keynote: sq('#2b2b30',
      '<rect x="10" y="12" width="28" height="17" rx="2.6" fill="#ffb43c"/><path d="M24 29v6M18 35h12" stroke="#e7e9ef" stroke-width="2.4" stroke-linecap="round"/>'),
    zoom: sq('#2d8cff',
      '<rect x="11" y="17" width="17" height="14" rx="3.4" fill="#fff"/><path d="M29.5 22.5 37 19v10l-7.5-3.5z" fill="#fff"/>'),
    music: sq('url(#mu)',
      '<defs><linearGradient id="mu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a9c"/><stop offset="1" stop-color="#f8324f"/></linearGradient></defs>' +
      '<path d="M31 12v18.5a4.2 4.2 0 1 1-2.6-3.9V17l-9.8 2.4v13.9a4.2 4.2 0 1 1-2.6-3.9V17.2z" fill="#fff"/>'),
    obsidian: sq('#3b2a6b',
      '<path d="M25 9 35 22l-4 15-11 3-6-11 5-16z" fill="#a78bfa"/><path d="M25 9 20 29l11 8-6-28z" fill="#c9b6ff"/>')
  };

  /* symbols the strip draws - the same SF Symbols the Mac names, hand-drawn */
  var SYM = {
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    forward: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
    up: '<svg viewBox="0 0 24 24"><path d="M12 20V5M5.5 11.5 12 5l6.5 6.5"/></svg>',
    cont: '<svg viewBox="0 0 24 24" class="f"><path d="M7 4.5 19 12 7 19.5z"/></svg>',
    over: '<svg viewBox="0 0 24 24"><path d="M4 16a8 8 0 0 1 15-3.8"/><path d="M19 6.5V12h-5.5"/></svg>',
    into: '<svg viewBox="0 0 24 24"><path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M5 20h14"/></svg>',
    out: '<svg viewBox="0 0 24 24"><path d="M12 21V9M7.5 13.5 12 9l4.5 4.5M5 4h14"/></svg>',
    archive: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="4.5" rx="1.4"/><path d="M5 8.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5M10 13h4"/></svg>',
    mic: '<svg viewBox="0 0 24 24"><path d="M9 9V6a3 3 0 0 1 5.7-1.3M15 10v1a3 3 0 0 1-4.6 2.5"/><path d="M5.5 11a6.5 6.5 0 0 0 9.6 5.7M18.5 11v.6"/><path d="M12 18.5V21M8.5 21h7M3.5 3.5l17 17"/></svg>',
    cam: '<svg viewBox="0 0 24 24"><path d="M15 10.5V8a1.5 1.5 0 0 0-1.5-1.5h-6M4.5 7.6A1.5 1.5 0 0 0 4 8.7V16a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.4-1"/><path d="M20 8.6 15.6 11v2l4.4 2.4z"/><path d="M3.5 3.5l17 17"/></svg>'
  };

  /* ================================================================
     the apps - dock order is deck order, and the strip table is an
     allow-list: an app that is not here gets no strip at all.
     ================================================================ */
  var state = {
    app: 0, brightness: 1, volume: 0.55, space: 0,
    finderSel: 1, finderCrumb: ['Macintosh HD', 'Users', 'tal', 'Projects'],
    safariTab: 0, safariPage: 0,
    xcodeLine: 3, mailGone: 0, slide: 1,
    muted: false, camOff: false, note: 1
  };

  var CODE = [
    ['1', '<span class="kw">func</span> <span class="fn">apply</span>(_ decisions: [Decision]) {'],
    ['2', '  <span class="kw">for</span> decision <span class="kw">in</span> decisions {'],
    ['3', '    <span class="kw">switch</span> decision {'],
    ['4', '    <span class="kw">case</span> .move(<span class="kw">let</span> delta):'],
    ['5', '      pointer.<span class="fn">accumulate</span>(delta)'],
    ['6', '    <span class="kw">case</span> .click(<span class="kw">let</span> button):'],
    ['7', '      poster.<span class="fn">press</span>(button)'],
    ['8', '    }'],
    ['9', '  }'],
    ['10', '}']
  ];

  var NOTES = [
    { t: 'Pointer spec', b: 'The trackpad sends displacement and the Mac decides how far. The pointer sends a position and the Mac decides nothing.' },
    { t: 'Link ladder', b: 'Cable first, then peer-to-peer Wi-Fi, then the router. An explicit choice yields exactly one attempt - falling back to a path the user ruled out is silent substitution.' },
    { t: 'Release-all', b: 'Every exit path releases first. A synthetic button-press whose sender vanished leaves the Mac dragging forever.' }
  ];

  var APPS = [
    {
      id: 'finder', name: 'Finder', icon: 'finder', running: true,
      strip: [
        { k: 'back', sym: 'back', label: 'Back', keys: '⌘[' },
        { k: 'up', sym: 'up', label: 'Enclosing Folder', keys: '⌘↑' }
      ],
      render: function () {
        var files = ['padoo', 'padoo-b5', 'taltools_site', 'Poof', 'Tally'];
        return '<div class="crumb">' + state.finderCrumb.join(' › ') + '</div><div class="flist">' +
          files.map(function (f, i) {
            return '<button class="frow' + (i === state.finderSel ? ' on' : '') + '" data-row="' + i + '"><span class="fi"></span><span class="fn">' + f + '</span></button>';
          }).join('') + '</div>';
      },
      press: function (k) {
        if (k === 'back') { state.finderSel = (state.finderSel + 4) % 5; return 'Finder went back - ⌘[ , the same key its own menu shows.'; }
        if (state.finderCrumb.length > 1) state.finderCrumb.pop();
        else state.finderCrumb = ['Macintosh HD', 'Users', 'tal', 'Projects'];
        return 'Enclosing folder. There is no toolbar button for this one - the pointer-only route is a click-and-hold on the proxy icon.';
      }
    },
    {
      id: 'safari', name: 'Safari', icon: 'safari', running: true,
      strip: [
        { k: 'back', sym: 'back', label: 'Back', keys: '⌘[' },
        { k: 'fwd', sym: 'forward', label: 'Forward', keys: '⌘]' }
      ],
      render: function () {
        var tabs = [
          { s: 'taltools.site', f: '#2F5BF0', wm: 'TalTools', c: '#dfe6f8' },
          { s: 'apple.com', f: '#b9bfcc', wm: 'Apple', c: '#e9edf6' },
          { s: 'developer.apple.com', f: '#4b8ef7', wm: 'Developer', c: '#8fc0ff' }
        ];
        var t = tabs[state.safariTab];
        var page = state.safariPage === 0
          ? '<div class="bwm" style="color:' + t.c + '">' + t.wm + '</div><div class="bcards">' +
            '<div class="bcard" style="--bs:' + t.f + '"><div class="bthumb"></div><div class="bline"></div><div class="bline sm"></div></div>' +
            '<div class="bcard" style="--bs:' + t.f + '"><div class="bthumb"></div><div class="bline"></div><div class="bline sm"></div></div>' +
            '<div class="bcard" style="--bs:' + t.f + '"><div class="bthumb"></div><div class="bline"></div><div class="bline sm"></div></div></div>'
          : '<div class="bwm" style="color:' + t.c + ';font-size:15px">' + t.s + '/padoo</div><div class="rows" style="text-align:left;padding:0 6px"><u></u><u></u><u></u><u></u></div>';
        return '<div class="btabs">' + tabs.map(function (x, i) {
          return '<button class="btab" data-tab="' + i + '" aria-current="' + (i === state.safariTab) + '"><span class="bf" style="background:' + x.f + '"></span><span class="bl">' + x.s + '</span></button>';
        }).join('') + '</div><div class="baddr"><span style="opacity:.4">🔒</span>' +
          (state.safariPage ? tabs[state.safariTab].s + '/padoo' : tabs[state.safariTab].s) +
          '</div><div class="bpage">' + page + '</div>';
      },
      press: function (k) {
        state.safariPage = k === 'back' ? 0 : 1;
        return k === 'back'
          ? 'Back. Two-finger swipe does this too - but a button needs no aim, and Back is the most repeated action in a browser by a wide margin.'
          : 'Forward. Every browser on the list binds the same two keys, so they share one definition.';
      }
    },
    {
      id: 'xcode', name: 'Xcode', icon: 'xcode', running: true,
      strip: [
        { k: 'cont', sym: 'cont', label: 'Continue', keys: '⌃⌘Y', solid: true },
        { k: 'over', sym: 'over', label: 'Step Over', keys: 'F6' },
        { k: 'into', sym: 'into', label: 'Step Into', keys: 'F7' },
        { k: 'out', sym: 'out', label: 'Step Out', keys: 'F8' }
      ],
      render: function () {
        return '<div class="code">' + CODE.map(function (l, i) {
          return '<div class="ln' + (i === state.xcodeLine ? ' cur' : '') + '"><span class="n">' + l[0] + '</span><span class="t">' + l[1] + '</span></div>';
        }).join('') + '</div><div class="dbgbar">paused · <b>PadooCore</b> · thread 1</div>';
      },
      press: function (k) {
        if (k === 'cont') { state.xcodeLine = 3; return 'Continue. Note the sharp triangle - the rounded one means media transport everywhere else, and one glyph meaning two things is how a control vocabulary stops being trusted.'; }
        if (k === 'out') state.xcodeLine = Math.max(0, state.xcodeLine - 2);
        else state.xcodeLine = Math.min(CODE.length - 1, state.xcodeLine + 1);
        return 'Stepping, with your eyes on the code instead of on a 20-point target pinned to the bottom of the window. VS Code and the JetBrains IDEs get the same four keys with their own keymaps.';
      }
    },
    {
      id: 'mail', name: 'Mail', icon: 'mail', running: true,
      strip: [{ k: 'arch', sym: 'archive', label: 'Archive', keys: '⌃⌘A', solid: true }],
      render: function () {
        var msgs = [
          { n: 'App Store Connect', c: '#1a7ff0', s: 'Your submission is in review' },
          { n: 'GitHub', c: '#2b2b30', s: '[padoo] CI passed on main' },
          { n: 'Apple Developer', c: '#5a5f6b', s: 'Certificate expires in 30 days' },
          { n: 'TestFlight', c: '#22b07d', s: 'New feedback from a tester' }
        ];
        return '<div class="mlist">' + msgs.map(function (m, i) {
          return '<div class="mrow' + (i < state.mailGone ? ' gone' : '') + '"><span class="av" style="background:' + m.c + '">' + m.n.charAt(0) + '</span><span class="mm"><b>' + m.n + '</b><span>' + m.s + '</span></span></div>';
        }).join('') + '</div>';
      },
      press: function () {
        state.mailGone = (state.mailGone + 1) % 5;
        return 'Archive only. Delete is a better button and a worse idea: a compose window has the same bundle identifier, and ⌘⌫ there deletes your selected text.';
      }
    },
    {
      id: 'keynote', name: 'Keynote', icon: 'keynote', running: false,
      strip: [
        { k: 'prev', sym: 'back', label: 'Previous', keys: '←' },
        { k: 'next', sym: 'forward', label: 'Next', keys: '→' }
      ],
      render: function () {
        var titles = ['', 'Padoo', 'Two milliseconds', 'The deck', 'Questions?'];
        return '<div class="slide"><span class="sn">' + state.slide + '</span><span class="stitle">' + titles[state.slide] + '</span></div>' +
          '<div class="slidefoot"><span>slide ' + state.slide + ' of 4</span><span>presenting</span></div>';
      },
      press: function (k) {
        state.slide = k === 'next' ? Math.min(4, state.slide + 1) : Math.max(1, state.slide - 1);
        return 'The one case where the removed round trip is physical: you are standing away from the Mac, and the phone is already in your hand.';
      }
    },
    {
      id: 'zoom', name: 'Zoom', icon: 'zoom', running: true,
      strip: [
        { k: 'mute', sym: 'mic', label: 'Mute', keys: '⇧⌘A' },
        { k: 'cam', sym: 'cam', label: 'Camera', keys: '⇧⌘V' }
      ],
      render: function () {
        var who = [{ n: 'D', c: '#2d8cff' }, { n: 'You', c: '#2F5BF0', me: true }, { n: 'R', c: '#22b07d' }, { n: 'M', c: '#f8324f' }];
        return '<div class="tiles">' + who.map(function (w) {
          return '<div class="tile' + (w.me ? ' me' : '') + '"><span class="fc" style="background:' + w.c + '">' + w.n.charAt(0) + '</span>' +
            (w.me ? '<span class="st"><i class="' + (state.muted ? 'off' : '') + '">🎙</i><i class="' + (state.camOff ? 'off' : '') + '">📷</i></span>' : '') + '</div>';
        }).join('') + '</div>';
      },
      press: function (k) {
        if (k === 'mute') state.muted = !state.muted; else state.camOff = !state.camOff;
        return 'Momentary, and drawn without state on purpose - the Mac cannot read Zoom\'s mute state, and a mute button showing the wrong one makes you confidently wrong in a meeting.';
      }
    },
    {
      id: 'music', name: 'Music', icon: 'music', running: true,
      strip: null,   /* deliberately: not in the table, so no strip at all */
      render: function () {
        return '<div class="np"><span class="art"></span><span><b>Nothing Here</b><span>The Allow-List · Single</span>' +
          '<span class="wave">' + [0, 1, 2, 3, 4, 5, 6].map(function (i) {
            return '<i style="animation-delay:' + (i * 0.09) + 's"></i>';
          }).join('') + '</span></span></div>';
      }
    },
    {
      id: 'obsidian', name: 'Obsidian', icon: 'obsidian', running: false,
      strip: [{ k: 'back', sym: 'back', label: 'Back', keys: '⌥⌘←' }],
      render: function () {
        var n = NOTES[state.note];
        return '<div class="note"><h4>' + n.t + '</h4><p>' + n.b + '</p></div>';
      },
      press: function () {
        state.note = (state.note + 2) % 3;
        return 'One button, deliberately. Forward was rejected as symmetry for its own sake - and Obsidian\'s Back is ⌥⌘←, where Safari\'s is ⌘[. Same identifier, bound differently, which is why no global map can exist.';
      }
    }
  ];

  /* ================================================================
     the coach line
     ================================================================ */
  var coachTimer = 0;
  function say(text, sticky) {
    if (!coach) return;
    coach.innerHTML = text;
    if (!reduce) {
      coach.classList.remove('flash');
      void coach.offsetWidth;
      coach.classList.add('flash');
    }
    clearTimeout(coachTimer);
    if (!sticky) {
      coachTimer = setTimeout(function () { coach.innerHTML = idleHint(); }, 6500);
    }
  }
  function idleHint() {
    if (mode === 'deck') return 'Press a key to bring that app forward. <b>Hold one</b> for App Exposé - and drag the side sliders.';
    if (mode === 'pointer') return 'Move over the glass to aim. The four pushes on the wheel are real system commands.';
    return 'Drag on the phone\'s glass - the cursor follows. Drive it onto the Dock and <b>tap to click</b>.';
  }

  /* ================================================================
     the Mac
     ================================================================ */
  var scrollY = 0;
  function currentApp() { return APPS[state.app]; }

  function renderWindow() {
    var app = currentApp();
    winTitle.textContent = app.name;
    mbApp.textContent = app.name;
    winBody.innerHTML = app.render();
    scrollY = 0;
    if (!reduce) {
      appWin.classList.remove('pop');
      void appWin.offsetWidth;
      appWin.classList.add('pop');
    }
    // Finder rows and Safari tabs are really clickable - by mouse, and by the
    // Padoo cursor, which hit-tests what is under it.
    winBody.querySelectorAll('[data-row]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.finderSel = +b.getAttribute('data-row');
        renderWindow();
      });
    });
    winBody.querySelectorAll('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.safariTab = +b.getAttribute('data-tab');
        state.safariPage = 0;
        renderWindow();
      });
    });
  }

  function setApp(i, source) {
    var changed = i !== state.app;
    state.app = i;
    APPS[i].running = true;
    Array.prototype.forEach.call(dockEl.children, function (b, j) {
      b.setAttribute('aria-current', j === i ? 'true' : 'false');
    });
    renderWindow();
    renderStrip();
    renderDeck();
    if (changed && source === 'deck') {
      say('<b>' + APPS[i].name + '</b> came forward. The deck reads your Mac\'s real Dock - same apps, same order, real icons.');
    } else if (changed && source === 'dock') {
      say('Frontmost app changed, so the phone\'s strip changed with it. ' +
        (APPS[i].strip ? 'These are <b>' + APPS[i].name + '\'s own keys</b>.' : '<b>No strip.</b> The table is an allow-list - an app that isn\'t in it silently gets nothing.'));
    }
  }

  // the dock
  APPS.forEach(function (app, i) {
    var b = document.createElement('button');
    b.className = 'dockapp';
    b.type = 'button';
    b.setAttribute('aria-label', app.name);
    b.innerHTML = ICONS[app.icon];
    b.addEventListener('click', function () { touched(); setApp(i, 'dock'); });
    dockEl.appendChild(b);
  });

  /* ---- the cursor ---- */
  var cx = 0, cy = 0, subX = 0, subY = 0, frames = 0;
  var MENUBAR = 30;   // the one strip the cursor may not enter
  function screenBox() { return mac.getBoundingClientRect(); }
  function placeCursor() {
    cursorEl.style.left = cx + 'px';
    cursorEl.style.top = cy + 'px';
    haloEl.style.left = cx + 'px';
    haloEl.style.top = cy + 'px';
  }
  function moveCursor(dx, dy) {
    var box = screenBox();
    cx = Math.max(2, Math.min(box.width - 4, cx + dx));
    cy = Math.max(MENUBAR, Math.min(box.height - 4, cy + dy));
    placeCursor();
  }
  function aimCursor(nx, ny) {
    var box = screenBox();
    cx = Math.max(2, Math.min(box.width - 4, nx * box.width));
    cy = Math.max(MENUBAR, Math.min(box.height - 4, MENUBAR + ny * (box.height - MENUBAR - 4)));
    placeCursor();
  }
  (function initCursor() {
    requestAnimationFrame(function () {
      var box = screenBox();
      cx = box.width * 0.42;
      cy = box.height * 0.52;
      placeCursor();
    });
  })();

  /* the click: ring, cursor squeeze, and a real hit-test of what is beneath */
  function clickAt() {
    var box = screenBox();
    clickRing.style.left = cx + 'px';
    clickRing.style.top = cy + 'px';
    clickRing.classList.remove('go');
    void clickRing.offsetWidth;
    clickRing.classList.add('go');
    cursorEl.classList.remove('clicking');
    void cursorEl.offsetWidth;
    cursorEl.classList.add('clicking');

    var el = document.elementFromPoint(box.left + cx, box.top + cy);
    if (!el) return;
    var hit = el.closest('.dockapp, .btab, .frow');
    if (hit) { hit.click(); return; }
    if (el.closest('.expose.on')) { closeExpose(); }
  }

  /* ---- Mission Control / App Exposé ---- */
  var exposeOpen = false;
  function openExpose(kind) {
    var app = currentApp();
    var count = kind === 'app' ? 3 : 6;
    exLabel.textContent = kind === 'app' ? 'App Windows - ' + app.name : 'Mission Control';
    exGrid.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var w = document.createElement('span');
      w.className = 'exw';
      exGrid.appendChild(w);
    }
    exposeEl.classList.add('on');
    exposeOpen = true;
    setTimeout(closeExpose, 1900);
  }
  function closeExpose() {
    exposeEl.classList.remove('on');
    exposeOpen = false;
  }

  /* ---- brightness / volume ---- */
  var hudTimer = 0;
  var VOL_ON = '<svg viewBox="0 0 24 24"><path d="M4 9h3.5L12 5v14l-4.5-4H4z"/><path d="M15.2 8.6a4.6 4.6 0 0 1 0 6.8" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';
  var BRI_ON = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.4"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" stroke="#fff" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>';
  function showHud(kind, value) {
    hudIcon.innerHTML = kind === 'volume' ? VOL_ON : BRI_ON;
    hudFill.style.width = Math.round(value * 100) + '%';
    hud.classList.add('on');
    clearTimeout(hudTimer);
    hudTimer = setTimeout(function () { hud.classList.remove('on'); }, 1100);
  }
  function setBrightness(v) {
    state.brightness = v;
    // never fully black: a demo that can be switched off is a broken demo
    mac.style.setProperty('--bright', (0.34 + v * 0.66).toFixed(3));
    sBrightFill.style.height = (v * 100) + '%';
    showHud('brightness', v);
  }
  function setVolume(v) {
    state.volume = v;
    sVolFill.style.height = (v * 100) + '%';
    showHud('volume', v);
  }

  /* ================================================================
     the phone - the context strip
     ================================================================ */
  function renderStrip() {
    var app = currentApp();
    var visible = mode !== 'deck' && !drawerOpen && app.strip;
    stripEl.classList.toggle('hidden', !visible);
    appChip.style.opacity = visible ? '1' : '.35';
    appChipName.textContent = app.name;
    var dot = appChip.querySelector('.adot');
    // colour derived from the name, stable across sessions because the hash is
    var h = 5381;
    for (var i = 0; i < app.name.length; i++) h = ((h * 33) + app.name.charCodeAt(i)) % 100000;
    dot.style.background = 'hsl(' + (h % 360) + ' 62% 55%)';
    dot.textContent = app.name.charAt(0);
    if (!visible) { stripEl.innerHTML = ''; return; }

    stripEl.innerHTML = app.strip.map(function (c) {
      return '<button class="skey' + (c.solid ? ' solid' : '') + '" type="button" data-k="' + c.k +
        '" aria-label="' + c.label + '" title="' + c.label + ' · ' + c.keys + '">' + SYM[c.sym] + '</button>';
    }).join('');
    stripEl.querySelectorAll('.skey').forEach(function (b) {
      b.addEventListener('click', function () {
        touched();
        var msg = app.press(b.getAttribute('data-k'));
        renderWindow();
        say(msg);
      });
    });
  }

  /* ================================================================
     the phone - the deck
     ================================================================ */
  var WELLS = 15;
  function renderDeck() {
    dPlate.innerHTML = '';
    for (var i = 0; i < WELLS; i++) {
      var app = APPS[i];
      var key = document.createElement('button');
      key.className = 'dkey' + (app ? '' : ' empty') + (app && app.running ? ' running' : '');
      key.type = 'button';
      key.setAttribute('aria-label', app ? app.name : 'Empty key');
      key.innerHTML = '<span class="dwell"></span><span class="dcap"><span class="dlcd">' +
        (app ? ICONS[app.icon] : '') + '</span><span class="dglass"></span></span><span class="drun"></span>';
      if (app) bindDeckKey(key, i);
      dPlate.appendChild(key);
    }
  }

  function bindDeckKey(key, index) {
    var holdTimer = 0, fired = false, inside = false;
    key.addEventListener('pointerdown', function (e) {
      touched();
      key.setPointerCapture(e.pointerId);
      key.classList.add('down');
      inside = true;
      fired = false;
      // A still finger emits no move events, so the hold is timed, not polled.
      holdTimer = setTimeout(function () {
        if (!inside) return;
        fired = true;
        key.classList.remove('down');
        setApp(index, 'silent');
        openExpose('app');
        say('Held. A long press is <b>App Exposé</b> for that app - every window it has, spread out.');
      }, 500);
    });
    key.addEventListener('pointermove', function (e) {
      if (!key.hasPointerCapture(e.pointerId)) return;
      var b = key.getBoundingClientRect();
      inside = e.clientX > b.left - 8 && e.clientX < b.right + 8 &&
               e.clientY > b.top - 8 && e.clientY < b.bottom + 8;
      key.classList.toggle('down', inside && !fired);
    });
    key.addEventListener('pointerup', function () {
      clearTimeout(holdTimer);
      key.classList.remove('down');
      if (fired || !inside) { inside = false; return; }
      inside = false;
      setApp(index, 'deck');
      if (drawerOpen) closeDrawer();
    });
    key.addEventListener('pointercancel', function () {
      clearTimeout(holdTimer);
      key.classList.remove('down');
      inside = false;
    });
  }

  /* the flanking sliders - brightness left, volume right, the sides the Mac's
     own keyboard puts them on */
  function bindSlider(el, apply) {
    function fromEvent(e) {
      var b = el.getBoundingClientRect();
      return Math.max(0, Math.min(1, 1 - (e.clientY - b.top) / b.height));
    }
    el.addEventListener('pointerdown', function (e) {
      touched();
      el.setPointerCapture(e.pointerId);
      apply(fromEvent(e));
      e.preventDefault();
    });
    el.addEventListener('pointermove', function (e) {
      if (!el.hasPointerCapture(e.pointerId)) return;
      apply(fromEvent(e));
    });
    el.addEventListener('pointerup', function () {
      say('That is the Mac\'s real volume and brightness - CoreAudio\'s output device and DisplayServices. If either can\'t be read <em>and</em> set, the phone draws no slider at all: absent beats inert.');
    });
  }
  bindSlider(sBright, setBrightness);
  bindSlider(sVol, setVolume);

  /* ================================================================
     the flower - press the circle and drag
     ================================================================ */
  var MODES = [
    { id: 'pad', label: 'Trackpad', angle: 15, icon: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/></svg>' },
    { id: 'pointer', label: 'Pointer', angle: 58, icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 1.6v3M12 19.4v3M1.6 12h3M19.4 12h3" stroke="currentColor" stroke-width="1.8"/></svg>' },
    { id: 'deck', label: 'Deck', angle: 101, icon: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7.4" height="7.4" rx="2"/><rect x="13.6" y="3" width="7.4" height="7.4" rx="2"/><rect x="3" y="13.6" width="7.4" height="7.4" rx="2"/><rect x="13.6" y="13.6" width="7.4" height="7.4" rx="2"/></svg>' }
  ];
  var RADIUS = 64, REACH = 118, DEAD = 26;
  var mode = 'pad', drawerOpen = false, drawerReturn = null;

  MODES.forEach(function (m) {
    var p = document.createElement('span');
    p.className = 'petal';
    p.setAttribute('data-mode', m.id);
    var rad = m.angle * Math.PI / 180;
    p.style.setProperty('--px', (Math.cos(rad) * RADIUS).toFixed(1) + 'px');
    p.style.setProperty('--py', (Math.sin(rad) * RADIUS).toFixed(1) + 'px');
    p.innerHTML = m.icon + '<span class="plab">' + m.label + '</span>';
    p.addEventListener('click', function (e) { e.stopPropagation(); setMode(m.id); closeFlower(); });
    switcher.appendChild(p);
  });
  var petals = Array.prototype.slice.call(switcher.querySelectorAll('.petal'));

  function iconFor(id) {
    for (var i = 0; i < MODES.length; i++) if (MODES[i].id === id) return MODES[i].icon;
    return '';
  }
  function openFlower() { switcher.classList.add('open'); }
  function closeFlower() {
    switcher.classList.remove('open');
    petals.forEach(function (p) { p.classList.remove('hot'); });
  }

  (function bindFlower() {
    var down = false, moved = false, hot = null, startedOpen = false;
    switcher.addEventListener('pointerdown', function (e) {
      touched();
      down = true; moved = false; hot = null;
      startedOpen = switcher.classList.contains('open');
      switcher.setPointerCapture(e.pointerId);
      openFlower();
      e.preventDefault();
    });
    switcher.addEventListener('pointermove', function (e) {
      if (!down) return;
      var b = switcher.getBoundingClientRect();
      var dx = e.clientX - (b.left + b.width / 2);
      var dy = e.clientY - (b.top + b.height / 2);
      var dist = Math.hypot(dx, dy);
      if (dist > 6) moved = true;
      hot = null;
      // A marking menu is a direction, not a target: nearest petal wins across
      // a generous reach, so overshooting costs nothing.
      if (dist > DEAD && dist < REACH) {
        var best = Infinity;
        petals.forEach(function (p) {
          var m = MODES.filter(function (x) { return x.id === p.getAttribute('data-mode'); })[0];
          var rad = m.angle * Math.PI / 180;
          var px = Math.cos(rad) * RADIUS, py = Math.sin(rad) * RADIUS;
          var d = Math.hypot(dx - px, dy - py);
          if (d < best) { best = d; hot = p; }
        });
      }
      petals.forEach(function (p) { p.classList.toggle('hot', p === hot); });
    });
    function end() {
      if (!down) return;
      down = false;
      if (hot) { setMode(hot.getAttribute('data-mode')); closeFlower(); }
      else if (moved || startedOpen) { closeFlower(); }
      // a plain tap leaves the flower open, so it can be read and clicked
    }
    switcher.addEventListener('pointerup', end);
    switcher.addEventListener('pointercancel', end);
    document.addEventListener('pointerdown', function (e) {
      if (!switcher.contains(e.target)) closeFlower();
    });
  })();

  function setMode(next) {
    if (drawerOpen) { drawerOpen = false; drawerReturn = null; }
    sfDeck.classList.remove('drawered');
    mode = next;
    desk.setAttribute('data-mode', next);
    sfPad.classList.toggle('on', next === 'pad');
    sfPointer.classList.toggle('on', next === 'pointer');
    sfDeck.classList.toggle('on', next === 'deck');
    swCircle.innerHTML = iconFor(next);
    drawerBtn.style.display = next === 'deck' ? 'none' : 'grid';
    haloEl.classList.toggle('on', next === 'pointer');
    renderStrip();
    if (next === 'pad') say('The trackpad. Every threshold behind it is tunable from the Mac - tap travel, the tap-then-drag window, how much movement commits a swipe.');
    if (next === 'pointer') say('The air pointer. A different mechanism, not the trackpad with another sensor: it sends a <b>position</b>, and the halo on the Mac is the only feedback aiming has.');
    if (next === 'deck') say('Fifteen wells, three columns, in Dock order. Seven are empty here because this Mac only has eight apps in its Dock - an empty key wobbles but never fires.');
  }
  swCircle.innerHTML = iconFor('pad');

  /* the app drawer: the same deck, summoned and dismissed in one motion */
  drawerBtn.addEventListener('click', function () {
    touched();
    drawerReturn = mode;
    drawerOpen = true;
    sfPad.classList.remove('on');
    sfPointer.classList.remove('on');
    sfDeck.classList.add('on', 'drawered');
    desk.setAttribute('data-mode', 'deck');
    drawerBtn.style.display = 'none';
    renderStrip();
    say('The <b>app drawer</b>: the same deck, pulled up over whatever surface you were on. Launch one app and it leaves, putting you back where you were.');
  });
  function closeDrawer() {
    if (!drawerOpen) return;
    drawerOpen = false;
    sfDeck.classList.remove('on', 'drawered');
    setMode(drawerReturn || 'pad');
    drawerReturn = null;
  }
  $('dGrip').addEventListener('click', function () { if (drawerOpen) closeDrawer(); });

  /* ================================================================
     the trackpad - the shipped curve, the shipped tap threshold
     ================================================================ */
  var CURVE = { min: 0.45, max: 5.5, knee: 420, precision: 1.25 };
  var MAP = 0.78;            // the demo's glass is smaller than a phone's
  var TAP_TRAVEL = 10;       // singleTapMaximumTravelPoints, as shipped
  var TAP_MS = 300;

  function gainFor(speed) {
    if (speed <= 0) return CURVE.min;
    var r = Math.pow(speed / CURVE.knee, CURVE.precision);
    return CURVE.min + (CURVE.max - CURVE.min) * (r / (r + 1));
  }

  (function bindPad() {
    var active = new Map(), primary = null, lastT = 0, lastX = 0, lastY = 0;
    var travel = 0, downT = 0, scrollBase = null;

    function localPoint(e) {
      var b = sfPad.getBoundingClientRect();
      return { x: e.clientX - b.left, y: e.clientY - b.top, w: b.width, h: b.height };
    }

    sfPad.addEventListener('pointerdown', function (e) {
      touched();
      sfPad.setPointerCapture(e.pointerId);
      active.set(e.pointerId, e);
      if (active.size === 1) {
        primary = e.pointerId;
        var p = localPoint(e);
        lastX = p.x; lastY = p.y; lastT = performance.now();
        travel = 0; downT = lastT;
        padHint.classList.add('gone');
        padTouch.classList.add('on');
        padTouch.style.left = p.x + 'px';
        padTouch.style.top = p.y + 'px';
      } else if (active.size === 2) {
        // two fingers on the glass is a scroll, not a move
        scrollBase = e.clientY;
      }
      e.preventDefault();
    });

    sfPad.addEventListener('pointermove', function (e) {
      if (!active.has(e.pointerId)) return;
      active.set(e.pointerId, e);
      var p = localPoint(e);

      if (active.size >= 2) {
        if (scrollBase !== null) { scrollWindow((e.clientY - scrollBase) * 1.4); scrollBase = e.clientY; }
        return;
      }
      if (e.pointerId !== primary) return;

      padTouch.style.left = p.x + 'px';
      padTouch.style.top = p.y + 'px';

      var now = performance.now();
      var dt = Math.max(1, now - lastT) / 1000;
      var dx = p.x - lastX, dy = p.y - lastY;
      lastX = p.x; lastY = p.y; lastT = now;
      travel += Math.hypot(dx, dy);

      var speed = Math.hypot(dx, dy) / dt;
      var gain = gainFor(speed);
      // sub-pixel accumulation: the fraction is kept, never thrown away
      var mx = dx * gain * MAP + subX, my = dy * gain * MAP + subY;
      var ix = Math.trunc(mx), iy = Math.trunc(my);
      subX = mx - ix; subY = my - iy;
      moveCursor(ix, iy);

      frames++;
      if (frames % 4 === 0) {
        roFrames.textContent = frames;
        roGain.textContent = gain.toFixed(2);
      }
    });

    function up(e) {
      if (!active.has(e.pointerId)) return;
      var wasPrimary = e.pointerId === primary;
      active.delete(e.pointerId);
      if (active.size < 2) scrollBase = null;
      if (!wasPrimary) return;
      primary = active.size ? active.keys().next().value : null;
      padTouch.classList.remove('on');
      var dur = performance.now() - downT;
      if (travel < TAP_TRAVEL && dur < TAP_MS) {
        clickAt();
        say('Tap to click. A tap is a touch that travelled less than <b>ten points</b> - the shipped threshold, and one of eight you can move from the Mac.');
      }
    }
    sfPad.addEventListener('pointerup', up);
    sfPad.addEventListener('pointercancel', up);

    // a mouse has no second finger, so the wheel stands in for two of them
    sfPad.addEventListener('wheel', function (e) {
      touched();
      e.preventDefault();
      scrollWindow(-e.deltaY * 0.55);
    }, { passive: false });
  })();

  function scrollWindow(dy) {
    var target = winBody.firstElementChild;
    if (!target) return;
    scrollY = Math.max(-64, Math.min(0, scrollY + dy));
    target.style.transform = 'translateY(' + scrollY + 'px)';
  }

  /* ================================================================
     the air pointer
     ================================================================ */
  (function bindPointer() {
    var aiming = false;

    function aimFrom(e) {
      var b = sfPointer.getBoundingClientRect();
      var nx = (e.clientX - b.left) / b.width;
      var ny = (e.clientY - b.top) / b.height;
      // Integrate then clamp: nothing accumulates past the edge, so sweeping
      // past the side and coming back moves the cursor immediately.
      aimCursor(Math.max(0, Math.min(1, nx)), Math.max(0, Math.min(1, ny)));
      frames++;
      if (frames % 4 === 0) roFrames.textContent = frames;
    }

    sfPointer.addEventListener('pointermove', function (e) {
      if (mode !== 'pointer') return;
      if (e.pointerType === 'mouse' || aiming) aimFrom(e);
    });
    sfPointer.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.wheel, .pside')) return;
      touched();
      aiming = true;
      sfPointer.setPointerCapture(e.pointerId);
      aimFrom(e);
    });
    sfPointer.addEventListener('pointerup', function () { aiming = false; });

    // the wheel: four pushes are four system commands, the middle is a click
    var quads = Array.prototype.slice.call(wheel.querySelectorAll('.wq'));
    function quadFor(e) {
      var b = wheel.getBoundingClientRect();
      var dx = e.clientX - (b.left + b.width / 2);
      var dy = e.clientY - (b.top + b.height / 2);
      var r = Math.hypot(dx, dy) / (b.width / 2);
      if (r < 0.34) return null;
      var a = Math.atan2(dy, dx) * 180 / Math.PI;
      if (a >= -45 && a < 45) return 'right';
      if (a >= 45 && a < 135) return 'down';
      if (a >= -135 && a < -45) return 'up';
      return 'left';
    }
    wheel.addEventListener('pointermove', function (e) {
      var q = quadFor(e);
      quads.forEach(function (el) { el.classList.toggle('hot', el.classList.contains(q)); });
    });
    wheel.addEventListener('pointerleave', function () {
      quads.forEach(function (el) { el.classList.remove('hot'); });
    });
    wheel.addEventListener('pointerdown', function (e) {
      touched();
      e.stopPropagation();
      var q = quadFor(e);
      if (!q) {
        clickAt();
        say('Tap the middle to click. Everything on this surface answers with a haptic, because your eyes are on the Mac and not on the glass.');
        return;
      }
      if (q === 'up') { openExpose('all'); say('Mission Control - and Padoo pressed <b>whatever you have it bound to</b>, read live from the window server. Rebound it? It presses yours. Turned it off? It presses nothing.'); }
      else if (q === 'down') { openExpose('app'); say('App Windows. Not the Apple default guessed from memory - App Exposé is <b>fn+control+down</b>, and posting it without the fn bit types an arrow key into whatever is focused.'); }
      else {
        state.space += q === 'left' ? 1 : -1;
        state.space = Math.max(-1, Math.min(1, state.space));
        spaceWrap.style.transform = 'translateX(' + (state.space * 22) + '%)';
        say('Moved a space. Same story: the combination comes from the window server, so a Mac that rebound it still works.');
      }
    });

    var dragging = false;
    pDrag.addEventListener('click', function () {
      touched();
      dragging = !dragging;
      pDrag.classList.toggle('armed', dragging);
      pDragLabel.textContent = dragging ? 'Drop' : 'Drag';
      say(dragging
        ? 'Button held. If the link died right now, the Mac would release it within about <b>a second and a half</b> rather than leave you dragging forever.'
        : 'Dropped.');
    });
    pRight.addEventListener('click', function () {
      touched();
      clickAt();
      say('Right click. On the trackpad this is a two-finger tap, so the surface needs no button for it - here there is no second finger, so there is one.');
    });
  })();

  /* ================================================================
     the autopilot: shows the idea, and gets out of the way for good
     the moment anyone touches anything
     ================================================================ */
  var userTouched = false, autoTimer = 0, autoRaf = 0;
  function touched() {
    if (userTouched) return;
    userTouched = true;
    clearTimeout(autoTimer);
    cancelAnimationFrame(autoRaf);
    padHint.classList.add('gone');
  }
  ['pointerdown', 'wheel', 'keydown'].forEach(function (t) {
    desk.addEventListener(t, touched, { passive: true });
  });

  function autopilot() {
    if (userTouched || reduce) return;
    var box = screenBox();
    // a lazy figure across the desktop, then a tap on the Dock's third icon
    var target = dockEl.children[2].getBoundingClientRect();
    var dockBox = { x: target.left + target.width / 2 - box.left, y: target.top + target.height / 2 - box.top };
    var path = [
      { x: box.width * 0.30, y: box.height * 0.62 },
      { x: box.width * 0.62, y: box.height * 0.30 },
      { x: box.width * 0.46, y: box.height * 0.52 },
      { x: dockBox.x, y: dockBox.y }
    ];
    var seg = 0, t = 0, from = { x: cx, y: cy };
    function step() {
      if (userTouched) return;
      t += 0.016;
      var dur = 0.85;
      var k = Math.min(1, t / dur);
      var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      cx = from.x + (path[seg].x - from.x) * e;
      cy = from.y + (path[seg].y - from.y) * e;
      placeCursor();
      if (k >= 1) {
        from = { x: cx, y: cy }; t = 0; seg++;
        if (seg >= path.length) {
          clickAt();
          return;
        }
      }
      autoRaf = requestAnimationFrame(step);
    }
    autoRaf = requestAnimationFrame(step);
  }

  var stageSeen = false;
  var sio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting || stageSeen) return;
      stageSeen = true;
      sio.disconnect();
      autoTimer = setTimeout(autopilot, 1400);
    });
  }, { threshold: 0.35 });
  sio.observe(desk);

  /* ================================================================
     boot
     ================================================================ */
  setBrightness(1);
  sVolFill.style.height = (state.volume * 100) + '%';
  setApp(0, 'boot');
  setMode('pad');
  say(idleHint(), true);
  window.addEventListener('resize', function () {
    var box = screenBox();
    cx = Math.min(cx, box.width - 4);
    cy = Math.max(MENUBAR, Math.min(cy, box.height - 4));
    placeCursor();
  });
})();
