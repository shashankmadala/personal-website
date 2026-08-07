/* ============================================================
   SHASHANK MADALA · animation engine
   typewriter hero, live terminal, scroll-scrubbed statement,
   sticky card stack, receipt printer, tilt, magnetic, cursor
   ============================================================ */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  /* ---------- preloader + hero typewriter ---------- */
  var loader = document.getElementById("loader");
  var loaderName = document.getElementById("loaderName");
  var typeTitle = document.getElementById("typeTitle");
  var typeRole = document.getElementById("typeRole");
  var hero = document.querySelector(".hero");
  var TITLE = "Hi, I'm Shashank.";
  var ROLES = [
    "I build AI that reads emotion.",
    "I research autism at Yale.",
    "I represented Team USA.",
    "I teach ML to 15,000+ students.",
    "I run a 50-chapter nonprofit."
  ];

  function typeInto(el, text, speed, done) {
    var i = 0;
    (function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(tick, speed + Math.random() * speed * 0.9);
      } else if (done) {
        done();
      }
    })();
  }

  function roleLoop(idx) {
    var text = ROLES[idx % ROLES.length];
    var i = 0;
    (function typeF() {
      if (i <= text.length) {
        typeRole.textContent = text.slice(0, i++);
        setTimeout(typeF, 34 + Math.random() * 30);
      } else {
        setTimeout(function () { eraseF(text.length); }, 2100);
      }
    })();
    function eraseF(n) {
      if (n >= 0) {
        typeRole.textContent = text.slice(0, n);
        setTimeout(function () { eraseF(n - 1); }, 16);
      } else {
        setTimeout(function () { roleLoop(idx + 1); }, 240);
      }
    }
  }

  function startHero() {
    if (reduced) {
      typeTitle.textContent = TITLE;
      typeRole.textContent = ROLES[0];
      hero.classList.add("typed");
      return;
    }
    typeInto(typeTitle, TITLE, 55, function () {
      hero.classList.add("typed");
      setTimeout(function () { roleLoop(0); }, 350);
    });
  }

  if (reduced) {
    loader.classList.add("done");
    startHero();
    armTerm();
  } else {
    typeInto(loaderName, "shashank.madala", 38, function () {
      setTimeout(function () {
        loader.classList.add("done");
        startHero();
        armTerm();
      }, 260);
    });
  }
  loader.addEventListener("transitionend", function () {
    if (loader.parentNode) loader.parentNode.removeChild(loader);
  });

  /* ---------- terminal ---------- */
  var termBody = document.getElementById("termBody");
  var SEQ = [
    { cmd: "whoami",
      out: ["shashank madala <span class='t-hl'>&middot;</span> student, builder, researcher",
            "robbinsville, nj <span class='t-hl'>&middot;</span> class of 2027"] },
    { cmd: "ls ~/building",
      out: ["<span class='t-hl'>kora/</span>  <span class='t-hl'>lumin-ai/</span>  <span class='t-hl'>safestrides/</span>  <span class='t-hl'>yale-research/</span>  <span class='t-hl'>frc-2590/</span>"] },
    { cmd: "cat focus.txt",
      out: ["AI that helps people understand each other."] },
    { cmd: "./status --live",
      out: ["research @ yale child study center <span class='t-ok'>[ACTIVE]</span>",
            "team usa &middot; econ olympiad 2026 <span class='t-hl'>[6TH OF 52]</span>",
            "lumin ai &middot; 50+ chapters <span class='t-hl'>[15,000+ STUDENTS]</span>",
            "kora &middot; 25 therapy centers <span class='t-hl'>[700+ USERS]</span>",
            "fbla &middot; chapter president <span class='t-hl'>[2X STATE TECH COMMITTEE]</span>"] }
  ];

  function termLine(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    termBody.appendChild(div);
  }

  var termRuns = 0;
  function runTerm() {
    termBody.innerHTML = "";
    var s = 0;
    (function nextCmd() {
      if (s >= SEQ.length) {
        termLine("<span class='t-prompt'>$</span> <span class='term-caret'></span>");
        termRuns++;
        if (termRuns < 2) setTimeout(runTerm, 4200);
        return;
      }
      var item = SEQ[s];
      var line = document.createElement("div");
      line.innerHTML = "<span class='t-prompt'>$</span> <span class='t-cmd'></span><span class='term-caret'></span>";
      termBody.appendChild(line);
      var cmdEl = line.querySelector(".t-cmd");
      var caret = line.querySelector(".term-caret");
      var i = 0;
      (function typeCmd() {
        if (i <= item.cmd.length) {
          cmdEl.textContent = item.cmd.slice(0, i++);
          setTimeout(typeCmd, 34 + Math.random() * 40);
        } else {
          caret.remove();
          var o = 0;
          (function outLine() {
            if (o < item.out.length) {
              termLine("<span class='t-out'>" + item.out[o++] + "</span>");
              setTimeout(outLine, 110);
            } else {
              s++;
              setTimeout(nextCmd, 620);
            }
          })();
        }
      })();
    })();
  }

  function armTerm() {
    if (reduced) {
      SEQ.forEach(function (item) {
        termLine("<span class='t-prompt'>$</span> <span class='t-cmd'>" + item.cmd + "</span>");
        item.out.forEach(function (l) { termLine("<span class='t-out'>" + l + "</span>"); });
      });
      return;
    }
    var termStarted = false;
    var termIO = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !termStarted) {
        termStarted = true;
        setTimeout(runTerm, 600);
        termIO.disconnect();
      }
    }, { threshold: 0.2 });
    termIO.observe(termBody);
  }

  /* ---------- marquee: duplicate for seamless loop ---------- */
  var track = document.getElementById("marqueeTrack");
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- reveal on scroll ---------- */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("on");
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { revealIO.observe(el); });

  /* ---------- counters ---------- */
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var dur = 1600;
    var t0 = null;
    function frame(t) {
      if (!t0) t0 = t;
      var p = clamp((t - t0) / dur, 0, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        runCounter(e.target);
        countIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(function (el) {
    if (reduced) el.textContent = parseInt(el.getAttribute("data-count"), 10).toLocaleString("en-US");
    else countIO.observe(el);
  });

  /* ---------- receipt printer ---------- */
  var receipt = document.getElementById("receipt");
  if (receipt) {
    var rows = receipt.querySelectorAll(".r-row");
    if (reduced) {
      rows.forEach(function (r) { r.classList.add("on"); });
    } else {
      var rIO = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          rows.forEach(function (r, i) {
            setTimeout(function () { r.classList.add("on"); }, 90 * i + 200);
          });
          rIO.disconnect();
        }
      }, { threshold: 0.35 });
      rIO.observe(receipt);
    }
  }

  /* ---------- statement: split into words ---------- */
  var statement = document.getElementById("statementText");
  var stWords = [];
  if (statement) {
    var KEY = { "AI": 1, "understand": 1, "emotion,": 1, "connection,": 1, "countries.": 1 };
    var words = statement.textContent.trim().split(/\s+/);
    statement.innerHTML = words.map(function (w) {
      return "<span class='w" + (KEY[w] ? " key" : "") + "'>" + w + "</span>";
    }).join(" ");
    stWords = statement.querySelectorAll(".w");
    if (reduced) stWords.forEach(function (w) { w.classList.add("lit"); });
  }

  /* ---------- magnetic buttons ---------- */
  if (!touch && !reduced) {
    document.querySelectorAll("[data-magnet]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + dx * 0.13 + "px," + dy * 0.16 + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* ---------- card spotlight follows the cursor ---------- */
  if (!touch && !reduced) {
    document.querySelectorAll(".spot").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- hero: cursor glow + floating chip parallax + terminal tilt ---------- */
  var heroCursor = document.getElementById("heroCursor");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".float-chip"));
  var CHIP_F = [0.018, 0.028, 0.022];
  var hcX = 0, hcY = 0, hcTX = 0, hcTY = 0;
  var tiltTX = 0, tiltTY = 0, tiltX = 0, tiltY = 0;
  if (!touch && !reduced && hero) {
    hero.addEventListener("mousemove", function (e) {
      var hr = hero.getBoundingClientRect();
      hcTX = e.clientX;
      hcTY = e.clientY - hr.top;
      hero.classList.add("mouse-in");
      var cx = e.clientX - window.innerWidth / 2;
      var cy = e.clientY - window.innerHeight / 2;
      chips.forEach(function (chip, i) {
        var px = Math.max(-16, Math.min(16, cx * CHIP_F[i]));
        var py = Math.max(-12, Math.min(12, cy * CHIP_F[i]));
        chip.style.setProperty("--px", px + "px");
        chip.style.setProperty("--py", py + "px");
      });
    });
    hero.addEventListener("mouseleave", function () {
      hero.classList.remove("mouse-in");
      chips.forEach(function (chip) {
        chip.style.setProperty("--px", "0px");
        chip.style.setProperty("--py", "0px");
      });
    });
  }
  var termWrapEl = document.getElementById("termWrap");
  if (!touch && !reduced && termWrapEl) {
    termWrapEl.addEventListener("mousemove", function (e) {
      var r = termWrapEl.getBoundingClientRect();
      tiltTY = ((e.clientX - r.left) / r.width - 0.5) * 4.5;
      tiltTX = -((e.clientY - r.top) / r.height - 0.5) * 3;
    });
    termWrapEl.addEventListener("mouseleave", function () {
      tiltTX = 0; tiltTY = 0;
    });
  }

  /* ---------- scroll-driven engine (rAF) ---------- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("progress");
  var term = document.getElementById("term");
  var termWrap = document.getElementById("termWrap");
  var statementSec = document.getElementById("statement");
  var stackCards = Array.prototype.slice.call(document.querySelectorAll(".stack-card"));
  var lastY = 0;
  var navAccum = 0;

  function onFrame() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight - vh;

    /* progress bar */
    if (progress) progress.style.transform = "scaleX(" + (docH > 0 ? y / docH : 0) + ")";

    /* nav state: accumulate scroll direction so slow scrolls still toggle it */
    if (y > 30) nav.classList.add("scrolled"); else nav.classList.remove("scrolled");
    var dy = y - lastY;
    if (dy !== 0) {
      if ((dy > 0) !== (navAccum > 0)) navAccum = 0;
      navAccum += dy;
      if (y > 500 && navAccum > 12) nav.classList.add("hidden");
      else if (navAccum < -12 || y <= 500) nav.classList.remove("hidden");
    }
    lastY = y;

    if (!reduced) {
      /* terminal: scroll lift + mouse tilt */
      if (term && termWrap) {
        var r = termWrap.getBoundingClientRect();
        var p = clamp(1 - (r.top + r.height * 0.5 - vh * 0.5) / vh, 0, 2);
        var rot = clamp(4.5 - p * 4.5, 0, 4.5);
        tiltX = lerp(tiltX, tiltTX, 0.08);
        tiltY = lerp(tiltY, tiltTY, 0.08);
        term.style.transform = "rotateX(" + (rot + tiltX) + "deg) rotateY(" + tiltY + "deg) translateY(" + (1 - clamp(p, 0, 1)) * 26 + "px)";
      }

      /* hero cursor glow lerp */
      if (heroCursor && hero.classList.contains("mouse-in")) {
        hcX = lerp(hcX, hcTX, 0.1);
        hcY = lerp(hcY, hcTY, 0.1);
        heroCursor.style.transform = "translate(" + (hcX - 320) + "px," + (hcY - 320) + "px)";
      }

      /* statement scrub */
      if (statementSec && stWords.length) {
        var sr = statementSec.getBoundingClientRect();
        var total = sr.height - vh;
        var sp = clamp(-sr.top / (total * 0.95), 0, 1);
        var lit = Math.floor(sp * stWords.length + 0.001);
        for (var i = 0; i < stWords.length; i++) {
          if (i < lit) stWords[i].classList.add("lit");
          else stWords[i].classList.remove("lit");
        }
      }

      /* sticky stack: scale + dim covered cards (desktop only; mobile cards are static) */
      var stackOn = window.innerWidth > 960;
      for (var c = 0; c < stackCards.length - 1; c++) {
        var inner = stackCards[c].firstElementChild;
        if (!stackOn) {
          if (inner.style.transform) { inner.style.transform = ""; inner.style.filter = ""; inner.style.opacity = ""; }
          continue;
        }
        var nextTop = stackCards[c + 1].getBoundingClientRect().top;
        var cover = clamp((vh - nextTop) / (vh - 100), 0, 1);
        inner.style.transform = "scale(" + (1 - cover * 0.06) + ") translateY(" + (-cover * 12) + "px)";
        inner.style.filter = "brightness(" + (1 - cover * 0.45) + ") saturate(" + (1 - cover * 0.3) + ")";
        inner.style.opacity = String(1 - cover * 0.12);
      }
    }

    requestAnimationFrame(onFrame);
  }
  requestAnimationFrame(onFrame);

})();



