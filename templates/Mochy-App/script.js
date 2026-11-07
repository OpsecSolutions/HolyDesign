// The original homepage and wiki share one document, selected by the URL.
const isWiki = new URLSearchParams(location.search).get("page") === "wiki";
if (isWiki) {
  try { if (localStorage.getItem("wikiSideFolded") === "1") document.documentElement.classList.add("side-folded"); } catch (e) {}
  const content = document.getElementById("wiki-template").content.cloneNode(true);
  document.body.replaceChildren(content);
  document.body.className = "";
  document.title = "Mochy Wiki";
} else { document.documentElement.classList.add("js"); }
// the little bits of feel the homepage and the wiki borrow from the app: buttons that squish and spring back, and the tour's bottom bar
(function () {
  // pressBounce: down squishes, up springs back past and settles
  document.addEventListener("pointerdown", function (e) {
    var el = e.target.closest(".press");
    if (!el) return;
    el.classList.add("down");
    var up = function () {
      el.classList.remove("down");
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  });

  // the tour: tap a tab and the phone shows that page, the highlight sliding over the way the app's does
  document.querySelectorAll(".tour").forEach(function (tour) {
    var tabs = tour.querySelectorAll(".navbar button");
    var shots = tour.querySelectorAll(".phone img");
    var hl = tour.querySelector(".hl");
    var caption = tour.querySelector(".tour-caption");
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t, j) { t.classList.toggle("on", i === j); });
        shots.forEach(function (s, j) {
          if (j === i && s.dataset.src) { s.src = s.dataset.src; delete s.dataset.src; }
          s.classList.toggle("on", i === j);
        });
        hl.style.left = (6 + i * 64 + 4) + "px";
        if (caption) caption.textContent = tab.dataset.caption || "";
      });
    });
  });
})();

