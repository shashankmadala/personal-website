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


/* ============================================================
   THE CLASSROOM, FINAL PASS
   Above 720px the rail is laid out as a mosaic, so there is
   nothing left to drag. Three small jobs follow from that:
   keep the band module's drag handler from swallowing clicks,
   keep the region's accessible name honest, and wire the tail
   button into the gallery the page already builds.
   Self contained, guarded, no second lightbox.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  if (root.hasAttribute("data-classroom-final")) return;
  root.setAttribute("data-classroom-final", "");

  var rail = document.getElementById("bandRail");
  var trigger = document.getElementById("luminGallery");

  function scrolls() {
    if (!rail) return false;
    return (rail.scrollWidth - rail.clientWidth) > 2;
  }

  /* ---- 1. the drag handler belongs to the phone layout only ----
     The band module arms a drag on pointerdown and then suppresses the
     click that follows any movement over 6px. In the mosaic there is no
     horizontal scroll, so that only means a mouse that twitches while
     clicking a photo silently fails to open it. A capture listener on the
     document stops pointerdown before it ever reaches the rail whenever
     the rail has nothing to scroll. Click, focus and keyboard are
     untouched, and the phone rail keeps its drag. */
  if (rail && window.PointerEvent) {
    document.addEventListener("pointerdown", function (e) {
      var t = e.target;
      if (!t || typeof t.closest !== "function") return;
      if (!t.closest("#bandRail")) return;
      if (scrolls()) return;
      e.stopPropagation();
    }, true);
  }

  /* ---- 2. the accessible name follows the layout ---- */
  var nameTimer = 0;
  function name() {
    nameTimer = 0;
    if (!rail) return;
    rail.setAttribute("aria-label", scrolls()
      ? "Lumin AI teaching photos, scrollable row of nine"
      : "Lumin AI teaching photos, nine frames");
  }
  function queueName() {
    if (nameTimer) return;
    nameTimer = setTimeout(name, 180);
  }
  if (rail) {
    name();
    window.addEventListener("resize", queueName, { passive: true });
    Array.prototype.forEach.call(rail.querySelectorAll("img"), function (img) {
      if (img.complete) return;
      img.addEventListener("load", queueName);
      img.addEventListener("error", queueName);
    });
  }

  /* ---- 3. the tail button opens the existing lightbox at frame one ----
     If work card 02 ever loses the trigger, the button hides itself rather
     than sitting there as a control that cannot do anything. */
  var openAll = document.getElementById("ctOpenAll");
  if (openAll) {
    if (!trigger || typeof trigger.click !== "function") {
      openAll.hidden = true;
    } else {
      openAll.addEventListener("click", function () {
        try { trigger.click(); } catch (err) {}
      });
    }
  }
})();


