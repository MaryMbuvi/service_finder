// src/data/resources.js

export const masterResources = [
  // ============================================================
  // 1. ABORTION CARE OPTIONS
  // ============================================================
  {
    name: "Plan C Pills Directory",
    desc: "A comprehensive, safe directory providing verified routes to order abortion pills by mail, including out-of-state shield-law clinics operating outside restricted tracking loops.",
    link: "https://www.plancpills.org",
    category: "abortion",
    subType: "all",
    deliveryType: "mail",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "I Need An A",
    desc: "A personalized, completely private search tool that finds open, active clinical slots, travel networks, and exact up-to-date procedural care facilities closest to your location.",
    link: "https://www.ineedana.com",
    category: "abortion",
    subType: "all",
    deliveryType: "in-person",
    costType: "all",
    requiresParentalConsent: false // Overridden by AppV2 code block logic for minor states
  },
  {
    name: "Abortion Finder National Directory",
    desc: "A vetted national database featuring over 750 verified brick-and-mortar health centers, tracking regional capacity limits, and operational scheduling timelines.",
    link: "https://www.abortionfinder.org",
    category: "abortion",
    subType: "all",
    deliveryType: "in-person",
    costType: "all",
    requiresParentalConsent: false
  },
  {
    name: "M+A Hotline",
    desc: "A secure, confidential network of licensed doctors and clinicians providing pro bono medical guidance, side-effect triage, and support for self-managed abortion pill tracking.",
    link: "https://mahotline.org",
    category: "abortion",
    subType: "all",
    deliveryType: "mail", // Remote/text consultation
    costType: "free-cash",
    requiresParentalConsent: false
  },

  // ============================================================
  // 2. STI DIAGNOSTICS & TESTING
  // ============================================================
  {
    name: "TakeMeHome Home Diagnostic Kits",
    desc: "Fully private, discrete at-home self-swab testing kits shipped blind in completely plain unbranded mailboxes with anonymous online digital tracking keys.",
    link: "https://takemehome.org",
    category: "testing",
    subType: "no", // Routes to regular checkups (No active symptoms)
    deliveryType: "mail",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "Planned Parenthood Facility Locator",
    desc: "Provides rapid walk-in diagnostic testing, professional clinical swabbing, and physical prescription tracking for immediate therapeutic relief and symptom management.",
    link: "https://www.plannedparenthood.org",
    category: "testing",
    subType: "yes", // Routes to active symptoms
    deliveryType: "in-person",
    costType: "all",
    requiresParentalConsent: false
  },
  {
    name: "CDC GetTested National Directory",
    desc: "A government-scrubbed locator pointing to free, low-cost, or completely anonymous local community health departments and public testing pop-ups.",
    link: "https://gettested.cdc.gov",
    category: "testing",
    subType: "all",
    deliveryType: "in-person",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "Scarleteen Sexual Health Testing Advisory",
    desc: "Teen-specific screening instructions, informational guides for assessing physical exposure risks, and safe, confidential regional resource lookups.",
    link: "https://www.scarleteen.com",
    category: "testing",
    subType: "all",
    deliveryType: "mail",
    costType: "free-cash",
    requiresParentalConsent: false
  },

  // ============================================================
  // 3. CONTRACEPTION & BIRTH CONTROL
  // ============================================================
  {
    name: "Bedsider Contraceptive Network",
    desc: "An independent, full-access guide comparing all birth control channels, helping you locate sliding-scale youth providers, and finding discrete generic methods online.",
    link: "https://www.bedsider.org",
    category: "contraceptive",
    subType: "routine",
    deliveryType: "all",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "Twentyeight Health Delivery",
    desc: "An affordable online prescription and mail-delivery hub that ships continuous birth control pills, rings, and emergency morning-after packages in unmarked wrappers.",
    link: "https://www.twentyeighthealth.com",
    category: "contraceptive",
    subType: "all",
    deliveryType: "mail",
    costType: "all",
    requiresParentalConsent: false
  },
  {
    name: "Title X National Family Planning Clinics",
    desc: "A network of federally funded clinics providing confidential, sliding-scale, or completely free ongoing birth control paths, patches, shots, and implants specifically to minors.",
    link: "https://opa-fpclinicfinder.hhs.gov",
    category: "contraceptive",
    subType: "routine",
    deliveryType: "in-person",
    costType: "free-cash",
    requiresParentalConsent: false // Federal Title X clinics legally protect minor confidentiality without parent notice
  },
  {
    name: "Emergency Contraception Website (Not-2-Late)",
    desc: "The ultimate emergency resource database tracking exactly where to locate over-the-counter morning-after options within your zip code within the 5-day protection window.",
    link: "https://ec.princeton.edu",
    category: "contraceptive",
    subType: "emergency",
    deliveryType: "all",
    costType: "free-cash",
    requiresParentalConsent: false
  },

  // ============================================================
  // 4. TESTING FOR PREGNANCY
  // ============================================================
  {
    name: "Free Pregnancy Test Directory",
    desc: "Connects users with non-judgmental, independent local community health clinics providing free clinical-grade pregnancy verification tests without parental signature mandates.",
    link: "https://www.freepregnancytest.com",
    category: "pregnancy",
    subType: "already-positive",
    deliveryType: "in-person",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "All-Options Talkline",
    desc: "A completely peer-vetted, non-judgmental telephone counsel network supporting individuals navigating positive verification results, parenting tracking, or open adoption paths.",
    link: "https://www.all-options.org",
    category: "pregnancy",
    subType: "already-positive",
    deliveryType: "mail", // Remote counseling support
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "Scarleteen Testing and Conception Support Hub",
    desc: "Breaks down accurate timeline protocols for checking urine metrics, handles tracking missteps, and paths free, unmarked screening strips directly to residential mailboxes.",
    link: "https://www.scarleteen.com",
    category: "pregnancy",
    subType: "need-test",
    deliveryType: "mail",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "Family Planning Community Access Centers",
    desc: "Localized state clinics running off independent grant funds providing walk-in verification laboratory metrics completely off insurance trails.",
    link: "https://www.familyplanning.org",
    category: "pregnancy",
    subType: "need-test",
    deliveryType: "in-person",
    costType: "free-cash",
    requiresParentalConsent: false
  },

  // ============================================================
  // 5. LGBTQ+ AFFIRMING CARE
  // ============================================================
  {
    name: "The Trevor Project Crisis Line",
    desc: "Completely untraceable text and telephone systems providing secure, immediate, 24/7 counseling. Instantly strips your device IP numbers and tracking footprints.",
    link: "https://www.thetrevorproject.org",
    category: "lgbtq",
    subType: "all",
    deliveryType: "mail",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "Q Chat Space",
    desc: "A live, chat-focused social safety zone managed by specialized adult monitors, hosting private digital peer discussions exclusively for individuals under 18 years old.",
    link: "https://www.qchatspace.org",
    category: "lgbtq",
    subType: "all",
    deliveryType: "mail",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "PFLAG National Support Map",
    desc: "Connects users with localized peer chapters, safe identity spaces, remote group networks, and legal protection advocates tracking minor care changes across all states.",
    link: "https://pflag.org",
    category: "lgbtq",
    subType: "all",
    deliveryType: "all",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "FOLX Health",
    desc: "A specialized clinical telehealth platform constructed for the LGBTQ+ demographic, delivering discrete expert care, remote guidance, and prescription hormone matching.",
    link: "https://www.folxhealth.com",
    category: "lgbtq",
    subType: "all",
    deliveryType: "in-person", // Filtered out automatically for red-zone minors in engine pipeline
    costType: "all",
    requiresParentalConsent: true
  },

  // ============================================================
  // 6. MENTAL HEALTH SUPPORT
  // ============================================================
  {
    name: "Crisis Text Line",
    desc: "Send text HOME to 741741 for instant connection to trained counselors. This network completely wipes incoming metadata trails and scrambles context arrays for complete privacy.",
    link: "https://www.crisistextline.org",
    category: "mental",
    subType: "distress",
    deliveryType: "mail",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "988 Suicide & Crisis Lifeline",
    desc: "A direct, federal, completely off-the-record crisis router mapping callers and text entries directly to decentralized, private local intervention teams 24 hours a day.",
    link: "https://988lifeline.org",
    category: "mental",
    subType: "distress",
    deliveryType: "mail",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "Open Path Psychotherapy Collective",
    desc: "A national provider registry linking users to local counselors who provide flexible, cash rates from $30-$70. Out-of-pocket transactions prevent record trails from leaking onto guardian insurance billing histories.",
    link: "https://openpathcollective.org",
    category: "mental",
    subType: "routine",
    deliveryType: "all",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "The Jed Foundation Mental Health Center",
    desc: "Provides self-directed mental check toolkits, emotional support management structures, and finders for sliding-scale youth therapeutic services.",
    link: "https://jedfoundation.org",
    category: "mental",
    subType: "routine",
    deliveryType: "all",
    costType: "free-cash",
    requiresParentalConsent: false
  },

  // ============================================================
  // 7. GENDER-BASED VIOLENCE (GBV) SUPPORT
  // ============================================================
  {
    name: "Love is Respect (National Youth Dating Abuse Hotline)",
    desc: "Confidential peer counseling text and link channels built specifically for teens navigating control patterns, physical coercion, or home safety blocks. Encrypted loops wipe records.",
    link: "https://www.loveisrespect.org",
    category: "gbv",
    subType: "digital",
    deliveryType: "mail",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "WomensLaw Legal Guidance Network",
    desc: "Provides clear legal advice detailing how minors can request emergency protection orders, explore immediate shelter placements, or apply for safe emancipation rules without guardian signatures.",
    link: "https://www.womenslaw.org",
    category: "gbv",
    subType: "all",
    deliveryType: "mail",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "Childhelp National Hotline",
    desc: "Professional emergency triage offering private risk planning, safety assessments, and rapid localized intervention metrics operating 24 hours a day.",
    link: "https://www.childhelp.org/hotline/",
    category: "gbv",
    subType: "digital",
    deliveryType: "mail",
    costType: "free-cash",
    requiresParentalConsent: false
  },
  {
    name: "National Network to End Domestic Violence Shelter Network",
    desc: "Direct, unlisted mappings connecting users immediately with underground community shelters, safe houses, and crisis case workers who can supply housing without parental sign-offs.",
    link: "https://nnedv.org",
    category: "gbv",
    subType: "physical",
    deliveryType: "in-person",
    costType: "free-cash",
    requiresParentalConsent: false
  }
];