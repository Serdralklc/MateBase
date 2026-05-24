import { useState, useEffect, useMemo, useCallback } from 'react'
import DetayPanel from './components/DetayPanel.jsx'
import KarsilastirmaPanel from './components/KarsilastirmaPanel.jsx'
import { MaliyetBadge } from './utils.jsx'

const ML_OPTIONS = ['$', '$$', '$$$', '$$$$']
const SI_OPTIONS = [
  { key: 'Kuru Sistem',      lbl: 'Kuru'      },
  { key: 'Islak Sistem',     lbl: 'Islak'     },
  { key: 'Prefabrik Sistem', lbl: 'Prefabrik' },
  { key: 'Kompozit Sistem',  lbl: 'Kompozit'  },
]

export default function App() {
  // ─── STATE ───────────────────────────────────────────────
  const [tumMalzemeler, setTumMalzemeler]   = useState([])
  const [yukleniyor, setYukleniyor]         = useState(true)
  const [hata, setHata]                     = useState(null)

  const [arama, setArama]       = useState('')
  const [ustKat, setUstKat]     = useState('Tümü')
  const [altKat, setAltKat]     = useState('Tümü')
  const [mlFiltre, setMlFiltre] = useState([])   // ['$', '$$', ...]
  const [siFiltre, setSiFiltre] = useState([])   // ['Kuru Sistem', ...]

  const [aktifTab, setAktifTab]   = useState('ara')  // 'ara' | 'kar'
  const [secili, setSecili]       = useState(null)
  const [karListe, setKarListe]   = useState([])

  // ─── VERİ YÜKLEMESİ ──────────────────────────────────────
  useEffect(() => {
    fetch('/malzemeler.json')
      .then(r => {
        if (!r.ok) throw new Error('Dosya yüklenemedi')
        return r.json()
      })
      .then(data => {
        setTumMalzemeler(data)
        setYukleniyor(false)
      })
      .catch(e => {
        setHata(e.message)
        setYukleniyor(false)
      })
  }, [])

  // ─── KATEGORİLER ─────────────────────────────────────────
  const ustKatlar = useMemo(() => {
    return ['Tümü', ...new Set(tumMalzemeler.map(m => m.ust))]
  }, [tumMalzemeler])

  const altKatlar = useMemo(() => {
    const liste = tumMalzemeler
      .filter(m => ustKat === 'Tümü' || m.ust === ustKat)
      .map(m => m.alt)
    return ['Tümü', ...new Set(liste)]
  }, [tumMalzemeler, ustKat])

  // Üst kat değişince alt katı sıfırla
  const handleUstKat = (v) => {
    setUstKat(v)
    setAltKat('Tümü')
  }

  // ─── FİLTRELEME ──────────────────────────────────────────
  const sonuclar = useMemo(() => {
    const a = arama.toLowerCase().trim()
    return tumMalzemeler.filter(m => {
      // Metin araması
      if (a) {
        const alanlari = [m.ad, m.ac, m.nr, m.alt, m.ks, m.av, m.mu, m.aile, m.il]
        const bulundu = alanlari.some(s => s && s.toLowerCase().includes(a))
        if (!bulundu) return false
      }
      if (ustKat !== 'Tümü' && m.ust !== ustKat) return false
      if (altKat !== 'Tümü' && m.alt !== altKat) return false
      if (mlFiltre.length > 0 && !mlFiltre.includes(m.ml)) return false
      if (siFiltre.length > 0 && !siFiltre.includes(m.si)) return false
      return true
    })
  }, [tumMalzemeler, arama, ustKat, altKat, mlFiltre, siFiltre])

  // ─── FİLTRE TOGGLE ───────────────────────────────────────
  const toggleMl = (v) => setMlFiltre(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])
  const toggleSi = (v) => setSiFiltre(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])

  // ─── KARŞILAŞTIRMA ───────────────────────────────────────
  const karEkle = useCallback((m) => {
    setKarListe(prev => {
      if (prev.find(x => x.id === m.id)) return prev           // zaten var
      if (prev.length >= 5) return [...prev.slice(1), m]        // 5 limitini koru
      return [...prev, m]
    })
  }, [])

  const karCikar = useCallback((id) => {
    setKarListe(prev => prev.filter(x => x.id !== id))
  }, [])

  const isKarsida = (m) => karListe.some(x => x.id === m.id)

  // ─── YÜKLEME DURUMU ──────────────────────────────────────
  if (yukleniyor) {
    return (
      <div className="yukleniyor">
        <div className="spinner" />
        <div style={{ fontWeight: 600 }}>Veritabanı yükleniyor…</div>
        <div style={{ fontSize: 12, color: 'var(--txt3)' }}>619 malzeme hazırlanıyor</div>
      </div>
    )
  }

  if (hata) {
    return (
      <div className="yukleniyor" style={{ color: 'var(--red-txt)' }}>
        <div>❌ Hata: {hata}</div>
        <div style={{ fontSize: 12, marginTop: 8 }}>
          <code>public/malzemeler.json</code> dosyasının var olduğundan emin olun
        </div>
      </div>
    )
  }

  // ─── RENDER ──────────────────────────────────────────────
  return (
    <div className="app">

      {/* HEADER */}
      <div className="header">
        <span className="header-logo">🏗️</span>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="header-title">MateBase</span>
            <span className="badge">{tumMalzemeler.length} malzeme</span>
          </div>
          <div className="header-sub">
            Türkiye &amp; Dünya · Tüm yapı kategorileri · Arama · Karşılaştırma
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button
          className={`tab ${aktifTab === 'ara' ? 'active' : ''}`}
          onClick={() => setAktifTab('ara')}
        >
          🔍 Malzeme Ara
        </button>
        <button
          className={`tab ${aktifTab === 'kar' ? 'active' : ''}`}
          onClick={() => setAktifTab('kar')}
        >
          ⚖️ Karşılaştır {karListe.length > 0 && `(${karListe.length})`}
        </button>
      </div>

      {/* ─── ARA PANELİ ─────────────────────────────────── */}
      {aktifTab === 'ara' && (
        <div className="ara-grid">

          {/* SOL — FİLTRELER + LİSTE */}
          <div className="sidebar">

            {/* Arama kutusu */}
            <div className="f-row">
              <input
                id="arama-inp"
                type="search"
                placeholder="Ara: EPS, membran, alçıpan, beton…"
                value={arama}
                onInput={e => setArama(e.target.value)}
                onChange={e => setArama(e.target.value)}
              />
            </div>

            {/* Üst kategori */}
            <div className="f-row">
              <select value={ustKat} onChange={e => handleUstKat(e.target.value)}>
                {ustKatlar.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>

            {/* Alt kategori */}
            <div className="f-row">
              <select value={altKat} onChange={e => setAltKat(e.target.value)}>
                {altKatlar.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>

            {/* Maliyet filtresi */}
            <div className="f-row">
              <div className="f-label">Maliyet</div>
              <div className="chips">
                {ML_OPTIONS.map(v => (
                  <span
                    key={v}
                    className={`chip ${mlFiltre.includes(v) ? 'on' : ''}`}
                    onClick={() => toggleMl(v)}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Sistem filtresi */}
            <div className="f-row">
              <div className="f-label">Sistem Türü</div>
              <div className="chips">
                {SI_OPTIONS.map(({ key, lbl }) => (
                  <span
                    key={key}
                    className={`chip ${siFiltre.includes(key) ? 'on' : ''}`}
                    onClick={() => toggleSi(key)}
                  >
                    {lbl}
                  </span>
                ))}
              </div>
            </div>

            {/* Sonuç sayısı */}
            <div className="sonuc-bilgi">
              {sonuclar.length} sonuç
              {arama && ` — "${arama}"`}
            </div>

            {/* Malzeme listesi */}
            <div className="liste">
              {sonuclar.slice(0, 80).map(m => (
                <div
                  key={m.id}
                  className={`kart ${secili?.id === m.id ? 'secili' : ''}`}
                  onClick={() => setSecili(m)}
                >
                  <div className="kart-ust">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                        <span className="kart-ad">{m.ad}</span>
                        {m.ks && <span className="ks-tag">{m.ks}</span>}
                        <MaliyetBadge ml={m.ml} />
                      </div>
                      {m.ac && (
                        <div className="kart-ac">
                          {m.ac.slice(0, 85)}{m.ac.length > 85 ? '…' : ''}
                        </div>
                      )}
                      <div className="kart-meta">
                        {m.alt}{m.si ? ` · ${m.si}` : ''}
                      </div>
                    </div>
                    <button
                      className={`ekle-btn ${isKarsida(m) ? 'eklendi' : ''}`}
                      onClick={e => { e.stopPropagation(); karEkle(m) }}
                    >
                      {isKarsida(m) ? '✓' : '+'} Karş.
                    </button>
                  </div>
                </div>
              ))}
              {sonuclar.length > 80 && (
                <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--txt3)', padding: '8px', borderTop: '1px solid var(--brd)' }}>
                  +{sonuclar.length - 80} daha · aramayı daraltın
                </div>
              )}
              {sonuclar.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--txt3)' }}>
                  🔎 Sonuç bulunamadı
                </div>
              )}
            </div>
          </div>

          {/* SAĞ — DETAY */}
          <DetayPanel
            malzeme={secili}
            tumMalzemeler={tumMalzemeler}
            onMuadilSec={m => setSecili(m)}
            onKarsiyaEkle={m => { karEkle(m); setAktifTab('kar') }}
          />
        </div>
      )}

      {/* ─── KARŞILAŞTIRMA PANELİ ───────────────────────── */}
      {aktifTab === 'kar' && (
        <KarsilastirmaPanel
          liste={karListe}
          onCikar={karCikar}
        />
      )}

    </div>
  )
}
