// Yasal metinler — müşterinin eski sitesinden (stlteknoloji.com) alındı.
// Alan adı yeni siteye yönlendiğinde eski sayfalar kaybolacağı için metin
// buraya taşındı. İçerik birebir korunmuştur; düzenlenmesi gerekirse hukuk
// tarafından onaylanmış yeni metinle değiştirilmelidir.
//
// Not: KVKK metnindeki ticaret sicil ve Mersis numaraları eski sitede de
// doldurulmamış (XX / 00000). Müşteriden gerçek değerler istenecek.

export type LegalBlock = { h: string } | { p: string };

export type LegalDoc = {
  title: string;
  blocks: LegalBlock[];
  /** Resmî çevirisi olmayan metinlerde gösterilen not */
  translationNote?: string;
};

export type LegalKey = "kvkk" | "privacy";

export const legalDocs: Record<LegalKey, Record<"tr" | "en", LegalDoc>> = {
  kvkk: {
    tr: {
      title: "KVKK ve Aydınlatma Metni",
      blocks: [
      { p: "www.stlteknoloji.com KİŞİSEL VERİLERİN KORUNMASI VE İŞLENMESİ" },
      { h: "1. TANIMLAR" },
      { p: "İş bu aydınlatma metninde geçen;" },
      { p: "Kişisel Veri: Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgiyi," },
      { p: "Kişisel Verilerin Korunması Kanunu (K.V.K.K.): 7 Nisan 2016 tarihinde Resmi Gazete’de yayınlanarak yürürlüğe giren 6698 sayılı Kişisel Verilerin Korunması Kanunu’nu," },
      { p: "Veri İşleyen: Veri Sorumlusunun verdiği yetkiye dayanarak onun adına kişisel verileri işleyen gerçek veya tüzel kişiyi," },
      { p: "Veri Sorumlusu: Kişisel Verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan gerçek veya tüzel kişiyi, ifade eder." },
      { p: "www.stlteknoloji.com, 6698 sayılı Kişisel Verilerin Korunması Kanunu (K.V.K.K.) uyarınca, Veri Sorumlusu sıfatıyla, sizi K.V.K.K. kapsamındaki aydınlatma yükümlülüğümüz çerçevesinde, kişisel verilerinizin toplanma yöntemleri ve hukuki sebepleri, kişisel verilerinizi koruma yöntemlerimiz ve politikamız, işlenen kişisel veri örnekleri, veri sorumlusunun kimliği, kişisel verilerin işlenme amaçları, kişisel verilerinizin üçüncü kişilere ve/veya yurtdışına aktarımı ve K.V.K.K. kapsamında size tanınan haklara ilişkin olarak bilgilendirmek istiyoruz." },
      { h: "2. VERİ SORUMLUSUNUN KİMLİĞİ" },
      { p: "K.V.K.K. uyarınca muhatap “Veri Sorumlusu” XX Ticaret Sicili nezdinde 00000 sicil numarası ile kayıtlı, 0000000000000000 Mersis numaralı, şirket merkezi adresinde bulunan www.stlteknoloji.com’dir." },
      { h: "3. KİŞİSEL VERİLERİNİZİN İŞLENME AMAÇLARI" },
      { p: "Kişisel Verileriniz K.V.K.K. Madde 5.2 ve Madde 6.3 kapsamında kanuni yükümlülüklerimizi yerine getirmek, bir sözleşmenin kurulması veya ifası, hukuki yükümlülüklerimizi yerine getirmek, bir hakkın tesisi, kullanılması veya korunması ve temel hak ve özgürlüklerinize zarar vermeksizin, meşru menfaatlerimizin korunması amacıyla ve alenileştirdiğiniz kişisel veriler bakımından açık rızanız olmaksızın işlenebilmektedir. Kişisel verileriniz internet sitemizde yer alan Gizlilik Politikamız’da belirtilen amaçlar dâhilinde K.V.K.K. Madde 5.1 ve Madde 6.2 kapsamında açık rızanıza istinaden işlenecektir. Ayrıca sizlerin beğeni, kullanım alışkanlıkları ve ihtiyaçlarına göre özelleştirilerek sizlere önerilmesi ve tanıtılması için gerekli olan aktivitelerin planlanması ve icrası için Kişisel Verileriniz açık rızanıza istinaden işlenecektir." },
      { h: "4. KİŞİSEL VERİLERİNİZİN ÜÇÜNCÜ KİŞİLERE VE/VEYA YURTDIŞINA AKTARILMASI" },
      { p: "Kişisel Verileriniz yukarıda K.V.K.K. Madde 5.2 ve Madde 6.3 kapsamında belirlenen amaçların varlığı halinde açık rızanız aranmaksızın yahut Aydınlatma Metni’nde yer alan amaçlarla K.V.K.K. Madde 5.1 ve Madde 6.3 kapsamında açık rızanıza istinaden yurtiçinde ve yurtdışında bulunan depolama, arşivleme, bilişim teknolojileri desteği (sunucu, hosting, program, bulut bilişim), güvenlik, çağrı merkezi, satış, pazarlama gibi alanlarda destek aldığımız üçüncü kişilerle, işbirliği yapılan ve/veya hizmet alınan grup şirketleri, GSM Operatörleri, iş ortakları, tedarikçi firmalar, bankalar, finans kuruluşları, hukuk, vergi vb. benzeri alanlarda destek alınan danışmanlık firmaları, satış, pazarlama ve www.stlteknoloji.com’un faaliyetleri ile ilgili sair alanlarda destek veren üçüncü kişilere (e-posta gönderimi, kampanya oluşturulması amacı ile reklam firmaları, CRM desteği veren firmalar ve benzeri) ile kurum ve kuruluşlara aktarılabilmektedir." },
      { h: "5. KİŞİSEL VERİ SAHİBİ OLARAK KANUN’UN 11. MADDESİNDE SAYILAN HAKLARINIZ" },
      { p: "Kişisel veri sahibi olarak Kanun’un 11. maddesi uyarınca aşağıdaki haklara sahip olduğunuzu bildiririz:" },
      { p: "Kişisel verilerinizin işlenip işlenmediğini öğrenme," },
      { p: "Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme," },
      { p: "Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme," },
      { p: "Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme," },
      { p: "Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme," },
      { p: "Kanun’a ve ilgili diğer kanun hükümlerine uygun olarak işlenmiş olmasına rağmen, işlenmesini gerektiren sebeplerin ortadan kalkması hâlinde kişisel verilerin silinmesini veya yok edilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme," },
      { p: "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkması durumunda buna itiraz etme," },
      { p: "Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme." },
      { p: "Yukarıda sıralanan haklarınıza yönelik başvurularınızı, sitemizden ulaşabileceğiniz İletişim Formu’nu doldurarak şirketimize iletebilirsiniz. Talebinizin niteliğine göre en kısa sürede ve en geç otuz gün içinde başvurularınız ücretsiz olarak sonuçlandırılacaktır; ancak işlemin ayrıca bir maliyet gerektirmesi halinde Kişisel Verileri Koruma Kurulu tarafından belirlenecek tarifeye göre tarafınızdan ücret talep edilebilecektir." },
      ],
    },
    en: {
      title: "GDPR and Clarification Text",
      blocks: [
      { p: "www.stlteknoloji.com PROTECTION AND PROCESSING OF PERSONAL DATA" },
      { h: "1. DEFINITIONS" },
      { p: "The work mentioned in this lighting text;" },
      { p: "Personal Data: All kinds of information about an identified or identifiable natural person," },
      { p: "Personal Data Protection Law (G.D.P.R.): The Personal Data Protection Law No. 6698, which was published in the Official Gazette on April 7, 2016," },
      { p: "Data Processor: Real or legal person who processes personal data on his behalf, based on the authority granted by the Data Controller," },
      { p: "Data Responsible: It refers to the natural or legal person who determines the purposes and means of processing the Personal Data and is responsible for the establishment and management of the data recording system." },
      { p: "www.stlteknoloji.com, in accordance with the Law No. 6698 on the Protection of Personal Data (G.D.P.R.), as the Data Officer, you will be sent to G.D.P.R. Within the scope of our lighting obligation, the methods and legal reasons of your personal data collection, our methods and policy of protecting your personal data, the samples of processed personal data, the identity of the data controller, the purposes of processing personal data, the transfer of your personal data to third parties and / or abroad and G.D.P.R. We would like to inform you about the rights granted to you within the scope of." },
      { h: "2. IDENTITY OF THE DATA RESPONSIBLE" },
      { p: "G.D.P.R. In accordance with the addressee, the \"Data Officer\" is www.stlteknoloji.com registered at the XX Trade Registry with the registration number 00000, addressed 0000000000000000 Mersis, located at the corporate address ." },
      { h: "3. PROCESSING PURPOSE OF YOUR PERSONAL DATA" },
      { p: "Your Personal Data G.D.P.R. It can be processed within the scope of Clause 5.2 and 6.3, to fulfill our legal obligations, to establish or perform a contract, to fulfill our legal obligations, to establish, use or protect a right and without damaging your fundamental rights and freedoms, without your explicit consent in terms of personal data you have publicized. . Your personal data within the scope of the purposes specified in our Privacy Policy on our website G.D.P.R. It will be processed under your express consent under Article 5.1 and 6.2. In addition, your Personal Data will be processed in accordance with your explicit consent for the planning and execution of the activities required for your recommendation and promotion by customizing according to your likes, usage habits and needs." },
      { h: "4. TRANSFER OF YOUR PERSONAL DATA TO THIRD PARTIES AND / OR ABROAD" },
      { p: "Your Personal Data above G.D.P.R. In the event that the objectives determined within the scope of Article 5.2 and 6.3 exist, G.D.P.R., without seeking your explicit consent or for the purposes of the Text of Clarification. Within the scope of Clause 5.1 and 6.3, based on your explicit consent, we cooperate with third parties that we receive support in areas such as storage, archiving, information technology support (server, hosting, program, cloud computing), security, call center, sales, marketing and / or group companies, GSM Operators, business partners, suppliers, banks, financial institutions, law, tax, etc. Consultancy firms in similar fields, sales, marketing and third parties that support www.stlteknoloji.com activities in other fields (e-mail sending, advertising companies for the purpose of creating a campaign, firms that provide CRM support, etc.) can be transferred to organizations." },
      { h: "5. YOUR RIGHTS AS A PERSONAL DATA OWNER IN ARTICLE 11 OF THE LAW" },
      { p: "As a personal data owner, we declare that you have the following rights in accordance with Article 11 of the Law:" },
      { p: "Learning whether your personal data is processed," },
      { p: "If your personal data is processed, requesting information about it," },
      { p: "Learning the purpose of processing your personal data and whether they are used in accordance with their purpose," },
      { p: "To know the third parties to whom your personal data is transferred domestically or abroad," },
      { p: "In the event that your personal data is incomplete or incorrectly processed, to request their correction and to request notification of the transaction made within this scope to the third parties to whom your personal data is transferred," },
      { p: "Despite being processed in accordance with the Law and other relevant provisions of the law, to request the deletion or destruction of personal data in case the reasons requiring its processing disappear and to inform the third parties to whom your personal data is transferred," },
      { p: "To object to this in case of a result against you by analyzing the processed data exclusively through automated systems," },
      { p: "Requesting the removal of the damage if you suffer damage due to illegal processing of your personal data." },
      { p: "You can send your applications regarding your rights listed above to our company by filling out the Contact Form which you can access from our site. Depending on the nature of your request, your applications will be concluded free of charge as soon as possible and within thirty days at the latest; however, if the transaction requires a separate cost, you may be charged according to the tariff to be determined by the Personal Data Protection Board." },
      ],
    },
  },
  privacy: {
    tr: {
      title: "Gizlilik ve Çerez Politikası",
      blocks: [
      { h: "GİZLİLİK ŞARTLARI" },
      { p: "1. www.stlteknoloji.com (“Şirket”) tarafından işletilen “www.stlteknoloji.com” adresindeki internet sitesi (“İnternet Sitesi”), İnternet Sitesini herhangi bir şekilde ziyaret eden ve/veya kullanan kişilere (“Kullanıcı”) daha iyi hizmet verebilmek amacıyla bazı kişisel bilgiler (isim, yaş, e-posta adresi, vb.) talep edilmektedir. İnternet Sitesi ile toplanan bu veriler; kampanya çalışmaları veya Kullanıcı’nın hesabına yönelik özel promosyon faaliyetlerinin yapılabilmesi için İnternet Sitesi bünyesinde kullanılmaktadır. Kişisel bilgiler haricinde; İnternet Sitesi üzerinden yapılan işlemlere ait istatistiksel veriler analiz edilmekte ve saklanmaktadır." },
      { p: "2. Şirket, üyelik formları ile kendisine iletilen bilgileri, Kullanıcılar’ın bilgisi veya aksi yönde bir talimatı olmaksızın, üçüncü şahıslarla kesinlikle paylaşmamakta, faaliyet dışı hiçbir nedenle ticari amaçla kullanmamakta ve satmamaktadır." },
      { p: "3. İnternet Sitesi içeriğinde Google Analytics’in Yeniden Pazarlama & Demografi ve İlgi Alanı Raporlaması özellikleri kullanılmaktadır. Reklam ayarları kullanılarak Görüntülü Reklamcılık için Google Analytics’in kapsamı dışında kalabilir ve Google Görüntülü Reklam Ağı reklamları özelleştirilebilir. Google Analytics ile sağlanan demografik bilgiler, İnternet Sitesi’ni ve varsa İnternet Sitesi üzerinden verilen reklamları, Kullanıcılar’ın ilgi alanlarına göre özelleştirmek için kullanılmaktadır. İşbu bilgiler, hedef kitle çalışmalarında kullanılırken diğer Kullanıcılar’a ait bilgilerle birlikte olmak üzere reklam yayıncıları ile paylaşılabilir. Bu bilgiler herhangi bir şekilde kişisel bilgi (isim, soyadı, T.C Kimlik No, cinsiyet, yaş vb.) içermeyip, grup olarak Kullanıcı eğilimleri ile ilgili çalışmalar yapmak ve hedef kitleyi derlemek etmek amacıyla kullanılmaktadır. İşbu Gizlilik Şartları’nı kabul edilmesiyle, anonim bilgilerin reklam yayıncıları ile reklam ve tanıtım amacıyla paylaşılmasına onay verilmektedir." },
      { p: "4. Google dahil üçüncü taraf sağlayıcılar, İnternet Sitesi reklamlarını internet üzerindeki yayıncı sitelerde yer verdikleri banner alanlarında gösterecektir. Ziyaretçilerin İnternet Sitesi’ne geçmişte yaptığı ziyaretleri temel alarak reklamlarla ilgili bilgi toplamak, reklamları optimize etmek ve yayınlamak üzere İnternet Sitesi tarafından ve Google dahil üçüncü taraf sağlayıcılarca birinci taraf çerezler ile üçüncü taraf çerezler birlikte kullanılmaktadır." },
      { p: "5. Kişisel Kullanıcı bilgileri, ancak resmi makamlarca talep edilmesi halinde ve yürürlükteki emredici mevzuat hükümleri gereğince açıklama yapmak zorunda olunduğu durumlarda resmi makamlara açıklanacaktır." },
      { p: "6. Ödeme sayfasında talep edilen Kullanıcı kredi kartı bilgileri, İnternet Sitesi'nden alışveriş yapan Kullanıcılar’ın güvenliğini en üst seviyede tutmak amacıyla hiçbir şekilde İnternet Sitesi veya hizmet veren üçüncü şirketlerin sunucularında tutulmamaktadır. Bu şekilde ödemeye yönelik tüm işlemlerin İnternet Sitesi arayüzü üzerinden ilgili banka ile Kullanıcı’nın kullanmakta olduğu cihaz arasında gerçekleşmesi sağlanmaktadır." },
      { p: "7. Kullanıcı, işbu Gizlilik Şartları’nı onaylayarak, Şirket ile paylaşmış olduğu bilgilerin şahsına ait olduğunu ve bu bilgilerin, satış ve pazarlama faaliyetlerinin yürütülebilmesi amacıyla ve her türlü iletişim aracına uygun bildiriminin sağlanması için Şirket’in iştiraki olan diğer tüzel kişiler ile de paylaşılabileceğine onay vermektedir." },
      { p: "8. İnternet Sitesi üyeliği çerçevesinde gönderilen e-postaların alt kısmında bulunan “Kampanya duyurularından haberdar olmak istemiyorsanız lütfen tıklayınız.” linkine tıklayarak, veya site üzerinden \"Hesabım\" bölümünde bulunan \"Üyelik Bilgileri Güncelleme\" alanında \"Reklam ve duyuru e-postalarını almak istiyorum\" seçeneğini boş bırakarak e-posta gönderim listesinden her zaman çıkış yapılabilmektedir." },
      { h: "ÇEREZ POLİTİKASI" },
      { p: "www.stlteknoloji.com olarak, web sitemizin kullanımını kolaylaştırmak ve sitemizin kullanımını kişiselleştirmek amacıyla çerezler, piksel etiketleri (\"pikseller\") ve yerel saklama teknolojileri kullanmaktayız. Bu sayfanın, anılan teknolojilerin niçin kullanıldıklarını ve bunları kontrol etmeyi veya -tercihiniz bu yöndeyse- silmeyi anlamanıza yardımcı olmasını istiyoruz." },
      { p: "Çerez Nedir?" },
      { p: "Günümüzde neredeyse her web sitesi çerez kullanmaktadır. Size daha iyi, hızlı ve güvenli bir deneyim sağlamak için, çoğu internet sitesi gibi biz de çerezler kullanıyoruz. Çerez, bir web sitesini ziyaret ettiğinizde cihazınıza (örneğin; bilgisayar veya cep telefonu) depolanan küçük bir metin dosyasıdır. Çerezler, bir web sitesini ilk ziyaretiniz sırasında tarayıcınız aracılığıyla cihazınıza depolanabilirler. Aynı siteyi aynı cihazla tekrar ziyaret ettiğinizde tarayıcınız cihazınızda site adına kayıtlı bir çerez olup olmadığını kontrol eder. Eğer kayıt var ise, kaydın içindeki veriyi ziyaret etmekte olduğunuz web sitesine iletir. Bu sayede web sitesi, sizin siteyi daha önce ziyaret ettiğinizi anlar ve size iletilecek içeriği de ona göre tayin eder." },
      { p: "Çerezler Neden Kullanılır?" },
      { p: "Bazı çerezler, daha önceki ziyaretlerinizde kullandığınız tercihlerin web sitesi tarafından hatırlanmasını sağlayarak, sonraki ziyaretlerinizin çok daha kullanıcı dostu ve kişiselleştirilmiş bir deneyim sunmasını sağlar." },
      { p: "Çerezleri Kontrol Etme ve Silme" },
      { p: "Çerezlerin kullanımına ilişkin tercihlerinizi değiştirmek ya da çerezleri engellemek veya silmek için tarayıcınızın ayarlarını değiştirmeniz yeterlidir. Birçok tarayıcı çerezleri kontrol edebilmeniz için size çerezleri kabul etme veya reddetme, yalnızca belirli türdeki çerezleri kabul etme ya da bir web sitesi cihazınıza çerez depolamayı talep ettiğinde tarayıcı tarafından uyarılma seçeneği sunar. Aynı zamanda daha önce tarayıcınıza kaydedilmiş çerezlerin silinmesi de mümkündür. Çerezleri kontrol edilmesine veya silinmesine ilişkin işlemler kullandığınız tarayıcıya göre değişebilmektedir. Bazı popüler tarayıcıların çerezlere izin verme ya da çerezleri engelleme veya silme talimatlarına aşağıdaki linklerden ulaşılması mümkündür." },
      { p: "www.stlteknoloji.com Tarafından Kullanılan Çerezler" },
      { p: "Web sitemizde kullanılan hiçbir çerez, kimliğinizin saptanmasına yarayacak verileri işlememektedir. Aşağıda web sitemizde kullanılmakta olan çerez türleri ve bu çerezlerin hangi amaçla kullanıldıkları detaylı bir şekilde ortaya konmuştur." },
      { p: "Kategori 1- Kesinlikle Gerekli Çerezler" },
      { p: "Bu çerezler, web sitesini dolaşmanıza ve web sitesinin güvenli alanlarına erişmenin sağlanması ve izinlerin ortaya konması için önemlidir. Bu çerezler olmadan, sitemizde bulunan alışveriş sepeti veya ödeme sayfası gibi talep ettiğiniz hizmetler sağlanamaz." },
      { h: "ÇEREZ ÇEREZ'İN TANIMI" },
      { p: "stlteknoloji Sitede oturum kaydınızı takip edebilmemiz için kullandığımız çerezdir." },
      { p: "lang Sitenin görüntülendiği dili ifade eden çerezdir. Arayüzde görüntülenecek dili belirler." },
      { p: "stlteknoloji_pop Sitede bir popup kullanılıyorsa gösterilip gösterilmediğinin kaydını tutmak için üretilen çerezdir." },
      { p: "cookieconsent_status Çerez Politikası bildirimi için üretilen çerezdir. Kaydı tutularak bu bildirimin tekrar görüntülenmemesi sağlanır." },
      { p: "Kategori 2- 'Performans' Çerezleri" },
      { p: "Bu çerezler, ziyaretçilerimizin web sitesini nasıl kullandıkları hakkında bilgi toplamaktadır. Örneğin, hangi ziyaretçilerin en sık gidecekleri sayfaları ve web sayfalarından hata mesajları alıp almadıklarını bilmemizi sağlar. Bu çerezler, bir ziyaretçiyi tanımlayan bilgileri değil anonim olar" },
      { h: "ÇEREZ ÇEREZ'İN TANIMI" },
      { p: "_ga Google Universal Analytics ile ilişkisi olan bir çerezdir. Bu çerez, istemci tanımlayıcısı olarak rastgele oluşturulmuş bir numara atayarak benzersiz kullanıcıları ayırmak için kullanılır. Sitelerin analiz raporları için ziyaretçi, oturum ve kampanya verilerini hesaplamak için kullanılır." },
      { p: "_gat Google Universal Analytics ile ilişkilidir - yüksek trafik alanlarındaki verilerin toplanmasını sınırlar" },
      { p: "_gid Tek bir tarayıcı oturumu sırasında bir ziyaretçiyi benzersiz şekilde tanımlar ve bir hedef kitleye örnek olduğunu gösterir." },
      { p: "_cfduid Cloudflare servisleri kullanılması durumunda üretilecek çerezdir. Benzersiz kullanıcı ID'si atayarak raporlama ve analiz yapılması için kullanılır." },
      { p: "Kategori 3- Hedefleme / Reklam Çerezleri" },
      { p: "Bu çerezler, reklamları sizinle ilgi alanlarınıza uygun olarak reklam kampanyasının etkinliğini ve reklam sayısını ölçmek için kullanılmaktadır. Genellikle web sitesi operatörünün izniyle reklam ağları tarafından yerleştirilirler. Ziyaret ettiğiniz web sitelerini hatırlıyorlar ve bu bilgiler 3. Kişi niteliğindeki reklam verenler gibi diğer kuruluşlarla paylaşılmaktadır. Çok sıklıkla çerezler hedefleme amacıyla diğer reklamların sitelerine link vermektedir. Bu kategoride çerez kullanmıyoruz." },
      { h: "ÇEREZ ÇEREZ'İN TANIMI" },
      ],
    },
    // Eski sitede bu metnin İngilizce sürümü yok. Hukuki metin uydurulmaz;
    // Türkçe metin gösterilir ve resmî dilin Türkçe olduğu belirtilir.
    en: {
      title: "Privacy and Cookie Policy",
      translationNote:
        "The official version of this text is in Turkish. The Turkish text below is authoritative.",
      blocks: [
      { h: "GİZLİLİK ŞARTLARI" },
      { p: "1. www.stlteknoloji.com (“Şirket”) tarafından işletilen “www.stlteknoloji.com” adresindeki internet sitesi (“İnternet Sitesi”), İnternet Sitesini herhangi bir şekilde ziyaret eden ve/veya kullanan kişilere (“Kullanıcı”) daha iyi hizmet verebilmek amacıyla bazı kişisel bilgiler (isim, yaş, e-posta adresi, vb.) talep edilmektedir. İnternet Sitesi ile toplanan bu veriler; kampanya çalışmaları veya Kullanıcı’nın hesabına yönelik özel promosyon faaliyetlerinin yapılabilmesi için İnternet Sitesi bünyesinde kullanılmaktadır. Kişisel bilgiler haricinde; İnternet Sitesi üzerinden yapılan işlemlere ait istatistiksel veriler analiz edilmekte ve saklanmaktadır." },
      { p: "2. Şirket, üyelik formları ile kendisine iletilen bilgileri, Kullanıcılar’ın bilgisi veya aksi yönde bir talimatı olmaksızın, üçüncü şahıslarla kesinlikle paylaşmamakta, faaliyet dışı hiçbir nedenle ticari amaçla kullanmamakta ve satmamaktadır." },
      { p: "3. İnternet Sitesi içeriğinde Google Analytics’in Yeniden Pazarlama & Demografi ve İlgi Alanı Raporlaması özellikleri kullanılmaktadır. Reklam ayarları kullanılarak Görüntülü Reklamcılık için Google Analytics’in kapsamı dışında kalabilir ve Google Görüntülü Reklam Ağı reklamları özelleştirilebilir. Google Analytics ile sağlanan demografik bilgiler, İnternet Sitesi’ni ve varsa İnternet Sitesi üzerinden verilen reklamları, Kullanıcılar’ın ilgi alanlarına göre özelleştirmek için kullanılmaktadır. İşbu bilgiler, hedef kitle çalışmalarında kullanılırken diğer Kullanıcılar’a ait bilgilerle birlikte olmak üzere reklam yayıncıları ile paylaşılabilir. Bu bilgiler herhangi bir şekilde kişisel bilgi (isim, soyadı, T.C Kimlik No, cinsiyet, yaş vb.) içermeyip, grup olarak Kullanıcı eğilimleri ile ilgili çalışmalar yapmak ve hedef kitleyi derlemek etmek amacıyla kullanılmaktadır. İşbu Gizlilik Şartları’nı kabul edilmesiyle, anonim bilgilerin reklam yayıncıları ile reklam ve tanıtım amacıyla paylaşılmasına onay verilmektedir." },
      { p: "4. Google dahil üçüncü taraf sağlayıcılar, İnternet Sitesi reklamlarını internet üzerindeki yayıncı sitelerde yer verdikleri banner alanlarında gösterecektir. Ziyaretçilerin İnternet Sitesi’ne geçmişte yaptığı ziyaretleri temel alarak reklamlarla ilgili bilgi toplamak, reklamları optimize etmek ve yayınlamak üzere İnternet Sitesi tarafından ve Google dahil üçüncü taraf sağlayıcılarca birinci taraf çerezler ile üçüncü taraf çerezler birlikte kullanılmaktadır." },
      { p: "5. Kişisel Kullanıcı bilgileri, ancak resmi makamlarca talep edilmesi halinde ve yürürlükteki emredici mevzuat hükümleri gereğince açıklama yapmak zorunda olunduğu durumlarda resmi makamlara açıklanacaktır." },
      { p: "6. Ödeme sayfasında talep edilen Kullanıcı kredi kartı bilgileri, İnternet Sitesi'nden alışveriş yapan Kullanıcılar’ın güvenliğini en üst seviyede tutmak amacıyla hiçbir şekilde İnternet Sitesi veya hizmet veren üçüncü şirketlerin sunucularında tutulmamaktadır. Bu şekilde ödemeye yönelik tüm işlemlerin İnternet Sitesi arayüzü üzerinden ilgili banka ile Kullanıcı’nın kullanmakta olduğu cihaz arasında gerçekleşmesi sağlanmaktadır." },
      { p: "7. Kullanıcı, işbu Gizlilik Şartları’nı onaylayarak, Şirket ile paylaşmış olduğu bilgilerin şahsına ait olduğunu ve bu bilgilerin, satış ve pazarlama faaliyetlerinin yürütülebilmesi amacıyla ve her türlü iletişim aracına uygun bildiriminin sağlanması için Şirket’in iştiraki olan diğer tüzel kişiler ile de paylaşılabileceğine onay vermektedir." },
      { p: "8. İnternet Sitesi üyeliği çerçevesinde gönderilen e-postaların alt kısmında bulunan “Kampanya duyurularından haberdar olmak istemiyorsanız lütfen tıklayınız.” linkine tıklayarak, veya site üzerinden \"Hesabım\" bölümünde bulunan \"Üyelik Bilgileri Güncelleme\" alanında \"Reklam ve duyuru e-postalarını almak istiyorum\" seçeneğini boş bırakarak e-posta gönderim listesinden her zaman çıkış yapılabilmektedir." },
      { h: "ÇEREZ POLİTİKASI" },
      { p: "www.stlteknoloji.com olarak, web sitemizin kullanımını kolaylaştırmak ve sitemizin kullanımını kişiselleştirmek amacıyla çerezler, piksel etiketleri (\"pikseller\") ve yerel saklama teknolojileri kullanmaktayız. Bu sayfanın, anılan teknolojilerin niçin kullanıldıklarını ve bunları kontrol etmeyi veya -tercihiniz bu yöndeyse- silmeyi anlamanıza yardımcı olmasını istiyoruz." },
      { p: "Çerez Nedir?" },
      { p: "Günümüzde neredeyse her web sitesi çerez kullanmaktadır. Size daha iyi, hızlı ve güvenli bir deneyim sağlamak için, çoğu internet sitesi gibi biz de çerezler kullanıyoruz. Çerez, bir web sitesini ziyaret ettiğinizde cihazınıza (örneğin; bilgisayar veya cep telefonu) depolanan küçük bir metin dosyasıdır. Çerezler, bir web sitesini ilk ziyaretiniz sırasında tarayıcınız aracılığıyla cihazınıza depolanabilirler. Aynı siteyi aynı cihazla tekrar ziyaret ettiğinizde tarayıcınız cihazınızda site adına kayıtlı bir çerez olup olmadığını kontrol eder. Eğer kayıt var ise, kaydın içindeki veriyi ziyaret etmekte olduğunuz web sitesine iletir. Bu sayede web sitesi, sizin siteyi daha önce ziyaret ettiğinizi anlar ve size iletilecek içeriği de ona göre tayin eder." },
      { p: "Çerezler Neden Kullanılır?" },
      { p: "Bazı çerezler, daha önceki ziyaretlerinizde kullandığınız tercihlerin web sitesi tarafından hatırlanmasını sağlayarak, sonraki ziyaretlerinizin çok daha kullanıcı dostu ve kişiselleştirilmiş bir deneyim sunmasını sağlar." },
      { p: "Çerezleri Kontrol Etme ve Silme" },
      { p: "Çerezlerin kullanımına ilişkin tercihlerinizi değiştirmek ya da çerezleri engellemek veya silmek için tarayıcınızın ayarlarını değiştirmeniz yeterlidir. Birçok tarayıcı çerezleri kontrol edebilmeniz için size çerezleri kabul etme veya reddetme, yalnızca belirli türdeki çerezleri kabul etme ya da bir web sitesi cihazınıza çerez depolamayı talep ettiğinde tarayıcı tarafından uyarılma seçeneği sunar. Aynı zamanda daha önce tarayıcınıza kaydedilmiş çerezlerin silinmesi de mümkündür. Çerezleri kontrol edilmesine veya silinmesine ilişkin işlemler kullandığınız tarayıcıya göre değişebilmektedir. Bazı popüler tarayıcıların çerezlere izin verme ya da çerezleri engelleme veya silme talimatlarına aşağıdaki linklerden ulaşılması mümkündür." },
      { p: "www.stlteknoloji.com Tarafından Kullanılan Çerezler" },
      { p: "Web sitemizde kullanılan hiçbir çerez, kimliğinizin saptanmasına yarayacak verileri işlememektedir. Aşağıda web sitemizde kullanılmakta olan çerez türleri ve bu çerezlerin hangi amaçla kullanıldıkları detaylı bir şekilde ortaya konmuştur." },
      { p: "Kategori 1- Kesinlikle Gerekli Çerezler" },
      { p: "Bu çerezler, web sitesini dolaşmanıza ve web sitesinin güvenli alanlarına erişmenin sağlanması ve izinlerin ortaya konması için önemlidir. Bu çerezler olmadan, sitemizde bulunan alışveriş sepeti veya ödeme sayfası gibi talep ettiğiniz hizmetler sağlanamaz." },
      { h: "ÇEREZ ÇEREZ'İN TANIMI" },
      { p: "stlteknoloji Sitede oturum kaydınızı takip edebilmemiz için kullandığımız çerezdir." },
      { p: "lang Sitenin görüntülendiği dili ifade eden çerezdir. Arayüzde görüntülenecek dili belirler." },
      { p: "stlteknoloji_pop Sitede bir popup kullanılıyorsa gösterilip gösterilmediğinin kaydını tutmak için üretilen çerezdir." },
      { p: "cookieconsent_status Çerez Politikası bildirimi için üretilen çerezdir. Kaydı tutularak bu bildirimin tekrar görüntülenmemesi sağlanır." },
      { p: "Kategori 2- 'Performans' Çerezleri" },
      { p: "Bu çerezler, ziyaretçilerimizin web sitesini nasıl kullandıkları hakkında bilgi toplamaktadır. Örneğin, hangi ziyaretçilerin en sık gidecekleri sayfaları ve web sayfalarından hata mesajları alıp almadıklarını bilmemizi sağlar. Bu çerezler, bir ziyaretçiyi tanımlayan bilgileri değil anonim olar" },
      { h: "ÇEREZ ÇEREZ'İN TANIMI" },
      { p: "_ga Google Universal Analytics ile ilişkisi olan bir çerezdir. Bu çerez, istemci tanımlayıcısı olarak rastgele oluşturulmuş bir numara atayarak benzersiz kullanıcıları ayırmak için kullanılır. Sitelerin analiz raporları için ziyaretçi, oturum ve kampanya verilerini hesaplamak için kullanılır." },
      { p: "_gat Google Universal Analytics ile ilişkilidir - yüksek trafik alanlarındaki verilerin toplanmasını sınırlar" },
      { p: "_gid Tek bir tarayıcı oturumu sırasında bir ziyaretçiyi benzersiz şekilde tanımlar ve bir hedef kitleye örnek olduğunu gösterir." },
      { p: "_cfduid Cloudflare servisleri kullanılması durumunda üretilecek çerezdir. Benzersiz kullanıcı ID'si atayarak raporlama ve analiz yapılması için kullanılır." },
      { p: "Kategori 3- Hedefleme / Reklam Çerezleri" },
      { p: "Bu çerezler, reklamları sizinle ilgi alanlarınıza uygun olarak reklam kampanyasının etkinliğini ve reklam sayısını ölçmek için kullanılmaktadır. Genellikle web sitesi operatörünün izniyle reklam ağları tarafından yerleştirilirler. Ziyaret ettiğiniz web sitelerini hatırlıyorlar ve bu bilgiler 3. Kişi niteliğindeki reklam verenler gibi diğer kuruluşlarla paylaşılmaktadır. Çok sıklıkla çerezler hedefleme amacıyla diğer reklamların sitelerine link vermektedir. Bu kategoride çerez kullanmıyoruz." },
      { h: "ÇEREZ ÇEREZ'İN TANIMI" },
      ],
    },
  },
};
