/* Chronicles boot — the only thing a game's HTML file has to load.
 *
 * A game shell is five lines: it names its track and loads this. Everything
 * else is worked out from the catalogue, which is also what the landing page
 * reads, so adding a track never means editing a shell.
 *
 * Load order matters and is deliberate:
 *
 *   defaults  -> the tunables
 *   core      -> palette, drawing, movement, map, camera, travel
 *   world     -> colourway, furniture painters, rooms   (needs core's palette)
 *   track     -> cast, objectives, step machine, lessons
 *   catalogue -> the list of every game
 *   frontend  -> menu, avatars, picker, certificate, and the boot that runs
 *
 * Core loads before the world and the track and reads everything it needs from
 * them inside functions, never at load time. Scripts are appended with
 * async=false, which keeps classic scripts executing in insertion order.
 */
(function () {
  var track = window.CHRONICLE;
  if (!track) throw new Error('boot: window.CHRONICLE must name a track');

  var base = document.currentScript.src.replace(/engine\/boot\.js.*$/, '');

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = base + 'engine/engine.css';
  document.head.appendChild(link);

  /* The DOM the engine expects. It lives here rather than in nine shells, so a
     change to the markup is one edit. Labels are filled in after the config
     layers have merged, in engine/frontend.js. */
  document.body.innerHTML = [
    '<div class="wrap">',
    '  <div class="top">',
    '    <h1 id="gameTitle"></h1>',
    '    <div class="hud">',
    '      <span id="clock"></span>',
    '      <button id="folioBtn"><span id="folioLabel"></span> (<span id="folioCount">0</span>)</button>',
    '    </div>',
    '  </div>',
    '  <div class="objrow">',
    '    <div id="obj"></div>',
    '    <div id="map" class="map" aria-label="Floor map"></div>',
    '  </div>',
    '  <div id="coach"></div>',
    '  <div class="stage">',
    '    <canvas id="c" width="1600" height="960" role="img"></canvas>',
    '  </div>',
    '  <div id="dlg"></div>',
    '  <div class="pad">',
    '    <div class="dpad">',
    '      <button id="t_up">&#9650;</button><button id="t_left">&#9664;</button>',
    '      <button id="t_right">&#9654;</button><button id="t_down">&#9660;</button>',
    '    </div>',
    '    <button id="t_act">TALK</button>',
    '  </div>',
    '  <p class="keys" id="keysHint"></p>',
    '</div>',
    '<div class="veil" id="menu"><div class="inner center">',
    '  <h2 id="menuTitle"></h2>',
    '  <p class="lede" id="menuLede"></p>',
    '  <button id="btnPlay" class="primary">Play game</button>',
    '  <button id="btnLearn" class="ghost"></button>',
    '  <button id="btnTracks" class="ghost">Choose another track</button>',
    '</div></div>',
    '<div class="veil" id="nameScreen" style="display:none"><div class="inner center">',
    '  <h3>What should they call you?</h3>',
    '  <input id="nameInput" type="text" autocomplete="off" spellcheck="false" placeholder="Your name"/>',
    '  <p class="hintline">It goes on your certificate at the end of the day.</p>',
    '  <button id="nameGo" class="primary" disabled>Start</button>',
    '  <button id="backName" class="link">Back</button>',
    '</div></div>',
    '<div class="veil" id="avatarScreen" style="display:none"><div class="inner center">',
    '  <h3>And who are you today?</h3>',
    '  <div class="avrow">',
    '    <div class="avcard"><canvas id="av0" width="230" height="300"></canvas></div>',
    '    <div class="avcard"><canvas id="av1" width="230" height="300"></canvas></div>',
    '    <div class="avcard"><canvas id="av2" width="230" height="300"></canvas></div>',
    '  </div>',
    '  <button id="avGo" class="primary" disabled>Start your first day</button>',
    '  <button id="backAvatar" class="link">Back</button>',
    '</div></div>',
    '<div class="veil" id="lessonsScreen" style="display:none"><div class="inner">',
    '  <h3 id="lessonsTitle">What this teaches</h3>',
    '  <div id="lessonsBody"></div>',
    '  <button id="backLessons" class="link">Back to menu</button>',
    '</div></div>',
    '<div class="veil" id="tracksScreen" style="display:none"><div class="inner">',
    '  <h3 id="pickerTitle"></h3>',
    '  <p class="lede small" id="pickerLede"></p>',
    '  <div id="tracksBody"></div>',
    '  <button id="backTracks" class="link">Back to menu</button>',
    '</div></div>',
    '<div class="veil" id="cert" style="display:none"><div class="inner center wide">',
    '  <canvas id="certCanvas" width="800" height="565"></canvas>',
    '  <div class="certbtns">',
    '    <button id="certDownload" class="primary">Download</button>',
    '    <button id="certFolio" class="ghost"></button>',
    '  </div>',
    '</div></div>',
    '<div class="veil" id="folio" style="display:none"><div class="inner"></div></div>'
  ].join('\n');

  /* The catalogue says which world a track belongs to, but it loads late, so
     read the world from a tiny map the catalogue also feeds. Falling back to
     loading the catalogue first keeps this honest with one source of truth. */
  var files = ['engine/defaults.js', 'catalogue.js'];
  var rest = null;

  function inject(list, done) {
    var i = 0;
    (function next() {
      if (i >= list.length) return done && done();
      var s = document.createElement('script');
      s.src = base + list[i++];
      s.async = false;
      s.onload = next;
      s.onerror = function () { throw new Error('boot: failed to load ' + s.src); };
      document.head.appendChild(s);
    })();
  }

  inject(files, function () {
    var entry = (window.CATALOGUE || []).filter(function (e) { return e.id === track; })[0];
    if (!entry) throw new Error('boot: "' + track + '" is not in catalogue.js');
    rest = ['engine/core.js',
            'worlds/' + entry.world + '.js',
            'tracks/' + track + '.js',
            'engine/frontend.js'];
    inject(rest);
  });
})();
