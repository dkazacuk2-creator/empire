/* =====================================================================
   ПЕРЕКУП: ИМПЕРИЯ — состояние, логика, сохранение
   ===================================================================== */
(function (G) {
  'use strict';
  var KEY = 'empire_save_v1';
  G.now = function () { return Date.now(); };

  /* ---------- числа ---------- */
  var SUF = ['млн', 'млрд', 'трлн', 'квадрлн', 'квинтлн', 'секстлн', 'септлн', 'октлн', 'нонлн', 'децлн'];
  G.num = function (n) {
    if (!isFinite(n)) return '∞';
    if (n < 0) return '−' + G.num(-n);
    if (n < 1e6) return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    var e = Math.floor(Math.log10(n) / 3) - 2;
    if (e >= SUF.length) return n.toExponential(2).replace('.', ',').replace('e+', 'e');
    var v = n / Math.pow(1000, e + 2);
    return (v >= 100 ? v.toFixed(1) : v.toFixed(2)).replace('.', ',') + ' ' + SUF[e];
  };
  G.fmt = function (n) { return G.num(n) + ' мон.'; };   // монеты — выдуманная валюта игры
  G.fmtTime = function (s) {
    s = Math.max(0, Math.round(s));
    if (s < 60) return s + ' с';
    if (s < 3600) return Math.floor(s / 60) + ' мин ' + (s % 60 ? (s % 60) + ' с' : '');
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h + ' ч' + (m ? ' ' + m + ' мин' : '');
  };

  /* ---------- состояние ---------- */
  G.defaultState = function () {
    var b = {};
    G.BIZ.forEach(function (x) { b[x.id] = { n: 0, mgr: false, p: 0, run: false, model: '' }; });
    b.sneakers.n = 1;
    return {
      v: 1, money: G.START_MONEY, run: 0, life: 0, inv: 0, biz: b, ups: {},
      boostUntil: 0, lastTs: 0, sound: true, buy: 1,
      gift: { day: -10, streak: 0 },
      ev: { next: 0, until: 0, amount: 0, rushNext: 0, rushBiz: '', rushUntil: 0 },
      stats: { deals: 0, prestiges: 0, best: 0 }
    };
  };
  function fix(s) {
    var d = G.defaultState();
    for (var k in d) if (s[k] === undefined || s[k] === null || typeof s[k] !== typeof d[k]) s[k] = d[k];
    G.BIZ.forEach(function (x) {
      var o = s.biz[x.id];
      if (!o || typeof o.n !== 'number' || !isFinite(o.n)) s.biz[x.id] = d.biz[x.id];
      else { o.p = isFinite(o.p) ? o.p : 0; o.mgr = !!o.mgr; o.run = !!o.run; }
    });
    ['money', 'run', 'life', 'inv', 'boostUntil', 'lastTs'].forEach(function (f) { if (!isFinite(s[f])) s[f] = d[f]; });
    for (var e in d.ev) if (typeof s.ev[e] !== typeof d.ev[e]) s.ev[e] = d.ev[e];
    for (var t in d.stats) if (typeof s.stats[t] !== 'number') s.stats[t] = 0;
    return s;
  }
  G.load = function () {
    var loc = null, cloud = null;
    try { loc = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    try { cloud = G.Platform.cloudGet('save'); } catch (e) {}
    var pick = loc;
    if (cloud && cloud.v && (!loc || (cloud.life || 0) > (loc.life || 0))) pick = cloud;
    G.S = fix(pick && pick.v ? pick : G.defaultState());
  };
  G.save = function (flush) {
    G.S.lastTs = G.now();
    try { localStorage.setItem(KEY, JSON.stringify(G.S)); } catch (e) {}
    G.Platform.cloudSet('save', G.S, flush);
  };

  /* ---------- формулы ---------- */
  G.biz = function (id) { for (var i = 0; i < G.BIZ.length; i++) if (G.BIZ[i].id === id) return G.BIZ[i]; return null; };
  G.speedLevel = function (n) { var l = 0; for (var i = 0; i < G.SPEED_MS.length; i++) if (n >= G.SPEED_MS[i]) l++; return l; };
  G.nextMilestone = function (n) {
    for (var i = 0; i < G.SPEED_MS.length; i++) if (n < G.SPEED_MS[i]) return { at: G.SPEED_MS[i], kind: 'speed' };
    var at = G.PROFIT_MS_FROM; while (n >= at) at += G.PROFIT_MS_STEP;
    return { at: at, kind: 'profit' };
  };
  G.cycleTime = function (b) { return b.t / Math.pow(2, G.speedLevel(G.S.biz[b.id].n)); };
  G.invBonus = function () { return 1 + G.S.inv * G.INV_BONUS; };
  G.boosted = function () { return G.S.boostUntil > G.now(); };
  G.rushOn = function (id) { return G.S.ev.rushBiz === id && G.S.ev.rushUntil > G.now(); };
  G.mult = function (b, noTemp) {
    var s = G.S, n = s.biz[b.id].n, m = G.invBonus();
    G.UPGRADES.forEach(function (u) { if (s.ups[u.id] && (u.biz === b.id || u.biz === null)) m *= u.x; });
    if (n >= G.PROFIT_MS_FROM) m *= Math.pow(2, 1 + Math.floor((n - G.PROFIT_MS_FROM) / G.PROFIT_MS_STEP));
    if (!noTemp) { if (G.boosted()) m *= 2; if (G.rushOn(b.id)) m *= 3; }
    return m;
  };
  G.revenue = function (b, noTemp) { return b.rev * G.S.biz[b.id].n * G.mult(b, noTemp); };
  // доход в секунду от направлений с менеджером
  G.ips = function (noTemp) {
    var sum = 0;
    G.BIZ.forEach(function (b) { var o = G.S.biz[b.id]; if (o.n > 0 && o.mgr) sum += G.revenue(b, noTemp) / G.cycleTime(b); });
    return sum;
  };
  // цена покупки q точек
  G.costOf = function (b, q) {
    var n = G.S.biz[b.id].n;
    return b.cost * Math.pow(b.k, n) * (Math.pow(b.k, q) - 1) / (b.k - 1);
  };
  G.maxBuy = function (b) {
    var n = G.S.biz[b.id].n, c0 = b.cost * Math.pow(b.k, n);
    var q = Math.floor(Math.log(G.S.money * (b.k - 1) / c0 + 1) / Math.log(b.k));
    return Math.max(0, q);
  };
  G.buyQty = function (b) {
    var m = G.S.buy;
    if (G.S.biz[b.id].n < 1) return 1; // новое направление всегда открывается одной точкой
    if (m === 'max') return Math.max(1, G.maxBuy(b));
    if (m === 'next') { var o = G.S.biz[b.id]; return Math.max(1, G.nextMilestone(o.n).at - o.n); }
    return m;
  };

  /* ---------- действия ---------- */
  function earn(x) { var s = G.S; s.money += x; s.run += x; s.life += x; }
  G.earn = earn;
  function pickModel(id) {
    var list = G.CATALOG && G.CATALOG[id]; if (!list || !list.length) return '';
    var m = list[Math.floor(Math.random() * list.length)]; return m[0] + ' ' + m[1];
  }
  G.buy = function (id) {
    var b = G.biz(id), q = G.buyQty(b), c = G.costOf(b, q);
    if (q < 1 || c > G.S.money + 1e-6) return false;
    var o = G.S.biz[id], before = G.nextMilestone(o.n);
    G.S.money -= c; o.n += q;
    if (!o.model) o.model = pickModel(id);
    var after = G.nextMilestone(o.n);
    return { unlocked: o.n === q, milestone: after.at !== before.at ? before : null };
  };
  G.tap = function (id) {
    var o = G.S.biz[id];
    if (o.n < 1 || o.mgr || o.run) return false;
    o.run = true; return true;
  };
  G.hire = function (id) {
    var b = G.biz(id), o = G.S.biz[id];
    if (o.mgr || o.n < 1 || G.S.money < b.mgr) return false;
    G.S.money -= b.mgr; o.mgr = true; return true;
  };
  G.buyUpgrade = function (uid) {
    var u = null; G.UPGRADES.forEach(function (x) { if (x.id === uid) u = x; });
    if (!u || G.S.ups[uid] || G.S.money < u.cost) return false;
    G.S.money -= u.cost; G.S.ups[uid] = true; return true;
  };

  // ход времени. dt — секунды. Возвращает {id: число сделок} для анимаций
  G.tick = function (dt) {
    var s = G.S, done = null;
    G.BIZ.forEach(function (b) {
      var o = s.biz[b.id];
      if (o.n < 1 || !(o.mgr || o.run)) return;
      var t = G.cycleTime(b);
      o.p += dt / t;
      if (o.p >= 1) {
        var cycles = o.mgr ? Math.floor(o.p) : 1;
        earn(G.revenue(b) * cycles);
        s.stats.deals += cycles;
        o.p = o.mgr ? o.p - cycles : 0;
        if (!o.mgr) o.run = false;
        if (t > 0.25 || Math.random() < 0.05) o.model = pickModel(b.id);
        (done = done || {})[b.id] = cycles;
      }
    });
    if (s.money > s.stats.best) s.stats.best = s.money;
    return done;
  };

  /* ---------- офлайн ---------- */
  G.offline = function () {
    var s = G.S; if (!s.lastTs) return 0;
    var dt = Math.min((G.now() - s.lastTs) / 1000, G.OFFLINE_MAX);
    if (dt < 30) return 0;
    var got = G.ips(true) * dt;
    if (got > 0) earn(got);
    return { amount: got, sec: dt };
  };

  /* ---------- буст, события, подарок ---------- */
  G.addBoost = function () {
    var s = G.S, now = G.now();
    s.boostUntil = Math.min(Math.max(now, s.boostUntil) + G.BOOST_STEP * 1000, now + G.BOOST_MAX * 1000);
  };
  function rnd(a) { return (a[0] + Math.random() * (a[1] - a[0])) * 1000; }
  G.events = function () {
    var e = G.S.ev, now = G.now(), out = null;
    if (!e.next) e.next = now + rnd(G.EVENT_EVERY);
    if (!e.rushNext) e.rushNext = now + rnd(G.RUSH_EVERY);
    if (now >= e.next && e.until < now) {
      e.until = now + G.EVENT_LIFE * 1000;
      e.amount = Math.max(5000, G.ips(true) * 60, G.revenue(G.BIZ[0], true) * 30);
      e.next = now + rnd(G.EVENT_EVERY);
      out = 'deal';
    }
    if (now >= e.rushNext) {
      var owned = G.BIZ.filter(function (b) { return G.S.biz[b.id].n > 0; });
      var b = owned[Math.floor(Math.random() * owned.length)];
      e.rushBiz = b.id; e.rushUntil = now + G.RUSH_TIME * 1000; e.rushNext = now + rnd(G.RUSH_EVERY);
      out = 'rush';
    }
    return out;
  };
  G.claimDeal = function (x) {
    var e = G.S.ev; if (e.until < G.now()) return 0;
    var a = e.amount * (x || 1); earn(a); e.until = 0; return a;
  };
  G.today = function () { var d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); };
  G.giftReady = function () { return G.S.gift.day !== G.today(); };
  G.giftAmount = function () {
    var g = G.S.gift, streak = g.day === G.today() - 1 ? g.streak + 1 : 1;
    streak = Math.min(streak, G.GIFT_DAYS);
    return { streak: streak, amount: Math.max(2000, G.ips(true) * 600, G.revenue(G.BIZ[0], true) * 120) * streak };
  };
  G.claimGift = function () {
    if (!G.giftReady()) return 0;
    var r = G.giftAmount(); earn(r.amount); G.S.gift = { day: G.today(), streak: r.streak }; return r.amount;
  };

  /* ---------- инвесторы (перерождение) ---------- */
  G.invTotal = function () { return Math.floor(Math.pow(G.S.life / G.INV_DIV, G.INV_POW)); };
  G.invNew = function () { return Math.max(0, G.invTotal() - G.S.inv); };
  G.prestige = function () {
    var add = G.invNew(); if (add < 1) return false;
    var s = G.S, d = G.defaultState();
    s.inv += add; s.money = d.money; s.run = 0; s.biz = d.biz; s.ups = {};
    s.stats.prestiges++;
    return add;
  };
})(window.G = window.G || {});