/* ---------- hero tile grid: cursor-reactive canvas ---------- */
(function () {
  "use strict";

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;

  var canvas = document.getElementById("tileCanvas");
  if (!canvas) return;

  var hero = canvas.closest ? canvas.closest(".hero") : null;

  /* no grid on touch or reduced motion: drop the element and stop */
  if (reduced || touch || !hero) {
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    return;
  }

  var ctx = canvas.getContext("2d");
  if (!ctx) {
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    return;
  }

  var CELL = 54;            /* tile size, px */
  var GAP = 8;              /* gap between tiles, px */
  var PITCH = CELL + GAP;
  var RADIUS = 240;         /* cursor falloff radius, px */
  var FLOOR = 0.015;        /* skip tiles dimmer than this */
  var DECAY = 7;            /* exp rate: glow fades out in about 0.6s */
  var CORNER = 7;           /* tile corner radius, px */
  var FILL_A = 0.13;        /* fill alpha at full intensity */
  var LINE_A = 0.3;         /* border alpha at full intensity */

  /* viewport tint: indigo on the left blending to cyan on the right */
  var C0 = [109, 127, 242]; /* --indigo */
  var C1 = [56, 225, 232];  /* --cyan */

  var dpr = 1, w = 0, h = 0, cols = 0, rows = 0;
  var cells = new Float32Array(0);
  var colFill = [];         /* per-column "r,g,b" */
  var colLine = [];         /* per-column lighter "r,g,b" for borders */

  var clientX = 0, clientY = 0;
  var mx = -1e4, my = -1e4; /* cursor in canvas space */
  var mouseIn = false, mouseDirty = false, sizeDirty = true;

  var pulses = [];
  var idleT = 0;
  var nextPulse = 1.2;
  var drew = false;
  var lastT = 0;

  function fit() {
    var rect = hero.getBoundingClientRect();
    var W = Math.round(rect.width);
    var H = Math.round(rect.height);
    if (!W || !H) return;
    var d = Math.min(window.devicePixelRatio || 1, 2);
    if (W === w && H === h && d === dpr) return;

    var oldCells = cells, oldCols = cols, oldRows = rows;
    w = W; h = H; dpr = d;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil((w + GAP) / PITCH);
    rows = Math.ceil((h + GAP) / PITCH);
    cells = new Float32Array(cols * rows);

    /* carry surviving glow across the resize */
    var cMin = Math.min(cols, oldCols), rMin = Math.min(rows, oldRows);
    for (var r = 0; r < rMin; r++) {
      for (var c = 0; c < cMin; c++) {
        cells[r * cols + c] = oldCells[r * oldCols + c];
      }
    }

    colFill = new Array(cols);
    colLine = new Array(cols);
    for (var i = 0; i < cols; i++) {
      var t = cols > 1 ? i / (cols - 1) : 0;
      var cr = C0[0] + (C1[0] - C0[0]) * t;
      var cg = C0[1] + (C1[1] - C0[1]) * t;
      var cb = C0[2] + (C1[2] - C0[2]) * t;
      colFill[i] = Math.round(cr) + "," + Math.round(cg) + "," + Math.round(cb);
      colLine[i] = Math.round(cr + (255 - cr) * 0.35) + "," +
                   Math.round(cg + (255 - cg) * 0.35) + "," +
                   Math.round(cb + (255 - cb) * 0.35);
    }
    drew = true;
  }

  function tilePath(x, y) {
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, CELL, CELL, CORNER);
      return;
    }
    var r = CORNER;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + CELL, y, x + CELL, y + CELL, r);
    ctx.arcTo(x + CELL, y + CELL, x, y + CELL, r);
    ctx.arcTo(x, y + CELL, x, y, r);
    ctx.arcTo(x, y, x + CELL, y, r);
    ctx.closePath();
  }

  hero.addEventListener("mousemove", function (e) {
    clientX = e.clientX;
    clientY = e.clientY;
    mouseIn = true;
    mouseDirty = true;
  }, { passive: true });

  hero.addEventListener("mouseleave", function () {
    mouseIn = false;
  }, { passive: true });

  window.addEventListener("resize", function () { sizeDirty = true; }, { passive: true });
  if (typeof ResizeObserver === "function") {
    new ResizeObserver(function () { sizeDirty = true; }).observe(hero);
  }

  function frame(t) {
    requestAnimationFrame(frame);
    var dt = lastT ? Math.min((t - lastT) / 1000, 0.1) : 0.016;
    lastT = t;

    /* reads first, then writes */
    if (sizeDirty) { sizeDirty = false; fit(); }
    if (mouseDirty) {
      var rect = hero.getBoundingClientRect();
      mx = clientX - rect.left;
      my = clientY - rect.top;
      mouseDirty = false;
    }
    if (!cols || !rows) return;

    /* excite tiles inside the cursor radius */
    if (mouseIn && mx > -1e3) {
      var cA = Math.max(0, Math.floor((mx - RADIUS) / PITCH));
      var cB = Math.min(cols - 1, Math.floor((mx + RADIUS) / PITCH));
      var rA = Math.max(0, Math.floor((my - RADIUS) / PITCH));
      var rB = Math.min(rows - 1, Math.floor((my + RADIUS) / PITCH));
      for (var rr = rA; rr <= rB; rr++) {
        for (var cc = cA; cc <= cB; cc++) {
          var dx = cc * PITCH + CELL / 2 - mx;
          var dy = rr * PITCH + CELL / 2 - my;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < RADIUS) {
            var f = 1 - dist / RADIUS;
            f = f * f * (3 - 2 * f);
            var k = rr * cols + cc;
            if (f > cells[k]) cells[k] = f;
          }
        }
      }
    }

    /* decay everything toward dark */
    var fade = Math.exp(-DECAY * dt);
    var any = false;
    for (var i = 0; i < cells.length; i++) {
      var v = cells[i] * fade;
      cells[i] = v < 0.001 ? 0 : v;
      if (v >= FLOOR) any = true;
    }

    /* idle life: a random tile pulses now and then */
    idleT += dt;
    if (idleT >= nextPulse) {
      idleT = 0;
      nextPulse = 1 + Math.random() * 0.5;
      pulses.push({ i: (Math.random() * cells.length) | 0, p: 0 });
    }
    for (var p = pulses.length - 1; p >= 0; p--) {
      var pu = pulses[p];
      pu.p += dt / 1.8;
      if (pu.p >= 1 || pu.i >= cells.length) { pulses.splice(p, 1); continue; }
      var env = Math.sin(Math.PI * pu.p) * 0.26;
      if (env > cells[pu.i]) cells[pu.i] = env;
      if (env >= FLOOR) any = true;
    }

    if (!any) {
      if (drew) { ctx.clearRect(0, 0, w, h); drew = false; }
      return;
    }

    ctx.clearRect(0, 0, w, h);
    drew = true;
    ctx.lineWidth = 1;
    for (var r2 = 0; r2 < rows; r2++) {
      for (var c2 = 0; c2 < cols; c2++) {
        var vv = cells[r2 * cols + c2];
        if (vv < FLOOR) continue;
        tilePath(c2 * PITCH + 0.5, r2 * PITCH + 0.5);
        ctx.fillStyle = "rgba(" + colFill[c2] + "," + (vv * FILL_A).toFixed(3) + ")";
        ctx.fill();
        ctx.strokeStyle = "rgba(" + colLine[c2] + "," + (vv * LINE_A).toFixed(3) + ")";
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(frame);
})();



/* ============================================================
   micro-delights
   dock-magnify hero letters, scroll-reactive marquee,
   click-to-recount stats, nav dot spin
   ============================================================ */

