/* =====================================================================
   ПЕРЕКУП: ИМПЕРИЯ — слой платформы
   Пикабу Игры (PkbSDK) · Яндекс Игры (YaGames) · локальная заглушка
   SDK грузится только той площадки, где открыта игра.
   ===================================================================== */
(function (G) {
  'use strict';
  var P = G.Platform = { name: 'local', sdk: null, busy: false, lastFlush: 0 };

  function onPikabu() {
    try {
      if (/platform=pikabu/.test(location.search)) return true;
      if (/pikabu\.ru/.test(document.referrer)) return true;
      var ao = location.ancestorOrigins;
      if (ao) for (var i = 0; i < ao.length; i++) if (/pikabu\.ru/.test(ao[i])) return true;
    } catch (e) {}
    return false;
  }
  function onYandex() {
    try { return /platform=yandex/.test(location.search) || /yandex|playhop/.test(location.hostname); } catch (e) { return false; }
  }
  function load(src, ok, fail) {
    var s = document.createElement('script'); s.src = src; s.async = true; s.onload = ok; s.onerror = fail; document.head.appendChild(s);
  }

  P.init = function (cb) {
    var done = false, finish = function () { if (!done) { done = true; cb(); } };
    setTimeout(finish, 6000); // если SDK не ответил — запускаемся без него
    if (onPikabu()) {
      load('https://games.pikabu.ru/sdk/sdk.js', function () {
        if (!window.PkbSDK) return finish();
        PkbSDK.init().then(function (sdk) { P.sdk = sdk; P.name = 'pikabu'; finish(); }).catch(finish);
      }, finish);
    } else if (onYandex()) {
      load('/sdk.js', function () {
        if (!window.YaGames) return finish();
        YaGames.init().then(function (sdk) { P.sdk = sdk; P.name = 'yandex'; finish(); }).catch(finish);
      }, finish);
    } else finish();
  };

  // игра загружена и готова
  P.ready = function () {
    try {
      if (P.name === 'pikabu') P.sdk.gameStarted();
      if (P.name === 'yandex' && P.sdk.features && P.sdk.features.LoadingAPI) P.sdk.features.LoadingAPI.ready();
    } catch (e) {}
  };

  // облачные сохранения (Пикабу); на остальных площадках — только localStorage
  P.cloudGet = function (key) {
    try { if (P.name === 'pikabu') return P.sdk.storage.get(key); } catch (e) {}
    return null;
  };
  P.cloudSet = function (key, val, flush) {
    if (P.name !== 'pikabu') return;
    try {
      P.sdk.storage.set(key, val);
      var now = Date.now();
      if (flush && now - P.lastFlush > 30000) { P.lastFlush = now; P.sdk.storage.flush().catch(function () {}); }
    } catch (e) {}
  };

  // реклама за награду. onDone(true) — награду выдать
  P.rewarded = function (onDone) {
    if (P.busy) return;
    P.busy = true;
    var end = function (ok) { P.busy = false; G.UI.adOverlay(false); G.paused = false; onDone(!!ok); };
    G.paused = true; G.UI.adOverlay(true);
    try {
      if (P.name === 'pikabu') {
        P.sdk.ads.rewarded.canShow().then(function (can) {
          if (!can) { end(false); G.UI.toast('Реклама сейчас недоступна, попробуй позже'); return; }
          P.sdk.ads.rewarded.show().then(function (r) { end(r && r.reward); }).catch(function () { end(false); });
        }).catch(function () { end(false); });
        return;
      }
      if (P.name === 'yandex') {
        var got = false;
        P.sdk.adv.showRewardedVideo({ callbacks: { onRewarded: function () { got = true; }, onClose: function () { end(got); }, onError: function () { end(false); } } });
        return;
      }
    } catch (e) { end(false); return; }
    setTimeout(function () { end(true); }, 1500); // локально: «реклама» 1,5 секунды
  };
})(window.G = window.G || {});