/* ============================================================
   THE SHORTCUTS SHEET
   "?" opens a help sheet for everything this page can do from
   the keyboard: the command palette, the lightbox arrows, the
   terminal commands. Escape, a click outside, or the close
   button shuts it. A one time pill points at the "?" on a
   first visit and then never appears again.
   Self contained. Every lookup is guarded.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  if (!root || !body) return;
  if (root.hasAttribute("data-ks-sheet")) return;
  root.setAttribute("data-ks-sheet", "");

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  var isMac = /Mac|iPhone|iPad|iPod/.test((navigator.platform || "") + " " + (navigator.userAgent || ""));
  var MOD = isMac ? "⌘" : "Ctrl";

  /* what this page actually has, read off the page rather than assumed */
  var hasPalette = !!(document.getElementById("cpOpen") || document.getElementById("cmdPalette"));
  var hasGallery = !!document.getElementById("luminGallery");
  var hasTerm = !!(document.getElementById("term") && document.getElementById("termBody"));
  var hasFilters = !!document.querySelector(".press-filters .pf-chip");

  /* the commands the terminal documents in its own help output */
  var CMDS = ["help", "whoami", "work", "kora", "lumin", "yale", "safestrides",
              "frc", "fbla", "honors", "press", "photos", "contact", "clear"];

  var GROUPS = [];

  if (hasPalette) {
    GROUPS.push({
      t: "SEARCH",
      rows: [
        { l: "Search the whole page", k: [MOD, "K", "~or", "/"] },
        { l: "Move through results", k: ["↑", "↓"] },
        { l: "Open the highlighted result", k: ["↵"] },
        { l: "Close the search", k: ["Esc"] }
      ]
    });
  }

  GROUPS.push({
    t: "THIS SHEET",
    rows: [
      { l: "Open the shortcuts", k: ["?"] },
      { l: "Close whatever is open", k: ["Esc"] }
    ]
  });

  if (hasGallery) {
    GROUPS.push({
      t: "PHOTOS",
      rows: [
        { l: "Open a teaching photo", k: ["↵", "~or", "Space"] },
        { l: "Previous, next photo", k: ["←", "→"] },
        { l: "Close the gallery", k: ["Esc"] }
      ]
    });
  }

  var pageRows = [
    { l: "Step through links and buttons", k: ["Tab"] },
    { l: "Step backwards", k: ["Shift", "Tab"] },
    { l: "Open whatever is focused", k: ["↵", "~or", "Space"] }
  ];
  if (hasFilters) pageRows.push({ l: "Move along the press filters", k: ["←", "→"] });
  GROUPS.push({ t: "THE PAGE", rows: pageRows });

  var shell = null, panel = null, closeBtn = null;
  var built = false, isOpen = false, lastFocus = null;

  function keyEl(token) {
    if (token.charAt(0) === "~") {
      var s = document.createElement("span");
      s.className = "ks-sep";
      s.textContent = token.slice(1);
      return s;
    }
    var k = document.createElement("kbd");
    k.className = "ks-k";
    k.textContent = token;
    return k;
  }

  function groupEl(def) {
    var sec = document.createElement("section");
    sec.className = "ks-group";

    var h = document.createElement("h3");
    h.className = "ks-gt mono";
    h.textContent = def.t;
    sec.appendChild(h);

    var dl = document.createElement("dl");
    dl.className = "ks-rows";
    for (var i = 0; i < def.rows.length; i++) {
      var row = document.createElement("div");
      row.className = "ks-row";
      var dt = document.createElement("dt");
      dt.textContent = def.rows[i].l;
      var dd = document.createElement("dd");
      for (var j = 0; j < def.rows[i].k.length; j++) dd.appendChild(keyEl(def.rows[i].k[j]));
      row.appendChild(dt);
      row.appendChild(dd);
      dl.appendChild(row);
    }
    sec.appendChild(dl);
    return sec;
  }

  function build() {
    shell = document.createElement("div");
    shell.className = "ks";
    shell.id = "ksSheet";

    var scrim = document.createElement("div");
    scrim.className = "ks-scrim";
    scrim.addEventListener("click", function () { close(true); });

    panel = document.createElement("div");
    panel.className = "ks-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "ksTitle");

    var head = document.createElement("div");
    head.className = "ks-head";
    var titles = document.createElement("div");
    titles.className = "ks-titles";
    var t1 = document.createElement("p");
    t1.className = "ks-title";
    t1.id = "ksTitle";
    t1.textContent = "Shortcuts";
    var t2 = document.createElement("p");
    t2.className = "ks-sub mono";
    t2.textContent = "WHAT THIS PAGE DOES WITHOUT A MOUSE";
    titles.appendChild(t1);
    titles.appendChild(t2);
    head.appendChild(titles);

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "ks-x mono";
    closeBtn.textContent = "ESC";
    closeBtn.setAttribute("aria-label", "Close the shortcuts");
    closeBtn.addEventListener("click", function () { close(true); });
    head.appendChild(closeBtn);

    var main = document.createElement("div");
    main.className = "ks-body";
    for (var i = 0; i < GROUPS.length; i++) main.appendChild(groupEl(GROUPS[i]));

    if (hasTerm) {
      var term = document.createElement("section");
      term.className = "ks-group ks-full";
      var th = document.createElement("h3");
      th.className = "ks-gt mono";
      th.textContent = "THE TERMINAL";
      var note = document.createElement("p");
      note.className = "ks-note";
      note.textContent = "The terminal at the top of the page is real. Click it, type, press Enter.";
      var ul = document.createElement("ul");
      ul.className = "ks-cmds";
      for (var c = 0; c < CMDS.length; c++) {
        var li = document.createElement("li");
        li.textContent = CMDS[c];
        ul.appendChild(li);
      }
      term.appendChild(th);
      term.appendChild(note);
      term.appendChild(ul);
      main.appendChild(term);
    }

    var foot = document.createElement("p");
    foot.className = "ks-foot mono";
    foot.textContent = "ESC CLOSES ANYTHING ON THIS PAGE";

    panel.appendChild(head);
    panel.appendChild(main);
    panel.appendChild(foot);
    shell.appendChild(scrim);
    shell.appendChild(panel);

    /* a click on the padding around the panel counts as outside */
    shell.addEventListener("click", function (e) {
      if (e.target === shell) close(true);
    });
    panel.addEventListener("keydown", onPanelKey);

    body.appendChild(shell);
    built = true;
  }

  function focusables() {
    if (!panel) return [];
    var all = panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    var out = [];
    for (var i = 0; i < all.length; i++) {
      if (!all[i].disabled && all[i].offsetParent !== null) out.push(all[i]);
    }
    return out;
  }

  function onPanelKey(e) {
    if (e.key !== "Tab") return;
    var list = focusables();
    if (!list.length) { e.preventDefault(); return; }
    var at = list.indexOf(document.activeElement);
    var next = e.shiftKey ? at - 1 : at + 1;
    if (at < 0) next = e.shiftKey ? list.length - 1 : 0;
    if (next < 0) next = list.length - 1;
    if (next >= list.length) next = 0;
    e.preventDefault();
    if (list[next] && list[next].focus) list[next].focus();
  }

  function open() {
    if (isOpen) return;
    if (document.querySelector(".lb.open")) return;   /* the lightbox owns the screen */
    if (document.querySelector(".cp.open")) return;   /* so does the palette */
    if (!built) build();
    dropHint();
    lastFocus = document.activeElement;
    var sbw = window.innerWidth - root.clientWidth;
    root.style.setProperty("--ks-sbw", (sbw > 0 ? sbw : 0) + "px");
    body.classList.add("ks-lock");
    shell.classList.add("open");
    isOpen = true;
    if (closeBtn && closeBtn.focus) {
      try { closeBtn.focus({ preventScroll: true }); } catch (err) { closeBtn.focus(); }
    }
  }

  /* restore false is for the hand-off to the command palette, which has
     already taken focus for itself by the time this runs */
  function close(restore) {
    if (!isOpen) return;
    isOpen = false;
    if (shell) shell.classList.remove("open");
    body.classList.remove("ks-lock");
    var back = lastFocus;
    lastFocus = null;
    if (restore === false) return;
    if (back && back !== body && back.focus && document.contains(back)) {
      try { back.focus({ preventScroll: true }); } catch (err) { try { back.focus(); } catch (e2) {} }
    }
    /* the thing that opened the sheet may be gone by now, the dismissed hint
       pill being the obvious case. never leave focus on a closed dialog */
    var still = document.activeElement;
    if (still && still !== back && panel && panel.contains(still) && still.blur) still.blur();
  }

  function typing(t) {
    if (!t) return false;
    var tag = t.tagName ? t.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (t.isContentEditable) return true;
    if (typeof t.closest === "function" && t.closest("#term")) return true;
    return false;
  }

  document.addEventListener("keydown", function (e) {
    var k = e.key;
    if (isOpen) {
      if (k === "Escape") { e.preventDefault(); close(true); return; }
      /* the palette handled this keystroke a moment ago and is opening
         over the top, so step aside instead of stacking */
      if ((e.metaKey || e.ctrlKey) && (k === "k" || k === "K")) { close(false); }
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (k !== "?" && !(k === "/" && e.shiftKey)) return;
    if (typing(e.target)) return;
    e.preventDefault();
    open();
  });

  /* ---------- the first visit pill ---------- */
  var SEEN = "sm-shortcuts-hint-v1";
  var hint = null, hintTimer = 0;

  function seen() {
    try { return window.localStorage.getItem(SEEN) === "1"; }
    catch (err) { return true; }
  }
  function markSeen() {
    try { window.localStorage.setItem(SEEN, "1"); } catch (err) {}
  }
  function dropHint() {
    if (hintTimer) { clearTimeout(hintTimer); hintTimer = 0; }
    if (!hint) return;
    hint.classList.remove("on");
    var el = hint;
    hint = null;
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, reduced ? 0 : 600);
  }

  /* true when nothing the visitor came here to read sits under that box */
  function clearOf(r) {
    var els = document.querySelectorAll(".term, .float-chip, .btn, .hero-sub, .hero-title, .eyebrow-pill, .nav-inner, .rail");
    for (var i = 0; i < els.length; i++) {
      var b = els[i].getBoundingClientRect();
      if (!b.width || !b.height) continue;
      if (b.right > r.left && b.left < r.right && b.bottom > r.top && b.top < r.bottom) return false;
    }
    return true;
  }

  function showHint() {
    if (seen() || touch || window.innerWidth < 760) return;
    if (document.querySelector(".lb.open") || document.querySelector(".cp.open")) return;
    /* someone already reading the work does not need to be told about a key */
    if (window.pageYOffset > window.innerHeight) return;

    hint = document.createElement("div");
    hint.className = "ks-hint";
    hint.setAttribute("aria-live", "polite");

    var go = document.createElement("button");
    go.type = "button";
    go.className = "ks-hint-go";
    go.setAttribute("aria-label", "Open the keyboard shortcuts");
    var k1 = document.createElement("kbd");
    k1.className = "ks-k";
    k1.textContent = "?";
    var l1 = document.createElement("span");
    l1.textContent = "shortcuts";
    var mid = document.createElement("i");
    mid.textContent = "·";
    var k2 = document.createElement("kbd");
    k2.className = "ks-k";
    k2.textContent = MOD + "K";
    var l2 = document.createElement("span");
    l2.textContent = "search";
    go.appendChild(k1); go.appendChild(l1);
    go.appendChild(mid);
    go.appendChild(k2); go.appendChild(l2);
    go.addEventListener("click", function () { open(); });

    var x = document.createElement("button");
    x.type = "button";
    x.className = "ks-hint-x";
    x.setAttribute("aria-label", "Dismiss this hint");
    x.innerHTML = "&times;";
    x.addEventListener("click", dropHint);

    hint.appendChild(go);
    hint.appendChild(x);
    body.appendChild(hint);

    /* a pill that sits on top of the terminal or a floating chip is not
       unobtrusive. try the corner, then the gap above the terminal, and if
       the hero is too short for either, say nothing and keep the one showing
       in the bank for the next visit */
    if (!clearOf(hint.getBoundingClientRect())) {
      var termEl = document.getElementById("term");
      if (termEl) {
        var tb = termEl.getBoundingClientRect();
        hint.style.bottom = Math.round(Math.max(20, window.innerHeight - tb.top + 14)) + "px";
      }
      if (!clearOf(hint.getBoundingClientRect())) {
        if (hint.parentNode) hint.parentNode.removeChild(hint);
        hint = null;
        return;
      }
    }
    markSeen();

    /* force layout so the fade has a from-state. a rAF would be prettier and
       would also never run in a backgrounded tab, which would strand the pill
       invisible until its own timer removed it */
    void hint.offsetHeight;
    hint.classList.add("on");
    hintTimer = setTimeout(dropHint, 9000);
  }

  /* wait for the hero to finish typing itself before saying anything, so the
     pill never arrives underneath the preloader and burns its one showing */
  (function arm() {
    if (seen() || touch) return;
    var heroEl = document.querySelector(".hero");
    var fired = false;
    function go() {
      if (fired) return;
      fired = true;
      setTimeout(showHint, 2600);
    }
    if (!heroEl || heroEl.classList.contains("typed")) { go(); return; }
    if (window.MutationObserver) {
      var mo = new MutationObserver(function () {
        if (heroEl.classList.contains("typed")) { mo.disconnect(); go(); }
      });
      mo.observe(heroEl, { attributes: true, attributeFilter: ["class"] });
    }
    setTimeout(go, 9000);
  })();
})();


/* ============================================================
   THE TIMELINE
   The spine draws itself from scroll position and each node
   ignites as the drawing head reaches its dot. One rAF loop,
   live only while the section is on screen. Under reduced
   motion the script does nothing at all: the CSS default is
   already the finished, static list.
   ============================================================ */