(function () {
  "use strict";

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  var root = document.documentElement;
  if (root.hasAttribute("data-micro-delights")) return;
  root.setAttribute("data-micro-delights", "");

  /* ---------- 1) hero title dock magnify ---------- */
  (function () {
    if (reduced || touch) return;
    var hero = document.querySelector(".hero");
    var title = document.querySelector(".hero-title");
    var typeTitle = document.getElementById("typeTitle");
    if (!hero || !title || !typeTitle) return;

    var RADIUS = 90;
    var LIFT = -10;
    var SCALE = 0.06;
    var letters = null;
    var centers = [];
    var mx = 0, my = 0, over = false, raf = 0, armed = false;

    function wrap() {
      if (typeTitle.querySelector(".tl")) {
        letters = typeTitle.querySelectorAll(".tl");
        return;
      }
      var text = typeTitle.textContent;
      typeTitle.textContent = "";
      var frag = document.createDocumentFragment();
      for (var i = 0; i < text.length; i++) {
        var s = document.createElement("span");
        s.className = "tl";
        s.textContent = text.charAt(i);
        frag.appendChild(s);
      }
      typeTitle.appendChild(frag);
      letters = typeTitle.querySelectorAll(".tl");
    }

    /* cache letter centers relative to the title box so scrolling
       never invalidates them and lifted letters do not feed back */
    function measure() {
      if (!letters) return;
      var tr = title.getBoundingClientRect();
      centers = [];
      for (var i = 0; i < letters.length; i++) {
        var r = letters[i].getBoundingClientRect();
        centers.push({
          x: r.left + r.width / 2 - tr.left,
          y: r.top + r.height / 2 - tr.top
        });
      }
    }

    function apply() {
      raf = 0;
      if (!letters || !centers.length) return;
      var tr = title.getBoundingClientRect();
      for (var i = 0; i < letters.length; i++) {
        var dx = tr.left + centers[i].x - mx;
        var dy = tr.top + centers[i].y - my;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (over && d < RADIUS) {
          var f = 1 - d / RADIUS;
          f = f * f * (3 - 2 * f);
          letters[i].style.transform =
            "translateY(" + (LIFT * f).toFixed(2) + "px) scale(" + (1 + SCALE * f).toFixed(3) + ")";
        } else if (letters[i].style.transform) {
          letters[i].style.transform = "";
        }
      }
    }

    function queue() {
      if (!raf) raf = requestAnimationFrame(apply);
    }

    function arm() {
      if (armed) return;
      armed = true;
      wrap();
      requestAnimationFrame(measure);
      title.addEventListener("mousemove", function (e) {
        mx = e.clientX;
        my = e.clientY;
        over = true;
        queue();
      }, { passive: true });
      title.addEventListener("mouseleave", function () {
        over = false;
        queue();
      }, { passive: true });
      window.addEventListener("resize", function () {
        if (!letters) return;
        for (var i = 0; i < letters.length; i++) letters[i].style.transform = "";
        requestAnimationFrame(measure);
      }, { passive: true });
    }

    if (hero.classList.contains("typed")) {
      arm();
    } else if (window.MutationObserver) {
      var mo = new MutationObserver(function () {
        if (hero.classList.contains("typed")) {
          mo.disconnect();
          arm();
        }
      });
      mo.observe(hero, { attributes: true, attributeFilter: ["class"] });
    }
  })();

  /* ---------- 2) marquee speed follows scroll ---------- */
  (function () {
    if (reduced) return;
    var track = document.getElementById("marqueeTrack");
    if (!track || !track.getAnimations) return;

    var lastY = window.scrollY;
    var lastT = performance.now();
    var vel = 0;
    var rate = 1;
    var raf = 0;

    function setRate(v) {
      var anims = track.getAnimations();
      for (var i = 0; i < anims.length; i++) {
        try { anims[i].playbackRate = v; } catch (err) {}
      }
    }

    function frame() {
      raf = 0;
      var target = 1 + Math.min(2.2, vel * 1.1);
      rate += (target - rate) * 0.1;
      vel *= 0.92;
      if (vel < 0.01) vel = 0;
      if (vel === 0 && Math.abs(rate - 1) < 0.01) {
        rate = 1;
        setRate(1);
        return;
      }
      setRate(rate);
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener("scroll", function () {
      var now = performance.now();
      var y = window.scrollY;
      var dt = now - lastT;
      if (dt > 0 && dt < 400) {
        var v = Math.abs(y - lastY) / dt;
        if (v > vel) vel = Math.min(3, v);
      }
      lastY = y;
      lastT = now;
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });
  })();

  /* ---------- 3) stats recount on click ---------- */
  (function () {
    var stats = document.querySelectorAll(".stat");
    if (!stats.length) return;
    Array.prototype.forEach.call(stats, function (stat) {
      if (stat.hasAttribute("data-recount")) return;
      stat.setAttribute("data-recount", "");
      stat.style.cursor = "pointer";
      stat.setAttribute("title", "click to recount");
      var runId = 0;
      stat.addEventListener("click", function () {
        var el = stat.querySelector("[data-count]");
        if (!el) return;
        var target = parseInt(el.getAttribute("data-count"), 10);
        if (isNaN(target)) return;
        if (reduced) {
          el.textContent = target.toLocaleString("en-US");
          return;
        }
        var id = ++runId;
        var dur = 1200;
        var t0 = null;
        function step(t) {
          if (id !== runId) return;
          if (t0 === null) t0 = t;
          var p = Math.min(1, (t - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(target * eased).toLocaleString("en-US");
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    });
  })();

  /* ---------- 4) nav dot spin on name hover ---------- */
  (function () {
    if (reduced || touch) return;
    var name = document.querySelector(".nav-name");
    var dot = document.querySelector(".nav-dot");
    if (!name || !dot) return;
    dot.addEventListener("animationend", function (e) {
      if (e.animationName === "md-dotspin") dot.classList.remove("md-spin");
    });
    name.addEventListener("mouseenter", function () {
      dot.classList.add("md-spin");
    }, { passive: true });
  })();

})();


/* tilt + glare on cards, ripples on buttons */
(function () {
  "use strict";

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ripples: stay on for touch, off for reduced motion */
  if (!reduced) {
    var btns = document.querySelectorAll(".btn, .nav-cta");
    btns.forEach(function (btn) {
      btn.addEventListener("pointerdown", function (e) {
        var r = btn.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        var d = Math.max(r.width, r.height) * 2.2;
        var dot = document.createElement("span");
        dot.className = "ripple-fx" + (btn.classList.contains("btn-primary") ? " ripple-bright" : "");
        dot.style.width = d + "px";
        dot.style.height = d + "px";
        dot.style.left = (x - d / 2) + "px";
        dot.style.top = (y - d / 2) + "px";
        btn.appendChild(dot);
        setTimeout(function () {
          if (dot.parentNode) dot.parentNode.removeChild(dot);
        }, 650);
      }, { passive: true });
    });
  }

  /* tilt: pointer devices with motion allowed only */
  if (touch || reduced) return;

  var MAX_TILT = 5;
  var cards = document.querySelectorAll(".photo, .press-card, .now-item, .beyond-card");
  if (!cards.length) return;

  /* pull the resting 2d rotation (photo cards) out of the computed matrix */
  function restAngle(el) {
    var t = getComputedStyle(el).transform;
    if (!t || t.indexOf("matrix(") !== 0) return 0;
    var parts = t.slice(7, -1).split(",");
    var a = parseFloat(parts[0]);
    var b = parseFloat(parts[1]);
    if (isNaN(a) || isNaN(b)) return 0;
    return Math.round(Math.atan2(b, a) * (180 / Math.PI) * 100) / 100;
  }

  cards.forEach(function (card) {
    var glare = document.createElement("div");
    glare.className = "tilt-glare";
    var dot = document.createElement("div");
    dot.className = "tilt-glare-dot";
    glare.appendChild(dot);
    card.appendChild(glare);

    var rest = restAngle(card);
    var rect = null;
    var raf = 0;
    var resetTimer = 0;
    var over = false;
    var tx = 0, ty = 0;   /* target rotateX / rotateY */
    var cx = 0, cy = 0;   /* current rotateX / rotateY */
    var gx = 0, gy = 0;   /* glare center in card space */
    var lift = 0;         /* 0 resting, 1 fully lifted */
    var dotSize = 0;

    function frame() {
      raf = 0;
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      lift += (1 - lift) * 0.14;
      var mag = Math.sqrt(cx * cx + cy * cy);
      card.style.transform =
        "perspective(900px) rotateX(" + cx.toFixed(3) + "deg) rotateY(" + cy.toFixed(3) + "deg)" +
        (rest ? " rotate(" + (rest * (1 - lift)).toFixed(3) + "deg)" : "") +
        " translateY(" + (-4 * lift).toFixed(2) + "px) scale(" + (1 + 0.012 * lift).toFixed(4) + ")";
      glare.style.opacity = Math.min(1, mag / MAX_TILT).toFixed(3);
      dot.style.transform = "translate3d(" + (gx - dotSize / 2).toFixed(1) + "px," + (gy - dotSize / 2).toFixed(1) + "px,0)";
      if (over) raf = requestAnimationFrame(frame);
    }

    card.addEventListener("mouseenter", function () {
      if (resetTimer) { clearTimeout(resetTimer); resetTimer = 0; }
      rect = card.getBoundingClientRect();
      dotSize = Math.max(rect.width, rect.height) * 1.4;
      dot.style.width = dotSize.toFixed(0) + "px";
      dot.style.height = dotSize.toFixed(0) + "px";
      over = true;
      tx = 0; ty = 0; cx = 0; cy = 0;
      lift = 0;
      card.style.transition = "transform 0s, border-color 0.3s";
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });

    card.addEventListener("mousemove", function (e) {
      if (!over || !rect) return;
      gx = e.clientX - rect.left;
      gy = e.clientY - rect.top;
      var px = Math.max(0, Math.min(1, gx / rect.width));
      var py = Math.max(0, Math.min(1, gy / rect.height));
      ty = (px - 0.5) * 2 * MAX_TILT;
      tx = -(py - 0.5) * 2 * MAX_TILT;
    }, { passive: true });

    card.addEventListener("mouseleave", function () {
      over = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      card.style.transition = "transform 0.6s var(--ease), border-color 0.3s";
      card.style.transform = rest ? "rotate(" + rest + "deg)" : "none";
      glare.style.opacity = "0";
      tx = 0; ty = 0; cx = 0; cy = 0;
      lift = 0;
      resetTimer = setTimeout(function () {
        resetTimer = 0;
        card.style.transform = "";
        card.style.transition = "";
      }, 650);
    }, { passive: true });
  });
})();


/* ---------- terminal: real input after the scripted demo ---------- */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  var term = document.getElementById("term");
  var termBody = document.getElementById("termBody");
  if (!term || !termBody) return;

  var statusEl = term.querySelector(".term-status");

  var armed = false;
  var focusedOnce = false;
  var input = null;
  var liveLine = null;
  var liveCmd = null;

  var EMAIL = "shashankmadala09@gmail.com";
  var LINKEDIN = "https://www.linkedin.com/in/shashank-madala/";
  var PROJECTS = ["kora/", "lumin-ai/", "yale-research/", "safestrides/", "frc-2590/", "fbla/"];

  var HELP = [
    "commands:",
    "  whoami        who i am",
    "  work          list projects (ls works too)",
    "  kora          the autism support app",
    "  lumin         the nonprofit",
    "  yale          the research",
    "  safestrides   pedestrian detection",
    "  frc           robotics",
    "  fbla          business club",
    "  honors        awards",
    "  press         coverage",
    "  photos        pictures on this page",
    "  contact       email and linkedin",
    "  clear         wipe the screen"
  ];

  var INFO = {
    kora: "kora is an AI app that helps caregivers of autistic children read emotional cues, built with a four-student team and inspired by my cousin. it now supports 700+ users across 25 therapy centers in 12 countries, and won the 2025 congressional app challenge for nj-10.",
    lumin: "lumin ai is a 501(c)(3) nonprofit that makes AI education free: a 20-module curriculum, 15,000+ students, 5,200+ certificates, and 50+ chapters across 16+ countries. most of my time now goes into making sure it keeps running after i graduate.",
    yale: "research intern in the cha lab at the yale child study center, building AI that models autism-related social communication from real parent and child interactions. 120+ hours of video, audio, and pose data from 40 families, with fusion models reaching auc 0.80 for predicting anxiety risk.",
    safestrides: "safestrides is a low-cost pedestrian detection system that retrofits older cars: a raspberry pi and coral tpu running tensorflow lite at 95% real-time accuracy. piloted across 200 student vehicles with the robbinsville police department.",
    frc: "third year as software lead on frc team 2590, nemesis. i built the team's first pnp pose estimation and object detection pipeline, and in 2024 we won the curie division at the first world championship.",
    fbla: "president of robbinsville fbla and a two-year member of the nj state technology committee, where i helped build the conference app used by 8,000+ members. grew the chapter from 45 to 175+ members and state qualifiers from 2 to 23."
  };

  var ALIAS = { "lumin-ai": "lumin", luminai: "lumin", "yale-research": "yale", "frc-2590": "frc", nemesis: "frc" };

  var HONORS = [
    "team usa, international economics olympiad",
    "usamo qualifier",
    "usaco gold division",
    "congressional app challenge winner, nj-10",
    "y combinator startup school",
    "blue ocean top 250 of 23,000+ (2x)",
    "amc 12b honor roll, top 5%",
    "full ledger is in the honors section below."
  ];

  var PRESS = [
    "canvasrebel, interview on kora (jan 2025)",
    "india-west, team usa at the ieo (jul 2026)",
    "new jersey stage, two nj students at the 2026 ieo (jul 2026)",
    "u.s. house, kora wins the nj-10 app challenge (jan 2026)",
    "links are in the press section below."
  ];

  function setBadge(txt) {
    if (!statusEl) return;
    var n = statusEl.lastChild;
    while (n && n.nodeType !== 3) n = n.previousSibling;
    if (n) n.nodeValue = txt;
    else statusEl.appendChild(document.createTextNode(txt));
  }

  function outLine(text, cls) {
    var div = document.createElement("div");
    var span = document.createElement("span");
    span.className = cls || "t-out";
    span.textContent = text;
    div.appendChild(span);
    termBody.appendChild(div);
  }

  function newLiveLine() {
    liveLine = document.createElement("div");
    liveLine.innerHTML = "<span class='t-prompt'>$</span> <span class='t-cmd'></span><span class='term-caret'></span>";
    liveCmd = liveLine.querySelector(".t-cmd");
    termBody.appendChild(liveLine);
  }

  function ensureLive() {
    if (!liveLine || liveLine.parentNode !== termBody) newLiveLine();
  }

  function trimHistory() {
    while (termBody.children.length > 200) termBody.removeChild(termBody.firstElementChild);
  }

  function scrollBottom() {
    termBody.scrollTop = termBody.scrollHeight;
  }

  function run(cmd) {
    var low = cmd.toLowerCase();
    var head = low.split(/\s+/)[0].replace(/\/+$/, "");
    if (ALIAS[head]) head = ALIAS[head];
    var i;

    if (/^rm\s+-rf\b/.test(low)) { outLine("nice try."); return; }
    if (head === "sudo") { outLine("permission denied. this is my site."); return; }
    if (head === "clear") { termBody.innerHTML = ""; return; }
    if (head === "help" || head === "?") {
      for (i = 0; i < HELP.length; i++) outLine(HELP[i]);
      return;
    }
    if (head === "whoami") {
      outLine("shashank madala. student at robbinsville high school, class of 2027.");
      outLine("i build AI systems that help people understand each other.");
      return;
    }
    if (head === "work" || head === "ls" || head === "projects") {
      for (i = 0; i < PROJECTS.length; i++) outLine(PROJECTS[i], "t-hl");
      return;
    }
    if (Object.prototype.hasOwnProperty.call(INFO, head)) { outLine(INFO[head]); return; }
    if (head === "honors") {
      for (i = 0; i < HONORS.length; i++) outLine(HONORS[i]);
      return;
    }
    if (head === "press") {
      for (i = 0; i < PRESS.length; i++) outLine(PRESS[i]);
      return;
    }
    if (head === "photos") { outLine("three pictures are spread through this page: team usa in shenzhen, a lumin class, and closing day."); return; }
    if (head === "contact") {
      outLine("email: " + EMAIL);
      outLine("linkedin: " + LINKEDIN);
      return;
    }
    if (head === "hi" || head === "hello" || head === "hey") { outLine("hey. type help to see what this can do."); return; }
    if (head === "gpa") { outLine("that number stays offline."); return; }
    outLine("command not found: " + head + ". try help");
  }

  function exec() {
    if (!input) return;
    ensureLive();
    var raw = input.value;
    input.value = "";
    var cmd = raw.trim();
    var caret = liveLine.querySelector(".term-caret");
    if (caret && caret.parentNode) caret.parentNode.removeChild(caret);
    if (cmd) run(cmd);
    newLiveLine();
    trimHistory();
    scrollBottom();
  }

  function onType() {
    if (!input) return;
    ensureLive();
    if (liveCmd) liveCmd.textContent = input.value;
    scrollBottom();
  }

  function onKey(e) {
    if (e.key === "Enter") exec();
    else if (e.key === "Escape" && input) input.blur();
  }

  function onFocus() {
    if (!focusedOnce) { focusedOnce = true; setBadge("LIVE"); }
    term.classList.add("term-typing");
    scrollBottom();
  }

  function onBlur() {
    term.classList.remove("term-typing");
  }

  function arm() {
    if (armed) return;
    armed = true;
    if (pollId) { clearInterval(pollId); pollId = 0; }

    /* freeze the terminal at its current height so new lines scroll, not grow */
    var h = termBody.offsetHeight;
    termBody.style.maxHeight = h + "px";
    termBody.style.overflowY = "auto";

    /* adopt the demo's trailing bare prompt, if there is one */
    var last = termBody.lastElementChild;
    if (last && last.querySelector(".term-caret") && !last.querySelector(".t-cmd")) {
      termBody.removeChild(last);
    }
    newLiveLine();

    input = document.createElement("input");
    input.type = "text";
    input.className = "term-cli-input";
    input.maxLength = 120;
    input.setAttribute("autocomplete", "off");
    input.setAttribute("autocapitalize", "off");
    input.setAttribute("autocorrect", "off");
    input.setAttribute("spellcheck", "false");
    input.setAttribute("aria-label", "Type a command");
    input.addEventListener("focus", onFocus);
    input.addEventListener("blur", onBlur);
    input.addEventListener("keydown", onKey);
    input.addEventListener("input", onType, { passive: true });
    term.appendChild(input);

    term.classList.add("term-live");
    setBadge("CLICK TO TYPE");
    scrollBottom();
  }

  term.addEventListener("click", function () {
    if (!armed || !input) return;
    if (!touch) {
      var sel = window.getSelection ? window.getSelection() : null;
      if (sel && String(sel).length > 0) return;
    }
    input.focus({ preventScroll: true });
  }, { passive: true });

  /* watch the scripted demo. it clears once between run 1 and run 2, then
     leaves a bare "$" prompt line. a reset followed by a bare prompt means
     it is done. the timer fallback covers throttled tabs. */
  var polls = 0;
  var prevCount = -1;
  var sawReset = false;
  var bareSince = 0;
  var pollId = setInterval(function () {
    polls++;
    var kids = termBody.children;
    var count = kids.length;
    if (reduced) {
      if (count > 0) arm();
      return;
    }
    if (prevCount > 4 && count < prevCount) sawReset = true;
    prevCount = count;
    var last = count ? kids[count - 1] : null;
    var bare = !!(last && last.querySelector(".term-caret") && last.querySelector(".t-prompt") && !last.querySelector(".t-cmd"));
    if (bare) {
      if (!bareSince) bareSince = Date.now();
      if (sawReset || Date.now() - bareSince > 5600) arm();
    } else {
      bareSince = 0;
    }
    if (polls > 450 && !armed) arm();
  }, 400);

})();


/* ---------- Lumin photo gallery lightbox ---------- */
(function () {
  "use strict";

  var trigger = document.getElementById("luminGallery");
  if (!trigger) return;

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SHOTS = [
    { f: "IMG_8320-2", c: "The first question of every class: how many of you have heard of AI?" },
    { f: "IMG_8321-2", c: "Explaining what AI is using Swiggy, YouTube Shorts and Netflix." },
    { f: "IMG_8314-2", c: "Working through the definition of artificial intelligence." },
    { f: "IMG_8317", c: "How is AI used in jobs, and what happens next." },
    { f: "IMG_8319", c: "A full classroom session in progress." },
    { f: "IMG_8315", c: "Teaching an auditorium of students." },
    { f: "IMG_8324-2", c: "Students during the session." },
    { f: "IMG_8316", c: "Group photo with a chapter class." },
    { f: "IMG_8325-2", c: "Class photo at the end of the day." }
  ];
  var SRC = function (n) { return "assets/photos/lumin/" + n + ".jpg"; };

  var idx = 0, built = false, lb, imgEl, capEl, countEl, strip, lastFocus;

  function build() {
    lb = document.createElement("div");
    lb.className = "lb";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Lumin AI teaching photos");

    var bar = document.createElement("div");
    bar.className = "lb-bar";
    bar.innerHTML =
      '<span class="lb-title mono">LUMIN AI &middot; TEACHING</span>' +
      '<span class="lb-count mono"></span>';
    var closeBtn = document.createElement("button");
    closeBtn.className = "lb-close";
    closeBtn.setAttribute("aria-label", "Close gallery");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", close);
    bar.appendChild(closeBtn);
    countEl = bar.querySelector(".lb-count");

    var stage = document.createElement("div");
    stage.className = "lb-stage";
    imgEl = document.createElement("img");
    imgEl.className = "lb-img";
    imgEl.alt = "";
    stage.appendChild(imgEl);

    var prev = document.createElement("button");
    prev.className = "lb-nav lb-prev";
    prev.setAttribute("aria-label", "Previous photo");
    prev.innerHTML = "&#8249;";
    prev.addEventListener("click", function () { go(idx - 1); });
    var next = document.createElement("button");
    next.className = "lb-nav lb-next";
    next.setAttribute("aria-label", "Next photo");
    next.innerHTML = "&#8250;";
    next.addEventListener("click", function () { go(idx + 1); });
    stage.appendChild(prev);
    stage.appendChild(next);

    capEl = document.createElement("p");
    capEl.className = "lb-cap";

    strip = document.createElement("div");
    strip.className = "lb-strip";
    SHOTS.forEach(function (s, i) {
      var t = document.createElement("button");
      t.className = "lb-thumb";
      t.setAttribute("aria-label", "Photo " + (i + 1));
      var ti = document.createElement("img");
      ti.src = SRC(s.f);
      ti.alt = "";
      ti.loading = "lazy";
      t.appendChild(ti);
      t.addEventListener("click", function () { go(i); });
      strip.appendChild(t);
    });

    lb.appendChild(bar);
    lb.appendChild(stage);
    lb.appendChild(capEl);
    lb.appendChild(strip);

    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target === stage) close();
    });

    /* swipe */
    var sx = 0, sy = 0;
    stage.addEventListener("touchstart", function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });

    document.body.appendChild(lb);
    built = true;
  }

  function go(n) {
    idx = (n + SHOTS.length) % SHOTS.length;
    var s = SHOTS[idx];
    imgEl.classList.remove("ready");
    var pre = new Image();
    pre.onload = function () {
      imgEl.src = pre.src;
      imgEl.alt = s.c;
      imgEl.classList.add("ready");
    };
    pre.src = SRC(s.f);
    if (pre.complete) pre.onload();
    capEl.textContent = s.c;
    countEl.textContent = (idx + 1) + " / " + SHOTS.length;
    Array.prototype.forEach.call(strip.children, function (t, i) {
      t.classList.toggle("on", i === idx);
    });
    var active = strip.children[idx];
    if (active && active.scrollIntoView) {
      active.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" });
    }
  }

  function open(start) {
    if (!built) build();
    lastFocus = document.activeElement;
    go(start || 0);
    lb.classList.add("open");
    document.body.classList.add("lb-lock");
    var c = lb.querySelector(".lb-close");
    if (c) c.focus();
    document.addEventListener("keydown", onKey);
  }

  function close() {
    if (!lb) return;
    lb.classList.remove("open");
    document.body.classList.remove("lb-lock");
    document.removeEventListener("keydown", onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") go(idx + 1);
    else if (e.key === "ArrowLeft") go(idx - 1);
  }

  trigger.addEventListener("click", function () { open(0); });
  trigger.setAttribute("tabindex", "0");
  trigger.setAttribute("role", "button");
  trigger.setAttribute("aria-label", "Open Lumin AI teaching photo gallery, 9 photos");
  trigger.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(0); }
  });
})();



