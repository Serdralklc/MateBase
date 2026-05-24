import { MaliyetBadge, PF_ALANLARI, pfCls } from '../utils.jsx'

export default function DetayPanel({ malzeme, tumMalzemeler, onMuadilSec, onKarsiyaEkle }) {
  if (!malzeme) {
    return (
      <div className="detay">
        <div className="bos-durum">
          <span className="bos-ikon">👆</span>
          <div style={{ fontSize: 14 }}>Soldaki listeden bir malzeme seçin</div>
          <div style={{ fontSize: 12, marginTop: 6, color: 'var(--txt3)' }}>
            Tüm teknik detaylar, avantajlar, muadiller burada görünecek
          </div>
          <div className="hizli-aramalar">
            {['EPS','XPS','membran','alçıpan','beton','seramik','cam','yangın','akustik'].map(k => (
              <span key={k} className="chip" onClick={() => {
                // Parent'a bildir — App.jsx'te arama kutusunu dolduracak
                document.getElementById('arama-inp').value = k
                document.getElementById('arama-inp').dispatchEvent(new Event('input', { bubbles: true }))
              }}>{k}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const m = malzeme

  // Muadil malzemeleri bul
  const muadiller = (() => {
    if (!m.muadil) return []
    const anahtar = m.muadil
      .split(/[,،\/]/)
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
    return tumMalzemeler
      .filter(x => {
        if (x.id === m.id) return false
        return anahtar.some(k =>
          x.ad.toLowerCase().includes(k) ||
          (x.ks && x.ks.toLowerCase() === k)
        )
      })
      .slice(0, 6)
  })()

  return (
    <div className="detay">
      {/* Başlık */}
      <div className="d-baslik">{m.ad}</div>
      <div className="d-alt">
        {m.ks && <><span className="ks-tag">{m.ks}</span>{' · '}</>}
        {m.ust} / {m.alt}
        {m.aile && ` / ${m.aile}`}
      </div>

      {/* Rozetler */}
      <div className="d-rozet-row">
        <MaliyetBadge ml={m.ml} />
        {m.si && (
          <span className="bdg" style={{ background: 'var(--bg3)', color: 'var(--txt2)' }}>
            {m.si}
          </span>
        )}
      </div>

      {/* Açıklama */}
      {m.ac && <div className="d-aciklama">{m.ac}</div>}

      {/* Nerede / Hangi Durumda */}
      {(m.nr || m.nz) && (
        <div className="d-grid-2">
          {m.nr && (
            <div className="d-kutu">
              <div className="d-kutu-lbl">📍 Nerede Kullanılır?</div>
              <div className="d-kutu-val">{m.nr}</div>
            </div>
          )}
          {m.nz && (
            <div className="d-kutu">
              <div className="d-kutu-lbl">🎯 Hangi Durumda Tercih Edilir?</div>
              <div className="d-kutu-val">{m.nz}</div>
            </div>
          )}
        </div>
      )}

      {/* Avantaj / Dezavantaj */}
      {(m.av || m.dz) && (
        <div className="d-grid-2">
          {m.av && (
            <div className="av-kutu">
              <div className="av-lbl">✓ Avantajlar</div>
              <div className="av-val">{m.av}</div>
            </div>
          )}
          {m.dz && (
            <div className="dz-kutu">
              <div className="dz-lbl">✗ Dezavantajlar</div>
              <div className="dz-val">{m.dz}</div>
            </div>
          )}
        </div>
      )}

      {/* Performans Profili */}
      <div className="pf-satir-lbl">Performans Profili</div>
      <div className="pf-wrap">
        {PF_ALANLARI.map(([key, lbl]) => {
          const v = m[key]
          if (!v || v === '-' || v === '') return null
          return (
            <span key={key} className={`pf ${pfCls(v)}`}>
              {lbl}: {v}
            </span>
          )
        })}
      </div>

      {/* Markalar */}
      {m.tr && (
        <div className="marka-satir">
          🇹🇷 <strong>TR Markalar:</strong> {m.tr}
        </div>
      )}
      {m.global_marka && (
        <div className="marka-satir">
          🌍 <strong>Global:</strong> {m.global_marka}
        </div>
      )}
      {m.il && (
        <div className="iliskili-satir">
          İlişkili Sistemler: {m.il}
        </div>
      )}

      {/* Muadiller */}
      {muadiller.length > 0 && (
        <>
          <div className="muadil-baslik">Muadil / Alternatifler</div>
          <div className="muadil-row">
            {muadiller.map(mu => (
              <button
                key={mu.id}
                className="muadil-btn"
                onClick={() => onMuadilSec(mu)}
              >
                {mu.ad} <MaliyetBadge ml={mu.ml} />
              </button>
            ))}
          </div>
          {m.muadil && (
            <div style={{ fontSize: 10, color: 'var(--txt3)', marginTop: 4 }}>
              {m.muadil}
            </div>
          )}
        </>
      )}

      {/* Butonlar */}
      <div className="d-btnler">
        <button className="btn-ana" onClick={() => onKarsiyaEkle(m)}>
          + Karşılaştırmaya Ekle
        </button>
      </div>
    </div>
  )
}