(function () {
  "use strict";

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;

  var root = document.documentElement;
  if (!root || root.hasAttribute("data-tl")) return;

  var sec = document.getElementById("timeline");
  var rail = document.getElementById("tlRail");
  var fill = document.getElementById("tlFill");
  var track = document.getElementById("tlTrack");
  if (!sec || !rail || !fill || !track) return;

  var items = Array.prototype.slice.call(track.querySelectorAll(".tl-item"));
  if (!items.length) return;

  /* the drawn line and the lit nodes are the CSS default, so asking for
     reduced motion means leaving the markup exactly as it is */
  if (reduced) return;

  root.setAttribute("data-tl", "");

  var HEAD = 0.66;                  /* where on screen the pen sits */
  var K = touch ? 0.3 : 0.16;       /* follow rate: tighter under momentum scroll */

  var stops = [];                   /* each dot's position along the rail, 0 to 1 */
  var measured = false;
  var lit = -1, tip = false;
  var drawn = 0, target = 0;
  var raf = 0, live = false, mRaf = 0;

  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }

  /* every read first, then the two writes. the rail is trimmed to run from
     the first dot to the last, so the line starts and stops on a node
     instead of trailing off past the end of the list */
  function measure() {
    mRaf = 0;
    var tr = track.getBoundingClientRect();
    if (!tr.height) { measured = false; return; }
    var mid = [];
    var i;
    for (i = 0; i < items.length; i++) {
      var dot = items[i].querySelector(".tl-dot") || items[i];
      var d = dot.getBoundingClientRect();
      mid.push(d.top + d.height / 2 - tr.top);
    }
    var first = mid[0];
    var span = mid[mid.length - 1] - first;
    if (span < 1) { measured = false; return; }
    rail.style.top = first.toFixed(1) + "px";
    rail.style.bottom = (tr.height - first - span).toFixed(1) + "px";
    var next = [];
    for (i = 0; i < mid.length; i++) next.push(clamp01((mid[i] - first) / span));
    stops = next;
    measured = true;
  }

  function want() {
    var rr = rail.getBoundingClientRect();
    if (!rr.height) return target;
    return clamp01((window.innerHeight * HEAD - rr.top) / rr.height);
  }

  /* writes only */
  function paint() {
    fill.style.height = (drawn * 100).toFixed(2) + "%";
    /* the bright tip is the pen: it shows while the line is being drawn and
       nowhere else, so it never sits on top of the first or last node */
    var drawing = drawn > 0.004 && drawn < 0.997;
    if (drawing !== tip) {
      tip = drawing;
      rail.classList.toggle("is-drawing", drawing);
    }
    if (!measured) return;
    var n = -1, i;
    if (drawn > 0) {
      for (i = 0; i < stops.length; i++) {
        if (drawn >= stops[i] - 0.002) n = i;
      }
    }
    if (n === lit) return;
    if (n > lit) { for (i = lit + 1; i <= n; i++) items[i].classList.add("on"); }
    else { for (i = lit; i > n; i--) items[i].classList.remove("on"); }
    lit = n;
  }

  function loop() {
    raf = 0;
    target = want();
    drawn += (target - drawn) * K;
    if (Math.abs(target - drawn) < 0.002) drawn = target;
    paint();
    if (live) raf = requestAnimationFrame(loop);
  }

  /* coming back into view, take the scroll position as it is rather than
     easing up from wherever the last visit left the line. a jump that skips
     the section entirely (an anchor link, a restored scroll position) never
     crosses the observer, so the value on entry can be stale */
  function resume() {
    measure();
    if (!live) {
      target = want();
      drawn = target;
      paint();
    }
    live = true;
    if (!raf) raf = requestAnimationFrame(loop);
  }

  /* off screen there is nothing to animate toward: land on the final value */
  function settle() {
    live = false;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (!measured) measure();
    target = want();
    drawn = target;
    paint();
  }

  function remeasure() {
    if (mRaf) return;
    mRaf = requestAnimationFrame(function () {
      measure();
      if (!live) settle();
    });
  }

  measure();
  settle();

  if (typeof IntersectionObserver === "function") {
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) resume();
        else settle();
      }
    }, { rootMargin: "25% 0px 25% 0px", threshold: 0 });
    io.observe(sec);
  } else {
    /* no observer: one frame per scroll tick, no idle loop */
    window.addEventListener("scroll", function () {
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; target = want(); drawn = target; paint(); });
    }, { passive: true });
  }

  window.addEventListener("resize", remeasure, { passive: true });
  window.addEventListener("load", remeasure);
  if (typeof ResizeObserver === "function") {
    new ResizeObserver(remeasure).observe(track);
  }
})();


