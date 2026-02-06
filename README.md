# Smartfit Coaching Landing Page

Moderne, interaktive Landing Page für David Puschmann - Personal Trainer & Online Coach in Trier.

## 🚀 Features

- **Dark Theme** mit Grün/Teal Accent Color (Apple-inspired Design)
- **Scroll-Animationen** (AOS Library)
- **Interaktive Elemente**: Animierte Counter, Hover-Effekte, Testimonial-Slider
- **Mobile-First & Responsive**
- **Sticky CTA Button** (erscheint nach Hero-Section)
- **Kontaktformular** mit Validierung
- **Floating Particles Animation** im Hero-Bereich

## 📁 Projektstruktur

```
smartfit-landing/
├── index.html    # Komplette Landing Page (Single-File)
└── README.md     # Diese Datei
```

## 🛠️ Technologie-Stack

- **Tailwind CSS** (CDN)
- **AOS** (Animate on Scroll Library)
- **Vanilla JavaScript**
- **Google Fonts** (Inter)

Keine weiteren Dependencies erforderlich!

## 📦 Deployment

### Option 1: Statisches Hosting (empfohlen)

Die `index.html` kann direkt auf jedem statischen Hosting-Service deployed werden:

#### Netlify (kostenlos)
```bash
# Via CLI
npm install -g netlify-cli
netlify deploy --dir=. --prod

# Oder: Drag & Drop auf netlify.com
```

#### Vercel (kostenlos)
```bash
npm install -g vercel
vercel --prod
```

#### GitHub Pages (kostenlos)
1. Repository erstellen
2. `index.html` hochladen
3. Settings → Pages → Branch auswählen

### Option 2: Eigener Server

```bash
# Mit Python (bereits installiert auf den meisten Systemen)
python3 -m http.server 8080

# Mit Node.js
npx serve .

# Mit PHP
php -S localhost:8080
```

### Option 3: Nginx/Apache

Einfach `index.html` in den Web-Root kopieren:

```bash
# Nginx
cp index.html /var/www/html/

# Apache
cp index.html /var/www/html/
```

## ⚙️ Anpassungen

### Kontaktformular Backend

Das Formular ist aktuell nur Frontend. Für echte Funktionalität:

1. **Formspree** (einfach): 
   ```html
   <form action="https://formspree.io/f/YOUR_ID" method="POST">
   ```

2. **Netlify Forms** (wenn auf Netlify gehostet):
   ```html
   <form name="contact" netlify>
   ```

3. **Eigenes Backend** - Endpoint in der JavaScript-Submit-Funktion anpassen

### Calendly Einbindung

Für Calendly statt/zusätzlich zum Kontaktformular:

```html
<!-- Calendly Inline Widget -->
<div class="calendly-inline-widget" 
     data-url="https://calendly.com/david-puschmann" 
     style="min-width:320px;height:630px;">
</div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

### Bilder hinzufügen

Im "Über mich" Bereich ist ein Platzhalter für das Profilbild. Ersetze den Placeholder mit:

```html
<img src="pfad/zum/bild.jpg" alt="David Puschmann" class="w-full h-full object-cover">
```

## 🎨 Design-Varianten

### Accent Color ändern

In `tailwind.config` im `<script>` Tag:

```javascript
accent: {
    DEFAULT: '#10b981', // Grün (Standard)
    // Alternative: '#0ea5e9' (Blau)
    // Alternative: '#8b5cf6' (Lila)
}
```

## 📱 Browser-Support

- Chrome (letzte 2 Versionen)
- Firefox (letzte 2 Versionen)
- Safari (letzte 2 Versionen)
- Edge (letzte 2 Versionen)
- Mobile Browser (iOS Safari, Chrome Android)

## 📄 Lizenz

Erstellt für Smartfit Coaching / David Puschmann.

---

**Kontakt:**
- 📍 Scheffelstraße 41, 54294 Trier
- 📞 0178 883 8785
- ✉️ support@smartfit-coaching.de