/* ============================================================
   motion + clickability pass
   staggered section heads, a right-hand section rail that also
   drives the nav active state
   ============================================================ */

(function () {
  "use strict";

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  var root = document.documentElement;
  if (root.hasAttribute("data-motion-pass")) return;
  root.setAttribute("data-motion-pass", "");

  /* ---------- 1) section heads: letters, then words ---------- */
  (function () {
    if (reduced) return;
    var heads = document.querySelectorAll(".sec-head");
    if (!heads.length) return;

    function letters(el, start, step) {
      var text = el.textContent.trim();
      if (!text) return;
      var box = document.createElement("span");
      box.className = "sh-ey";
      for (var i = 0; i < text.length; i++) {
        var s = document.createElement("span");
        s.className = "sh-l";
        s.textContent = text.charAt(i);
        s.style.transitionDelay = (start + i * step) + "ms";
        box.appendChild(s);
      }
      el.textContent = "";
      el.appendChild(box);
    }

    function words(el, start, step) {
      var parts = el.textContent.trim().split(/(\s+)/);
      if (!parts.length) return;
      var frag = document.createDocumentFragment();
      var n = 0;
      for (var i = 0; i < parts.length; i++) {
        if (!parts[i]) continue;
        if (/^\s+$/.test(parts[i])) {
          frag.appendChild(document.createTextNode(parts[i]));
          continue;
        }
        var s = document.createElement("span");
        s.className = "sh-w";
        s.textContent = parts[i];
        s.style.transitionDelay = (start + n * step) + "ms";
        n++;
        frag.appendChild(s);
      }
      el.textContent = "";
      el.appendChild(frag);
    }

    var io = null;
    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add("in");
            io.unobserve(entries[i].target);
          }
        }
      }, { threshold: 0.25, rootMargin: "0px 0px -8% 0px" });
    }

    Array.prototype.forEach.call(heads, function (head) {
      if (!head || head.querySelector(".sh-l") || head.querySelector(".sh-w")) return;
      var ey = head.querySelector(".eyebrow");
      var ti = head.querySelector(".sec-title");
      if (!ey && !ti) return;
      if (ey) letters(ey, 0, 18);
      if (ti) words(ti, 120, 55);
      head.classList.add("stag");
      if (io) io.observe(head);
      else head.classList.add("in");
    });
  })();

  /* ---------- 2) section rail + nav active state ---------- */
  (function () {
    if (touch) return;

    var DEFS = [
      ["top", "START"], ["now", "NOW"], ["work", "WORK"], ["honors", "HONORS"],
      ["press", "PRESS"], ["beyond", "ALSO"], ["contact", "CONTACT"]
    ];
    var items = [];
    for (var i = 0; i < DEFS.length; i++) {
      var el = document.getElementById(DEFS[i][0]);
      if (el) items.push({ el: el, id: DEFS[i][0], label: DEFS[i][1], top: 0, dot: null });
    }
    if (items.length < 3) return;

    var rail = document.createElement("nav");
    rail.className = "rail";
    rail.setAttribute("aria-label", "Page sections");
    items.forEach(function (it) {
      var a = document.createElement("a");
      a.className = "rail-dot";
      a.href = "#" + it.id;
      a.setAttribute("aria-label", "Jump to " + it.label.toLowerCase());
      var lab = document.createElement("span");
      lab.className = "rail-lab mono";
      lab.textContent = it.label;
      var pip = document.createElement("i");
      pip.className = "rail-pip";
      a.appendChild(lab);
      a.appendChild(pip);
      rail.appendChild(a);
      it.dot = a;
    });
    if (!document.body) return;
    document.body.appendChild(rail);

    var navLinks = document.querySelectorAll(".nav-links a");
    var active = -1;
    var shown = false;
    var raf = 0;

    function measure() {
      var sy = window.pageYOffset;
      for (var i = 0; i < items.length; i++) {
        items[i].top = items[i].el.getBoundingClientRect().top + sy;
      }
    }

    function paint() {
      raf = 0;
      var y = window.pageYOffset + window.innerHeight * 0.38;
      var idx = 0;
      for (var i = 0; i < items.length; i++) {
        if (items[i].top <= y) idx = i;
      }
      if (idx !== active) {
        active = idx;
        for (var j = 0; j < items.length; j++) {
          items[j].dot.classList.toggle("on", j === idx);
        }
        var hash = "#" + items[idx].id;
        Array.prototype.forEach.call(navLinks, function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === hash);
        });
      }
      var want = window.pageYOffset > window.innerHeight * 0.55;
      if (want !== shown) {
        shown = want;
        rail.classList.toggle("show", want);
      }
    }

    function queue() { if (!raf) raf = requestAnimationFrame(paint); }
    function remeasure() { measure(); queue(); }

    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    window.addEventListener("load", remeasure);
    if (typeof ResizeObserver === "function") {
      new ResizeObserver(remeasure).observe(document.body);
    }
    measure();
    paint();
  })();

})();