/* ============================================================
   KORA, THE IDEA
   Four cue sliders drive a weighted distance against five hand
   written prototypes. The winner and the split animate into a
   line drawing and five bars. Deterministic arithmetic, nothing
   trained, nothing fetched, nothing left running when it settles.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root || root.hasAttribute("data-kora-demo")) return;

  var panel = document.getElementById("kdPanel");
  if (!panel) return;

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------- the model, such as it is ---------- */
  var KEYS = ["eye", "voice", "posture", "movement"];
  var CUE_NAME = ["eye contact", "voice", "posture", "movement"];
  var WORDS = {
    eye: ["looking away", "glancing", "steady", "locked on"],
    voice: ["quiet", "soft", "raised", "loud"],
    posture: ["turned away", "closed", "settled", "facing you"],
    movement: ["still", "slow", "restless", "fast"]
  };

  /* cue weights, and how sharply the read commits to one answer */
  var W = [1.15, 1, 0.95, 1];
  var WSUM = 4.1;
  var SHARP = 4.5;

  /* prototype: where each state sits on the four cues, plus what the
     drawing does when that state is the whole answer */
  var STATES = [
    { k: "calm",        p: [0.62, 0.32, 0.72, 0.24], mouth: 8,   brow: 0,  open: 0.55 },
    { k: "engaged",     p: [0.88, 0.70, 0.86, 0.62], mouth: 20,  brow: -4, open: 0.78 },
    { k: "anxious",     p: [0.26, 0.56, 0.30, 0.78], mouth: -6,  brow: 9,  open: 0.86 },
    { k: "overwhelmed", p: [0.10, 0.92, 0.16, 0.94], mouth: -13, brow: 13, open: 0.96 },
    { k: "withdrawn",   p: [0.10, 0.14, 0.22, 0.10], mouth: -4,  brow: 3,  open: 0.30 }
  ];
  var N = STATES.length;

  /* ---------- the parts, every one of them optional ---------- */
  var inputs = [], wordEls = [];
  var i, el;
  for (i = 0; i < KEYS.length; i++) {
    el = panel.querySelector('[data-kd-cue="' + KEYS[i] + '"]');
    if (!el) return;
    inputs.push(el);
    wordEls.push(panel.querySelector('[data-kd-word="' + KEYS[i] + '"]'));
  }

  var bars = [], fills = [], vals = [], lastVal = [];
  for (i = 0; i < N; i++) {
    var row = panel.querySelector('[data-kd-state="' + STATES[i].k + '"]');
    bars.push(row);
    fills.push(row ? row.querySelector(".kd-b-fill") : null);
    vals.push(row ? row.querySelector(".kd-b-val") : null);
    lastVal.push("");
  }

  var stateEl = document.getElementById("kdState");
  var driverEl = document.getElementById("kdDriver");
  var auraEl = document.getElementById("kdAura");
  var eyeL = document.getElementById("kdEyeL");
  var eyeR = document.getElementById("kdEyeR");
  var pupL = document.getElementById("kdPupL");
  var pupR = document.getElementById("kdPupR");
  var browL = document.getElementById("kdBrowL");
  var browR = document.getElementById("kdBrowR");
  var mouthEl = document.getElementById("kdMouth");

  /* the state names live in the markup, so the copy stays in one place */
  var LABEL = [];
  for (i = 0; i < N; i++) {
    var nameEl = bars[i] ? bars[i].querySelector(".kd-b-name") : null;
    LABEL.push(nameEl ? (nameEl.textContent || "").trim() : STATES[i].k);
  }

  root.setAttribute("data-kora-demo", "");

  var live = document.createElement("p");
  live.className = "kd-sr";
  live.setAttribute("aria-live", "polite");
  panel.appendChild(live);

  /* ---------- state ---------- */
  var tgt = { c: [], open: 0.6, gaze: -3.2, mouth: 7.2, brow: 0.7, aura: 0.33 };
  var cur = { c: [], open: 0.6, gaze: -3.2, mouth: 7.2, brow: 0.7, aura: 0.33 };
  for (i = 0; i < N; i++) { tgt.c.push(0); cur.c.push(0); }

  var top = -1, lastDriver = "", raf = 0, sayTimer = 0, first = true;

  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }

  function read() {
    var x = [];
    for (var j = 0; j < inputs.length; j++) {
      var v = parseFloat(inputs[j].value);
      if (isNaN(v)) v = 50;
      x.push(clamp01(v / 100));
    }
    return x;
  }

  function wordFor(j, v) {
    var list = WORDS[KEYS[j]];
    var n = Math.floor(v * list.length);
    if (n >= list.length) n = list.length - 1;
    if (n < 0) n = 0;
    return list[n];
  }

  /* ---------- the arithmetic ---------- */
  function score(x) {
    var out = [], sum = 0, j, s, d;
    for (s = 0; s < N; s++) {
      d = 0;
      for (j = 0; j < 4; j++) d += W[j] * Math.abs(x[j] - STATES[s].p[j]);
      d /= WSUM;
      var v = Math.pow(d < 1 ? 1 - d : 0, SHARP);
      out.push(v);
      sum += v;
    }
    for (s = 0; s < N; s++) out[s] = sum > 0 ? out[s] / sum : 1 / N;
    return out;
  }

  /* what separates the winner from the runner up, which is the only
     honest thing this arithmetic can say about why */
  function driver(x, c) {
    var a = -1, b = -1, s;
    for (s = 0; s < N; s++) {
      if (a < 0 || c[s] > c[a]) { b = a; a = s; }
      else if (b < 0 || c[s] > c[b]) { b = s; }
    }
    if (a < 0 || b < 0) return "";
    var lead = [];
    for (var j = 0; j < 4; j++) {
      var gain = W[j] * (Math.abs(x[j] - STATES[b].p[j]) - Math.abs(x[j] - STATES[a].p[j]));
      if (gain > 0.02) lead.push({ j: j, g: gain });
    }
    lead.sort(function (p, q) { return q.g - p.g; });
    if (!lead.length) return "AN EVEN SPLIT ACROSS THE FOUR CUES";
    if (lead.length === 1) return "TIPPED BY " + CUE_NAME[lead[0].j].toUpperCase();
    return "TIPPED BY " + CUE_NAME[lead[0].j].toUpperCase() + " AND " + CUE_NAME[lead[1].j].toUpperCase();
  }

  /* ---------- writes only, once per frame ---------- */
  function eyePath(cx, o) {
    var up = (96 - (4 + 26 * o)).toFixed(1);
    var dn = (96 + (4 + 14 * o)).toFixed(1);
    return "M" + (cx - 13) + " 96Q" + cx + " " + up + " " + (cx + 13) + " 96Q" +
           cx + " " + dn + " " + (cx - 13) + " 96Z";
  }

  function paint() {
    var j;
    for (j = 0; j < N; j++) {
      if (fills[j]) fills[j].style.transform = "scaleX(" + cur.c[j].toFixed(4) + ")";
      if (vals[j]) {
        var s = Math.round(cur.c[j] * 100) + "%";
        if (s !== lastVal[j]) { vals[j].textContent = s; lastVal[j] = s; }
      }
    }
    if (auraEl) {
      auraEl.setAttribute("r", (74 + cur.aura * 18).toFixed(1));
      auraEl.style.opacity = (0.1 + cur.aura * 0.3).toFixed(3);
    }
    if (eyeL) eyeL.setAttribute("d", eyePath(78, cur.open));
    if (eyeR) eyeR.setAttribute("d", eyePath(122, cur.open));
    var po = clamp01(cur.open * 1.7 - 0.25) * (0.45 + 0.55 * clamp01((cur.gaze + 8.5) / 8.5));
    if (pupL) {
      pupL.setAttribute("cx", (78 + cur.gaze).toFixed(1));
      pupL.style.opacity = po.toFixed(3);
    }
    if (pupR) {
      pupR.setAttribute("cx", (122 + cur.gaze).toFixed(1));
      pupR.style.opacity = po.toFixed(3);
    }
    if (browL) browL.setAttribute("transform", "rotate(" + cur.brow.toFixed(2) + " 86 76)");
    if (browR) browR.setAttribute("transform", "rotate(" + (-cur.brow).toFixed(2) + " 114 76)");
    if (mouthEl) mouthEl.setAttribute("d", "M76 136Q100 " + (136 + cur.mouth).toFixed(1) + " 124 136");
  }

  function step() {
    raf = 0;
    var k = 0.18, max = 0, j, d;
    for (j = 0; j < N; j++) {
      d = tgt.c[j] - cur.c[j];
      if (Math.abs(d) > max) max = Math.abs(d);
      cur.c[j] += d * k;
    }
    var fields = ["open", "gaze", "mouth", "brow", "aura"];
    var scale = [1, 0.08, 0.06, 0.06, 1];
    for (j = 0; j < fields.length; j++) {
      d = tgt[fields[j]] - cur[fields[j]];
      if (Math.abs(d) * scale[j] > max) max = Math.abs(d) * scale[j];
      cur[fields[j]] += d * k;
    }
    if (max < 0.0012) {
      for (j = 0; j < N; j++) cur.c[j] = tgt.c[j];
      for (j = 0; j < fields.length; j++) cur[fields[j]] = tgt[fields[j]];
      paint();
      return;
    }
    paint();
    raf = requestAnimationFrame(step);
  }

  function settle() {
    if (reduced) {
      for (var j = 0; j < N; j++) cur.c[j] = tgt.c[j];
      cur.open = tgt.open; cur.gaze = tgt.gaze; cur.mouth = tgt.mouth;
      cur.brow = tgt.brow; cur.aura = tgt.aura;
      paint();
      return;
    }
    if (!raf) raf = requestAnimationFrame(step);
  }

  /* ---------- one update ---------- */
  function update() {
    var x = read();
    var c = score(x);
    var j;

    for (j = 0; j < inputs.length; j++) {
      var word = wordFor(j, x[j]);
      if (wordEls[j] && wordEls[j].textContent !== word) wordEls[j].textContent = word;
      if (inputs[j].getAttribute("aria-valuetext") !== word) {
        inputs[j].setAttribute("aria-valuetext", word);
      }
    }

    var win = 0;
    for (j = 1; j < N; j++) if (c[j] > c[win]) win = j;

    for (j = 0; j < N; j++) tgt.c[j] = c[j];
    tgt.open = 0; tgt.mouth = 0; tgt.brow = 0;
    for (j = 0; j < N; j++) {
      tgt.open += c[j] * STATES[j].open;
      tgt.mouth += c[j] * STATES[j].mouth;
      tgt.brow += c[j] * STATES[j].brow;
    }
    tgt.gaze = -(1 - x[0]) * 8.5;
    tgt.aura = (x[1] + x[3]) / 2;

    if (win !== top) {
      top = win;
      for (j = 0; j < N; j++) if (bars[j]) bars[j].classList.toggle("is-top", j === win);
      if (stateEl) {
        stateEl.textContent = LABEL[win];
        if (!reduced && !first) {
          stateEl.classList.remove("kd-pop");
          void stateEl.offsetWidth;
          stateEl.classList.add("kd-pop");
        }
      }
    }

    var d = driver(x, c);
    if (driverEl && d && d !== lastDriver) {
      lastDriver = d;
      driverEl.textContent = d;
    }

    if (sayTimer) clearTimeout(sayTimer);
    sayTimer = setTimeout(function () {
      sayTimer = 0;
      live.textContent = LABEL[top] + ", " + Math.round(tgt.c[top] * 100) + " percent";
    }, 600);

    first = false;
    settle();
  }

  for (i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", update, { passive: true });
    inputs[i].addEventListener("change", update, { passive: true });
  }

  var presets = panel.querySelectorAll("[data-kd-set]");
  Array.prototype.forEach.call(presets, function (btn) {
    btn.addEventListener("click", function () {
      var parts = (btn.getAttribute("data-kd-set") || "").split(",");
      for (var j = 0; j < inputs.length && j < parts.length; j++) {
        var v = parseFloat(parts[j]);
        if (isNaN(v)) continue;
        inputs[j].value = String(Math.max(0, Math.min(100, v)));
      }
      update();
      /* on one column the answer sits above the chips, so a tap near the
         bottom of the panel can change something that is off screen.
         block nearest does nothing at all when it is already in view. */
      if (touch) {
        var readtop = panel.querySelector(".kd-readtop");
        if (readtop && readtop.scrollIntoView) {
          try {
            readtop.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
          } catch (err) { readtop.scrollIntoView(); }
        }
      }
    });
  });

  /* the sliders keep their markup values, so the first paint is the same
     picture a page without any script would have shown, and nothing
     animates out of a wrong resting position on load */
  var x0 = read();
  var c0 = score(x0);
  cur.open = 0; cur.mouth = 0; cur.brow = 0;
  for (i = 0; i < N; i++) {
    cur.c[i] = c0[i];
    cur.open += c0[i] * STATES[i].open;
    cur.mouth += c0[i] * STATES[i].mouth;
    cur.brow += c0[i] * STATES[i].brow;
  }
  cur.gaze = -(1 - x0[0]) * 8.5;
  cur.aura = (x0[1] + x0[3]) / 2;
  update();
})();


