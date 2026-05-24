// Maliyet etiketi ve CSS sınıfı
export const ML_LBL = {
  '$':    'Ekonomik',
  '$$':   'Orta',
  '$$$':  'Yüksek',
  '$$$$': 'Çok Pahalı',
}

export const ML_CLS = {
  '$':    'ml1',
  '$$':   'ml2',
  '$$$':  'ml3',
  '$$$$': 'ml4',
}

// Performans değeri → CSS sınıfı
export function pfCls(v) {
  if (v === 'Çok İyi') return 'pf-ci'
  if (v === 'İyi')     return 'pf-iy'
  if (v === 'Orta')    return 'pf-or'
  return 'pf-du'
}

// Performans alanları listesi
export const PF_ALANLARI = [
  ['is', 'Isı Yal.'],
  ['se', 'Ses Yal.'],
  ['ya', 'Yangın'],
  ['su', 'Su'],
  ['ne', 'Nem'],
  ['uv', 'UV'],
  ['da', 'Darbe'],
  ['ba', 'Basma'],
  ['om', 'Ömür'],
  ['bk', 'Bakım'],
  ['uy', 'Uygulama'],
]

// Maliyet badge JSX için
export function MaliyetBadge({ ml }) {
  return (
    <span className={`bdg ${ML_CLS[ml] || 'ml2'}`}>
      {ml} {ML_LBL[ml] || ''}
    </span>
  )
}