/* ============================================================
   command palette
   Cmd/Ctrl+K, "/" or the nav search button. Indexes the page by
   reading the DOM at init, so it never goes stale.
   ============================================================ */
(function () {
  "use strict";

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;

  var root = document.documentElement;
  var body = document.body;
  if (!root || !body) return;
  if (root.hasAttribute("data-cmdk")) return;
  root.setAttribute("data-cmdk", "");

  var isMac = /Mac|iPhone|iPad|iPod/.test((navigator.platform || "") + " " + (navigator.userAgent || ""));
  var NAV_OFFSET = 100;

  var openBtn = document.getElementById("cpOpen");
  var kbdEl = document.getElementById("cpKbd");
  if (kbdEl) kbdEl.textContent = isMac ? "⌘K" : "Ctrl K";

  /* ---------- helpers ---------- */
  function txt(el) { return el ? (el.textContent || "").replace(/\s+/g, " ").trim() : ""; }

  function clip(s, n) {
    if (!s) return "";
    if (s.length <= n) return s;
    var cut = s.slice(0, n);
    var sp = cut.lastIndexOf(" ");
    if (sp > n * 0.55) cut = cut.slice(0, sp);
    return cut.replace(/[\s,;:.]+$/, "") + "…";
  }

  function firstBit(s, n) {
    if (!s) return "";
    var stop = s.indexOf(". ");
    if (stop > 12 && stop < n) return s.slice(0, stop);
    return clip(s, n);
  }

  /* ---------- scroll + highlight ---------- */

  /* sticky cards report their stuck position, not their place in the
     document. drop the stickiness for the one measuring read. */
  function docTop(el) {
    root.classList.add("cp-measure");
    var t = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0);
    root.classList.remove("cp-measure");
    return t;
  }

  var flashTimers = [];
  function flash(el) {
    var i;
    for (i = 0; i < flashTimers.length; i++) clearTimeout(flashTimers[i]);
    flashTimers = [];
    var prev = document.querySelectorAll(".cp-flash, .cp-flash-out");
    for (i = 0; i < prev.length; i++) {
      prev[i].classList.remove("cp-flash");
      prev[i].classList.remove("cp-flash-out");
    }
    if (!el) return;
    /* wait out the smooth scroll, and outlast the reveal and receipt-print
       animations that may still be running on the target */
    var lead = reduced ? 0 : 420;
    flashTimers.push(setTimeout(function () { el.classList.add("cp-flash"); }, lead));
    flashTimers.push(setTimeout(function () { el.classList.add("cp-flash-out"); }, lead + 1400));
    flashTimers.push(setTimeout(function () {
      el.classList.remove("cp-flash");
      el.classList.remove("cp-flash-out");
    }, lead + 2100));
  }

  function scrollTo(y) {
    y = Math.max(0, Math.round(y));
    try { window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" }); }
    catch (err) { window.scrollTo(0, y); }
  }

  function jump(target, flashEl) {
    if (!target) return;
    scrollTo(docTop(target) - NAV_OFFSET);
    flash(flashEl || target);
    var f = flashEl || target;
    setTimeout(function () {
      if (!f.hasAttribute("tabindex")) f.setAttribute("tabindex", "-1");
      try { f.focus({ preventScroll: true }); } catch (err) {}
    }, reduced ? 60 : 520);
  }

  function openUrl(url) {
    if (!url) return;
    var w = window.open(url, "_blank", "noopener,noreferrer");
    if (w) { try { w.opener = null; } catch (err) {} }
  }

  /* ---------- index ---------- */
  var GROUPS = ["Work", "Honors", "Press", "Photos", "Contact", "Facts"];
  var entries = [];
  var seq = 0;

  function add(group, title, sub, kind, keys, ext, run) {
    if (!title || typeof run !== "function") return;
    entries.push({
      id: "cp-o-" + (seq++),
      g: group,
      t: title,
      s: sub || "",
      kind: kind || "",
      ext: !!ext,
      tl: title.toLowerCase(),
      sl: (sub || "").toLowerCase(),
      kl: (keys || "").toLowerCase(),
      run: run
    });
  }

  function cardByTitle(needle) {
    var cards = document.querySelectorAll(".stack .stack-card");
    for (var i = 0; i < cards.length; i++) {
      if (txt(cards[i].querySelector(".stack-title")).toLowerCase().indexOf(needle) > -1) return cards[i];
    }
    return null;
  }

  function capOf(fig) {
    if (!fig) return "";
    var c = fig.querySelector("figcaption");
    if (!c) return "";
    var b = txt(c.querySelector("b"));
    var s = txt(c.querySelector("span"));
    if (b && s) return b + " · " + s;
    return b || s;
  }

  var SCOPE = { INTL: "International", NATL: "National", STATE: "State" };

  function buildIndex() {
    entries = [];
    seq = 0;
    var i;

    /* --- work: the six sticky cards --- */
    var cards = document.querySelectorAll(".stack .stack-card");
    for (i = 0; i < cards.length; i++) {
      (function (card) {
        var title = txt(card.querySelector(".stack-title"));
        if (!title) return;
        var num = txt(card.querySelector(".stack-num"));
        var role = txt(card.querySelector(".chip-blue"));
        var desc = txt(card.querySelector(".stack-desc"));
        var tags = [];
        var lis = card.querySelectorAll(".tags li");
        for (var j = 0; j < lis.length; j++) tags.push(txt(lis[j]));
        var inner = card.querySelector(".stack-in") || card;
        add("Work", title, firstBit(desc, 74), num || "WORK",
          title + " " + role + " " + desc + " " + tags.join(" "), false,
          function () { jump(card, inner); });
      })(cards[i]);
    }

    /* --- honors: the receipt ledger --- */
    var receipt = document.getElementById("receipt") || document.getElementById("honors");
    var rows = document.querySelectorAll(".receipt-list .r-row");
    for (i = 0; i < rows.length; i++) {
      (function (row) {
        var label = txt(row.querySelector("span"));
        if (!label) return;
        var scope = txt(row.querySelector("b"));
        add("Honors", label, SCOPE[scope] || scope, scope || "HONOR",
          label + " award honor " + scope, false,
          function () { jump(receipt || row, row); });
      })(rows[i]);
    }

    /* --- press: every article on the wall, never hardcoded --- */
    var pcards = document.querySelectorAll(".press-grid .press-card");
    for (i = 0; i < pcards.length; i++) {
      (function (a) {
        var head = txt(a.querySelector("h3"));
        var href = a.getAttribute("href");
        if (!head || !href) return;
        var tops = a.querySelectorAll(".press-top span");
        var outlet = tops.length ? txt(tops[0]) : "";
        var date = tops.length > 1 ? txt(tops[1]) : "";
        var sub = outlet + (date ? " · " + date : "");
        add("Press", head, sub, "LINK",
          head + " " + sub + " " + txt(a.querySelector(".press-peek")) + " news article coverage", true,
          function () { openUrl(href); });
      })(pcards[i]);
    }

    /* --- photos --- */
    var gal = document.getElementById("luminGallery");
    if (gal) {
      var badge = txt(gal.querySelector(".gal-badge"));
      add("Photos", "Lumin AI teaching photos", (badge || "9 photos") + " · opens the gallery", "PHOTOS",
        "lumin class classroom teaching gallery slideshow pictures", false,
        function () { setTimeout(function () { gal.click(); }, 60); });
    }
    var band = document.querySelector(".photo.pic-band");
    if (band) {
      add("Photos", "Team USA with the flag, Shenzhen", capOf(band), "PHOTO",
        "team usa flag ieo shenzhen china olympiad picture", false,
        function () { jump(band, band); });
    }
    var sign = document.querySelector(".photo.pic-sign");
    if (sign) {
      add("Photos", "Closing day at the Olympiad", capOf(sign), "PHOTO",
        "shenzhen closing thank you ieo picture", false,
        function () { jump(sign, sign); });
    }

    /* --- contact --- */
    var contact = document.getElementById("contact");
    var mail = document.querySelector('.contact a[href^="mailto:"]') || document.querySelector('a[href^="mailto:"]');
    if (mail) {
      var addr = (mail.getAttribute("href") || "").replace(/^mailto:/, "");
      add("Contact", "Email Shashank", addr, "MAIL", "email mail contact reach out write", true,
        function () { window.location.href = mail.getAttribute("href"); });
    }
    var li = document.querySelector('.contact a[href*="linkedin"]') || document.querySelector('a[href*="linkedin"]');
    if (li) {
      var lh = li.getAttribute("href") || "";
      add("Contact", "LinkedIn", lh.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), "LINK",
        "linkedin social profile connect", true,
        function () { openUrl(lh); });
    }
    if (contact) {
      add("Contact", "Go to the contact section", "Let's talk", "JUMP", "contact talk hire email section", false,
        function () { jump(contact, contact); });
    }

    /* --- quick facts --- */
    var stats = document.querySelector(".stats");
    var kora = cardByTitle("kora");
    var lumin = cardByTitle("lumin");
    var yale = cardByTitle("yale");
    var nowSec = document.getElementById("now");

    add("Facts", "Team USA, 6th of 52", "IEO 2026 business case, Shenzhen", "FACT",
      "team usa 6th 52 economics olympiad ieo shenzhen china 2026", false,
      function () { jump(stats || nowSec, stats || nowSec); });

    add("Facts", "15,000+ students taught", "Lumin AI, 50+ chapters in 16+ countries", "FACT",
      "15000 students lumin nonprofit chapters countries taught certificates", false,
      function () { jump(lumin || stats, lumin ? (lumin.querySelector(".stack-in") || lumin) : stats); });

    add("Facts", "700+ Kora users", "25 therapy centers across 12 countries", "FACT",
      "700 users kora therapy centers countries autism app", false,
      function () { jump(kora || stats, kora ? (kora.querySelector(".stack-in") || kora) : stats); });

    add("Facts", "AUC 0.80 fusion models", "Yale Child Study Center, anxiety risk in autism", "FACT",
      "auc 0.80 fusion multimodal yale research anxiety autism cha lab", false,
      function () { jump(yale || stats, yale ? (yale.querySelector(".stack-in") || yale) : stats); });

    add("Facts", "Class of 2027", "Robbinsville High School, New Jersey", "FACT",
      "class 2027 robbinsville high school new jersey student", false,
      function () { scrollTo(0); });
  }

  /* ---------- matching ---------- */
  function tierFor(e, tok) {
    var i = e.tl.indexOf(tok);
    if (i === 0) return 0;
    if (i > 0) return /[a-z0-9]/.test(e.tl.charAt(i - 1)) ? 2 : 1;
    i = e.sl.indexOf(tok);
    if (i === 0) return 3;
    if (i > 0) return 4;
    if (e.kl.indexOf(tok) > -1) return 5;
    return -1;
  }

  function filter(q) {
    if (!q) return entries.slice();
    var toks = q.split(/\s+/);
    var hit = [];
    var i, j;
    for (i = 0; i < entries.length; i++) {
      var e = entries[i], best = 99, ok = true;
      for (j = 0; j < toks.length; j++) {
        var t = tierFor(e, toks[j]);
        if (t < 0) { ok = false; break; }
        if (t < best) best = t;
      }
      if (ok) hit.push({ e: e, s: best, i: i });
    }
    /* keep one header per group: bucket first, then order groups by
       their strongest hit so a prefix match still floats to the top */
    var buckets = {}, order = [];
    for (i = 0; i < hit.length; i++) {
      var g = hit[i].e.g;
      if (!buckets[g]) { buckets[g] = []; order.push(g); }
      buckets[g].push(hit[i]);
    }
    order.sort(function (a, b) {
      var ba = 99, bb = 99;
      for (var k = 0; k < buckets[a].length; k++) ba = Math.min(ba, buckets[a][k].s);
      for (k = 0; k < buckets[b].length; k++) bb = Math.min(bb, buckets[b][k].s);
      return ba - bb || GROUPS.indexOf(a) - GROUPS.indexOf(b);
    });
    var out = [];
    for (i = 0; i < order.length; i++) {
      var list2 = buckets[order[i]];
      list2.sort(function (a, b) { return a.s - b.s || a.i - b.i; });
      for (j = 0; j < list2.length; j++) out.push(list2[j].e);
    }
    return out;
  }

  /* ---------- overlay ---------- */
  var shell = null, panel = null, input = null, listEl = null, hintN = null, closeBtn = null;
  var results = [], rowEls = [], active = -1, isOpen = false, lastFocus = null, hiQ = "";

  function fill(el, text, q) {
    el.textContent = "";
    var i = q ? text.toLowerCase().indexOf(q) : -1;
    if (i < 0) { el.textContent = text; return; }
    el.appendChild(document.createTextNode(text.slice(0, i)));
    var m = document.createElement("mark");
    m.className = "cp-hit";
    m.textContent = text.slice(i, i + q.length);
    el.appendChild(m);
    el.appendChild(document.createTextNode(text.slice(i + q.length)));
  }

  function buildUI() {
    shell = document.createElement("div");
    shell.className = "cp";
    shell.id = "cmdPalette";

    var scrim = document.createElement("div");
    scrim.className = "cp-scrim";
    scrim.addEventListener("click", close);

    panel = document.createElement("div");
    panel.className = "cp-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Search this site");

    var field = document.createElement("div");
    field.className = "cp-field";
    field.innerHTML = '<svg class="cp-mag" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">' +
      '<circle cx="6.4" cy="6.4" r="4.6" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M10 10L13.4 13.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

    input = document.createElement("input");
    input.className = "cp-input";
    input.type = "text";
    input.placeholder = "Search work, honors, press, photos";
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-controls", "cpList");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-label", "Search this site");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("autocapitalize", "off");
    input.setAttribute("autocorrect", "off");
    input.setAttribute("spellcheck", "false");
    input.maxLength = 60;
    field.appendChild(input);

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "cp-esc mono";
    closeBtn.textContent = "ESC";
    closeBtn.setAttribute("aria-label", "Close search");
    closeBtn.addEventListener("click", close);
    field.appendChild(closeBtn);

    listEl = document.createElement("div");
    listEl.className = "cp-list";
    listEl.id = "cpList";
    listEl.setAttribute("role", "listbox");
    listEl.setAttribute("aria-label", "Search results");

    var hint = document.createElement("div");
    hint.className = "cp-hint mono";
    hint.innerHTML =
      '<span class="cp-hk"><kbd>&#8593;</kbd><kbd>&#8595;</kbd>move</span>' +
      '<span class="cp-hk"><kbd>&#8629;</kbd>open</span>' +
      '<span class="cp-hk"><kbd>esc</kbd>close</span>' +
      '<span class="cp-hn"></span>';
    hintN = hint.querySelector(".cp-hn");

    panel.appendChild(field);
    panel.appendChild(listEl);
    panel.appendChild(hint);
    shell.appendChild(scrim);
    shell.appendChild(panel);
    body.appendChild(shell);

    input.addEventListener("input", render);
    panel.addEventListener("keydown", onPanelKey);
    listEl.addEventListener("click", onListClick);
    if (!touch) listEl.addEventListener("mousemove", onListMove);
  }

  function render() {
    if (!listEl) return;
    var raw = (input.value || "").trim();
    var q = raw.toLowerCase();
    hiQ = q.split(/\s+/)[0] || "";
    results = filter(q);
    listEl.innerHTML = "";
    rowEls = [];

    if (!results.length) {
      var em = document.createElement("p");
      em.className = "cp-empty";
      em.textContent = "Nothing here matches “" + raw + "”. Try kora, yale, olympiad, or fbla.";
      listEl.appendChild(em);
      setActive(-1);
      if (hintN) hintN.textContent = "0 results";
      listEl.scrollTop = 0;
      return;
    }

    var lastG = null;
    for (var i = 0; i < results.length; i++) {
      var e = results[i];
      if (e.g !== lastG) {
        lastG = e.g;
        var h = document.createElement("div");
        h.className = "cp-group";
        h.setAttribute("aria-hidden", "true");
        h.textContent = e.g;
        listEl.appendChild(h);
      }

      var row = document.createElement("div");
      row.className = "cp-row";
      row.id = e.id;
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", "false");
      row.setAttribute("data-i", String(i));

      var kind = document.createElement("span");
      kind.className = "cp-kind mono";
      kind.textContent = e.kind;

      var mid = document.createElement("span");
      mid.className = "cp-mid";
      var t1 = document.createElement("span");
      t1.className = "cp-t";
      fill(t1, e.t, hiQ);
      mid.appendChild(t1);
      if (e.s) {
        var t2 = document.createElement("span");
        t2.className = "cp-s mono";
        fill(t2, e.s, hiQ);
        mid.appendChild(t2);
      }

      var go = document.createElement("span");
      go.className = "cp-go mono";
      go.textContent = e.ext ? "↗" : "↵";

      row.appendChild(kind);
      row.appendChild(mid);
      row.appendChild(go);
      listEl.appendChild(row);
      rowEls.push(row);
    }

    if (hintN) hintN.textContent = results.length + (results.length === 1 ? " result" : " results");
    listEl.scrollTop = 0;
    setActive(0);
  }

  function ensureVisible(row) {
    if (!listEl || !row) return;
    var top = row.offsetTop;
    var bot = top + row.offsetHeight;
    var vt = listEl.scrollTop;
    var vb = vt + listEl.clientHeight;
    var pad = 32; /* the sticky group header sits on top of the first row */
    if (top - pad < vt) listEl.scrollTop = Math.max(0, top - pad);
    else if (bot + 6 > vb) listEl.scrollTop = bot + 6 - listEl.clientHeight;
  }

  function setActive(i) {
    for (var j = 0; j < rowEls.length; j++) {
      var on = j === i;
      rowEls[j].classList.toggle("on", on);
      rowEls[j].setAttribute("aria-selected", on ? "true" : "false");
    }
    active = i;
    if (input) {
      if (i >= 0 && rowEls[i]) input.setAttribute("aria-activedescendant", rowEls[i].id);
      else input.removeAttribute("aria-activedescendant");
    }
    if (i >= 0) ensureVisible(rowEls[i]);
  }

  function move(d) {
    if (!rowEls.length) return;
    var n = active + d;
    if (n < 0) n = rowEls.length - 1;
    if (n >= rowEls.length) n = 0;
    setActive(n);
  }

  function activate(i) {
    var e = results[i];
    if (!e) return;
    /* jumps and the gallery move focus themselves, so only hand it back to
       the nav button when the entry leaves the page as it is */
    close(!!e.ext);
    e.run();
  }

  function onListClick(e) {
    var row = e.target && e.target.closest ? e.target.closest(".cp-row") : null;
    if (!row) return;
    var i = parseInt(row.getAttribute("data-i"), 10);
    if (!isNaN(i)) activate(i);
  }

  function onListMove(e) {
    var row = e.target && e.target.closest ? e.target.closest(".cp-row") : null;
    if (!row) return;
    var i = parseInt(row.getAttribute("data-i"), 10);
    if (!isNaN(i) && i !== active) setActive(i);
  }

  function onPanelKey(e) {
    var k = e.key;
    if (k === "ArrowDown") { e.preventDefault(); move(1); }
    else if (k === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (k === "Home" && e.target === input && !input.value) { e.preventDefault(); setActive(0); }
    else if (k === "End" && e.target === input && !input.value) { e.preventDefault(); setActive(rowEls.length - 1); }
    else if (k === "Enter") { e.preventDefault(); activate(active); }
    else if (k === "Tab") {
      /* keep tabbing inside the dialog, but escape is always one key away */
      var stops = [input, closeBtn];
      var at = stops.indexOf(document.activeElement);
      var next = e.shiftKey ? at - 1 : at + 1;
      if (next < 0) next = stops.length - 1;
      if (next >= stops.length) next = 0;
      if (stops[next]) { e.preventDefault(); stops[next].focus(); }
    }
  }

  function onGlobalKey(e) {
    var k = e.key;
    if ((e.metaKey || e.ctrlKey) && (k === "k" || k === "K")) {
      e.preventDefault();
      if (isOpen) close(); else open();
      return;
    }
    if (isOpen && k === "Escape") { e.preventDefault(); close(); return; }
    if (isOpen || e.metaKey || e.ctrlKey || e.altKey) return;
    if (k !== "/") return;
    /* never steal a slash from the hero terminal or any other field */
    var t = e.target;
    var tag = t && t.tagName ? t.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select" || (t && t.isContentEditable)) return;
    e.preventDefault();
    open();
  }

  function open() {
    if (isOpen) return;
    if (document.querySelector(".lb.open")) return; /* the photo lightbox owns the screen */
    if (!shell) buildUI();
    lastFocus = document.activeElement;
    var sbw = window.innerWidth - root.clientWidth;
    root.style.setProperty("--cp-sbw", (sbw > 0 ? sbw : 0) + "px");
    body.classList.add("cp-lock");
    shell.classList.add("open");
    isOpen = true;
    input.value = "";
    input.placeholder = window.innerWidth < 560 ? "Search this site" : "Search work, honors, press, photos";
    render();
    if (!touch) {
      try { input.focus({ preventScroll: true }); } catch (err) { input.focus(); }
    }
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");
  }

  function close(restore) {
    if (!isOpen) return;
    isOpen = false;
    if (shell) shell.classList.remove("open");
    body.classList.remove("cp-lock");
    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
    /* hand focus back where it came from, or to the nav button if it came
       from nowhere, so it never gets stranded on the hidden input */
    var back = lastFocus;
    lastFocus = null;
    if (restore === false) { if (input) input.blur(); return; }
    if (!back || back === body || !back.focus || !document.contains(back)) back = openBtn;
    if (back && back.focus) {
      try { back.focus({ preventScroll: true }); } catch (err) { try { back.focus(); } catch (e2) {} }
    } else if (input) {
      input.blur();
    }
  }

  buildIndex();
  document.addEventListener("keydown", onGlobalKey);
  if (openBtn) {
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (isOpen) close(); else open();
    });
  }
})();