/* ============================================================
   LIGHT MODE
   The stored choice wins, then the operating system, then dark.
   The head script has normally already applied it before first
   paint; this re-applies it in case that never ran, then owns
   the toggle, the persistence and the theme-color meta.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root || root.hasAttribute("data-theme-live")) return;
  root.setAttribute("data-theme-live", "");

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;

  var KEY = "sm-theme";
  var TINT = { light: "#f6f7fa", dark: "#07090e" };

  var meta = document.querySelector('meta[name="theme-color"]');
  var btn = document.getElementById("themeBtn");

  var mql = null;
  try { mql = matchMedia("(prefers-color-scheme: light)"); } catch (e) {}

  function saved() {
    try {
      var v = localStorage.getItem(KEY);
      return (v === "light" || v === "dark") ? v : null;
    } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }
  function system() { return (mql && mql.matches) ? "light" : "dark"; }
  function now() { return root.getAttribute("data-theme") === "light" ? "light" : "dark"; }

  function paint(theme) {
    root.setAttribute("data-theme", theme);
    if (meta) meta.setAttribute("content", TINT[theme] || TINT.dark);
    if (btn) btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  }

  paint(saved() || system());

  var xT = 0;
  function swap(theme) {
    function run() { paint(theme); }
    if (!reduced && typeof document.startViewTransition === "function") {
      try { document.startViewTransition(run); return; } catch (e) {}
    }
    if (!reduced && !touch) {
      root.classList.add("th-x");
      clearTimeout(xT);
      xT = setTimeout(function () { root.classList.remove("th-x"); }, 360);
    }
    run();
  }

  if (btn) {
    btn.addEventListener("click", function () {
      var next = now() === "light" ? "dark" : "light";
      save(next);
      swap(next);
    });
  }

  /* until there is an explicit choice, follow the operating system live */
  function follow() { if (!saved()) paint(system()); }
  if (mql) {
    if (mql.addEventListener) mql.addEventListener("change", follow);
    else if (mql.addListener) mql.addListener(follow);
  }
})();


/* ============================================================
   fly-in choreography
   Replaces the flat .reveal fade with a directional entry engine.
   Every claimed element gets an entry vector read off its own
   position inside its layout group: left column enters from the
   left, right column from the right, full width blocks rise. The
   entry is travel + a scale + a short blur that resolves, on one
   long curve. Batches that enter together stagger in document
   order. Purely IntersectionObserver driven: no scroll listener,
   no rAF loop.
   ============================================================ */
(function () {
  "use strict";

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;

  var root = document.documentElement;
  if (!root || root.hasAttribute("data-flyin")) return;
  root.setAttribute("data-flyin", "");

  var all = document.querySelectorAll(".reveal");
  if (!all.length) return;

  /* section heads run their own letter and word stagger, the receipt
     rows have a printer, the work stack has the sticky scrub. Claim
     nothing that another module already owns. */
  var items = [];
  var i;
  for (i = 0; i < all.length; i++) {
    var cand = all[i];
    if (cand.closest && cand.closest(".sec-head, .stack-card, .statement-text")) continue;
    items.push(cand);
  }
  if (!items.length) return;

  /* Retire the old flat fade for everything below. Dropping .reveal on
     its own leaves the element fully visible, so every early return and
     every failure from here down is a safe one. */
  for (i = 0; i < items.length; i++) {
    items[i].classList.remove("reveal", "d1", "d2", "d3");
    items[i].classList.remove("on");
  }

  var IO = window.IntersectionObserver;
  if (reduced || typeof IO !== "function" || !document.body) return;

  /* ---------- layout groups ---------- */
  var MARK = "data-fly-m";
  for (i = 0; i < items.length; i++) items[i].setAttribute(MARK, "");

  function groupOf(el) {
    var n = el.parentElement;
    while (n && n !== document.body) {
      if (n.querySelectorAll("[" + MARK + "]").length >= 2) return n;
      if (n.tagName === "SECTION" || n.tagName === "MAIN") return n;
      n = n.parentElement;
    }
    return el.parentElement || document.body;
  }

  var recs = [];
  for (i = 0; i < items.length; i++) {
    recs.push({ el: items[i], group: groupOf(items[i]) });
  }
  for (i = 0; i < items.length; i++) items[i].removeAttribute(MARK);

  /* ---------- entry vectors, all reads then all writes ---------- */
  var TRAVEL = touch ? 44 : 88;   /* max lateral travel, px */
  var EDGE = 3;                   /* keep this much clear of the viewport edge */

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function measure(list) {
    var vw = window.innerWidth || root.clientWidth;
    var reads = [];
    var k;
    /* an element already carrying a fly transform would measure its
       moved box, so strip the state before reading, then write it back.
       No paint happens between the two loops. */
    for (k = 0; k < list.length; k++) list[k].el.removeAttribute("data-fly");
    for (k = 0; k < list.length; k++) {
      reads.push({
        r: list[k].el.getBoundingClientRect(),
        g: list[k].group.getBoundingClientRect()
      });
    }
    for (k = 0; k < list.length; k++) {
      var el = list[k].el;
      var r = reads[k].r;
      var g = reads[k].g;
      if (!r.width || !r.height) continue;

      /* full width of its group means it rises, otherwise it enters from
         whichever side of the group centre line it sits on, and the
         further out it sits the further it travels */
      var x = 0;
      if (g.width > 0 && r.width / g.width < 0.72) {
        var off = (r.left + r.width / 2) - (g.left + g.width / 2);
        var d = clamp(off / (g.width / 2), -1, 1);
        if (Math.abs(d) >= 0.14) x = d * TRAVEL;
      }

      /* HARD BOUND: never let the moved box cross a viewport edge, so the
         document can never gain horizontal scroll. Narrow viewports lose
         the lateral travel on their own and become a clean rise. */
      var room = x < 0 ? Math.max(0, r.left - EDGE) : Math.max(0, vw - r.right - EDGE);
      if (Math.abs(x) > room) x = (x < 0 ? -room : room);
      if (Math.abs(x) < 14) x = 0;

      var wide = r.width > 860;
      var y = x === 0 ? (touch ? 34 : 58) : (touch ? 18 : 26);
      var s = wide ? 0.978 : (touch ? 0.968 : 0.942);
      var b = 0;
      if (!touch && !el.classList.contains("band-rail")) b = wide ? 3 : 5;

      el.style.setProperty("--fx", Math.round(x) + "px");
      el.style.setProperty("--fy", y + "px");
      el.style.setProperty("--fs", String(s));
      el.style.setProperty("--fb", b + "px");
      el.setAttribute("data-fly", "");
    }
  }

  measure(recs);
  /* flush the entry state once so the very first element the observer
     reports actually has something to transition from */
  void root.offsetHeight;

  /* ---------- settle: back to a plain, untouched element ---------- */
  function settle(el) {
    if (!el.hasAttribute("data-fly")) return;
    el.classList.remove("fly-in");
    el.removeAttribute("data-fly");
    var s = el.style;
    s.willChange = "";
    s.transitionDelay = "";
    s.removeProperty("--fx");
    s.removeProperty("--fy");
    s.removeProperty("--fs");
    s.removeProperty("--fb");
  }

  var STEP = 72;      /* stagger between siblings entering together */
  var MAXI = 5;       /* cap the cascade so a wide batch never drags */
  var LIFE = 1500;    /* transform duration plus headroom */

  function show(el, delay) {
    if (!el.hasAttribute("data-fly") || el.classList.contains("fly-in")) return;
    el.style.willChange = "transform, opacity, filter";
    el.style.transitionDelay = delay + "ms";
    el.classList.add("fly-in");
    setTimeout(function () { settle(el); }, delay + LIFE);
  }

  function order(a, b) {
    var p = a.compareDocumentPosition(b);
    if (p & 4) return -1;   /* DOCUMENT_POSITION_FOLLOWING */
    if (p & 2) return 1;    /* DOCUMENT_POSITION_PRECEDING */
    return 0;
  }

  var io = null;
  try {
    io = new IO(function (entries) {
      var hit = [];
      var n;
      for (n = 0; n < entries.length; n++) {
        if (entries[n].isIntersecting) hit.push(entries[n].target);
      }
      if (!hit.length) return;
      hit.sort(order);
      for (n = 0; n < hit.length; n++) {
        if (io) io.unobserve(hit[n]);
        show(hit[n], Math.min(n, MAXI) * STEP);
      }
    }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });
  } catch (err) {
    io = null;
  }

  if (!io) {
    for (i = 0; i < recs.length; i++) settle(recs[i].el);
    return;
  }
  for (i = 0; i < recs.length; i++) io.observe(recs[i].el);

  /* ---------- safety net ----------
     If the observer ever stops delivering, anything already scrolled
     past still lands. Costs one rect read every 2.5s and stops itself
     once nothing is pending. */
  var net = setInterval(function () {
    var pending = 0;
    var vh = window.innerHeight || root.clientHeight;
    for (var k = 0; k < recs.length; k++) {
      var el = recs[k].el;
      if (!el.hasAttribute("data-fly")) continue;
      if (el.classList.contains("fly-in")) { pending++; continue; }
      pending++;
      if (el.getBoundingClientRect().top < vh * 0.95) settle(el);
    }
    if (!pending) { clearInterval(net); net = 0; }
  }, 2500);

  /* ---------- press wall ----------
     The filter module owns the motion of a cell that comes back from
     display:none, so hand any still pending card straight to it. */
  var filters = document.querySelector(".press-filters");
  if (filters) {
    filters.addEventListener("click", function () {
      var cards = document.querySelectorAll(".press-card[data-fly]");
      for (var k = 0; k < cards.length; k++) {
        if (io) io.unobserve(cards[k]);
        settle(cards[k]);
      }
    }, { passive: true });
  }

  /* ---------- resize: re-derive the vectors for anything still waiting ---------- */
  var rz = 0;
  window.addEventListener("resize", function () {
    clearTimeout(rz);
    rz = setTimeout(function () {
      var pending = [];
      for (var k = 0; k < recs.length; k++) {
        var el = recs[k].el;
        if (el.hasAttribute("data-fly") && !el.classList.contains("fly-in")) pending.push(recs[k]);
      }
      if (pending.length) measure(pending);
    }, 180);
  }, { passive: true });

})();


