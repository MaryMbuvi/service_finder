// src/data/resources.js

export const masterResources = [
  // --- ABORTION ACCESS SECTOR ---
  {
    name: '🔑 I Need an A (ineedana.com)',
    desc: 'The gold-standard tool to find vetted, real abortion clinics near you. Deep-links your age and location safely to filter out active legal bans.',
    link: 'https://www.ineedana.com',
    category: 'abortion',
    deliveryType: 'in-person',
    costType: 'insurance',
    requiresParentalConsent: false // Handled dynamically via their internal search tool query
  },
  {
    name: '📦 Plan C (plancpills.org)',
    desc: 'A comprehensive, trusted directory detailing exactly how people safely order abortion pills online and receive them discretely by mail, matching local legal policies.',
    link: 'https://www.plancpills.org',
    category: 'abortion',
    deliveryType: 'mail',
    costType: 'free-cash',
    requiresParentalConsent: false // Mail/telehealth networks often have explicit privacy pathways for youth
  },
  {
    name: '🏥 Abortion Finder (abortionfinder.org)',
    desc: 'A massive, highly updated national search portal featuring over 750 verified providers and telehealth services across the United States.',
    link: 'https://www.abortionfinder.org',
    category: 'abortion',
    deliveryType: 'in-person',
    costType: 'insurance',
    requiresParentalConsent: false // Handled dynamically via their query routing
  },

  // --- STI TESTING SECTOR ---
  {
    name: '🔬 TakeMeHome (takemehome.org)',
    desc: 'Get an anonymous, free or low-cost STI test kit mailed right to your door. You do a quick swab, drop it in the mail for free, and view your private results online.',
    link: 'https://takemehome.org',
    category: 'testing',
    deliveryType: 'mail',
    costType: 'free-cash',
    requiresParentalConsent: false // Explicitly built for confidential, home-based youth testing
  },
  {
    name: '🏥 Planned Parenthood Care Locator',
    desc: 'Find a safe physical clinic near you for immediate testing, treatment, and hands-on evaluations from compassionate care teams.',
    link: 'https://www.plannedparenthood.org',
    category: 'testing',
    deliveryType: 'in-person',
    costType: 'insurance',
    requiresParentalConsent: true // Physical checkups using standard health insurance may trigger parental notifications or require consent depending on local state health codes
  },

  // --- CONTRACEPTIVE SECTOR ---
  {
    name: '🚨 Emergency Pill Locator (ec.princeton.edu)',
    desc: 'Lost your protection window? Use this specialized emergency hub to find out exactly which local pharmacies have over-the-counter pills like Plan B sitting on shelves.',
    link: 'https://ec.princeton.edu',
    category: 'contraceptive',
    deliveryType: 'in-person',
    costType: 'free-cash',
    requiresParentalConsent: false // Emergency contraception has no federal age restrictions for over-the-counter purchase
  },
  {
    name: '💊 Twentyeight Health (twentyeighthealth.com)',
    desc: 'A highly youth-centered telehealth platform where doctors prescribe ongoing birth control online and ship it discretely to your room using insurance or low cash rates.',
    link: 'https://www.twentyeighthealth.com',
    category: 'contraceptive',
    deliveryType: 'mail',
    costType: 'insurance',
    requiresParentalConsent: true // Telehealth prescribing apps usually require legal medical consent or parental sign-off for users under 18 or 13 depending on state rules
  },

  // --- GENERAL HEALTH INFORMATION SECTOR ---
  {
    name: '💬 Scarleteen (scarleteen.com)',
    desc: 'The ultimate, non-judgmental, inclusive guide to sex, bodies, boundaries, and relationships built entirely for teenagers and young adults.',
    link: 'https://www.scarleteen.com',
    category: 'all',
    deliveryType: 'all',
    costType: 'all',
    requiresParentalConsent: false // Educational platforms never require parental consent
  }
]