# 🏗️ Yapı Malzemeleri Danışmanı — Kurulum Talimatları

## Gerekenler (sadece bir kere kurulur)

### 1. Node.js kur
- https://nodejs.org adresine git
- **"LTS"** yazan yeşil butona tıkla → indir → kur
- Kurulum bitince bilgisayarı yeniden başlatmana gerek yok

---

## Projeyi Çalıştırma (VS Code'da)

### Adım 1 — Klasörü VS Code'da aç
1. VS Code'u aç
2. **File → Open Folder** tıkla
3. `yapi-danismani` klasörünü seç → **Klasörü Seç** butonu

### Adım 2 — Terminali aç
- VS Code'da üstten: **Terminal → New Terminal**
- Alt kısımda siyah bir terminal penceresi açılacak

### Adım 3 — Tek seferlik kurulum (sadece ilk seferde)
Terminale şunu yaz ve Enter'a bas:
```
npm install
```
Birkaç saniye bekle, tamamlandığında tekrar yazı girebilirsin.

### Adım 4 — Uygulamayı başlat
Terminale şunu yaz ve Enter'a bas:
```
npm run dev
```

### Adım 5 — Tarayıcıda aç
Terminalde şuna benzer bir şey göreceksin:
```
  ➜  Local:   http://localhost:5173/
```
`http://localhost:5173/` adresine tıkla veya tarayıcına kopyala.

---

## Durdurmak için
Terminal penceresinde **Ctrl + C** tuşlarına bas.

## Sonraki seferlerde
Sadece **Adım 4** ve **Adım 5** yeterli.
(`npm install` sadece bir kere yapılır)

---

## Sorun çıkarsa

**"npm bulunamadı" gibi bir hata varsa:**
→ Node.js'i kurduğundan emin ol (Adım 1)
→ VS Code'u kapat ve tekrar aç

**Beyaz ekran / hata ekranı:**
→ `public/malzemeler.json` dosyasının klasörde olduğunu kontrol et

---

## Klasör yapısı
```
yapi-danismani/
├── public/
│   └── malzemeler.json     ← 619 malzeme verisi
├── src/
│   ├── components/
│   │   ├── DetayPanel.jsx
│   │   └── KarsilastirmaPanel.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── utils.jsx
├── index.html
├── package.json
└── vite.config.js
```
