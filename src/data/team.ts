import type { TeamMember } from '@/types';

const MEMBER_SOCIAL = [
  { platform: 'facebook' as const, url: '#' },
  { platform: 'linkedin' as const, url: '#' },
  { platform: 'tiktok' as const, url: '#' },
];

const EXEC_SOCIAL = MEMBER_SOCIAL;

const ACTIVITY_IMAGES = [
  '/images/leadership/activity-1.png',
  '/images/leadership/activity-2.png',
  '/images/leadership/activity-3.png',
  '/images/leadership/activity-4.png',
  '/images/leadership/activity-5.png',
  '/images/leadership/activity-6.png',
  '/images/leadership/activity-7.png',
];

/**
 * Single source of truth for the people shown on BOTH the homepage
 * `TeamSection` (dashboard) and the `/leadership` page. Names + roles mirror
 * the dashboard, which is the canonical reference.
 */
export const EXECUTIVE_LEADERSHIP: TeamMember[] = [
  {
    id: 'exec-1',
    name: 'Minh Anh Nguyen',
    role: 'President & Chair',
    avatarUrl: '/images/leadership/exec-1.png',
    continent: 'Asia',
    socialLinks: EXEC_SOCIAL,
    year: '2020 - 2026',
    sdgTags: ['SDG4', 'SDG17'],
    bio: [
      'As President & Chair of Youth Organization Union, I have dedicated over six years to bridging youth-led organizations across five continents, building frameworks for cross-cultural collaboration and sustainable impact.',
      'My work focuses on creating inclusive governance structures that amplify youth voices in global policy dialogues, particularly within the UN Sustainable Development Goals framework.',
      'At Y.O.U, I believe that empowering young people to lead with vision and integrity is the most transformative investment we can make for a more just and equitable world.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  {
    id: 'exec-2',
    name: 'Safeen H. Mohammed',
    role: 'Vice President',
    avatarUrl: '/images/leadership/exec-2.png',
    continent: 'Asia',
    socialLinks: EXEC_SOCIAL,
    year: '2022 - 2026',
    sdgTags: ['SDG16', 'SDG10'],
    bio: [
      'As Vice President of Y.O.U, I oversee strategic partnerships and inter-regional coordination, ensuring our continental directors work in alignment toward shared global goals.',
      'With a background in international relations and youth advocacy across West Asia, I bring a perspective shaped by contexts where peace-building and social inclusion are daily imperatives, not abstract ideals.',
      'I am committed to embedding conflict-sensitive approaches into all Y.O.U programs, ensuring our work contributes meaningfully to SDG 16 — Peace, Justice and Strong Institutions.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  {
    id: 'exec-3',
    name: 'Muhammad Younas',
    role: 'Secretary General',
    avatarUrl: '/images/leadership/exec-3.png',
    continent: 'Asia',
    socialLinks: EXEC_SOCIAL,
    year: '2021 - 2026',
    sdgTags: ['SDG4', 'SDG8'],
    bio: [
      'As Secretary General, I manage the operational and institutional backbone of Y.O.U, coordinating communications, governance processes, and documentation across our global network.',
      'My experience spans youth leadership development programs in South Asia, where I have worked to create economic opportunities and quality education pathways for underserved youth communities.',
      'I believe in the power of organized, well-coordinated youth movements to hold institutions accountable and drive systemic change from the ground up.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
];

/**
 * Continental Directors — one canonical list consumed by the dashboard
 * showcase and the `/leadership` continent/region filter.
 */
export const TEAM_DATA: TeamMember[] = [
  // ── Europe ────────────────────────────────────────────────────────────────
  {
    id: 'dir-eu-1', name: 'Sophie Martin', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-1.png', continent: 'Europe', regionGroup: 'Europe',
    socialLinks: MEMBER_SOCIAL, year: '2023', sdgTags: ['SDG5', 'SDG13'],
    bio: [
      'As Continental Director for Europe, Sophie leads Y.O.U\'s engagement across the European region, connecting youth organizations from Western and Central Europe in climate action and gender equality initiatives.',
      'With a background in environmental policy from Sciences Po Paris and experience volunteering with the European Youth Forum, Sophie brings both academic rigor and grassroots energy to her role.',
      'She is passionate about leveraging European institutional frameworks to amplify youth voices in climate negotiations and ensure gender-responsive policies at all levels of governance.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  {
    id: 'dir-eu-2', name: 'Hans Mueller', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-5.png', continent: 'Europe', regionGroup: 'Europe',
    socialLinks: MEMBER_SOCIAL, year: '2024', sdgTags: ['SDG9', 'SDG17'],
    bio: [
      'Hans serves as Continental Director for Northern Europe, focusing on innovation, technology, and sustainable infrastructure projects that connect youth-led startups with global development agendas.',
      'Based in Berlin, Hans has led cross-border youth entrepreneurship programs partnering with universities across Germany, Sweden, and the Netherlands, creating networks for young changemakers.',
      'His vision is for European youth to lead the green and digital transitions not just as beneficiaries, but as architects of the future economy.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  // ── East Asia ─────────────────────────────────────────────────────────────
  {
    id: 'dir-ea-1', name: 'Yuki Tanaka', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-2.png', continent: 'Asia', regionGroup: 'East Asia',
    socialLinks: MEMBER_SOCIAL, year: '2023', sdgTags: ['SDG4', 'SDG11'],
    bio: [
      'Yuki leads Y.O.U\'s East Asia chapter, coordinating youth programs across Japan, South Korea, China, and Taiwan with a focus on sustainable cities and inclusive education systems.',
      'A graduate of the University of Tokyo with experience at the Japan International Cooperation Agency (JICA), Yuki brings deep expertise in development cooperation and youth civic engagement.',
      'She is dedicated to building East Asian youth solidarity networks that bridge historical divides and foster collaborative approaches to shared regional challenges.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  {
    id: 'dir-ea-2', name: 'Ji-woo Park', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-3.png', continent: 'Asia', regionGroup: 'East Asia',
    socialLinks: MEMBER_SOCIAL, year: '2024', sdgTags: ['SDG8', 'SDG10'],
    bio: [
      'Ji-woo is Y.O.U\'s Continental Director for East Asia focused on economic inclusion and reducing inequalities among youth in the region\'s rapidly urbanizing societies.',
      'With a background in social entrepreneurship from Seoul National University and experience at the Asian Development Bank\'s youth programs, Ji-woo brings a strong foundation in evidence-based youth policy.',
      'She advocates for youth-led social enterprises as a key driver of equitable economic growth across East Asia.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  // ── Southeast Asia ────────────────────────────────────────────────────────
  {
    id: 'dir-sea-1', name: 'Trần Nguyễn Mai Trinh', role: 'Continental Director',
    avatarUrl: '/images/leadership/modal-avatar-trinh.png', continent: 'Asia', regionGroup: 'Southeast Asia',
    socialLinks: MEMBER_SOCIAL, year: '2026', sdgTags: ['SDG5', 'SDG10', 'SDG16'],
    bio: [
      'With my experience at AIESEC, the Ho Chi Minh City Department of Foreign Affairs, and the Korea Trade-Investment Promotion Agency (KOTRA) under the Consulate General of the Republic of Korea in Ho Chi Minh City, alongside volunteering at the 2024 Ho Chi Minh City Friendship Dialogue and Economic Forum (FD-HEF 2024) and the 2025 United Nations Day of Vesak (UN Vesak 2025), I have developed a more multi-dimensional understanding of non-traditional security from a state-centric perspective in international relations.',
      'Specifically, I aim to protect vulnerable groups, including women, children, and the LGBTQIA+ community, in a society where gender and social inequalities persist. I strongly advocate for SDG 5, SDG 10, and SDG 16 through the lenses of feminism and intersectional feminism, while emphasizing the importance of human rights within global disputes and conflicts.',
      'At CSE, I hope to collaborate with young people to create meaningful, sustainable projects that have an optimistic and tangible impact, contributing to the gradual positive transformation of social equality.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  {
    id: 'dir-sea-2', name: 'Kanya Srisombat', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-4.png', continent: 'Asia', regionGroup: 'Southeast Asia',
    socialLinks: MEMBER_SOCIAL, year: '2025', sdgTags: ['SDG3', 'SDG6'],
    bio: [
      'Kanya is Y.O.U\'s Continental Director for Mainland Southeast Asia, championing health equity and clean water access initiatives across Thailand, Cambodia, Laos, and Myanmar.',
      'Her background includes work with WHO\'s Youth Advisory Group and community health programs in rural Thailand, where she saw firsthand how youth-led advocacy can shift government priorities toward underserved populations.',
      'She is committed to building a generation of Southeast Asian health advocates who understand the deep links between environmental sustainability and public health outcomes.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  {
    id: 'dir-sea-3', name: 'Bima Arjuna', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-1.png', continent: 'Asia', regionGroup: 'Southeast Asia',
    socialLinks: MEMBER_SOCIAL, year: '2025', sdgTags: ['SDG14', 'SDG13'],
    bio: [
      'Bima leads Y.O.U\'s maritime Southeast Asia engagement, coordinating ocean conservation and climate resilience programs across Indonesia, the Philippines, and Timor-Leste.',
      'A marine biologist by training and a youth climate negotiator by vocation, Bima has represented Indonesian youth at COP26 and COP28, advocating for ambitious climate commitments from island nations.',
      'He believes coastal and island communities must be at the center of global climate solutions, and works tirelessly to ensure their stories and solutions reach international decision-making tables.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  // ── South Asia ────────────────────────────────────────────────────────────
  {
    id: 'dir-sa-1', name: 'Priya Sharma', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-2.png', continent: 'Asia', regionGroup: 'South Asia',
    socialLinks: MEMBER_SOCIAL, year: '2024', sdgTags: ['SDG1', 'SDG5'],
    bio: [
      'Priya serves as Continental Director for South Asia, coordinating Y.O.U\'s work across India, Nepal, Bangladesh, Sri Lanka, and Pakistan with a focus on poverty alleviation and gender equity.',
      'With a background in development economics from JNU Delhi and field experience with UN Women\'s programs in South Asia, Priya brings a gender-transformative lens to all regional programming.',
      'She is committed to centering the voices of rural and marginalized youth in South Asia\'s development story, ensuring that economic growth translates to lived improvements in their communities.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  {
    id: 'dir-sa-2', name: 'Rohan Perera', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-5.png', continent: 'Asia', regionGroup: 'South Asia',
    socialLinks: MEMBER_SOCIAL, year: '2025', sdgTags: ['SDG16', 'SDG17'],
    bio: [
      'Rohan leads Y.O.U\'s South Asia reconciliation and civic resilience programs, working at the intersection of peacebuilding and youth empowerment across conflict-affected communities.',
      'Based in Colombo, Rohan has extensive experience facilitating inter-community dialogue programs in Sri Lanka and advising youth-led peace organizations in the region.',
      'His work focuses on creating safe spaces for young people to engage across political and cultural divides, building the social fabric needed for lasting peace.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  // ── Central Asia ──────────────────────────────────────────────────────────
  {
    id: 'dir-ca-1', name: 'Aisha Nurlanovna', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-3.png', continent: 'Asia', regionGroup: 'Central Asia',
    socialLinks: MEMBER_SOCIAL, year: '2025', sdgTags: ['SDG4', 'SDG8'],
    bio: [
      'Aisha is Y.O.U\'s Continental Director for Central Asia, coordinating youth education and economic empowerment programs across Kazakhstan, Kyrgyzstan, Tajikistan, Uzbekistan, and Turkmenistan.',
      'A graduate of KIMEP University and a Chevening Scholar, Aisha has worked on regional youth development frameworks with the UNDP Central Asia office and the Shanghai Cooperation Organisation\'s Youth Council.',
      'She is passionate about connecting Central Asian youth to global opportunities while preserving the rich cultural heritage and local knowledge systems that make the region unique.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  // ── West Asia ─────────────────────────────────────────────────────────────
  {
    id: 'dir-wa-1', name: 'Layla Al-Hassan', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-4.png', continent: 'Asia', regionGroup: 'West Asia',
    socialLinks: MEMBER_SOCIAL, year: '2023', sdgTags: ['SDG16', 'SDG10'],
    bio: [
      'Layla leads Y.O.U\'s West Asia programs, working to create spaces for youth-led peacebuilding and social cohesion across a region shaped by complex political histories.',
      'With a background in humanitarian law from the American University of Beirut and experience with the UNHCR\'s youth programs, Layla brings both legal expertise and deep empathy to her work.',
      'She believes that young people in West Asia, despite the challenges they face, are the most creative and resilient force for positive change in the region.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  {
    id: 'dir-wa-2', name: 'Omar Al-Rashid', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-1.png', continent: 'Asia', regionGroup: 'West Asia',
    socialLinks: MEMBER_SOCIAL, year: '2024', sdgTags: ['SDG9', 'SDG11'],
    bio: [
      'Omar serves as Continental Director focusing on innovation and urban resilience in West Asia, leading programs that connect youth with sustainable city-building initiatives across the Gulf and Levant regions.',
      'An urban planner and social entrepreneur, Omar co-founded a youth innovation hub in Amman that has incubated over 30 youth-led enterprises addressing urban challenges from affordable housing to clean energy.',
      'He is committed to positioning West Asian youth as pioneers in the global transition to smart, sustainable, and inclusive cities.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  // ── North Asia ────────────────────────────────────────────────────────────
  {
    id: 'dir-na-1', name: 'Dmitri Volkov', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-2.png', continent: 'Asia', regionGroup: 'North Asia',
    socialLinks: MEMBER_SOCIAL, year: '2024', sdgTags: ['SDG13', 'SDG15'],
    bio: [
      'Dmitri coordinates Y.O.U\'s North Asia programs, focusing on climate change adaptation and environmental stewardship across Russia\'s vast Siberian and Far Eastern regions.',
      'With a background in environmental science from Novosibirsk State University and experience with indigenous community environmental projects, Dmitri bridges scientific expertise with traditional ecological knowledge.',
      'He is dedicated to amplifying the voices of young people in North Asia\'s indigenous communities, who are among the world\'s most vulnerable to and most knowledgeable about the effects of climate change.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  // ── Australia ─────────────────────────────────────────────────────────────
  {
    id: 'dir-au-1', name: 'Sarah Johnson', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-3.png', continent: 'Australia', regionGroup: 'Australia',
    socialLinks: MEMBER_SOCIAL, year: '2023', sdgTags: ['SDG15', 'SDG13'],
    bio: [
      'Sarah leads Y.O.U\'s Oceania chapter, bringing together youth organizations from Australia, New Zealand, and the Pacific Islands to collaborate on environmental sustainability and First Nations rights.',
      'A descendant of Aboriginal Australians with a law degree from ANU, Sarah integrates Indigenous knowledge systems into international development frameworks, ensuring climate solutions respect sovereignty and self-determination.',
      'She is a passionate advocate for Pacific Island youth, who are on the frontlines of climate impacts, and works to amplify their leadership in global climate negotiations.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  // ── Africa ────────────────────────────────────────────────────────────────
  {
    id: 'dir-af-1', name: 'Amara Okafor', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-4.png', continent: 'Africa', regionGroup: 'Africa',
    socialLinks: MEMBER_SOCIAL, year: '2023', sdgTags: ['SDG1', 'SDG2'],
    bio: [
      'Amara is Y.O.U\'s Continental Director for West Africa, leading programs that connect youth across Ghana, Nigeria, Senegal, and Côte d\'Ivoire in food security and economic empowerment initiatives.',
      'With experience at the African Union Commission\'s youth desk and a master\'s in agricultural development from the University of Ghana, Amara brings both institutional knowledge and field-level expertise to her role.',
      'She believes Africa\'s young people are not just the continent\'s future but its present solution — and she works to create pathways for youth-led agricultural innovation to reach global markets and policy tables.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  {
    id: 'dir-af-2', name: 'Tendai Moyo', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-5.png', continent: 'Africa', regionGroup: 'Africa',
    socialLinks: MEMBER_SOCIAL, year: '2024', sdgTags: ['SDG4', 'SDG9'],
    bio: [
      'Tendai leads Y.O.U\'s East and Southern Africa programs, coordinating youth education technology and digital inclusion initiatives across Kenya, Zimbabwe, Tanzania, and South Africa.',
      'A software engineer turned social entrepreneur, Tendai founded EdTech Zimbabwe, an organization that has brought digital literacy programs to over 50,000 rural youth, before joining Y.O.U.',
      'He is committed to ensuring that Africa\'s digital transformation is youth-led, Africa-centered, and designed to close rather than widen existing inequalities.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  // ── America ───────────────────────────────────────────────────────────────
  {
    id: 'dir-am-1', name: 'Isabella Reyes', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-1.png', continent: 'America', regionGroup: 'America',
    socialLinks: MEMBER_SOCIAL, year: '2024', sdgTags: ['SDG10', 'SDG16'],
    bio: [
      'Isabella serves as Continental Director for Latin America, coordinating Y.O.U\'s work across Colombia, Brazil, Mexico, Peru, and Central America with a focus on human rights and reducing inequality.',
      'With a background in human rights law from UNAM Mexico City and field experience with Indigenous rights organizations in the Amazon, Isabella brings a decolonial perspective to international development.',
      'She is committed to ensuring that Y.O.U\'s work in Latin America is grounded in the priorities and leadership of historically marginalized youth communities, including Indigenous and Afro-descendant youth.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
  {
    id: 'dir-am-2', name: 'Marcus Thompson', role: 'Continental Director',
    avatarUrl: '/images/leadership/director-2.png', continent: 'America', regionGroup: 'America',
    socialLinks: MEMBER_SOCIAL, year: '2025', sdgTags: ['SDG11', 'SDG13'],
    bio: [
      'Marcus leads Y.O.U\'s North America programs, connecting youth organizations across the United States, Canada, and the Caribbean on climate justice and sustainable urban development.',
      'A community organizer from Chicago with experience at the Obama Foundation\'s civic engagement programs, Marcus brings a deep commitment to racial equity and community-centered development.',
      'He is passionate about building bridges between North American and Global South youth movements, ensuring that climate justice frameworks center the voices of those most impacted by environmental harm.',
    ],
    activityImages: ACTIVITY_IMAGES,
  },
];
