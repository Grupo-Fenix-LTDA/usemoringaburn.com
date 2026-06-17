(function () {
  "use strict";

  // Lote renova todo dia às 07:00 de Brasília (10:00 UTC) e cai 1 a cada 30 min.
  var START = 31;
  var FLOOR = 7;
  var STEP_SECONDS = 1800;
  var RESET_HOUR_UTC = 10;   // hora de Brasília + 3
  var REFRESH_MS = 5000;
  var RED_AT = 15;         
  var LABEL = "Bottles Remaining";
  var SELECTORS = ["[data-bottles-remaining]", ".bottles-remaining"];
  var FALLBACK_BEFORE = ".box-6-bottle";

  var serverOffset = 0;

  function syncTime() {
    return fetch(location.href, { method: "HEAD", cache: "no-store" })
      .then(function (r) {
        var date = r.headers.get("Date");
        if (date) serverOffset = new Date(date).getTime() - Date.now();
      })
      .catch(function () {});
  }

  function now() {
    return Date.now() + serverOffset;
  }

  function lastReset() {
    var t = now();
    var d = new Date(t);
    var reset = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), RESET_HOUR_UTC);
    return t < reset ? reset - 86400000 : reset;
  }

  function count() {
    var dropped = Math.floor((now() - lastReset()) / 1000 / STEP_SECONDS);
    return Math.max(FLOOR, START - dropped);
  }

  // Retorna TODOS os elementos encontrados (não só o primeiro).
  function getEls() {
    var els = [];
    for (var i = 0; i < SELECTORS.length; i++) {
      var found = document.querySelectorAll(SELECTORS[i]);
      for (var j = 0; j < found.length; j++) els.push(found[j]);
    }
    if (els.length) return els;

    // fallback: só injeta a barra se não achou nenhum elemento na página
    var host = document.querySelector(FALLBACK_BEFORE);
    if (!host) return els;

    var bar = document.createElement("div");
    bar.style.cssText =
      "display:flex;align-items:center;justify-content:center;gap:8px;" +
      "background:#fff4e5;border:2px solid #ff8a00;color:#a64200;" +
      "font:700 18px 'Roboto',sans-serif;padding:10px 16px;border-radius:10px;" +
      "margin:0 auto 18px;max-width:420px;box-shadow:0 2px 10px rgba(0,0,0,.06);";
    bar.innerHTML = "<span>⏳ " + LABEL + ":</span>" +
      '<span class="bottles-remaining" style="font-size:22px;">--</span>';
    host.parentNode.insertBefore(bar, host);
    return [bar.querySelector(".bottles-remaining")];
  }

  function paint(el) {
    var c = count();
    el.textContent = String(c);
    el.style.color = c <= RED_AT ? "#c0392b" : "";
  }

  function start() {
    var els = getEls();
    if (!els.length) return;
    els.forEach(paint);
    syncTime().then(function () {
      els.forEach(paint);
      setInterval(function () { els.forEach(paint); }, REFRESH_MS);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
