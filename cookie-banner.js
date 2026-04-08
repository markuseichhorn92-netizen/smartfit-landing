/**
 * DSGVO-konformes Cookie-Banner für Smartfit Coaching
 * - Annehmen, Ablehnen, Details einsehen
 * - Speichert Einwilligung in localStorage
 * - Blockiert externe Ressourcen bis Einwilligung erteilt
 */
(function () {
  'use strict';

  // ── Cookie-Kategorien ──────────────────────────────────────────────
  var CATEGORIES = [
    {
      id: 'essential',
      label: 'Essentiell',
      description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich (z.\u00a0B. Speicherung Ihrer Cookie-Einstellungen). Sie können nicht deaktiviert werden.',
      required: true,
      cookies: ['cookie_consent – Speichert Ihre Cookie-Einstellungen (1 Jahr)']
    },
    {
      id: 'functional',
      label: 'Funktional',
      description: 'Ermöglichen erweiterte Funktionen wie das Laden externer Schriftarten (Google Fonts) und Animationsbibliotheken.',
      required: false,
      cookies: [
        'Google Fonts – Lädt Schriftarten von Google-Servern (fonts.googleapis.com)',
        'AOS Library – Animations-Bibliothek von unpkg.com'
      ]
    },
    {
      id: 'analytics',
      label: 'Statistik & Analyse',
      description: 'Helfen uns zu verstehen, wie Besucher die Website nutzen. Alle Daten werden anonymisiert erfasst.',
      required: false,
      cookies: ['Derzeit keine Analyse-Cookies aktiv']
    },
    {
      id: 'marketing',
      label: 'Marketing',
      description: 'Werden verwendet, um Besuchern relevante Werbung anzuzeigen und die Wirksamkeit von Kampagnen zu messen.',
      required: false,
      cookies: ['Derzeit keine Marketing-Cookies aktiv']
    }
  ];

  var STORAGE_KEY = 'cookie_consent';
  var CONSENT_VERSION = 1;

  // ── Hilfsfunktionen ────────────────────────────────────────────────
  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data.version !== CONSENT_VERSION) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(choices) {
    var data = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      categories: choices
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function isConsentGiven() {
    return getConsent() !== null;
  }

  function isCategoryAllowed(catId) {
    var consent = getConsent();
    if (!consent) return false;
    return consent.categories[catId] === true;
  }

  // ── Banner HTML ────────────────────────────────────────────────────
  function buildBanner() {
    var overlay = document.createElement('div');
    overlay.id = 'cookie-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Cookie-Einstellungen');

    var detailRows = '';
    CATEGORIES.forEach(function (cat) {
      var cookieList = '';
      cat.cookies.forEach(function (c) {
        cookieList += '<li>' + c + '</li>';
      });
      detailRows += ''
        + '<div class="cb-category">'
        + '  <div class="cb-category-header">'
        + '    <label class="cb-switch-label">'
        + '      <input type="checkbox" id="cb-cat-' + cat.id + '" '
        +           (cat.required ? 'checked disabled' : '')
        + '        class="cb-checkbox" data-cat="' + cat.id + '">'
        + '      <span class="cb-switch"></span>'
        + '      <span class="cb-cat-name">' + cat.label
        +           (cat.required ? ' <span class="cb-required">(immer aktiv)</span>' : '')
        + '      </span>'
        + '    </label>'
        + '    <button class="cb-toggle-detail" aria-expanded="false" data-target="cb-detail-' + cat.id + '">'
        + '      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        + '    </button>'
        + '  </div>'
        + '  <div id="cb-detail-' + cat.id + '" class="cb-detail" hidden>'
        + '    <p>' + cat.description + '</p>'
        + '    <ul>' + cookieList + '</ul>'
        + '  </div>'
        + '</div>';
    });

    overlay.innerHTML = ''
      + '<div class="cb-banner">'
      + '  <div class="cb-content">'
      + '    <h2 class="cb-title">Cookie-Einstellungen</h2>'
      + '    <p class="cb-text">Wir nutzen Cookies und ähnliche Technologien, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. '
      + '    Sie können selbst entscheiden, welche Kategorien Sie zulassen möchten. Weitere Informationen finden Sie in unserer '
      + '    <a href="/datenschutz.html" class="cb-link">Datenschutzerklärung</a>.</p>'
      + '    <div id="cb-details" class="cb-details" hidden>'
      +        detailRows
      + '    </div>'
      + '    <div class="cb-actions">'
      + '      <button id="cb-reject" class="cb-btn cb-btn-secondary">Nur Essentiell</button>'
      + '      <button id="cb-show-details" class="cb-btn cb-btn-tertiary">Einstellungen</button>'
      + '      <button id="cb-save" class="cb-btn cb-btn-secondary" hidden>Auswahl speichern</button>'
      + '      <button id="cb-accept" class="cb-btn cb-btn-primary">Alle akzeptieren</button>'
      + '    </div>'
      + '  </div>'
      + '</div>';

    return overlay;
  }

  // ── Styles ─────────────────────────────────────────────────────────
  function injectStyles() {
    var css = ''
      + '#cookie-overlay {'
      + '  position:fixed;inset:0;z-index:99999;'
      + '  display:flex;align-items:flex-end;justify-content:center;'
      + '  background:rgba(0,0,0,.6);backdrop-filter:blur(4px);'
      + '  padding:0 16px 16px;'
      + '  font-family:"Inter",system-ui,sans-serif;'
      + '  animation:cbFadeIn .3s ease;'
      + '}'
      + '@keyframes cbFadeIn{from{opacity:0}to{opacity:1}}'
      + '.cb-banner{'
      + '  width:100%;max-width:720px;'
      + '  background:#111;border:1px solid rgba(255,255,255,.1);'
      + '  border-radius:16px;padding:24px;'
      + '  box-shadow:0 -4px 30px rgba(0,0,0,.5);'
      + '  max-height:90vh;overflow-y:auto;'
      + '}'
      + '.cb-title{font-size:1.15rem;font-weight:700;color:#fff;margin:0 0 8px}'
      + '.cb-text{font-size:.875rem;color:#aaa;line-height:1.6;margin:0 0 16px}'
      + '.cb-link{color:#238B53;text-decoration:underline}'
      + '.cb-link:hover{color:#2ea866}'
      /* Actions */
      + '.cb-actions{display:flex;flex-wrap:wrap;gap:8px}'
      + '.cb-btn{'
      + '  padding:10px 20px;border-radius:8px;font-size:.875rem;font-weight:600;'
      + '  cursor:pointer;border:none;transition:all .2s;white-space:nowrap;'
      + '}'
      + '.cb-btn-primary{background:linear-gradient(135deg,#238B53,#1d7346);color:#fff}'
      + '.cb-btn-primary:hover{filter:brightness(1.15)}'
      + '.cb-btn-secondary{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.15)}'
      + '.cb-btn-secondary:hover{background:rgba(255,255,255,.14)}'
      + '.cb-btn-tertiary{background:transparent;color:#238B53;border:1px solid #238B53}'
      + '.cb-btn-tertiary:hover{background:rgba(35,139,83,.1)}'
      /* Details */
      + '.cb-details{margin:0 0 16px;display:flex;flex-direction:column;gap:8px}'
      + '.cb-category{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px 14px}'
      + '.cb-category-header{display:flex;align-items:center;justify-content:space-between}'
      + '.cb-cat-name{color:#fff;font-size:.875rem;font-weight:500}'
      + '.cb-required{color:#666;font-weight:400;font-size:.75rem}'
      + '.cb-toggle-detail{background:none;border:none;color:#888;cursor:pointer;padding:4px;transition:transform .2s}'
      + '.cb-toggle-detail[aria-expanded="true"]{transform:rotate(180deg)}'
      + '.cb-detail{padding:8px 0 0;font-size:.8rem;color:#999;line-height:1.5}'
      + '.cb-detail p{margin:0 0 6px}'
      + '.cb-detail ul{margin:4px 0 0;padding-left:18px;list-style:disc}'
      + '.cb-detail li{margin:2px 0}'
      /* Toggle switch */
      + '.cb-switch-label{display:flex;align-items:center;gap:10px;cursor:pointer}'
      + '.cb-checkbox{position:absolute;opacity:0;width:0;height:0}'
      + '.cb-switch{'
      + '  width:38px;height:22px;background:#333;border-radius:11px;'
      + '  position:relative;flex-shrink:0;transition:background .2s;'
      + '}'
      + '.cb-switch::after{'
      + '  content:"";position:absolute;top:3px;left:3px;'
      + '  width:16px;height:16px;background:#888;border-radius:50%;transition:all .2s;'
      + '}'
      + '.cb-checkbox:checked + .cb-switch{background:#238B53}'
      + '.cb-checkbox:checked + .cb-switch::after{left:19px;background:#fff}'
      + '.cb-checkbox:disabled + .cb-switch{opacity:.6}'
      /* Mobile */
      + '@media(max-width:480px){'
      + '  .cb-banner{padding:18px 16px;border-radius:14px 14px 0 0}'
      + '  .cb-actions{flex-direction:column}'
      + '  .cb-btn{width:100%;text-align:center}'
      + '  #cookie-overlay{padding:0}'
      + '}';

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ── Banner Logik ───────────────────────────────────────────────────
  function showBanner() {
    injectStyles();
    var overlay = buildBanner();
    document.body.appendChild(overlay);

    var detailsWrap = overlay.querySelector('#cb-details');
    var btnDetails = overlay.querySelector('#cb-show-details');
    var btnSave = overlay.querySelector('#cb-save');
    var btnAccept = overlay.querySelector('#cb-accept');
    var btnReject = overlay.querySelector('#cb-reject');

    // Detail-Toggles für einzelne Kategorien
    overlay.querySelectorAll('.cb-toggle-detail').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = overlay.querySelector('#' + btn.getAttribute('data-target'));
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        target.hidden = expanded;
      });
    });

    // Einstellungen anzeigen/verstecken
    btnDetails.addEventListener('click', function () {
      var visible = !detailsWrap.hidden;
      detailsWrap.hidden = visible;
      btnDetails.textContent = visible ? 'Einstellungen' : 'Einstell. ausblenden';
      btnSave.hidden = visible;
      if (!visible) btnDetails.hidden = true;
      btnSave.hidden = visible;
      if (!visible) {
        btnDetails.hidden = true;
        btnSave.hidden = false;
      }
    });

    // Alle akzeptieren
    btnAccept.addEventListener('click', function () {
      var choices = {};
      CATEGORIES.forEach(function (cat) { choices[cat.id] = true; });
      saveConsent(choices);
      closeBanner(overlay);
      applyConsent();
    });

    // Nur Essentiell
    btnReject.addEventListener('click', function () {
      var choices = {};
      CATEGORIES.forEach(function (cat) { choices[cat.id] = cat.required; });
      saveConsent(choices);
      closeBanner(overlay);
      applyConsent();
    });

    // Auswahl speichern
    btnSave.addEventListener('click', function () {
      var choices = {};
      CATEGORIES.forEach(function (cat) {
        if (cat.required) {
          choices[cat.id] = true;
        } else {
          var cb = overlay.querySelector('#cb-cat-' + cat.id);
          choices[cat.id] = cb ? cb.checked : false;
        }
      });
      saveConsent(choices);
      closeBanner(overlay);
      applyConsent();
    });

    // ESC-Taste deaktivieren (Banner muss aktiv beantwortet werden)
    document.addEventListener('keydown', function blockEsc(e) {
      if (e.key === 'Escape' && document.getElementById('cookie-overlay')) {
        e.preventDefault();
      }
    });
  }

  function closeBanner(overlay) {
    overlay.style.animation = 'cbFadeIn .2s ease reverse';
    setTimeout(function () {
      overlay.remove();
    }, 200);
  }

  // ── Consent anwenden ───────────────────────────────────────────────
  function applyConsent() {
    // Hier können zukünftige Scripts je nach Kategorie geladen werden.
    // Beispiel: Analytics-Script nur laden wenn analytics = true
    //
    // if (isCategoryAllowed('analytics')) {
    //   loadGoogleAnalytics();
    // }
    //
    // if (isCategoryAllowed('marketing')) {
    //   loadFacebookPixel();
    // }
  }

  // ── Einstellungen erneut öffnen (Footer-Link) ─────────────────────
  window.openCookieSettings = function () {
    localStorage.removeItem(STORAGE_KEY);
    // Altes Banner entfernen falls vorhanden
    var existing = document.getElementById('cookie-overlay');
    if (existing) existing.remove();
    showBanner();

    // Vorherige Auswahl wiederherstellen im Banner
    var consent = getConsent();
    if (consent) {
      CATEGORIES.forEach(function (cat) {
        if (!cat.required) {
          var cb = document.querySelector('#cb-cat-' + cat.id);
          if (cb) cb.checked = consent.categories[cat.id] || false;
        }
      });
    }
  };

  // ── Initialisierung ────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    if (!isConsentGiven()) {
      showBanner();
    } else {
      applyConsent();
    }
  }
})();