/* ============================================================
   pinned set pieces
   Two places where the page stops and something happens, both
   scrubbed from a 0..1 progress read off a wrapper's own rect.

   1. THE BOARD. The four stats move into a sticky inner wrapper
      inside a taller outer block, so the board holds in the
      middle of the screen for about half a viewport while the
      numbers count. Scrolling back up runs the count backwards.
   2. THE CLASSROOM. The nine frames start scattered, tilted,
      shrunk and soft, and converge into the mosaic. Released to
      transform: none at the end, so the layout is untouched.

   One scroll listener, one rAF, all reads before all writes.
   Elements are handed over from the entry engine by dropping
   [data-fly], which every path in that module guards on.
   ============================================================ */
(function () {
  "use strict";

  var reduced = false, touch = false;
  try { reduced = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  try { touch = matchMedia("(hover: none), (pointer: coarse)").matches; } catch (e) {}
  if (reduced) return;

  var root = document.documentElement;
  if (!root || root.hasAttribute("data-setpiece")) return;
  root.setAttribute("data-setpiece", "");

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function fmt(n) { return n.toLocaleString("en-US"); }

  /* take an element back off the entry engine and off the old flat fade,
     leaving it in its plain, fully visible state */
  function claim(el) {
    if (!el) return null;
    el.classList.remove("reveal", "d1", "d2", "d3", "on", "fly-in");
    el.removeAttribute("data-fly");
    var s = el.style;
    s.willChange = "";
    s.transitionDelay = "";
    s.removeProperty("--fx");
    s.removeProperty("--fy");
    s.removeProperty("--fs");
    s.removeProperty("--fb");
    return el;
  }

  var winH = window.innerHeight || root.clientHeight || 800;
  var winW = window.innerWidth || root.clientWidth || 1200;

  /* ---------------------------------------------------------
     1. THE BOARD
     --------------------------------------------------------- */
  var board = (function () {
    var sec = document.querySelector(".stats");
    if (!sec) return null;
    var grid = sec.querySelector(".stats-grid");
    if (!grid || !grid.parentNode) return null;
    var list = Array.prototype.slice.call(grid.querySelectorAll(".stat"));
    if (list.length < 2) return null;

    var cells = [];
    for (var i = 0; i < list.length; i++) {
      var el = claim(list[i]);
      el.classList.add("ps-stat");
      var num = null, target = 0;
      var old = el.querySelector("[data-count]");
      if (old && old.parentNode) {
        /* the node the one shot counter observes leaves the document, so
           that counter can never fire a second animation over this one */
        num = old.cloneNode(true);
        old.parentNode.replaceChild(num, old);
        target = parseInt(num.getAttribute("data-count"), 10);
        if (isNaN(target) || target < 0) target = 0;
        num.textContent = fmt(target);
      }
      cells.push({ el: el, num: num, target: target, txt: num ? fmt(target) : "" });
    }

    var pin = document.createElement("div");
    pin.className = "ps-pin";
    var stick = document.createElement("div");
    stick.className = "ps-stick";
    var spacer = document.createElement("div");
    spacer.className = "ps-spacer";
    spacer.setAttribute("aria-hidden", "true");

    grid.parentNode.insertBefore(pin, grid);
    stick.appendChild(grid);
    pin.appendChild(stick);
    pin.appendChild(spacer);

    var extra = 0, top = 0, pinTop = 0, last = -1;

    function measure() {
      /* the pin costs scroll height, so it only exists where there is a
         viewport tall enough to hold the board still and read it */
      var on = !touch && winW >= 900 && winH >= 620;
      spacer.style.height = "0px";
      stick.style.position = "static";
      stick.style.top = "";
      extra = 0;
      top = 0;
      last = -1;
      if (!on) return;
      var h = stick.offsetHeight;
      if (!h || h > winH - 140) return;          /* too tall to pin: no pin */
      top = Math.round(Math.max(96, (winH - h) / 2));
      extra = Math.round(winH * 0.55);
      stick.style.position = "sticky";
      stick.style.top = top + "px";
      spacer.style.height = extra + "px";
    }

    function read() { pinTop = pin.getBoundingClientRect().top; }

    function write() {
      var from = winH * 0.8;
      var span = Math.max(1, from - top + extra);
      var p = clamp((from - pinTop) / span, 0, 1);
      /* nothing moved, so nothing is written. This also leaves the
         click to recount interaction a clear field between scrolls. */
      if (p === last) return;
      last = p;
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i];
        /* the block is fully present well before the numbers finish, so
           a jump straight into the middle of the pin never lands on a
           board that is not there */
        var b = ease(clamp((p - (0.04 + i * 0.07)) / 0.2, 0, 1));
        var n = ease(clamp((p - (0.08 + i * 0.09)) / 0.4, 0, 1));
        var st = c.el.style;
        if (b >= 1) {
          st.transform = "none";
          st.filter = "none";
          st.opacity = "1";
          st.willChange = "";
        } else {
          st.transform = "translate3d(0," + (34 * (1 - b)).toFixed(1) + "px,0) scale(" + (0.955 + 0.045 * b).toFixed(4) + ")";
          st.filter = b > 0.72 ? "none" : "blur(" + (4 * (1 - b / 0.72)).toFixed(2) + "px)";
          st.opacity = b.toFixed(3);
          st.willChange = "transform, opacity, filter";
        }
        if (c.num) {
          var t = fmt(Math.round(c.target * n));
          if (t !== c.txt) { c.num.textContent = t; c.txt = t; }
        }
      }
    }

    function reset() {
      spacer.style.height = "0px";
      stick.style.position = "static";
      stick.style.top = "";
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i];
        c.el.style.transform = "none";
        c.el.style.filter = "none";
        c.el.style.opacity = "1";
        c.el.style.willChange = "";
        if (c.num) c.num.textContent = fmt(c.target);
      }
    }

    return { measure: measure, read: read, write: write, reset: reset };
  })();

  /* ---------------------------------------------------------
     2. THE CLASSROOM
     --------------------------------------------------------- */
  var mosaic = (function () {
    var rail = document.getElementById("bandRail");
    if (!rail) return null;
    var shots = Array.prototype.slice.call(rail.querySelectorAll(".band-shot"));
    if (shots.length < 3) return null;

    claim(rail);
    rail.classList.add("ps-mosaic");

    var frames = [];
    for (var i = 0; i < shots.length; i++) {
      var hit = shots[i].querySelector(".band-hit");
      if (!hit) continue;
      frames.push({
        shot: shots[i],
        hit: hit,
        cap: shots[i].querySelector(".band-cap"),
        dir: 0, top: 0, last: -1
      });
    }
    if (frames.length < 3) return null;

    var wide = false, dx = 0;

    function measure() {
      /* below 721 the mosaic is a horizontal rail with overflow-y hidden,
         so sideways travel and a downward rise would both be clipped. The
         phone gets the same choreography with scale and opacity only. */
      wide = winW >= 721 && !touch;
      var k;
      /* a frame carrying a transform would measure its moved box, so the
         state comes off before the reads and goes back on in the same
         frame, before any paint */
      for (k = 0; k < frames.length; k++) {
        frames[k].hit.style.transform = "none";
        frames[k].hit.style.filter = "none";
        if (frames[k].cap) frames[k].cap.style.transform = "none";
        frames[k].last = -1;
      }
      var rr = rail.getBoundingClientRect();
      var pad = parseFloat(window.getComputedStyle(rail).paddingLeft);
      if (!(pad >= 0)) pad = 24;
      /* HARD BOUND: the sideways travel is never wider than the gutter it
         lives in, so a frame can never reach the viewport edge and the
         document can never gain horizontal scroll */
      dx = wide ? Math.max(0, Math.min(52, pad - 14)) : 0;
      var mid = rr.left + rr.width / 2;
      var half = (rr.width / 2) || 1;
      for (k = 0; k < frames.length; k++) {
        var r = frames[k].hit.getBoundingClientRect();
        frames[k].dir = clamp((((r.left + r.width / 2) - mid) / half) * 1.7, -1, 1);
      }
    }

    function read() {
      for (var k = 0; k < frames.length; k++) {
        frames[k].top = frames[k].shot.getBoundingClientRect().top;
      }
    }

    function write() {
      var from = winH * 0.94;
      var span = winH * (wide ? 0.52 : 0.42);
      if (span < 1) span = 1;
      for (var k = 0; k < frames.length; k++) {
        var f = frames[k];
        /* on the rail every frame shares one top, so the stagger there is
           read off the index instead of the layout */
        var raw = clamp((from - f.top + (wide ? 0 : k * 26)) / span, 0, 1);
        var e = ease(raw);
        if (e === f.last) continue;
        f.last = e;
        var hs = f.hit.style;
        if (e >= 1) {
          hs.transform = "none";
          hs.filter = "none";
          hs.opacity = "1";
          hs.willChange = "";
          if (f.cap) { f.cap.style.transform = "none"; f.cap.style.opacity = "1"; }
          continue;
        }
        var inv = 1 - e;
        var x = wide ? f.dir * dx * inv : 0;
        var y = wide ? 46 * inv : 0;
        var rot = wide ? f.dir * 2.4 * inv : 0;
        var sc = wide ? (0.9 + 0.1 * e) : (0.95 + 0.05 * e);
        hs.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) rotate(" + rot.toFixed(2) + "deg) scale(" + sc.toFixed(4) + ")";
        hs.filter = (!wide || e > 0.66) ? "none" : "blur(" + (3 * (1 - e / 0.66)).toFixed(2) + "px)";
        hs.opacity = (0.15 + 0.85 * e).toFixed(3);
        hs.willChange = "transform, opacity, filter";
        if (f.cap) {
          f.cap.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
          f.cap.style.opacity = e.toFixed(3);
        }
      }
    }

    function reset() {
      for (var k = 0; k < frames.length; k++) {
        var f = frames[k];
        f.hit.style.transform = "none";
        f.hit.style.filter = "none";
        f.hit.style.opacity = "1";
        f.hit.style.willChange = "";
        if (f.cap) { f.cap.style.transform = "none"; f.cap.style.opacity = "1"; }
      }
    }

    return { measure: measure, read: read, write: write, reset: reset };
  })();

  var pieces = [];
  if (board) pieces.push(board);
  if (mosaic) pieces.push(mosaic);
  if (!pieces.length) return;

  /* ---------------------------------------------------------
     one loop
     --------------------------------------------------------- */
  var queued = false, remeasure = true, ran = false, dead = false;

  function bail() {
    if (dead) return;
    dead = true;
    try { window.removeEventListener("scroll", tick); } catch (e) {}
    try { window.removeEventListener("resize", onResize); } catch (e) {}
    for (var i = 0; i < pieces.length; i++) {
      try { pieces[i].reset(); } catch (e) {}
    }
    pieces = [];
  }

  function frame() {
    queued = false;
    if (dead) return;
    try {
      if (remeasure) {
        remeasure = false;
        winH = window.innerHeight || root.clientHeight || winH;
        winW = window.innerWidth || root.clientWidth || winW;
        for (var m = 0; m < pieces.length; m++) pieces[m].measure();
      }
      for (var r = 0; r < pieces.length; r++) pieces[r].read();    /* reads */
      for (var w = 0; w < pieces.length; w++) pieces[w].write();   /* writes */
      ran = true;
    } catch (e) {
      bail();
    }
  }

  function tick() {
    if (dead || queued) return;
    queued = true;
    requestAnimationFrame(frame);
  }

  var rz = 0;
  function onResize() {
    clearTimeout(rz);
    rz = setTimeout(function () { remeasure = true; tick(); }, 140);
  }

  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onResize, { passive: true });

  /* the mosaic's column balance only settles once the nine files have
     their real heights, so re-derive the vectors as they arrive */
  var imgs = document.querySelectorAll("#bandRail img");
  for (var q = 0; q < imgs.length; q++) {
    if (imgs[q].complete) continue;
    imgs[q].addEventListener("load", onResize);
    imgs[q].addEventListener("error", onResize);
  }
  window.addEventListener("load", onResize);

  frame();                                   /* first state before paint */
  setTimeout(function () { remeasure = true; tick(); }, 400);
  setTimeout(function () { remeasure = true; tick(); }, 1400);

  /* if the loop never got through a single pass, put everything back */
  setTimeout(function () { if (!ran) bail(); }, 5000);

  window.addEventListener("pagehide", function () { clearTimeout(rz); });

})();


