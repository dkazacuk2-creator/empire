/* =====================================================================
   ПЕРЕКУП: ИМПЕРИЯ — собственные векторные иконки (нарисованы кодом)
   G.ICON(id) возвращает строку <svg>. Цвета направлений — G.COLOR[id].
   ===================================================================== */
(function (G) {
  'use strict';
  G.COLOR = {
    sneakers: ['#ff7a45', '#ff3d6e'], phone: ['#4cc9ff', '#3a6bff'], tablet: ['#7cf0c8', '#1fb8a5'],
    console: ['#b78bff', '#6d4dff'], laptop: ['#9fb3ff', '#5a6cff'], camera: ['#ffd36b', '#ff9a2e'],
    pc: ['#5effa8', '#1fc46e'], tv: ['#ff8ad8', '#c04dff'], bike: ['#7ef36b', '#2ab84d'],
    watch: ['#ffe28a', '#e0a400'], moto: ['#ff6b6b', '#c41f3a'], car: ['#6bd6ff', '#2a7dff']
  };
  function g(id, a, b) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>'; }
  var S = {
    sneakers: function (c) {
      return '<defs>' + g('snA', c[0], c[1]) + '</defs>' +
        '<path d="M8 41c0-6 3-13 7-17l6 3c3 2 6 2 8 0l3-3c5 7 12 10 20 11 5 1 8 4 8 8v1H8z" fill="url(#snA)"/>' +
        '<path d="M8 42h52v6c0 2-2 4-4 4H12c-2 0-4-2-4-4z" fill="#f3f5fa"/><path d="M8 48h52" stroke="#c9d0dd" stroke-width="2"/>' +
        '<path d="M22 29l4 3M26 26l4 3M30 23l3 3" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="M34 39c6-2 12-2 18 1" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85"/>' +
        '<circle cx="13" cy="33" r="2" fill="#fff" opacity=".5"/>';
    },
    phone: function (c) {
      return '<defs>' + g('phA', c[0], c[1]) + '</defs>' +
        '<rect x="17" y="5" width="30" height="54" rx="7" fill="#1b2130"/><rect x="20" y="9" width="24" height="44" rx="4" fill="url(#phA)"/>' +
        '<rect x="28" y="10.5" width="8" height="2.5" rx="1.25" fill="#1b2130"/>' +
        '<g fill="#fff" opacity=".9"><rect x="23" y="17" width="5" height="5" rx="1.5"/><rect x="29.5" y="17" width="5" height="5" rx="1.5"/><rect x="36" y="17" width="5" height="5" rx="1.5"/>' +
        '<rect x="23" y="24" width="5" height="5" rx="1.5"/><rect x="29.5" y="24" width="5" height="5" rx="1.5"/><rect x="36" y="24" width="5" height="5" rx="1.5" opacity=".6"/></g>' +
        '<path d="M20 40l24-14v6L20 46z" fill="#fff" opacity=".15"/><rect x="27" y="49" width="10" height="2" rx="1" fill="#fff" opacity=".7"/>';
    },
    tablet: function (c) {
      return '<defs>' + g('tbA', c[0], c[1]) + '</defs>' +
        '<rect x="7" y="11" width="50" height="40" rx="6" fill="#1b2130"/><rect x="11" y="15" width="42" height="32" rx="3" fill="url(#tbA)"/>' +
        '<path d="M15 41l8-8 6 4 10-12 9 7" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="39" cy="25" r="2.6" fill="#fff"/><path d="M11 36L53 18v6L11 42z" fill="#fff" opacity=".12"/><circle cx="55" cy="31" r="1.2" fill="#556"/>';
    },
    console: function (c) {
      return '<defs>' + g('csA', c[0], c[1]) + '</defs>' +
        '<path d="M14 20h36c7 0 10 6 11 14l1 9c1 6-5 9-9 5l-6-6H17l-6 6c-4 4-10 1-9-5l1-9c1-8 4-14 11-14z" fill="url(#csA)"/>' +
        '<path d="M14 20h36c4 0 7 2 9 6H5c2-4 5-6 9-6z" fill="#fff" opacity=".18"/>' +
        '<path d="M16 28h4v4h4v4h-4v4h-4v-4h-4v-4h4z" fill="#1b2130"/>' +
        '<circle cx="45" cy="29" r="2.6" fill="#ffd36b"/><circle cx="51" cy="33" r="2.6" fill="#ff6b6b"/><circle cx="45" cy="37" r="2.6" fill="#5effa8"/><circle cx="39" cy="33" r="2.6" fill="#4cc9ff"/>' +
        '<circle cx="27" cy="38" r="3" fill="#1b2130" opacity=".6"/><circle cx="37" cy="38" r="3" fill="#1b2130" opacity=".6"/>';
    },
    laptop: function (c) {
      return '<defs>' + g('lpA', c[0], c[1]) + '</defs>' +
        '<rect x="12" y="12" width="40" height="28" rx="3.5" fill="#1b2130"/><rect x="15" y="15" width="34" height="22" rx="2" fill="url(#lpA)"/>' +
        '<path d="M19 21h12M19 25h18M19 29h9" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".9"/>' +
        '<path d="M15 33l34-14v5L15 37z" fill="#fff" opacity=".12"/>' +
        '<path d="M5 42h54l-3 6c-1 1-2 2-4 2H12c-2 0-3-1-4-2z" fill="#c9d0dd"/><path d="M27 42h10l-1 2h-8z" fill="#8b95a7"/>';
    },
    camera: function (c) {
      return '<defs>' + g('cmA', c[0], c[1]) + '</defs>' +
        '<path d="M22 16l3-5h14l3 5h12c3 0 5 2 5 5v24c0 3-2 5-5 5H10c-3 0-5-2-5-5V21c0-3 2-5 5-5z" fill="#2a3142"/>' +
        '<rect x="5" y="22" width="54" height="5" fill="url(#cmA)"/>' +
        '<circle cx="32" cy="34" r="12" fill="#1b2130"/><circle cx="32" cy="34" r="9" fill="url(#cmA)"/><circle cx="32" cy="34" r="5" fill="#1b2130"/>' +
        '<circle cx="29" cy="31" r="2" fill="#fff" opacity=".8"/><rect x="48" y="18" width="6" height="3" rx="1" fill="#ffd36b"/>';
    },
    pc: function (c) {
      return '<defs>' + g('pcA', c[0], c[1]) + '</defs>' +
        '<rect x="4" y="12" width="36" height="26" rx="3" fill="#1b2130"/><rect x="7" y="15" width="30" height="20" rx="1.5" fill="url(#pcA)"/>' +
        '<path d="M18 38h8l2 8H16z" fill="#2a3142"/><rect x="12" y="46" width="20" height="3" rx="1.5" fill="#2a3142"/>' +
        '<path d="M7 30l30-12v4L7 34z" fill="#fff" opacity=".13"/>' +
        '<rect x="43" y="10" width="17" height="40" rx="3" fill="#2a3142"/><rect x="46" y="14" width="11" height="2" rx="1" fill="url(#pcA)"/>' +
        '<circle cx="51.5" cy="26" r="4.5" fill="none" stroke="url(#pcA)" stroke-width="2"/><circle cx="51.5" cy="38" r="4.5" fill="none" stroke="url(#pcA)" stroke-width="2"/>';
    },
    tv: function (c) {
      return '<defs>' + g('tvA', c[0], c[1]) + '</defs>' +
        '<rect x="4" y="10" width="56" height="36" rx="4" fill="#1b2130"/><rect x="7" y="13" width="50" height="30" rx="2" fill="url(#tvA)"/>' +
        '<path d="M7 36l12-10 9 7 10-12 19 15v7H7z" fill="#fff" opacity=".25"/><circle cx="46" cy="20" r="3.5" fill="#fff" opacity=".8"/>' +
        '<path d="M24 46h16l3 7H21z" fill="#2a3142"/><rect x="18" y="52" width="28" height="3" rx="1.5" fill="#2a3142"/>';
    },
    bike: function (c) {
      return '<defs>' + g('bkA', c[0], c[1]) + '</defs>' +
        '<circle cx="15" cy="40" r="11" fill="none" stroke="#2a3142" stroke-width="4"/><circle cx="49" cy="40" r="11" fill="none" stroke="#2a3142" stroke-width="4"/>' +
        '<circle cx="15" cy="40" r="11" fill="none" stroke="#8b95a7" stroke-width="1" opacity=".6"/><circle cx="49" cy="40" r="11" fill="none" stroke="#8b95a7" stroke-width="1" opacity=".6"/>' +
        '<path d="M15 40l10-17h17l7 17M25 23l7 17h-17M32 40l10-17" stroke="url(#bkA)" stroke-width="3.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<path d="M21 19h9" stroke="#1b2130" stroke-width="4" stroke-linecap="round"/><path d="M42 23l-2-6h6" stroke="#1b2130" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<circle cx="32" cy="40" r="3" fill="#1b2130"/>';
    },
    watch: function (c) {
      return '<defs>' + g('wtA', c[0], c[1]) + '</defs>' +
        '<rect x="23" y="3" width="18" height="16" rx="3" fill="#2a3142"/><rect x="23" y="45" width="18" height="16" rx="3" fill="#2a3142"/>' +
        '<circle cx="32" cy="32" r="17" fill="url(#wtA)"/><circle cx="32" cy="32" r="13" fill="#1b2130"/>' +
        '<g stroke="#fff" stroke-linecap="round"><path d="M32 22v2M32 40v2M22 32h2M40 32h2" stroke-width="2" opacity=".7"/><path d="M32 32V25" stroke-width="2.4"/><path d="M32 32l6 3" stroke-width="2.4"/></g>' +
        '<circle cx="32" cy="32" r="1.8" fill="url(#wtA)"/><rect x="48" y="29" width="4" height="6" rx="1.5" fill="url(#wtA)"/><path d="M22 21a15 15 0 0 1 12-4" stroke="#fff" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>';
    },
    moto: function (c) {
      return '<defs>' + g('mtA', c[0], c[1]) + '</defs>' +
        '<circle cx="14" cy="42" r="10" fill="#1b2130"/><circle cx="50" cy="42" r="10" fill="#1b2130"/><circle cx="14" cy="42" r="4" fill="#8b95a7"/><circle cx="50" cy="42" r="4" fill="#8b95a7"/>' +
        '<path d="M14 42l12-14h14l10 14" stroke="#2a3142" stroke-width="4" fill="none" stroke-linejoin="round"/>' +
        '<path d="M22 30c4-7 12-9 20-9l8 2 6 9c-6 1-11 1-16-1l-6 4z" fill="url(#mtA)"/><path d="M27 25c4-2 9-3 14-3l-2 4c-4 0-8 0-12 1z" fill="#fff" opacity=".35"/>' +
        '<path d="M42 21l4-6h5" stroke="#2a3142" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="24" y="33" width="12" height="6" rx="2" fill="#2a3142"/>';
    },
    car: function (c) {
      return '<defs>' + g('crA', c[0], c[1]) + '</defs>' +
        '<path d="M6 40c0-5 2-8 6-9l7-1 7-9c2-2 4-3 7-3h10c3 0 5 1 7 3l7 9c3 1 5 4 5 8v5H6z" fill="url(#crA)"/>' +
        '<path d="M22 30l6-8c1-1 2-1 3-1h6v9zM40 21h4c1 0 2 0 3 1l6 8H40z" fill="#1b2130" opacity=".75"/>' +
        '<path d="M8 36h50" stroke="#fff" stroke-width="2" opacity=".35"/><rect x="54" y="33" width="5" height="3" rx="1.5" fill="#ffe28a"/><rect x="6" y="34" width="4" height="3" rx="1.5" fill="#ff6b6b"/>' +
        '<circle cx="18" cy="44" r="7" fill="#1b2130"/><circle cx="48" cy="44" r="7" fill="#1b2130"/><circle cx="18" cy="44" r="3" fill="#c9d0dd"/><circle cx="48" cy="44" r="3" fill="#c9d0dd"/>';
    },
    // вкладки и прочее
    tab_biz: function () {
      return '<path d="M8 26h48v30H8z" fill="#2a3142"/><path d="M6 12h52l4 14H2z" fill="#ffb020"/><path d="M6 12h13l-4 14H2zM32 12h13l3 14H32zM19 12h13v14H16z" fill="#fff" opacity=".25"/>' +
        '<path d="M2 26c0 4 3 6 7 6s6-2 6-6c0 4 3 6 7 6s7-2 7-6c0 4 3 6 7 6s6-2 6-6c0 4 3 6 7 6s7-2 7-6" fill="#ffb020"/><rect x="14" y="38" width="14" height="18" rx="2" fill="#4cc9ff"/><rect x="34" y="38" width="16" height="11" rx="2" fill="#7cf0c8"/>';
    },
    tab_mgr: function () {
      return '<circle cx="32" cy="20" r="11" fill="#ffd0a8"/><path d="M21 17c1-7 6-10 11-10s10 3 11 10c-3-2-7-3-11-3s-8 1-11 3z" fill="#5a3b2a"/>' +
        '<path d="M10 58c0-13 9-21 22-21s22 8 22 21z" fill="#3a6bff"/><path d="M26 37h12l-6 8z" fill="#fff"/><path d="M32 42l-3 4 3 12 3-12z" fill="#ff3d6e"/>';
    },
    tab_up: function () {
      return '<circle cx="32" cy="32" r="26" fill="#3ecf8e"/><path d="M32 15l15 17h-9v15H26V32h-9z" fill="#fff"/><circle cx="32" cy="32" r="26" fill="none" stroke="#fff" stroke-width="3" opacity=".25"/>';
    },
    tab_inv: function () {
      return '<rect x="6" y="20" width="52" height="34" rx="6" fill="#8a5a2e"/><path d="M24 20v-5c0-2 2-4 4-4h8c2 0 4 2 4 4v5" stroke="#5a3b1e" stroke-width="4" fill="none"/>' +
        '<path d="M6 32h52v4H6z" fill="#5a3b1e"/><rect x="28" y="30" width="8" height="8" rx="2" fill="#ffd36b"/><path d="M6 26c0-3 3-6 6-6h40c3 0 6 3 6 6v2H6z" fill="#fff" opacity=".12"/>';
    },
    tab_bonus: function () {
      return '<rect x="8" y="26" width="48" height="30" rx="4" fill="#ff3d6e"/><rect x="5" y="18" width="54" height="11" rx="3" fill="#ff6b8a"/><rect x="28" y="18" width="8" height="38" fill="#ffd36b"/>' +
        '<path d="M32 18c-4-9-14-12-15-6s8 6 15 6zM32 18c4-9 14-12 15-6s-8 6-15 6z" fill="#ffd36b"/>';
    },
    coin: function () {
      return '<circle cx="32" cy="32" r="26" fill="#e0a400"/><circle cx="32" cy="30" r="24" fill="#ffd36b"/><circle cx="32" cy="30" r="17" fill="none" stroke="#e0a400" stroke-width="3"/>' +
        '<path d="M27 21h8a5 5 0 0 1 0 10h-8M27 21v18M24 35h11" stroke="#b07a00" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
    },
    globe: function () {
      return '<circle cx="32" cy="32" r="25" fill="#2a7dff"/><path d="M14 20c6 2 8 8 6 13s3 9 1 15c-6-4-10-10-10-16 0-5 1-9 3-12zM38 9c-2 5 2 9 7 9s6 6 3 10 0 10 5 11c2-3 3-7 3-11 0-9-7-17-18-19zM30 44c4-2 8 1 8 5s-3 6-5 7c-4-2-6-8-3-12z" fill="#5effa8"/><circle cx="32" cy="32" r="25" fill="none" stroke="#fff" stroke-width="2" opacity=".3"/>';
    }
  };
  G.ICON = function (id, cls) {
    var f = S[id]; if (!f) return '';
    return '<svg class="svgi ' + (cls || '') + '" viewBox="0 0 64 64" aria-hidden="true">' + f(G.COLOR[id] || ['#fff', '#aaa']) + '</svg>';
  };
})(window.G = window.G || {});
