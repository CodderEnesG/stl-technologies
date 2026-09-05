import type { SiteContent } from "./tr";

// English content — mirrors tr.ts structure exactly.

export const en: SiteContent = {
  meta: {
    siteTitle: "STL Teknoloji",
    home: { title: "STL Teknoloji — Oxyra, Fressi, wexta, BNK", desc: "A manufacturing and technology company in Istanbul with a 35,000 m² facility, uniting four brands under one roof." },
    oxyra: { title: "Oxyra — Gaming Gear | STL Teknoloji", desc: "Gaming chairs and equipment. An STL Teknoloji brand." },
    fressi: { title: "Fressi — Technology That Feels Good at Home | STL Teknoloji", desc: "Retro-designed small home appliances: coffee machines, kettles, toasters and more." },
    wexta: { title: "wexta — Luggage & Travel | STL Teknoloji", desc: "Durable luggage made in Istanbul. 100% local production, exported to 20 countries." },
    bnk: { title: "BNK — Beauty Net Korea | STL Teknoloji", desc: "The brand that turns K-beauty skincare into a simple routine." },
  },

  nav: {
    brandsLabel: "Brands",
    about: "About",
    contact: "Contact",
    menuAria: "Menu",
  },

  footer: {
    tagline: "Four brands, one manufacturing discipline. Made in Istanbul.",
    brandsHeading: "Brands",
    corporateHeading: "Corporate",
    contactHeading: "Contact",
    kvkk: "Privacy Notice (KVKK)",
    privacy: "Privacy & Cookie Policy",
    rights: "All rights reserved.",
  },

  home: {
    introEyebrow: "STL Teknoloji",
    introTitle: "Four brands, one roof",
    introText:
      "We bring together four brands that speak to different worlds under the same production and design discipline — from gaming to the kitchen, from travel to skincare.",
    stats: [
      { n: "2016", l: "Founded" },
      { n: "35,000 m²", l: "Production facility" },
      { n: "20", l: "Export countries" },
    ],
    bento: {
      eyebrow: "Group",
      title: "The STL World",
      description: "Manufacturing, export and brand management — all under one roof in Arnavutköy.",
      production: { kicker: "Production", text: "From concept to production under one roof at our 35,000 m² facility in Arnavutköy." },
      exportKicker: "Export",
      exportStat: "20",
      exportText: "countries with points of sale",
      valueKicker: "Value",
      valueText: "Four different categories, one production quality standard.",
      oem: { kicker: "OEM manufacturing", text: "We produce luggage for Türkiye's leading textile brands." },
    },
    whoWeAre: {
      eyebrow: "Who We Are",
      title: "Four brands, one manufacturing discipline.",
      paragraphs: [
        "We were founded in Istanbul in 2016, making luggage. Today, at our 35,000 m² facility in Arnavutköy, we run four brands under one manufacturing and design discipline — from gaming equipment to small home appliances, from travel to skincare.",
        "Our production backbone is local. We make OEM luggage for Türkiye's leading textile brands and export to 20 countries. The quality line we hold for OEM work is the same line we hold for our own brands.",
      ],
    },
    portfolioEyebrow: "Portfolio",
    portfolioTitle: "Our brands",
    portfolioDescription: "Four brands, each in its own field, all shaped by the same production discipline.",
    explore: "Explore",
    discoverBrand: "Discover the brand",
    exportMap: {
      kicker: "Exports",
      unit: "export markets",
      title: "Made in Arnavutköy, shipped worldwide.",
      body: "Our own brands and the products we manufacture as OEM reach retail in Türkiye and in 20 countries.",
      legendHome: "Production base",
      legendMarket: "Export market",
      alt: "World map of STL Teknoloji export markets",
      pendingNote: "The country list will be updated.",
    },
    cube: {
      roleDescription: "Brand selector cube",
      hint: "Move the pointer across, or use the arrow keys.",
    },
    partnersKicker: "References",
    partnersTitle: "Brands we work with.",
    partnersNote: "A selection of our corporate manufacturing and supply partnerships.",
    ctaButton: "Get in touch",
  },

  brands: {
    oxyra: {
      tagline: "The advantage is on your side.",
      summary: "Gaming chairs and equipment built for long sessions.",
      channel: "Browse on stlteknoloji.com",
      about: {
        kicker: "About Oxyra",
        title: "Built for long sessions.",
        body: "Oxyra is STL Teknoloji's gaming brand. Our gaming chairs are developed with the production discipline of our Istanbul facility: a solid frame, long-lasting upholstery and ergonomics that hold their shape through hours of play.",
      },
      stats: [
        { n: "3", l: "Product categories" },
        { n: "2016", l: "Manufacturer-backed" },
        { n: "TR", l: "Local production" },
      ],
      brandAbout: {
        eyebrow: "The brand",
        title: "X is on the player's side.",
        body: [
          "Oxyra is STL Teknoloji's gaming equipment brand. It is developed in the same facility, on the same quality line, and holds to a single design language from chairs to peripherals.",
          "The goal isn't a flashy accessory — it's gear that holds its shape through hours of play. Clean lines, restrained lighting, solid materials.",
        ],
      },
      // Brand-wide claims — true for every chair. Model-specific figures live in
      // the spotlight block below, tied to that one product.
      specBand: [
        { k: "Frame", v: "Steel chassis" },
        { k: "Ergonomics", v: "Adjustable lumbar & neck support" },
        { k: "Upholstery", v: "Wear-resistant surface" },
        { k: "Mechanism", v: "Reclining backrest" },
      ],
      spotlight: {
        kicker: "Featured model",
        title: "Mooncha — gaming chair with footrest.",
        text: "Breathable, non-sweat leather surface; six-point support system and a retractable footrest. The figures below belong to this model.",
        cta: "View product",
        specs: [
          { k: "Recline", v: "145°" },
          { k: "Seat width", v: "51 cm" },
          { k: "Load capacity", v: "136 kg" },
          { k: "Durability test", v: "100,000 cycles" },
        ],
        alts: [
          "Oxyra Mooncha gaming chair, white",
          "Elastic comfort layer cutaway",
          "Six-point support system",
          "Chair dimensions",
          "Wingless seat area",
          "145° adjustable recline",
          "Durability test",
        ],
      },
      hotspotsEyebrow: "A closer look",
      hotspotsTitle: "Built for long sessions.",
      hotspotsHint: "Hover or tap the points",
      hotspots: [
        {
          title: "Ergonomic support",
          text: "Lumbar and neck cushions with adjustable armrests; your spine keeps its natural curve through long sessions.",
          x: 62,
          y: 28,
        },
        {
          title: "Solid frame",
          text: "Steel chassis and quality mechanism; the same seating feel years down the line.",
          x: 47,
          y: 70,
        },
        {
          title: "Manufacturer-backed",
          text: "No middlemen: we stand behind what leaves our factory, spare parts included.",
          x: 47,
          y: 83,
        },
      ],
      rangeEyebrow: "Product range",
      rangeTitle: "Three parts of the setup",
      rangeDescription: "From the chair to peripherals — three product families in one design language.",
      range: [
        {
          label: "Gaming Chairs",
          text: "Steel frame and adjustable support, built for long sessions.",
          image: "/images/oxyra/koltuk-oxyra.jpg",
        },
        {
          label: "Audio",
          text: "Closed-back design for in-game directionality and clear comms.",
          image: "/images/oxyra/headset-oxyra.jpg",
        },
        {
          label: "Peripherals",
          text: "Light body, precise sensor — response at the speed of your reflex.",
          image: "/images/oxyra/mouse-oxyra.jpg",
        },
      ],
      editorial: {
        title: "As fast as your reflex.",
        text: "A play is decided in milliseconds. The Oxyra mouse tracks without tiring your hand — light body, precise sensor, balanced weight.",
      },
      quote: { text: "Award-winning design that rewrites the rules of the game.", source: "Oxyra" },
      ctaTitle: "Complete your setup",
    },
    fressi: {
      tagline: "Technology that feels good at home.",
      summary: "Retro-designed small appliances; from coffee to the kitchen, products that suit your home.",
      channel: "Discover at fressihome.com",
      scriptAccent: "feels good at home",
      about: {
        kicker: "About Fressi",
        title: "The elegance of the past, with today's technology.",
        body: "Fressi brings a fresh take to small home appliances with its retro and vintage style. Kettles, coffee machines, toasters and home living products combine simple design with reliable performance. The goal isn't show: it's making the small moments of everyday life more elegant and easier.",
      },
      stats: [
        { n: "80+", l: "Products" },
        { n: "6", l: "Categories" },
        { n: "2 years", l: "Warranty" },
      ],
      valueProps: [
        { title: "Retro-modern design", text: "Nostalgic lines with today's safety and efficiency standards." },
        { title: "Colors that suit your home", text: "Cream, green and navy tones; a palette that speaks together." },
        { title: "Benefit-focused", text: "Not a pile of specs; concrete value for daily life." },
      ],
      hero: {
        slides: [
          {
            title: "Technology that feels good at home.",
            sub: "Retro lines, everyday practicality.",
            cta: "Explore Fressi products",
          },
          {
            title: "You're the head chef in your kitchen.",
            sub: "Get it perfectly right the first time.",
            cta: "See the products",
          },
        ],
        prev: "Previous slide",
        next: "Next slide",
      },
      gallery: {
        eyebrow: "Fressi at home",
        title: "When Fressi moves in",
      },
      circles: {
        eyebrow: "Product world",
        title: "What are we making today?",
      },
      reviews: {
        eyebrow: "Customer reviews",
        title: "What Fressi owners say",
        count: (n: number) => `${n} reviews`,
        verified: "Verified purchase",
        all: "Read all reviews on fressihome.com",
      },
      categoriesLabel: "What are you looking for?",
      vitrineTitle: "Highlights",
      editorial: {
        title: "From the first coffee of the morning to the evening tea.",
        text: "Fressi products look good on the counter; but their real job is making every hour of the day a little more enjoyable.",
      },
      quote: { text: "Fressi is technology that makes daily life easier, suits the home, and feels good.", source: "Brand statement" },
      ctaTitle: "A fresh breath for your kitchen",
    },
    wexta: {
      tagline: "Every journey starts with a dream.",
      summary: "Durable, spacious luggage made in Istanbul; exported to 20 countries.",
      channel: "Browse on stlteknoloji.com",
      slider: [
        { title: "One step ahead of time", cta: "Explore" },
        { title: "Every journey starts with a dream", cta: "Browse products" },
        { title: "Original, stylish and elegant models", cta: "Browse products" },
      ],
      heroAlt: {
        label: "Travel collection",
        title: "Off the line, ready for the trip.",
        lead: "Hard-shell luggage made on our own line in Arnavutköy: light, quiet and built to last for years.",
        cta: "Browse products",
      },
      about: {
        kicker: "About wexta",
        title: "Straight from the factory, ready for the journey.",
        body: "wexta is STL Teknoloji's luggage brand. The luggage we have produced since 2016 at our 35,000 m² facility in Arnavutköy, Istanbul is also the choice of Türkiye's leading textile brands. Every stage from sheet extrusion to assembly happens under one roof: 100% ABS shells, steel-screwed accessories.",
      },
      stats: [
        { n: "35,000 m²", l: "Production facility" },
        { n: "20", l: "Export countries" },
        { n: "100%", l: "Local production" },
      ],
      specBand: [
        { k: "Shell", v: "100% ABS" },
        { k: "Sizes", v: "20 / 24 / 28 inch" },
        { k: "Assembly", v: "Steel screws" },
        { k: "Production", v: "100% local" },
      ],
      shells: {
        eyebrow: "Shell",
        title: "Three shells, three journeys.",
        cta: "See the series",
        items: [
          { title: "ABS shell", text: "The shell of most series: 100% ABS. Flexes on impact and returns to shape; steel-screwed accessories." },
          { title: "Polypropylene", text: "The PP10 series: a wave-formed, more flexible shell. Absorbs impact and keeps the weight down." },
          { title: "Kids' size", text: "WX-412 / 414 / 415: embossed character, coloured wheels and handle. A child's first suitcase of their own." },
        ],
      },
      guide: {
        eyebrow: "Size guide",
        title: "Pick the size for your journey.",
        lead: "Three sizes, one mould language: 20, 24 and 28 inches. Every series comes as a set of three; the length of the trip tells you which one is yours.",
        note: "Day counts are a suggestion; carry-on limits vary by airline.",
        sizes: [
          { inch: "20", label: "Cabin", days: "2–4 days", text: "Short city breaks and business trips. It travels with you; no waiting at the belt." },
          { inch: "24", label: "Medium", days: "5–7 days", text: "The right balance for a week away: checked in, yet easy to roll with one hand." },
          { inch: "28", label: "Large", days: "1–2 weeks", text: "Long trips and family luggage. The largest of the set." },
        ],
        set: { label: "Set of three", text: "20 · 24 · 28 together; one series, one colour." },
      },
      series: {
        eyebrow: "Series guide",
        title: "Browse by series.",
        lead: "Eight adult series and a kids' series. All come off the same line in the same three sizes; the surface pattern and the palette make the difference.",
        catalogLabel: "2023 catalogue (PDF)",
        colorsLabel: (n: number) => `${n} colours`,
        sizesLabel: "Sizes",
        sizesValue: "20 · 24 · 28 inch",
        kidsSize: "Kids' size",
        materialLabel: "Shell",
        material: { abs: "100% ABS", pp: "Polypropylene" },
        productCta: "Product page",
        quoteCta: "Get a quote",
        items: {
          "VL-280": { name: "Milano", text: "Classic vertically ribbed shell; the widest colour range in the catalogue." },
          "WX-1": { name: "WX-1", text: "Square-textured embossed surface, matte finish; eight colours." },
          "WL-240": { name: "WL-240", text: "Wide horizontal lines with a contrast-coloured wheel detail." },
          "WX-230": { name: "WX-230", text: "Fine vertical lines, pastel palette." },
          "WX-300": { name: "WX-300 Printed", text: "A printed marble pattern on a plain shell." },
          "WX-330": { name: "Diamond", text: "Diamond-embossed front, metallic colours." },
          "WX-1001": { name: "WX-1001", text: "Chevron-embossed shell; six colour options." },
          "WX-PP10": { name: "PP10", text: "Polypropylene shell with a wave-formed surface; flexes on impact." },
          "WX-41x": { name: "Kids' series", text: "WX-412 / 414 / 415: embossed character, coloured wheels and handle; kids' size." },
        },
      },
      hotspotsEyebrow: "A closer look",
      hotspotsTitle: "Durability is in the details.",
      hotspotsHint: "Hover or tap the dots",
      hotspots: [
        { title: "ABS shell", text: "100% ABS shell: it flexes on impact and returns to shape. Years on the belt, same suitcase.", x: 50, y: 58 },
        { title: "Double wheels", text: "360° spinning double wheels on all four corners; low centre of gravity, glides silently with one hand.", x: 38, y: 93 },
        { title: "Combination lock", text: "Lock recessed into the shell: nothing sticks out, nothing catches on the belt or in transit.", x: 66, y: 50 },
        { title: "Telescopic handle", text: "Multi-stage aluminium handle; adjusts to your height and stays put once locked.", x: 55, y: 14 },
      ],
      stages: {
        eyebrow: "Production",
        title: "From sheet to suitcase in three stages.",
        lead: "Raw material enters the plant as granules and leaves as luggage. Every step in between happens under the same roof in Arnavutköy.",
        items: [
          { n: "01", title: "Extrusion", text: "Two extruder lines draw ABS and PC raw material into sheets 1–4 mm thick." },
          { n: "02", title: "Vacuum forming", text: "The sheet is formed in vacuum moulds into 20, 24 and 28 inch shells." },
          { n: "03", title: "Assembly", text: "Zip, wheels, handle and lining are fixed to the shell with steel screws; products that pass quality control are packed." },
        ],
      },
      parts: {
        title: "Screwed assembly, replaceable parts.",
        text: "Every accessory on the shell is fixed with steel screws. If a wheel or handle wears out, the part comes off and a new one goes on; the suitcase keeps travelling.",
      },
      editorial: {
        title: "Light travel, clear route.",
        text: "A good suitcase makes you forget it exists: it's light, rolls silently, and comes out of baggage claim intact. That's exactly what wexta aims for.",
      },
      quote: { text: "Every journey starts with a dream.", source: "wexta" },
      ctaTitle: "Ready for the journey?",
    },
    bnk: {
      tagline: "Korean glow, daily ritual.",
      summary: "Turns K-beauty skincare into a simple, effective routine.",
      channel: "Shop at beautynetkorea.com.tr",
      about: {
        kicker: "About BNK",
        title: "Korean skincare, in a simple routine.",
        body: "BNK — Beauty Net Korea — brings the careful formulation approach of Korean cosmetics to Türkiye. The range covers three Korean brands: TENZERO, FOODAHOLIC and DR. MELOSO. Instead of crowded shelves, a small set of products with a clear purpose: cleanse, balance, feed, protect. Every product is made in Korea and reaches Türkiye through beautynetkorea.com.tr; the routine takes four steps and two minutes, morning and evening.",
      },
      stats: [
        { n: "70+", l: "Products" },
        { n: "3", l: "Korean brands" },
        { n: "12", l: "Categories" },
      ],
      specBand: [
        { k: "Approach", v: "Korean skincare" },
        { k: "Routine", v: "Morning and evening" },
        { k: "Steps", v: "Two minutes" },
        { k: "Range", v: "Few, and clearly useful" },
      ],
      valueProps: [
        { title: "Less, but better", text: "A product selection with clear purpose that keeps the routine simple." },
        { title: "Korean formulas", text: "K-beauty's proven approach to ingredients." },
        { title: "Daily ritual", text: "Morning and evening; care completed in two minutes." },
      ],
      hero: {
        editorialHero: {
          title: "Korean glow, a daily ritual.",
          sub: "Not a crowded shelf — products with a clear job: cleanse, balance, feed, protect.",
          cta: "Explore the routine",
        },
        prev: "Previous slide",
        next: "Next slide",
      },
      routine: {
        eyebrow: "The Korean routine",
        title: "The steps a routine can't skip",
        description: "Korean skincare works in order: cleanse first, then balance, then feed, and protect last.",
        steps: [
          { n: "01", label: "Cleanse", text: "Lifts the day's dirt and excess sebum without stripping the skin." },
          { n: "02", label: "Balance", text: "Toner rebalances pH so the following steps absorb properly." },
          { n: "03", label: "Feed", text: "Serum and moisturiser deliver the actives and hydration skin needs." },
          { n: "04", label: "Protect", text: "No routine is complete without SPF — the last morning step." },
        ],
      },
      bestSellers: {
        eyebrow: "From the store",
        title: "Best sellers",
        badges: { best: "Best seller", new: "New" },
        view: "View in store",
      },
      barLinks: [
        { label: "Best Sellers", href: "#en-cok-satanlar" },
        { label: "Routine", href: "#rutin" },
        { label: "Blog", href: "#blog" },
      ],
      blog: {
        eyebrow: "Skin journal",
        title: "Tips from the Korean routine",
        soon: "Coming soon",
        posts: [
          {
            kicker: "Basics",
            title: "Why the Korean routine follows an order",
            excerpt: "Going from thin to rich textures gives every product the sequence it needs to work.",
            readingTime: "4 min",
          },
          {
            kicker: "Sun care",
            title: "Applying the right amount of SPF",
            excerpt: "The number on the label only becomes real with enough product and regular reapplication.",
            readingTime: "3 min",
          },
          {
            kicker: "Skin type",
            title: "Choosing a moisturiser for combination skin",
            excerpt: "If the T-zone shines while cheeks stay dry, the weight of the product is usually the problem.",
            readingTime: "5 min",
          },
        ],
      },
      allProducts: "All products",
      categoriesLabel: "Routine",
      vitrineTitle: "Featured products",
      editorial: {
        title: "Glow is the result of consistent care.",
        text: "The secret of K-beauty isn't a miracle, it's consistency. BNK keeps the routine simple to make that consistency easy.",
      },
      quote: { text: "Korean glow, daily ritual.", source: "BNK" },
      ctaTitle: "Build your routine",
    },
  },

  brandPage: {
    stlBrandBadge: "An STL Teknoloji brand",
    productsCount: (n: number) => `${n} products`,
    orContact: "or contact us",
    categoriesTitle: "Categories",
  },

  // "About" is not a separate page; these strings feed the about and
  // mission/vision sections on the landing page.
  about: {
    missionEyebrow: "Mission & Vision",
    missionTitle: "What we aim for",
    mission: {
      label: "Mission",
      text: "To hold the same manufacturing and design standard across all four of our brands, whatever the category. With our innovative approach, to offer products that fit every budget and last for years.",
    },
    vision: {
      label: "Vision",
      text: "To grow on a 100% local production principle at our 35,000 m² state-of-the-art facility, and to turn our brand portfolio — from gaming equipment to home appliances to skincare — into a group preferred worldwide.",
    },
    lineAlt: "STL Teknoloji production line",
    buildingAlt: "STL Teknoloji production facility, Arnavutköy",
    facilityAlt: "STL Teknoloji production facility",
  },

  contact: {
    eyebrow: "Contact",
    title: "Let's talk.",
    lead: "Reach us about dealerships, partnerships, OEM manufacturing or anything about our products.",
    phoneLabel: "Phone",
    emailLabel: "E-mail",
    addressLabel: "Address",
    hoursLabel: "Working hours",
    formTitle: "Leave a message",
    nameLabel: "Full name",
    emailFieldLabel: "E-mail",
    companyLabel: "Company (optional)",
    messageLabel: "Your message",
    kvkkText: "I consent to the processing of my personal data under the Privacy Notice.",
    kvkkLink: "Privacy Notice",
    submit: "Send",
    submitNote: "Pressing Send opens your e-mail app; the message goes to info@stlteknoloji.com.",
    mapTitle: "STL Teknoloji location",
  },

  notFound: {
    title: "Page not found",
    body: "The page you are looking for may have been moved or removed.",
    home: "Back to home",
  },
};