/* ============================================================
   FRICTIONLESS CONTACT
   The mailto button stays a mailto button. Under it the address
   becomes readable text you can select, a copy control that
   draws a check when it lands, and a share control that hands
   off to the system sheet when there is one and copies the page
   link when there is not. Announced politely, keyboard first.
   Self contained. Every lookup is guarded.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root || root.hasAttribute("data-contact-copy")) return;

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;

  var contact = document.getElementById("contact");
  if (!contact) return;

  var mail = contact.querySelector('a[href^="mailto:"]');
  if (!mail) return;

  var addr = (mail.getAttribute("href") || "").replace(/^mailto:/i, "").split("?")[0];
  try { addr = decodeURIComponent(addr); } catch (err) {}
  addr = addr.trim();
  if (!addr) return;

  var host = mail.parentNode;
  if (!host || !host.parentNode) return;

  root.setAttribute("data-contact-copy", "");

  /* a phone gets a beat longer, since the hand is often in the way */
  var HOLD = touch ? 2300 : 1900;
  var canShare = !!(window.navigator && typeof navigator.share === "function");

  /* ---------- clipboard: async API first, execCommand second ---------- */
  function legacyCopy(text) {
    if (!document.execCommand || !document.body) return false;
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.setAttribute("aria-hidden", "true");
    ta.tabIndex = -1;
    ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;" +
      "border:0;opacity:0;pointer-events:none;";
    document.body.appendChild(ta);
    var ok = false;
    try {
      ta.select();
      if (ta.setSelectionRange) ta.setSelectionRange(0, text.length);
      ok = document.execCommand("copy");
    } catch (err) { ok = false; }
    if (ta.parentNode) ta.parentNode.removeChild(ta);
    return !!ok;
  }

  function copy(text, done) {
    var nav = window.navigator;
    if (nav && nav.clipboard && nav.clipboard.writeText) {
      try {
        var p = nav.clipboard.writeText(text);
        if (p && p.then) {
          p.then(function () { done(true); }, function () { done(legacyCopy(text)); });
          return;
        }
      } catch (err) {}
    }
    done(legacyCopy(text));
  }

  /* ---------- markup ---------- */
  var ICON_COPY =
    '<svg class="fc-i fc-i-copy" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">' +
    '<rect x="1.15" y="4.15" width="7.7" height="8.7" rx="2" stroke="currentColor" stroke-width="1.3"/>' +
    '<path d="M4.4 4.15V3.1a2 2 0 0 1 2-2h4.45a2 2 0 0 1 2 2v5.65a2 2 0 0 1-2 2h-.55" ' +
    'stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
  var ICON_CHECK =
    '<svg class="fc-i fc-i-check" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">' +
    '<path d="M2.2 7.4 5.6 10.8 11.8 3.6" stroke="currentColor" stroke-width="1.7" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_SHARE =
    '<svg class="fc-i fc-i-share" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">' +
    '<path d="M7 1.4v7.3M4.3 4.1 7 1.4l2.7 2.7M2.2 8.4v3.1a1 1 0 0 0 1 1h7.6a1 1 0 0 0 1-1V8.4" ' +
    'stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var row = document.createElement("div");
  row.className = "fc-row";

  var field = document.createElement("div");
  field.className = "fc-field";

  var addrEl = document.createElement("span");
  addrEl.className = "fc-addr mono";
  addrEl.textContent = addr;
  field.appendChild(addrEl);

  var copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "fc-copy mono";
  copyBtn.innerHTML = '<span class="fc-ico" aria-hidden="true">' + ICON_COPY + ICON_CHECK + "</span>" +
    '<span class="fc-label">COPY</span>';
  copyBtn.setAttribute("aria-label", "Copy the email address " + addr + " to the clipboard");
  field.appendChild(copyBtn);

  var shareBtn = document.createElement("button");
  shareBtn.type = "button";
  shareBtn.className = "fc-share mono";
  shareBtn.innerHTML = '<span class="fc-ico" aria-hidden="true">' + ICON_SHARE + "</span>" +
    '<span class="fc-label">' + (canShare ? "SHARE" : "COPY LINK") + "</span>";
  shareBtn.setAttribute("aria-label", canShare ? "Share this page" : "Copy a link to this page");

  var live = document.createElement("p");
  live.className = "fc-live";
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");

  row.appendChild(field);
  row.appendChild(shareBtn);
  row.appendChild(live);
  host.parentNode.insertBefore(row, host.nextSibling);

  var copyLabel = copyBtn.querySelector(".fc-label");
  var shareLabel = shareBtn.querySelector(".fc-label");

  /* the address is spelled out below now, so the button says what it does */
  var btnLabel = mail.querySelector("span");
  if (btnLabel && btnLabel.textContent.trim().toLowerCase() === addr.toLowerCase()) {
    btnLabel.textContent = "Email me";
  }

  /* ---------- announcements ---------- */
  var sayTimer = 0;
  function say(msg) {
    if (sayTimer) { clearTimeout(sayTimer); sayTimer = 0; }
    live.textContent = "";
    sayTimer = setTimeout(function () {
      sayTimer = 0;
      live.textContent = msg;
    }, 40);
  }

  /* ---------- copy ---------- */
  function selectAddr() {
    try {
      var sel = window.getSelection ? window.getSelection() : null;
      if (!sel || !document.createRange) return;
      var r = document.createRange();
      r.selectNodeContents(addrEl);
      sel.removeAllRanges();
      sel.addRange(r);
    } catch (err) {}
  }

  var copyTimer = 0;
  function copyState(kind) {
    if (copyTimer) { clearTimeout(copyTimer); copyTimer = 0; }
    copyBtn.classList.toggle("is-done", kind === "done");
    copyBtn.classList.toggle("is-fail", kind === "fail");
    copyLabel.textContent = kind === "done" ? "COPIED" : kind === "fail" ? "SELECTED" : "COPY";
    if (!kind) return;
    copyTimer = setTimeout(function () {
      copyTimer = 0;
      copyState("");
    }, kind === "fail" ? 4600 : HOLD);
  }

  copyBtn.addEventListener("click", function () {
    copy(addr, function (ok) {
      if (ok) {
        copyState("done");
        say("Email address copied to the clipboard.");
        return;
      }
      selectAddr();
      copyState("fail");
      say("The browser blocked copying. The address is selected, so you can copy it with your keyboard.");
    });
  });

  /* ---------- share ---------- */
  var shareTimer = 0;
  function shareState(text, done) {
    if (shareTimer) { clearTimeout(shareTimer); shareTimer = 0; }
    shareLabel.textContent = text;
    shareBtn.classList.toggle("is-done", !!done);
    shareTimer = setTimeout(function () {
      shareTimer = 0;
      shareBtn.classList.remove("is-done");
      shareLabel.textContent = canShare ? "SHARE" : "COPY LINK";
    }, HOLD + 400);
  }

  function shareFallback() {
    copy(window.location.href, function (ok) {
      if (ok) {
        shareState("LINK COPIED", true);
        say("A link to this page was copied to the clipboard.");
        return;
      }
      shareState("BLOCKED", false);
      say("The browser blocked copying the link.");
    });
  }

  shareBtn.addEventListener("click", function () {
    if (canShare) {
      try {
        var p = navigator.share({ title: document.title || "Shashank Madala", url: window.location.href });
        if (p && p.then) {
          p.then(null, function (err) {
            if (err && err.name === "AbortError") return;
            shareFallback();
          });
        }
        return;
      } catch (err) {}
    }
    shareFallback();
  });

  /* ---------- entrance ---------- */
  if (reduced || typeof IntersectionObserver !== "function") {
    row.classList.add("fc-in");
  } else {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0] && entries[0].isIntersecting) {
        row.classList.add("fc-in");
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(row);
  }
})();

