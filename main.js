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
    if (head === "photos") { outLine("three photos from shenzhen are further down this page."); return; }
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