/* ---------- press wall: topic filters ---------- */
(function () {
  "use strict";

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;

  var grid = document.getElementById("pressGrid");
  var bar = document.querySelector(".press-filters");
  var countEl = document.getElementById("pressCount");
  var emptyEl = document.getElementById("pressEmpty");
  if (!grid || !bar) return;

  var cells = Array.prototype.slice.call(grid.querySelectorAll(".press-cell"));
  var chips = Array.prototype.slice.call(bar.querySelectorAll(".pf-chip"));
  if (!cells.length || !chips.length) return;

  var TOTAL = cells.length;
  var DUR = touch ? 280 : 360;
  var EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
  var canAnimate = !reduced && typeof grid.animate === "function";
  var current = "all";
  var gen = 0;

  function keyOf(chip) {
    return (chip.getAttribute("data-pf") || "all").toLowerCase();
  }

  function matches(cell, key) {
    if (key === "all") return true;
    var t = " " + (cell.getAttribute("data-pf") || "").toLowerCase() + " ";
    return t.indexOf(" " + key + " ") > -1;
  }

  /* live counts on the chips; a chip that matches nothing never ships */
  for (var q = 0; q < chips.length; q++) {
    var ck = keyOf(chips[q]);
    var n = 0;
    for (var w = 0; w < cells.length; w++) if (matches(cells[w], ck)) n++;
    var slot = chips[q].querySelector(".pf-n");
    if (slot) slot.textContent = String(n);
    if (!n) chips[q].hidden = true;
  }

  for (var z = 0; z < cells.length; z++) cells[z].setAttribute("data-on", "1");
  document.documentElement.classList.add("pf-live");

  function say(shown) {
    if (countEl) {
      countEl.textContent = shown === TOTAL
        ? TOTAL + " pieces of coverage"
        : shown + " of " + TOTAL + " pieces of coverage";
    }
    if (emptyEl) emptyEl.hidden = shown !== 0;
  }
  say(TOTAL);

  function clear(cell) {
    if (cell.pfAnim) {
      try { cell.pfAnim.cancel(); } catch (err) {}
      cell.pfAnim = null;
    }
    var s = cell.style;
    s.position = ""; s.left = ""; s.top = ""; s.width = ""; s.height = "";
    s.opacity = ""; s.transform = ""; s.zIndex = ""; s.pointerEvents = "";
    s.display = cell.getAttribute("data-on") === "0" ? "none" : "";
  }

  function play(cell, frames, opts, g, done) {
    var a = null;
    try { a = cell.animate(frames, opts); } catch (err) { a = null; }
    if (!a) { if (done) done(); return; }
    cell.pfAnim = a;
    a.onfinish = function () {
      if (cell.pfAnim === a) cell.pfAnim = null;
      if (g !== gen) return;
      if (done) { done(); return; }
      cell.style.transform = "";
      cell.style.opacity = "";
    };
    a.oncancel = function () { if (cell.pfAnim === a) cell.pfAnim = null; };
  }

  function apply(key, animate) {
    gen++;
    var g = gen;
    var i, cell;

    /* settle every cell to its logical state so the measurements are clean */
    for (i = 0; i < cells.length; i++) clear(cells[i]);

    var gr = grid.getBoundingClientRect();
    var before = [];
    for (i = 0; i < cells.length; i++) {
      cell = cells[i];
      if (cell.getAttribute("data-on") === "0") { before.push(null); continue; }
      var r = cell.getBoundingClientRect();
      before.push({ x: r.left - gr.left, y: r.top - gr.top, w: r.width, h: r.height });
    }

    var shown = 0, out = [], into = [], stay = [];
    for (i = 0; i < cells.length; i++) {
      cell = cells[i];
      var on = matches(cell, key);
      if (on) shown++;
      cell.setAttribute("data-on", on ? "1" : "0");
      if (before[i] && !on) out.push({ cell: cell, r: before[i] });
      else if (!before[i] && on) into.push(cell);
      else if (before[i] && on) stay.push({ cell: cell, r: before[i] });
    }

    say(shown);
    for (i = 0; i < chips.length; i++) {
      chips[i].setAttribute("aria-pressed", keyOf(chips[i]) === key ? "true" : "false");
    }

    if (!animate || !canAnimate) {
      for (i = 0; i < cells.length; i++) {
        cells[i].style.display = cells[i].getAttribute("data-on") === "1" ? "" : "none";
      }
      return;
    }

    /* the leavers step out of the flow at their old spot so the
       survivors can slide underneath them. opacity 0 is the resting
       value, so a dropped animation leaves them invisible, not stranded */
    for (i = 0; i < out.length; i++) {
      var os = out[i].cell.style;
      os.position = "absolute";
      os.left = out[i].r.x + "px";
      os.top = out[i].r.y + "px";
      os.width = out[i].r.w + "px";
      os.height = out[i].r.h + "px";
      os.opacity = "0";
      os.zIndex = "0";
      os.pointerEvents = "none";
    }
    /* the arrivals ride the animation's backwards fill instead of an
       inline opacity, so a dropped animation leaves them visible */
    for (i = 0; i < into.length; i++) into[i].style.display = "";

    /* one read after all the writes */
    var gr2 = grid.getBoundingClientRect();
    for (i = 0; i < stay.length; i++) {
      var nr = stay[i].cell.getBoundingClientRect();
      stay[i].dx = stay[i].r.x - (nr.left - gr2.left);
      stay[i].dy = stay[i].r.y - (nr.top - gr2.top);
    }

    for (i = 0; i < stay.length; i++) {
      if (Math.abs(stay[i].dx) < 0.5 && Math.abs(stay[i].dy) < 0.5) continue;
      play(stay[i].cell, [
        { transform: "translate(" + stay[i].dx.toFixed(1) + "px," + stay[i].dy.toFixed(1) + "px)" },
        { transform: "translate(0px,0px)" }
      ], { duration: DUR, easing: EASE }, g);
    }

    for (i = 0; i < into.length; i++) {
      play(into[i], [
        { opacity: 0, transform: "translateY(10px) scale(0.985)" },
        { opacity: 1, transform: "none" }
      ], { duration: DUR, delay: Math.min(i * 26, 150), easing: EASE, fill: "backwards" }, g);
    }

    for (i = 0; i < out.length; i++) {
      (function (leaver) {
        play(leaver, [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(0.96)" }
        ], { duration: Math.round(DUR * 0.55), easing: "ease-out" }, g, function () {
          clear(leaver);
        });
      })(out[i].cell);
    }

    /* nothing is allowed to hang. if an animation is throttled, dropped,
       or never runs at all, this puts every cell in its resting state */
    setTimeout(function () {
      if (g !== gen) return;
      for (var k = 0; k < cells.length; k++) clear(cells[k]);
    }, DUR + 400);
  }

  function pick(key) {
    if (key === current) return;
    current = key;
    /* a card that never scrolled into view yet must not filter in invisible */
    for (var i = 0; i < cells.length; i++) {
      var card = cells[i].querySelector(".press-card");
      if (card) card.classList.add("on");
    }
    apply(key, true);
  }

  bar.addEventListener("click", function (e) {
    var t = e.target;
    while (t && t !== bar && (!t.classList || !t.classList.contains("pf-chip"))) t = t.parentNode;
    if (!t || t === bar || !t.classList) return;
    pick(keyOf(t));
  });

  bar.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    var live = [];
    for (var i = 0; i < chips.length; i++) if (!chips[i].hidden) live.push(chips[i]);
    var at = live.indexOf(document.activeElement);
    if (at < 0) return;
    e.preventDefault();
    var to = (at + (e.key === "ArrowRight" ? 1 : -1) + live.length) % live.length;
    if (live[to] && live[to].focus) live[to].focus();
  });
})();




