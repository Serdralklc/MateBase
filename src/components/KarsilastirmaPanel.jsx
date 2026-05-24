import { MaliyetBadge, PF_ALANLARI, pfCls } from '../utils.jsx'

export default function KarsilastirmaPanel({ liste, onCikar }) {
  if (liste.length < 2) {
    return (
      <div className="kar-bos">
        <span>⚖️</span>
        <div style={{ fontSize: 14 }}>En az 2 malzeme ekleyin</div>
        <div style={{ fontSize: 12, marginTop: 6 }}>
          Malzeme kartındaki <strong>"+ Karşılaştırmaya Ekle"</strong> butonuna basın
          <br />(maksimum 5 malzeme)
        </div>
      </div>
    )
  }

  // Tablo satır tanımları
  const satirlar = [
    { lbl: 'Kategori',    render: m => m.alt || '—' },
    { lbl: 'Sistem',      render: m => m.si  || '—' },
    { lbl: 'Maliyet',     render: m => <MaliyetBadge ml={m.ml} /> },
    { lbl: 'Açıklama',    render: m => <span style={{ fontSize: 11 }}>{(m.ac || '—').slice(0, 90)}</span> },
    ...PF_ALANLARI.map(([key, lbl]) => ({
      lbl,
      render: m => {
        const v = m[key]
        if (!v || v === '-' || v === '') return <span style={{ color: 'var(--txt3)' }}>—</span>
        return <span className={`pf ${pfCls(v)}`}>{v}</span>
      }
    })),
    { lbl: 'Avantajlar',    render: m => <span style={{ fontSize: 11, color: 'var(--green-txt)' }}>{(m.av || '—').slice(0, 100)}</span> },
    { lbl: 'Dezavantajlar', render: m => <span style={{ fontSize: 11, color: 'var(--red-txt)'   }}>{(m.dz || '—').slice(0, 100)}</span> },
    { lbl: 'TR Markalar',   render: m => <span style={{ fontSize: 11 }}>{m.tr || '—'}</span> },
    { lbl: 'Nerede Kullanılır', render: m => <span style={{ fontSize: 11 }}>{(m.nr || '—').slice(0, 100)}</span> },
  ]

  return (
    <div>
      <div className="info-bar">
        💡 {liste.length} malzeme karşılaştırılıyor — satır başlarına tıklayarak sıralayabilirsiniz
      </div>
      <div className="kar-scroll">
        <table className="kar-tablo">
          <thead>
            <tr>
              <th>Özellik</th>
              {liste.map(m => (
                <th key={m.id} style={{ minWidth: 160 }}>
                  <div>{m.ad}</div>
                  <MaliyetBadge ml={m.ml} />
                  <button className="kar-cikar-btn" onClick={() => onCikar(m.id)}>
                    × Çıkar
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {satirlar.map((s, i) => (
              <tr key={i}>
                <td className="kar-ozellik-td">{s.lbl}</td>
                {liste.map(m => (
                  <td key={m.id}>{s.render(m)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
