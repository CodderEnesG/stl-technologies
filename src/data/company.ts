// Tek doğruluk kaynağı: STL Teknoloji kurumsal bilgileri (stlteknoloji.com'dan doğrulandı)
export const company = {
  name: "STL Teknoloji",
  legalName: "STL TEKNOLOJİ LTD ŞTİ",
  founded: 2016,
  facilitySqm: "35.000",
  exportCountries: 20,
  /**
   * İhracat pazarları — ISO 3166-1 alpha-2 kodları.
   * Kaynak: wexta 2023 kataloğu. Müşteriden 20 ülkelik tam liste bekleniyor.
   * XK (Kosova) world-atlas 110m verisinde ayrı ülke değil → haritada 9 ülke boyanır.
   */
  exportMarkets: ["GB", "XK", "GE", "SO", "HR", "TN", "IR", "FR", "NE", "AZ"] as string[],
  phoneDisplay: "+90 212 866 85 51",
  phoneHref: "tel:+902128668551",
  email: "info@stlteknoloji.com",
  addressLines: [
    "Deliklikaya Mah. Fersah Cad. No: 134",
    "Teskoop Özel Endüstri Bölgesi",
    "34555 Arnavutköy / İstanbul",
  ],
  hours: "08:15 – 17:45",
  weekend: "Hafta sonu kapalı",
  website: "https://www.stlteknoloji.com",
  kvkkUrl: "https://www.stlteknoloji.com/tr/sayfa/kvkk-ve-aydinlatma-metni",
  privacyUrl: "https://www.stlteknoloji.com/tr/sayfa/gizlilik-ve-cerez-politikasi",
  instagram: "https://www.instagram.com/stlteknoloji",
  mapsQuery: "Teskoop Özel Endüstri Bölgesi, Fersah Cad. No:134, Deliklikaya, Arnavutköy, İstanbul",
};