/* ---------- work cards v2: detail drawers + press cross links ---------- */
(function () {
  "use strict";

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;

  var root = document.documentElement;
  if (!root || root.hasAttribute("data-wk-cards")) return;

  var cards = document.querySelectorAll(".stack-card");
  if (!cards.length) return;

  var CHEVRON = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">' +
    '<path d="M2.6 4.4 6 7.8l3.4-3.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* a topic maps to the press links that belong to it, so the count on the
     pill is read off the page instead of hard coded */
  var COVERAGE = {
    kora: { hosts: ["mciver.house.gov", "congressionalappchallenge.us", "canvasrebel.com"], one: "article", many: "articles" },
    yale: { hosts: ["medicine.yale.edu"], one: "profile", many: "profiles" },
    frc: { hosts: ["frc2590.org"], one: "profile", many: "profiles" }
  };

  function coverageCount(hosts) {
    var links = document.querySelectorAll(".press-card[href]");
    var n = 0;
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href") || "";
      for (var h = 0; h < hosts.length; h++) {
        if (href.indexOf(hosts[h]) !== -1) { n++; break; }
      }
    }
    return n;
  }

  var wired = 0;

  Array.prototype.forEach.call(cards, function (card, i) {
    var main = card.querySelector(".stack-main");
    if (!main) return;
    var bar = main.querySelector(".wk-bar");
    var drawer = main.querySelector(".wk-drawer");
    if (!bar || !drawer) return;
    var inner = drawer.querySelector(".wk-drawer-in");
    if (!inner) return;

    var titleEl = card.querySelector(".stack-title");
    var name = titleEl ? titleEl.textContent.trim() : "this project";
    var id = drawer.id || ("wk-drawer-" + (i + 1));
    drawer.id = id;

    /* ---- the toggle ---- */
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "wk-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", id);
    var label = document.createElement("span");
    label.textContent = "More details";
    btn.appendChild(label);
    btn.insertAdjacentHTML("beforeend", CHEVRON);
    btn.setAttribute("aria-label", "More details about " + name);
    bar.insertBefore(btn, bar.firstChild);

    var open = false;

    function paint(next) {
      open = next;
      btn.setAttribute("aria-expanded", next ? "true" : "false");
      label.textContent = next ? "Hide details" : "More details";
      btn.setAttribute("aria-label", (next ? "Hide details about " : "More details about ") + name);
      if (next) drawer.classList.add("wk-open");
      else drawer.classList.remove("wk-open");
    }

    function setOpen(next) {
      if (next === open) return;
      paint(next);
      if (reduced) {
        drawer.style.height = next ? "auto" : "0px";
        return;
      }
      var from = drawer.getBoundingClientRect().height;
      var to = next ? inner.offsetHeight : 0;
      drawer.style.height = from + "px";
      /* force a reflow so the browser has two heights to animate between */
      void drawer.offsetHeight;
      drawer.style.height = to + "px";
    }

    drawer.addEventListener("transitionend", function (e) {
      if (e.target !== drawer || e.propertyName !== "height") return;
      /* let an open drawer size itself again, so reflow and resize keep working */
      if (open) drawer.style.height = "auto";
    });

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!open);
    });

    /* ---- the coverage pill ---- */
    var topic = bar.getAttribute("data-wk-topic");
    var cfg = topic ? COVERAGE[topic] : null;
    if (cfg) {
      var n = coverageCount(cfg.hosts);
      if (n > 0) {
        var cov = document.createElement("button");
        cov.type = "button";
        cov.className = "wk-cov";
        var dot = document.createElement("i");
        dot.setAttribute("aria-hidden", "true");
        cov.appendChild(dot);
        cov.appendChild(document.createTextNode(n + " " + (n === 1 ? cfg.one : cfg.many)));
        cov.setAttribute("aria-label", "Show the " + n + " " + (n === 1 ? cfg.one : cfg.many) + " about " + name + " in the press section");
        cov.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          try {
            document.dispatchEvent(new CustomEvent("press:filter", { bubbles: true, detail: { topic: topic } }));
          } catch (err) {}
          var press = document.getElementById("press");
          if (press && press.scrollIntoView) {
            press.scrollIntoView({ behavior: (reduced || touch) ? "auto" : "smooth", block: "start" });
          }
        });
        bar.insertBefore(cov, btn.nextSibling);
      }
    }

    wired++;
  });

  /* only collapse once something is actually wired up */
  if (wired) root.setAttribute("data-wk-cards", "");
})();


