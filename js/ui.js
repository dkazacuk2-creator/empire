/* =====================================================================
   ПЕРЕКУП: ИМПЕРИЯ — интерфейс и главный цикл
   ===================================================================== */
(function (G) {
  'use strict';
  var UI = G.UI = { tab: 'biz', modal: null };
  function $(id) { return document.getElementById(id); }
  var fmt = function (n) { return G.fmt(n); };

  /* ---------- звук ---------- */
  var ac = null;
  function tone(f, t0, dur, type, vol) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, ac.currentTime + t0);
    g.gain.linearRampToValueAtTime(vol || 0.1, ac.currentTime + t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t0 + dur);
    o.connect(g); g.connect(ac.destination); o.start(ac.currentTime + t0); o.stop(ac.currentTime + t0 + dur + 0.02);
  }
  UI.sfx = function (k) {
    if (!G.S.sound || document.hidden || G.paused) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      if (k === 'coin') { tone(880, 0, 0.1, 'triangle', 0.06); tone(1320, 0.06, 0.15, 'triangle', 0.06); }
      else if (k === 'buy') tone(620, 0, 0.08, 'triangle', 0.08);
      else if (k === 'level') { tone(523, 0, 0.12, 'triangle'); tone(659, 0.1, 0.12, 'triangle'); tone(784, 0.2, 0.25, 'triangle'); }
      else if (k === 'big') { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, i * 0.09, 0.2, 'triangle'); }); }
      else tone(400, 0, 0.05, 'square', 0.03);
    } catch (e) {}
  };
  function audioPause(on) { try { if (ac) { if (on) ac.suspend(); else ac.resume(); } } catch (e) {} }

  /* ---------- уведомления ---------- */
  UI.toast = function (msg) {
    var d = document.createElement('div'); d.className = 'toast'; d.innerHTML = msg; $('toasts').appendChild(d);
    setTimeout(function () { d.remove(); }, 2600);
  };
  UI.adOverlay = function (on) { $('adov').classList.toggle('hidden', !on); audioPause(on); };
  function floatText(el, text) {
    if (!el) return; var r = el.getBoundingClientRect();
    var f = document.createElement('div'); f.className = 'float'; f.textContent = text;
    f.style.left = (r.left + 8) + 'px'; f.style.top = (r.top - 4) + 'px';
    document.body.appendChild(f); setTimeout(function () { f.remove(); }, 900);
  }

  /* ---------- живые эффекты ---------- */
  var lastPop = {}, lastCoin = {}, coinsLive = 0;
  function pop(id) {
    var el = $('bi-' + id), t = performance.now();
    if (!el || t - (lastPop[id] || 0) < 260) return;
    lastPop[id] = t;
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  }
  function flyCoins(id, n) {
    var from = $('bi-' + id), to = $('mcoin'), t = performance.now();
    if (!from || !to || t - (lastCoin[id] || 0) < 650 || coinsLive > 14 || !from.animate) return;
    lastCoin[id] = t;
    var a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    if (a.bottom < 0 || a.top > innerHeight) return;
    for (var i = 0; i < n; i++) (function (i) {
      var c = document.createElement('div'); c.className = 'coinfly'; c.innerHTML = G.ICON('coin');
      var x0 = a.left + a.width / 2 - 11 + (Math.random() - 0.5) * 20, y0 = a.top + a.height / 2 - 11;
      var dx = b.left + b.width / 2 - 11 - x0, dy = b.top + b.height / 2 - 11 - y0;
      c.style.left = x0 + 'px'; c.style.top = y0 + 'px';
      document.body.appendChild(c); coinsLive++;
      var mx = (Math.random() - 0.5) * 120, up = -40 - Math.random() * 50;
      var anim = c.animate([
        { transform: 'translate(0,0) scale(.6)', opacity: 0 },
        { transform: 'translate(' + (mx * 0.5) + 'px,' + up + 'px) scale(1.1)', opacity: 1, offset: 0.25 },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.7)', opacity: 0.9 }
      ], { duration: 750 + i * 90, easing: 'cubic-bezier(.5,0,.6,1)', delay: i * 70 });
      anim.onfinish = function () { c.remove(); coinsLive--; var m = $('mcoin'); m.classList.remove('bump'); void m.offsetWidth; m.classList.add('bump'); };
    })(i);
  }

  /* ---------- навигация ---------- */
  var TABS = [['biz', 'tab_biz', 'Бизнес'], ['mgr', 'tab_mgr', 'Менеджеры'], ['up', 'tab_up', 'Улучшения'], ['inv', 'tab_inv', 'Инвесторы'], ['bonus', 'tab_bonus', 'Бонусы']];
  function renderNav() {
    $('nav').innerHTML = TABS.map(function (t) {
      return '<button data-tab="' + t[0] + '" class="' + (UI.tab === t[0] ? 'on' : '') + '"><b>' + G.ICON(t[1]) + '</b>' + t[2] + '<i class="dot hidden" id="dot-' + t[0] + '"></i></button>';
    }).join('');
  }

  /* ---------- вкладка «Бизнес» ---------- */
  var BUYS = [[1, '×1'], [10, '×10'], [100, '×100'], ['next', 'До цели'], ['max', 'Макс']];
  function tileStyle(id) { var c = G.COLOR[id]; return 'style="--c1:' + c[0] + ';--c2:' + c[1] + '"'; }
  function bizHTML() {
    var h = '<div class="seg">' + BUYS.map(function (b) { return '<button data-buy="' + b[0] + '" class="' + (String(G.S.buy) === String(b[0]) ? 'on' : '') + '">' + b[1] + '</button>'; }).join('') + '</div>';
    var shownLocked = 0;
    G.BIZ.forEach(function (b) {
      var o = G.S.biz[b.id];
      if (o.n < 1) {
        if (shownLocked >= 2) return; shownLocked++;
        h += '<div class="bcard lockcard" id="c-' + b.id + '" ' + tileStyle(b.id) + '><div class="bico">' + G.ICON(b.id) + '</div><div class="bmid"><div class="bname">' + b.ru + '</div><div class="bsub">Новое направление. Доход: ' + fmt(b.rev) + ' за ' + G.fmtTime(b.t) + '</div></div>' +
          '<button class="bbuy" data-buyb="' + b.id + '" id="bb-' + b.id + '">Открыть<b id="bc-' + b.id + '"></b></button></div>';
        return;
      }
      h += '<div class="bcard" id="c-' + b.id + '" ' + tileStyle(b.id) + '><div class="bico" data-tap="' + b.id + '" id="bi-' + b.id + '" style="animation-delay:-' + (G.BIZ.indexOf(b) * 0.37).toFixed(2) + 's">' + G.ICON(b.id) + '<span class="bn" id="bn-' + b.id + '"></span><span class="mgrb ' + (o.mgr ? '' : 'hidden') + '" id="bg-' + b.id + '">' + G.ICON('tab_mgr') + '</span></div>' +
        '<div class="bmid" data-tap="' + b.id + '"><div class="bname">' + b.ru + ' <span class="ms" id="bm-' + b.id + '"></span></div>' +
        '<div class="bbar"><i id="bp-' + b.id + '"></i><span id="br-' + b.id + '"></span></div><div class="bsub" id="bs-' + b.id + '"></div></div>' +
        '<button class="bbuy" data-buyb="' + b.id + '" id="bb-' + b.id + '">Купить ×<span id="bq-' + b.id + '"></span><b id="bc-' + b.id + '"></b></button></div>';
    });
    return h;
  }
  function updateBiz(full) {
    G.BIZ.forEach(function (b) {
      var o = G.S.biz[b.id], bar = $('bp-' + b.id), bb = $('bb-' + b.id);
      if (!bb) return;
      var q = G.buyQty(b), c = G.costOf(b, q);
      if (o.n < 1) { $('bc-' + b.id).textContent = fmt(G.costOf(b, 1)); bb.disabled = G.S.money < G.costOf(b, 1); return; }
      var t = G.cycleTime(b), fast = (o.mgr && t < 0.2);
      if (bar) { bar.classList.toggle('fast', fast); if (!fast) bar.style.width = (Math.min(1, o.p) * 100) + '%'; }
      if (!full) return;
      $('bn-' + b.id).textContent = G.num(o.n);
      var ms = G.nextMilestone(o.n);
      $('bm-' + b.id).textContent = (G.rushOn(b.id) ? '🔥 ×3 · ' : '') + (ms.kind === 'speed' ? '⚡' : '💰') + ' ' + o.n + '/' + ms.at;
      $('br-' + b.id).textContent = '+' + fmt(G.revenue(b)) + (fast ? ' ×' + G.num(Math.round(1 / t)) + '/с' : '');
      $('bs-' + b.id).textContent = (o.mgr ? '' : (o.run ? '' : '👆 Нажми, чтобы продать · ')) + (o.model || b.ru) + ' · ' + (t >= 1 ? G.fmtTime(t) : t.toFixed(2).replace('.', ',') + ' с');
      $('bi-' + b.id).classList.toggle('idle', !o.mgr && !o.run);
      $('c-' + b.id).classList.toggle('rush', G.rushOn(b.id));
      $('bq-' + b.id).textContent = G.num(q);
      $('bc-' + b.id).textContent = fmt(c);
      bb.disabled = c > G.S.money;
    });
  }

  /* ---------- менеджеры, улучшения, инвесторы, бонусы ---------- */
  function mgrHTML() {
    var h = '<div class="note">Менеджер сам проводит сделки — и пока ты в игре, и пока тебя нет (до ' + G.fmtTime(G.OFFLINE_MAX) + ').</div>';
    G.BIZ.forEach(function (b) {
      var o = G.S.biz[b.id];
      if (o.n < 1 && !o.mgr) return;
      h += '<div class="card ' + (o.mgr ? 'done' : '') + '" ' + tileStyle(b.id) + '><div class="ico tile">' + G.ICON(b.id) + '</div><div class="nm">Менеджер: ' + b.ru + '</div>' +
        (o.mgr ? '<div class="btn" style="grid-row:span 2">✓ Нанят</div>' : '<button class="btn main" data-hire="' + b.id + '" id="h-' + b.id + '">' + fmt(b.mgr) + '</button>') +
        '<div class="sub">' + (o.mgr ? 'Работает без остановки' : 'Сделки идут сами') + '</div></div>';
    });
    return h;
  }
  function upHTML() {
    var h = '<div class="note">Каждое улучшение утраивает доход направления. Общие — сразу всех.</div>', n = 0;
    G.UPGRADES.forEach(function (u) {
      if (G.S.ups[u.id] || n >= 14) return;
      if (u.biz && G.S.biz[u.biz].n < 1) return;
      n++;
      var b = u.biz ? G.biz(u.biz) : null;
      h += '<div class="card" ' + (u.biz ? tileStyle(u.biz) : 'style="--c1:#6bd6ff;--c2:#2a7dff"') + '><div class="ico tile">' + G.ICON(u.biz || 'globe') + '</div><div class="nm">' + u.name + '</div>' +
        '<button class="btn main" data-up="' + u.id + '" id="u-' + u.id + '">' + fmt(u.cost) + '</button>' +
        '<div class="sub">' + (b ? b.ru : 'Все направления') + ': доход ×' + u.x + '</div></div>';
    });
    var bought = Object.keys(G.S.ups).length;
    if (!n) h += '<div class="empty">Открой новые направления, чтобы появились улучшения</div>';
    h += '<div class="note" style="text-align:center">Куплено улучшений: ' + bought + ' из ' + G.UPGRADES.length + '</div>';
    return h;
  }
  function invHTML() {
    var add = G.invNew(), tot = G.S.inv;
    return '<div class="big"><div class="bigsvg">' + G.ICON('tab_inv') + '</div><div class="muted">Твои инвесторы</div><div class="n">' + G.num(tot) + '</div><div class="good">+' + G.num(tot * G.INV_BONUS * 100) + '% к доходу</div></div>' +
      '<div class="big"><div class="muted">Готовы вложиться сейчас</div><div class="n" id="invnew">' + G.num(add) + '</div>' +
      '<div class="note">Продай империю инвестору — начнёшь заново с 400 монет, но каждый инвестор навсегда даёт +' + (G.INV_BONUS * 100) + '% ко всему доходу. Чем больше заработаешь за всё время, тем больше инвесторов.</div>' +
      '<button class="btn violet full" id="prest" ' + (add < 1 ? 'disabled' : '') + '>Продать империю<small>и получить ' + G.num(add) + ' инвест.</small></button>' +
      '<div class="note">Заработано за всё время: ' + fmt(G.S.life) + '<br>Следующий инвестор при ' + fmt(Math.pow(G.invTotal() + 1, 1 / G.INV_POW) * G.INV_DIV) + '</div></div>';
  }
  function bonusHTML() {
    var g = G.giftAmount(), ready = G.giftReady();
    return '<div class="sect">Ежедневный подарок</div><div class="card"><div class="ico tile" style="--c1:#ff6b8a;--c2:#ff3d6e">' + G.ICON('tab_bonus') + '</div><div class="nm">День ' + g.streak + ' из ' + G.GIFT_DAYS + '</div>' +
      '<button class="btn ' + (ready ? 'good' : '') + '" id="gift" ' + (ready ? '' : 'disabled') + '>' + (ready ? 'Забрать' : 'Завтра') + '</button>' +
      '<div class="sub">' + (ready ? fmt(g.amount) : 'Заходи каждый день — подарок растёт') + '</div></div>' +
      '<div class="sect">Ускорение</div><div class="card"><div class="ico tile" style="--c1:#b78bff;--c2:#6d4dff">⚡</div><div class="nm">Доход ×2 на 30 минут</div>' +
      '<button class="btn violet" id="boost2">Смотреть</button><div class="sub">Можно накопить до ' + G.fmtTime(G.BOOST_MAX) + '</div></div>' +
      '<div class="sect">Статистика</div><div class="card"><div class="ico tile" style="--c1:#4cc9ff;--c2:#3a6bff">' + G.ICON('coin') + '</div><div class="nm">Сделок: ' + G.num(G.S.stats.deals) + '</div><div></div>' +
      '<div class="sub">Продаж империи: ' + G.S.stats.prestiges + ' · Рекорд: ' + fmt(G.S.stats.best) + '</div></div>' +
      '<button class="btn red full" id="reset">Сбросить прогресс</button>';
  }

  /* ---------- общий рендер ---------- */
  function render() {
    renderNav();
    var v = $('view');
    v.innerHTML = UI.tab === 'biz' ? bizHTML() : UI.tab === 'mgr' ? mgrHTML() : UI.tab === 'up' ? upHTML() : UI.tab === 'inv' ? invHTML() : bonusHTML();
    if (UI.tab === 'biz') updateBiz(true);
    updateTop(); updateButtons();
  }
  UI.render = render;
  var shown = -1;
  function moneyText(dt) {
    var real = G.S.money;
    if (shown < 0 || real < shown || !isFinite(shown)) shown = real;
    else shown += (real - shown) * Math.min(1, dt * 7);
    if (Math.abs(real - shown) < Math.max(1, real * 1e-4)) shown = real;
    $('money').textContent = fmt(shown);
  }
  UI.moneyText = moneyText;
  function updateTop() {
    if (G.paused) return;
    var ips = G.ips();
    $('ips').innerHTML = ips > 0 ? '<b>+' + fmt(ips) + '/с</b>' : 'Найми менеджера, чтобы доход шёл сам';
    var left = (G.S.boostUntil - G.now()) / 1000;
    $('boost').innerHTML = left > 0 ? '<span class="boostchip">⚡×2 ' + G.fmtTime(left) + '</span>' : '<button class="boostbtn" id="boost1">📺 ×2 доход</button>';
  }
  function updateButtons() {
    var m = G.S.money;
    if (UI.tab === 'mgr') G.BIZ.forEach(function (b) { var e = $('h-' + b.id); if (e) e.disabled = m < b.mgr; });
    if (UI.tab === 'up') G.UPGRADES.forEach(function (u) { var e = $('u-' + u.id); if (e) e.disabled = m < u.cost; });
    // точки на вкладках
    var mgrAvail = G.BIZ.some(function (b) { var o = G.S.biz[b.id]; return o.n > 0 && !o.mgr && m >= b.mgr; });
    var upAvail = G.UPGRADES.some(function (u) { return !G.S.ups[u.id] && (!u.biz || G.S.biz[u.biz].n > 0) && m >= u.cost; });
    var d;
    if ((d = $('dot-mgr'))) d.classList.toggle('hidden', !mgrAvail);
    if ((d = $('dot-up'))) d.classList.toggle('hidden', !upAvail);
    if ((d = $('dot-bonus'))) d.classList.toggle('hidden', !G.giftReady());
    if ((d = $('dot-inv'))) d.classList.toggle('hidden', G.invNew() < Math.max(1, G.S.inv * 0.5));
  }

  /* ---------- модальные окна ---------- */
  function modal(html) { $('modal').innerHTML = '<div class="sheet">' + html + '</div>'; $('modal').classList.remove('hidden'); }
  function closeModal() { $('modal').classList.add('hidden'); $('modal').innerHTML = ''; }
  UI.showOffline = function (r) {
    modal('<div class="bigico">🌙</div><h2>Пока тебя не было</h2><div class="muted">Менеджеры работали ' + G.fmtTime(r.sec) + '</div><div class="amt">+' + fmt(r.amount) + '</div>' +
      '<button class="btn violet full" id="offx2">📺 Удвоить за рекламу</button><button class="btn full" data-close>Забрать</button>');
    UI.offAmount = r.amount;
  };

  /* ---------- обработка нажатий ---------- */
  function onClick(e) {
    var t = e.target.closest('button, [data-tap]');
    if (!t) { if (e.target.id === 'modal') closeModal(); return; }
    var d = t.dataset;
    if (d.tab) { UI.tab = d.tab; render(); $('view').scrollTop = 0; UI.sfx('click'); return; }
    if (d.buy) { G.S.buy = isNaN(+d.buy) ? d.buy : +d.buy; render(); return; }
    if (d.buyb) {
      var r = G.buy(d.buyb);
      if (r) {
        UI.sfx(r.milestone ? 'level' : 'buy');
        if (r.unlocked) { UI.toast(G.biz(d.buyb).ico + ' Открыто направление «' + G.biz(d.buyb).ru + '»!'); render(); }
        else updateBiz(true);
        if (r.milestone) UI.toast(r.milestone.kind === 'speed' ? '⚡ ' + G.biz(d.buyb).ru + ': сделки вдвое быстрее!' : '💰 ' + G.biz(d.buyb).ru + ': доход ×2!');
      }
      return;
    }
    if (d.tap) { if (G.tap(d.tap)) { UI.sfx('click'); updateBiz(true); } return; }
    if (d.hire) { if (G.hire(d.hire)) { UI.sfx('level'); UI.toast('👔 Менеджер нанят — «' + G.biz(d.hire).ru + '» работают сами'); render(); } return; }
    if (d.up) { if (G.buyUpgrade(d.up)) { UI.sfx('level'); render(); } return; }
    if (d.close !== undefined) { closeModal(); return; }
    switch (t.id) {
      case 'sndbtn': G.S.sound = !G.S.sound; t.textContent = G.S.sound ? '🔊' : '🔇'; break;
      case 'boost1': case 'boost2':
        G.Platform.rewarded(function (ok) { if (ok) { G.addBoost(); UI.sfx('big'); UI.toast('⚡ Доход ×2 ещё на 30 минут!'); G.save(true); } render(); });
        break;
      case 'gift': var a = G.claimGift(); if (a) { UI.sfx('big'); UI.toast('🎁 +' + fmt(a)); G.save(true); render(); } break;
      case 'offx2':
        G.Platform.rewarded(function (ok) { if (ok) { G.earn(UI.offAmount); UI.toast('🌙 Офлайн-доход удвоен: +' + fmt(UI.offAmount)); UI.sfx('big'); } closeModal(); });
        break;
      case 'evbtn': var got = G.claimDeal(1); if (got) { UI.sfx('coin'); UI.toast('📦 Партия перепродана: +' + fmt(got)); } $('evbtn').classList.add('hidden'); break;
      case 'prest':
        modal('<div class="bigico">💼</div><h2>Продать империю?</h2><div class="muted">Все точки, менеджеры, улучшения и деньги обнулятся.</div><div class="amt">+' + G.num(G.invNew()) + ' инвест.</div>' +
          '<div class="note">Доход станет больше на +' + G.num(G.invNew() * G.INV_BONUS * 100) + '% навсегда</div><button class="btn violet full" id="prestok">Продать</button><button class="btn full" data-close>Отмена</button>');
        break;
      case 'prestok': var n = G.prestige(); closeModal(); if (n) { UI.sfx('big'); UI.toast('💼 +' + G.num(n) + ' инвесторов! Начинаем заново — теперь быстрее'); UI.tab = 'biz'; G.save(true); render(); } break;
      case 'reset': modal('<div class="bigico">⚠️</div><h2>Сбросить всё?</h2><div class="muted">Пропадут и инвесторы. Отменить нельзя.</div><button class="btn red full" id="resetok">Да, сбросить</button><button class="btn full" data-close>Отмена</button>'); break;
      case 'resetok': G.S = G.defaultState(); G.save(true); closeModal(); UI.tab = 'biz'; render(); break;
    }
  }

  /* ---------- главный цикл ---------- */
  var last = 0, acc = 0, saveAt = 0, uiAt = 0;
  function frame(ts) {
    requestAnimationFrame(frame);
    var now = G.now();
    if (!last) last = now;
    var dt = Math.min((now - last) / 1000, 1); last = now;
    if (G.paused || document.hidden) return;
    var done = G.tick(dt);
    if (done && UI.tab === 'biz') {
      for (var id in done) {
        var b = G.biz(id), ct = G.cycleTime(b);
        if (ct > 0.4) floatText($('bp-' + id), '+' + fmt(G.revenue(b) * done[id]));
        if (!G.S.biz[id].mgr) UI.sfx('coin');
        pop(id); flyCoins(id, ct > 2 ? 3 : ct > 0.4 ? 2 : 1);
      }
    }
    moneyText(dt);
    var ev = G.events();
    if (ev === 'rush') UI.toast('🔥 Ажиотаж: «' + G.biz(G.S.ev.rushBiz).ru + '» приносят ×3 целую минуту!');
    var evb = $('evbtn'), evOn = G.S.ev.until > now;
    if (evOn) { evb.innerHTML = '📦 Оптовая партия! +' + fmt(G.S.ev.amount) + '<small>нажми, пока не ушла · ' + Math.ceil((G.S.ev.until - now) / 1000) + ' с</small>'; }
    evb.classList.toggle('hidden', !evOn);
    if (UI.tab === 'biz') updateBiz(now - uiAt > 120);
    if (now - uiAt > 120) { uiAt = now; updateTop(); updateButtons(); UI.moneyText(0); if (UI.tab === 'inv' && $('invnew')) { var nn = G.num(G.invNew()); if ($('invnew').textContent !== nn) render(); } }
    if (now - saveAt > 5000) { saveAt = now; G.save(now % 60000 < 5000); }
  }

  function start() {
    G.load();
    $('mcoin').innerHTML = G.ICON('coin');
    var off = G.offline();
    G.S.lastTs = G.now();
    renderNav(); render();
    document.addEventListener('click', onClick);
    $('sndbtn').textContent = G.S.sound ? '🔊' : '🔇';
    $('loading').remove();
    if (off && off.amount > 0) UI.showOffline(off);
    else if (G.giftReady() && G.S.stats.deals > 0) UI.toast('🎁 Тебя ждёт ежедневный подарок — вкладка «Бонусы»');
    G.Platform.ready();
    requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { G.save(true); audioPause(true); }
      else {
        audioPause(false);
        var r = G.offline(); last = 0; G.S.lastTs = G.now();
        if (r && r.amount > 0) UI.showOffline(r);
      }
    });
    window.addEventListener('pagehide', function () { G.save(true); });
  }
  G.Platform.init(start);
})(window.G = window.G || {});