/* ---------- Apple style scroll choreography ----------
   1. every .reveal gets a directional entry vector derived from
      where it actually sits in its row, plus a stagger
   2. section titles reveal word by word from behind a mask
   3. the nine classroom photos fly in from alternating sides
   4. ambient washes drift for depth
   Falls back to fully visible if anything goes wrong.        */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root || root.hasAttribute("data-choreo")) return;
  root.setAttribute("data-choreo", "");

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------- 1. split section titles into masked words ---------- */
  var titles = document.querySelectorAll(".sec-title");
  Array.prototype.forEach.call(titles, function (t) {
    if (!t || t.getAttribute("data-split")) return;
    var text = (t.textContent || "").trim();
    if (!text) return;
    var words = text.split(/\s+/);
    if (words.length > 14) return;
    t.textContent = "";
    words.forEach(function (w, i) {
      var wrap = document.createElement("span");
      wrap.className = "wr";
      var inner = document.createElement("span");
      inner.className = "wi";
      inner.textContent = w;
      if (!reduced) inner.style.transitionDelay = (0.06 + i * 0.055).toFixed(3) + "s";
      wrap.appendChild(inner);
      t.appendChild(wrap);
      if (i < words.length - 1) t.appendChild(document.createTextNode(" "));
    });
    t.setAttribute("data-split", "1");
  });

  /* ---------- 3. classroom photos fly in ---------- */
  var shots = document.querySelectorAll(".band-shot");
  if (shots.length && !reduced) {
    Array.prototype.forEach.call(shots, function (s, i) {
      s.classList.add("ch");
      var dir = i % 3;
      var x = dir === 0 ? -60 : dir === 2 ? 60 : 0;
      var rot = dir === 0 ? -3 : dir === 2 ? 3 : 0;
      s.style.transform = "translate3d(" + x + "px, 60px, 0) scale(0.93) rotate(" + rot + "deg)";
      s.style.transitionDelay = (i % 3) * 0.09 + "s";
    });

    var shotIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("ch-in");
        e.target.style.transform = "";
        shotIO.unobserve(e.target);
        setTimeout(function () { e.target.style.willChange = "auto"; }, 1400);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(shots, function (s) { shotIO.observe(s); });
  }

  /* ---------- 4. depth drift on the ambient washes ---------- */
  if (!reduced && !touch) {
    var washes = [];
    var hg = document.querySelector(".hero-glow");
    var cg = document.querySelector(".contact-glow");
    if (hg) washes.push({ el: hg, f: 0.055 });
    if (cg) washes.push({ el: cg, f: -0.045 });

    if (washes.length) {
      var ticking = false;
      var onScroll = function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var vh = window.innerHeight || 800;
          washes.forEach(function (w) {
            var r = w.el.getBoundingClientRect();
            var mid = r.top + r.height / 2 - vh / 2;
            var off = Math.max(-38, Math.min(38, mid * w.f));
            w.el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0)";
          });
          ticking = false;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* ---------- safety net: nothing may stay invisible ---------- */
  setTimeout(function () {
    Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || 800) && !el.classList.contains("on")) el.classList.add("on");
    });
    Array.prototype.forEach.call(document.querySelectorAll(".band-shot.ch"), function (s) {
      var r = s.getBoundingClientRect();
      if (r.top < (window.innerHeight || 800)) { s.classList.add("ch-in"); s.style.transform = ""; }
    });
  }, 5000);
})();


/* ---------- directional fly-in ----------
   The [data-fly] entry system already travels, scales and blurs,
   but it ships --fx at 0 so everything rises straight up. This
   assigns a horizontal vector from each element's real position:
   left column flies in from the left, right column from the right,
   full width blocks keep rising. Idempotent, runs again as new
   elements are claimed (the press filter reveals cards late).   */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root || root.hasAttribute("data-flyx")) return;
  root.setAttribute("data-flyx", "");

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  var MAX = 78;   /* px of sideways travel, clipped by main{overflow-x:clip} */

  function assign() {
    var els = document.querySelectorAll("[data-fly]");
    if (!els.length) return 0;
    var vw = window.innerWidth || 1280;
    var n = 0;

    /* read every rect first, then write, so we never thrash layout */
    var reads = [];
    Array.prototype.forEach.call(els, function (el) {
      if (!el || el.getAttribute("data-flyx")) return;
      var r;
      try { r = el.getBoundingClientRect(); } catch (e) { return; }
      if (!r || r.width < 40) return;
      reads.push({ el: el, left: r.left, width: r.width });
    });

    reads.forEach(function (item) {
      var centre = item.left + item.width / 2;
      var wide = item.width > vw * 0.6;
      var fx = 0;
      if (!wide) {
        if (centre < vw * 0.44) fx = -MAX;
        else if (centre > vw * 0.56) fx = MAX;
        else fx = 0;
        /* narrower cards travel a touch further, big ones stay calm */
        if (item.width < vw * 0.3) fx = fx * 1.15;
      }
      if (fx !== 0) item.el.style.setProperty("--fx", Math.round(fx) + "px");
      item.el.setAttribute("data-flyx", "1");
      n++;
    });
    return n;
  }

  function run() { requestAnimationFrame(assign); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
  window.addEventListener("load", run, { once: true });
  /* catch elements claimed late, then stop */
  var tries = 0;
  var timer = setInterval(function () {
    run();
    if (++tries > 6) clearInterval(timer);
  }, 700);
})();