/* ============================================================
   THE CLASSROOM BAND
   Drag with momentum, snap, a scroll thumb, arrow buttons, and a
   hand-off into the existing Lumin lightbox at the right index.
   Self-contained. Every lookup is guarded.
   ============================================================ */
(function () {
  "use strict";

  var rail = document.getElementById("bandRail");
  if (!rail) return;

  var fill = document.getElementById("bandFill");
  var prevBtn = document.getElementById("bandPrev");
  var nextBtn = document.getElementById("bandNext");
  var shots = Array.prototype.slice.call(rail.querySelectorAll(".band-shot"));
  if (!shots.length) return;

  var reduced = false;
  try { reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  /* ---------- open the existing lightbox at a given index ---------- */
  function openAt(i) {
    var trigger = document.getElementById("luminGallery");
    if (!trigger) return;
    trigger.click();                       /* builds and opens at 0 */
    if (!i) return;
    var thumbs = document.querySelectorAll(".lb .lb-strip .lb-thumb");
    if (thumbs.length > i && thumbs[i]) thumbs[i].click();
  }

  shots.forEach(function (shot, i) {
    var hit = shot.querySelector(".band-hit");
    if (!hit) return;
    hit.addEventListener("click", function () { openAt(i); });
  });

  /* ---------- scroll thumb + arrow state ---------- */
  var syncRaf = 0;
  function sync() {
    syncRaf = 0;
    var max = rail.scrollWidth - rail.clientWidth;
    var frac = rail.scrollWidth > 0 ? rail.clientWidth / rail.scrollWidth : 1;
    if (frac > 1) frac = 1;
    var p = max > 1 ? rail.scrollLeft / max : 0;
    if (p < 0) p = 0;
    if (p > 1) p = 1;
    if (fill) {
      fill.style.width = (frac * 100).toFixed(2) + "%";
      fill.style.left = (p * (100 - frac * 100)).toFixed(2) + "%";
    }
    if (prevBtn) prevBtn.disabled = rail.scrollLeft <= 2;
    if (nextBtn) nextBtn.disabled = max <= 2 || rail.scrollLeft >= max - 2;
  }
  function queueSync() {
    if (!syncRaf) syncRaf = requestAnimationFrame(sync);
  }

  rail.addEventListener("scroll", queueSync, { passive: true });
  window.addEventListener("resize", queueSync, { passive: true });
  rail.querySelectorAll("img").forEach(function (img) {
    if (img.complete) return;
    img.addEventListener("load", queueSync);
    img.addEventListener("error", queueSync);
  });
  sync();

  /* ---------- arrow buttons ---------- */
  function nudge(dir) {
    var step = Math.max(200, Math.round(rail.clientWidth * 0.78));
    if (rail.scrollBy) {
      rail.scrollBy({ left: dir * step, behavior: reduced ? "auto" : "smooth" });
    } else {
      rail.scrollLeft += dir * step;
    }
  }
  if (prevBtn) prevBtn.addEventListener("click", function () { nudge(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { nudge(1); });

  /* ---------- drag to scroll, mouse only ---------- */
  var fine = false;
  try { fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches; } catch (e) {}
  if (!fine || !window.PointerEvent) return;

  var down = false, moved = false;
  var startX = 0, startLeft = 0, lastX = 0, lastT = 0, vel = 0, glideRaf = 0;

  rail.addEventListener("dragstart", function (e) { e.preventDefault(); });

  rail.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    down = true;
    moved = false;
    startX = e.clientX;
    startLeft = rail.scrollLeft;
    lastX = e.clientX;
    lastT = (window.performance && performance.now) ? performance.now() : Date.now();
    vel = 0;
    if (glideRaf) { cancelAnimationFrame(glideRaf); glideRaf = 0; }
  });

  window.addEventListener("pointermove", function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    if (!moved) {
      if (Math.abs(dx) < 6) return;
      moved = true;
      rail.classList.add("dragging");
    }
    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    var dt = now - lastT;
    if (dt > 0) vel = ((e.clientX - lastX) / dt) * 16;
    lastX = e.clientX;
    lastT = now;
    rail.scrollLeft = startLeft - dx;
    if (e.cancelable) e.preventDefault();
  }, { passive: false });

  function glide() {
    vel *= 0.92;
    if (Math.abs(vel) < 0.6) { glideRaf = 0; return; }
    var before = rail.scrollLeft;
    rail.scrollLeft = before - vel;
    if (rail.scrollLeft === before) { glideRaf = 0; return; }
    glideRaf = requestAnimationFrame(glide);
  }

  function release() {
    if (!down) return;
    down = false;
    rail.classList.remove("dragging");
    if (moved && !reduced && Math.abs(vel) > 1.2) glideRaf = requestAnimationFrame(glide);
  }
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);

  /* a drag that ends over a frame must not also open the lightbox */
  rail.addEventListener("click", function (e) {
    if (!moved) return;
    moved = false;
    e.preventDefault();
    e.stopPropagation();
  }, true);
})();