if (!isWiki) {
// the homepage's motion: each sheet's pose from the scroll, the strip that slides sideways, the top bar, reveals and leaning phones
(function () {
  var root = document.documentElement;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wide = window.matchMedia("(min-width: 981px)");

  // the menu on a phone, closed again by picking a link
  var topnav = document.getElementById("topnav");
  var nav = topnav.querySelector(".nav");
  var toggle = topnav.querySelector(".nav-toggle");
  toggle.addEventListener("click", function () {
    toggle.setAttribute("aria-expanded", String(nav.classList.toggle("open")));
  });
  nav.querySelectorAll(".nav-links a").forEach(function (a) {
    a.addEventListener("click", function () { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); });
  });

  var items = Array.prototype.slice.call(document.querySelectorAll(".stack > *"));
  var hero = document.querySelector(".hero");
  var rail = document.querySelector(".rail");
  var track = rail ? rail.querySelector(".rail-track") : null;
  var cards = track ? Array.prototype.slice.call(track.children) : [];
  var railIndex = items.indexOf(rail);
  var travel = 0;
  var railHeight = 0;
  var cardMid = [];

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function n(v) { return Math.round(v * 100) / 100; }

  // a style only written when it changed, so a still page costs nothing and a moving one never restyles a whole sheet
  function put(el, prop, value) {
    if (!el) return;
    var seen = el._seen || (el._seen = {});
    if (seen[prop] === value) return;
    seen[prop] = value;
    el.style[prop] = value;
  }
  function px(el, name, fallback) {
    var v = parseFloat(getComputedStyle(el).getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  }

  // each sheet's moving pieces, found once; the dark shade that falls over a covered sheet is its own layer
  var parts = items.map(function (el) {
    var shade = null;
    if (el.classList.contains("scene")) {
      shade = document.createElement("div");
      shade.className = "shade";
      el.appendChild(shade);
    }
    return {
      el: el,
      body: el.querySelector(".scene-body"),
      shade: shade,
      words: el.querySelector(".words, .rail-head"),
      flip: el.classList.contains("flip"),
      head: el === rail,
      slots: Array.prototype.map.call(el.querySelectorAll(".slot"), function (s) { return { el: s }; }),
      ghost: el.querySelector(".ghost"),
      ring: el.querySelector(".ring-wrap"),
      copy: el.querySelector(".hero-copy"),
      mascot: el.querySelector(".mascot-wrap"),
      cue: el.querySelector(".cue")
    };
  });

  // how far the strip travels sideways, how long it stays pinned, and each phone's own rise and lean
  function measure() {
    parts.forEach(function (p) {
      p.slots.forEach(function (s) {
        s.rise = px(s.el, "--rise", 240);
        s.lift = px(s.el, "--lift", 60);
        s.turn = px(s.el, "--turn", 6);
      });
    });
    if (!rail) return;
    if (!wide.matches || still) {
      rail.style.height = "";
      track.style.transform = "";
      cards.forEach(function (c) { put(c, "transform", ""); put(c.querySelector(".phone"), "transform", ""); });
      travel = 0;
      return;
    }
    travel = Math.max(0, track.scrollWidth - window.innerWidth);
    railHeight = Math.round(window.innerHeight * 1.35 + travel);
    rail.style.height = railHeight + "px";
    cardMid = cards.map(function (c) { return c.offsetLeft + c.offsetWidth / 2; });
  }

  // one sheet's pose for how far in (i) and how covered (c) it is
  function pose(p, i, c) {
    var out = 1 - i;
    put(p.body, "transform", c ? "scale(" + n(1 - c * 0.07) + ")" : "");
    if (p.shade) put(p.shade, "opacity", c ? String(n(c * 0.62)) : "0");
    if (p.words) {
      var move = p.head || !wide.matches ? "translate3d(0," + n(out * (p.head ? 80 : 50)) + "px,0)" : "translate3d(" + n(out * (p.flip ? 110 : -110)) + "px,0,0)";
      put(p.words, "transform", out ? move : "");
      put(p.words, "opacity", out ? String(n(i)) : "");
    }
    p.slots.forEach(function (s) {
      var y = out * s.rise - c * s.lift;
      put(s.el, "transform", y || out ? "translate3d(0," + n(y) + "px,0) rotate(" + n(out * s.turn) + "deg)" : "");
    });
    if (p.ghost) put(p.ghost, "transform", c ? "translate3d(" + n(c * -16) + "%,0,0)" : "");
    if (p.ring) put(p.ring, "transform", c ? "rotate(" + n(c * 120) + "deg)" : "");
    if (p.copy) {
      put(p.copy, "transform", c ? "translate3d(0," + n(c * -90) + "px,0)" : "");
      put(p.copy, "opacity", c ? String(n(clamp(1 - c * 1.3))) : "");
    }
    if (p.mascot) put(p.mascot, "transform", c ? "translate3d(0," + n(c * -70) + "px,0) scale(" + n(1 + c * 0.05) + ")" : "");
    if (p.cue) put(p.cue, "opacity", c ? String(n(clamp(1 - c * 4))) : "");
  }

  // every read first, then every write, once a frame at most
  var queued = false;
  function frame() {
    queued = false;
    var vh = window.innerHeight;
    var vw = window.innerWidth;
    var tops = items.map(function (el) { return el.getBoundingClientRect().top; });
    parts.forEach(function (p, i) {
      var next = tops[i + 1];
      var covering = next !== undefined && p.el.classList.contains("scene");
      pose(p, ease(clamp((vh - tops[i]) / (vh * 0.6))), covering ? clamp(1 - next / vh) : 0);
    });
    // the hero's marquee, ring and cue rest once a sheet fully covers them
    if (hero) hero.classList.toggle("resting", tops[1] !== undefined && tops[1] <= 0);
    if (travel) {
      var x = clamp(-tops[railIndex] / (railHeight - vh)) * travel;
      track.style.transform = "translate3d(" + (-x).toFixed(1) + "px, 0, 0)";
      cards.forEach(function (c, i) {
        var d = n(Math.min(1, Math.abs(cardMid[i] - x - vw / 2) / vw * 1.6));
        put(c, "transform", "scale(" + n(1 - d * 0.06) + ")");
        put(c._phone || (c._phone = c.querySelector(".phone")), "transform", "translate(-50%, calc(36% + " + n(d * 50) + "px)) rotate(" + n(d * 4) + "deg)");
      });
    }
    topnav.classList.toggle("solid", window.scrollY > 24);
  }
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(frame);
  }

  if (still) {
    window.addEventListener("scroll", function () { topnav.classList.toggle("solid", window.scrollY > 24); }, { passive: true });
  } else {
    measure();
    frame();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", function () { measure(); queue(); });
    window.addEventListener("load", function () { measure(); queue(); });
    wide.addEventListener("change", function () { measure(); queue(); });
  }

  // what comes after the sheets rises in the first time it's seen
  var reveals = document.querySelectorAll(".reveal");
  if (still || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        seen.unobserve(e.target);
      });
    }, { threshold: 0.18 });
    reveals.forEach(function (el) { seen.observe(el); });
  }

  // press3D: a phone leans toward the pointer a few degrees, only while hovered
  if (!still && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".tilt").forEach(function (el) {
      var pending = 0;
      el.addEventListener("pointermove", function (e) {
        if (pending) return;
        pending = requestAnimationFrame(function () {
          pending = 0;
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = "perspective(900px) rotateY(" + (x * 10).toFixed(2) + "deg) rotateX(" + (-y * 10).toFixed(2) + "deg)";
        });
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }
})();

} else {
// the wiki: one page per #name, the sidebar and search built from the articles, copy buttons, colours for json, and the little demos
(function () {
  var pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
  var toc = document.getElementById("toc");
  var next = document.getElementById("next");
  var links = {};

  // the sidebar, grouped the way the articles say
  var group = null;
  pages.forEach(function (page) {
    if (page.dataset.group !== group) {
      group = page.dataset.group;
      var head = document.createElement("li");
      head.className = "group";
      head.textContent = group;
      toc.appendChild(head);
    }
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + page.id;
    a.innerHTML = page.dataset.title;
    li.appendChild(a);
    toc.appendChild(li);
    links[page.id] = a;
  });

  var current = null;
  var leaving = 0;

  // the old page fades up and out first, then the new one rises in at the top
  function show(id) {
    var page = document.getElementById(id) || pages[0];
    if (!page.classList.contains("page")) page = pages[0];
    Object.keys(links).forEach(function (k) { links[k].classList.toggle("on", k === page.id); });
    document.title = page.dataset.title.replace(/&amp;/g, "&").replace(/^\d+\. /, "") + " · Mochy Wiki";
    document.getElementById("side").classList.remove("open");
    document.getElementById("tocToggle").setAttribute("aria-expanded", "false");
    clearTimeout(leaving);
    var old = current;
    current = page;
    if (!old || old === page || still) {
      swap(old, page);
      return;
    }
    old.classList.add("leaving");
    leaving = setTimeout(function () { swap(old, page); }, 160);
  }

  function swap(old, page) {
    pages.forEach(function (p) { p.classList.remove("leaving"); });
    if (old && old !== page) old.classList.remove("on");
    page.classList.add("on");
    page.querySelectorAll("img[loading]").forEach(function (img) { img.loading = "eager"; });
    var i = pages.indexOf(page);
    next.innerHTML = "";
    if (i > 0) next.appendChild(step(pages[i - 1], "previous"));
    else next.appendChild(document.createElement("span"));
    if (i < pages.length - 1) next.appendChild(step(pages[i + 1], "next"));
    next.classList.remove("in");
    void next.offsetWidth;
    next.classList.add("in");
    // straight to the top, not the smooth scroll the rest of the site uses, and again after the browser's own jump to the #name
    toTop();
    requestAnimationFrame(toTop);
  }

  function toTop() { window.scrollTo({ top: 0, behavior: "instant" }); }

  function step(page, word) {
    var a = document.createElement("a");
    a.href = "#" + page.id;
    a.className = "press";
    a.innerHTML = "<small>" + word + "</small><b>" + page.dataset.title + "</b>";
    return a;
  }

  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // opening a link to a page, the browser jumps to its article once everything has loaded; the page should open at its title instead
  window.addEventListener("load", function () { if (window.scrollY < 400) toTop(); });
  window.addEventListener("hashchange", function () { show(location.hash.slice(1)); });
  show(location.hash.slice(1));

  // the hamburger on a phone opens the pages under the brand
  var burger = document.getElementById("tocToggle");
  burger.addEventListener("click", function () {
    burger.setAttribute("aria-expanded", String(document.getElementById("side").classList.toggle("open")));
  });

  // the fold button tucks the sidebar away to just the brand, and it stays that way next visit
  // the head already folded it before the first paint, so this only syncs the button
  var root = document.documentElement;
  var fold = document.getElementById("sideFold");
  function setFolded(folded) {
    root.classList.toggle("side-folded", folded);
    fold.setAttribute("aria-expanded", String(!folded));
    fold.setAttribute("aria-label", folded ? "Show the sidebar" : "Hide the sidebar");
  }
  setFolded(root.classList.contains("side-folded"));
  fold.addEventListener("click", function () {
    var folded = !root.classList.contains("side-folded");
    setFolded(folded);
    try { localStorage.setItem("wikiSideFolded", folded ? "1" : "0"); } catch (e) {}
  });
  // transitions only once the page has settled, so opening it folded doesn't play the fold
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add("ready"); }); });

  // json and code get a little colour, done once, no library
  document.querySelectorAll("pre code").forEach(function (code) {
    var text = code.textContent;
    var html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    if (code.classList.contains("json")) {
      html = html
        .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span class="k">$1</span>$2')
        .replace(/:\s*("(?:[^"\\]|\\.)*")/g, function (m, s) { return m.replace(s, '<span class="s">' + s + "</span>"); })
        .replace(/([\[,]\s*)("(?:[^"\\]|\\.)*")/g, '$1<span class="s">$2</span>')
        .replace(/\b(-?\d+(?:\.\d+)?)\b(?![^<]*<\/span>)/g, '<span class="n">$1</span>');
    } else {
      html = html.replace(/(\/\/.*|\/\*.*?\*\/)/g, '<span class="c">$1</span>');
    }
    code.innerHTML = html;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy press";
    button.textContent = "Copy";
    button.addEventListener("click", function () {
      var done = function () { button.textContent = "Copied!"; setTimeout(function () { button.textContent = "Copy"; }, 1300); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
    code.parentNode.appendChild(button);
  });

  // search: titles first, then the words inside; / jumps to it, arrows and enter pick
  var q = document.getElementById("q");
  var results = document.getElementById("results");
  var index = pages.map(function (p) { return { id: p.id, title: p.dataset.title.replace(/&amp;/g, "&"), text: p.textContent.replace(/\s+/g, " ").toLowerCase() }; });
  var picked = 0;
  function search() {
    var term = q.value.trim().toLowerCase();
    if (!term) { results.classList.remove("open"); return; }
    var hits = index.map(function (e) {
      var inTitle = e.title.toLowerCase().indexOf(term) >= 0;
      var at = e.text.indexOf(term);
      if (!inTitle && at < 0) return null;
      var snippet = at >= 0 ? "…" + e.text.slice(Math.max(0, at - 30), at + 60) + "…" : "";
      return { e: e, score: inTitle ? 0 : 1, snippet: snippet };
    }).filter(Boolean).sort(function (a, b) { return a.score - b.score; }).slice(0, 8);
    picked = 0;
    results.innerHTML = hits.length ? "" : '<a><span>nothing found for that, try another word</span></a>';
    hits.forEach(function (h, i) {
      var a = document.createElement("a");
      a.href = "#" + h.e.id;
      if (i === 0) a.className = "sel";
      a.innerHTML = "<b></b><span></span>";
      a.firstChild.textContent = h.e.title;
      a.lastChild.textContent = h.snippet;
      a.addEventListener("click", function () { results.classList.remove("open"); q.value = ""; });
      results.appendChild(a);
    });
    results.classList.add("open");
  }
  q.addEventListener("input", search);
  q.addEventListener("keydown", function (e) {
    var items = results.querySelectorAll("a[href]");
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      picked = (picked + (e.key === "ArrowDown" ? 1 : -1) + items.length) % Math.max(items.length, 1);
      items.forEach(function (a, i) { a.classList.toggle("sel", i === picked); });
    } else if (e.key === "Enter" && items[picked]) {
      location.hash = items[picked].getAttribute("href");
      results.classList.remove("open");
      q.value = "";
      q.blur();
    } else if (e.key === "Escape") {
      results.classList.remove("open");
      q.blur();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== q) { e.preventDefault(); q.focus(); }
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".search")) results.classList.remove("open"); });

  // the demos: option rows pick one, switches flip, like the app's own
  document.querySelectorAll(".demo-row[data-group]").forEach(function (row) {
    row.addEventListener("click", function (e) {
      var b = e.target.closest(".opt");
      if (!b) return;
      row.querySelectorAll(".opt").forEach(function (o) { o.classList.toggle("on", o === b); });
      if (b.dataset.bar) document.getElementById("glassBar").className = "bar " + b.dataset.bar;
    });
  });
  document.querySelectorAll(".switch").forEach(function (s) {
    s.addEventListener("click", function () { s.classList.toggle("on"); saver(); });
  });

  // what data saver does with the two switches as they're set
  function saver() {
    var box = document.getElementById("saverDemo");
    if (!box) return;
    var on = box.querySelector('[data-k="on"]').classList.contains("on");
    var mobile = box.querySelector('[data-k="mobile"]').classList.contains("on");
    var mobileRow = box.querySelector('[data-k="mobile"]').parentNode;
    mobileRow.style.opacity = on ? "1" : "0.4";
    document.getElementById("saverText").textContent = !on
      ? "off: everything plays at the quality you picked."
      : (mobile ? "on mobile data: " : "always: ") + "youtube plays its lightest stream, modules play High instead of lossless, and canvas covers and video backgrounds stay off.";
  }
  saver();
})();

}

