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
    "I lead 8,000+ FBLA members."
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
  } else {
    typeInto(loaderName, "shashank.madala", 38, function () {
      setTimeout(function () {
        loader.classList.add("done");
        startHero();
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
            "nj fbla &middot; state president <span class='t-hl'>[8,000+ MEMBERS]</span>"] }
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

  if (reduced) {
    SEQ.forEach(function (item) {
      termLine("<span class='t-prompt'>$</span> <span class='t-cmd'>" + item.cmd + "</span>");
      item.out.forEach(function (l) { termLine("<span class='t-out'>" + l + "</span>"); });
    });
  } else {
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

  /* ---------- scroll-driven engine (rAF) ---------- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("progress");
  var term = document.getElementById("term");
  var termWrap = document.getElementById("termWrap");
  var statementSec = document.getElementById("statement");
  var stackCards = Array.prototype.slice.call(document.querySelectorAll(".stack-card"));
  var lastY = 0;

  function onFrame() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight - vh;

    /* progress bar */
    if (progress) progress.style.transform = "scaleX(" + (docH > 0 ? y / docH : 0) + ")";

    /* nav state */
    if (y > 30) nav.classList.add("scrolled"); else nav.classList.remove("scrolled");
    if (y > 500 && y > lastY + 4) nav.classList.add("hidden");
    else if (y < lastY - 4 || y < 500) nav.classList.remove("hidden");
    lastY = y;

    if (!reduced) {
      /* terminal lift + tilt on scroll */
      if (term && termWrap) {
        var r = termWrap.getBoundingClientRect();
        var p = clamp(1 - (r.top + r.height * 0.5 - vh * 0.5) / vh, 0, 2);
        var rot = clamp(4.5 - p * 4.5, 0, 4.5);
        term.style.transform = "rotateX(" + rot + "deg) translateY(" + (1 - clamp(p, 0, 1)) * 26 + "px)";
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
