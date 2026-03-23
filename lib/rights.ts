export interface RightType {
  id: string
  title: string
  description: string
  category: string
  content?: string
  pdfUrl?: string
  featured?: boolean
  publicationDate?: string
  officialSource?: string
  lastAmended?: string
}

const rightsData: RightType[] = [
  {
    id: "right-to-equality",
    title: "Right to Equality",
    description:
      "Article 14 guarantees equality before the law and equal protection of the laws to all persons within the territory of India.",
    category: "Fundamental Rights",
    content:
      "The Right to Equality is enshrined in Articles 14-18 of the Indian Constitution. It includes equality before the law, prohibition of discrimination on grounds of religion, race, caste, sex or place of birth, equality of opportunity in matters of public employment, abolition of untouchability and abolition of titles.",
    pdfUrl: "/assets/pdfs/constitution-right-to-equality.pdf",
    featured: true,
    publicationDate: "26 January 1950",
    officialSource: "Constitution of India, Government of India",
    lastAmended: "2019",
  },
  {
    id: "right-to-freedom",
    title: "Right to Freedom",
    description:
      "Articles 19-22 guarantee certain freedoms including freedom of speech and expression, assembly, association, movement, residence, and profession.",
    category: "Fundamental Rights",
    content:
      "The Right to Freedom includes six fundamental freedoms: freedom of speech and expression, freedom of assembly, freedom of association, freedom of movement, freedom of residence, and freedom of profession. These rights are subject to reasonable restrictions that may be imposed by the State.",
    pdfUrl: "/assets/pdfs/constitution-right-to-freedom.pdf",
    featured: true,
    publicationDate: "26 January 1950",
    officialSource: "Constitution of India, Government of India",
    lastAmended: "2019",
  },
  {
    id: "right-against-exploitation",
    title: "Right Against Exploitation",
    description: "Articles 23-24 prohibit human trafficking, forced labor, and child employment in hazardous jobs.",
    category: "Fundamental Rights",
    content:
      "The Right Against Exploitation prohibits trafficking in human beings, forced labor (begar), and employment of children below 14 years in factories, mines, and other hazardous occupations.",
    pdfUrl: "/assets/pdfs/constitution-right-against-exploitation.pdf",
    publicationDate: "26 January 1950",
    officialSource: "Constitution of India, Government of India",
    lastAmended: "2016",
  },
  {
    id: "right-to-freedom-of-religion",
    title: "Right to Freedom of Religion",
    description: "Articles 25-28 provide religious freedom to all citizens and ensures a secular state in India.",
    category: "Fundamental Rights",
    content:
      "The Right to Freedom of Religion guarantees freedom of conscience and free profession, practice and propagation of religion, freedom to manage religious affairs, freedom from taxation for promotion of any religion, and freedom from religious instruction in certain educational institutions.",
    pdfUrl: "/assets/pdfs/constitution-right-to-religion.pdf",
    publicationDate: "26 January 1950",
    officialSource: "Constitution of India, Government of India",
    lastAmended: "1977",
  },
  {
    id: "cultural-and-educational-rights",
    title: "Cultural and Educational Rights",
    description: "Articles 29-30 protect the interests of minorities by preserving their culture, language and script.",
    category: "Fundamental Rights",
    content:
      "Cultural and Educational Rights protect the rights of minorities to conserve their language, script, and culture, and establish and administer educational institutions of their choice.",
    pdfUrl: "/assets/pdfs/constitution-cultural-educational-rights.pdf",
    publicationDate: "26 January 1950",
    officialSource: "Constitution of India, Government of India",
    lastAmended: "2012",
  },
  {
    id: "right-to-constitutional-remedies",
    title: "Right to Constitutional Remedies",
    description: "Article 32 provides the right to move the Supreme Court for enforcement of Fundamental Rights.",
    category: "Fundamental Rights",
    content:
      "The Right to Constitutional Remedies empowers citizens to approach the Supreme Court directly for the enforcement of their Fundamental Rights. Dr. B.R. Ambedkar called it 'the heart and soul of the Constitution'.",
    pdfUrl: "/assets/pdfs/constitution-remedies.pdf",
    publicationDate: "26 January 1950",
    officialSource: "Constitution of India, Government of India",
    lastAmended: "2015",
  },
  {
    id: "right-to-education",
    title: "Right to Education",
    description: "Article 21A provides free and compulsory education to all children between the ages of 6 and 14 years.",
    category: "Fundamental Rights",
    content:
      "The Right to Education was added to the Constitution through the 86th Amendment Act, 2002. It makes education a fundamental right for all children between 6-14 years of age.",
    pdfUrl: "/assets/pdfs/right-to-education-act.pdf",
    featured: true,
    publicationDate: "4 August 2009",
    officialSource: "Ministry of Law and Justice, Government of India",
    lastAmended: "2019",
  },
  {
    id: "consumer-protection",
    title: "Consumer Protection Act",
    description:
      "Protects consumers against defective goods, deficient services, unfair trade practices, and the right to seek redressal.",
    category: "Consumer Rights",
    content:
      "The Consumer Protection Act, 2019 replaced the earlier Act of 1986 to provide better protection of consumers' interests. It established the Central Consumer Protection Authority (CCPA) to regulate matters relating to violation of consumer rights, unfair trade practices, and false or misleading advertisements.",
    pdfUrl: "/assets/pdfs/consumer-protection-act-2019.pdf",
    featured: true,
    publicationDate: "9 August 2019",
    officialSource: "Ministry of Consumer Affairs, Food and Public Distribution, Government of India",
    lastAmended: "2020",
  },
  {
    id: "right-to-information",
    title: "Right to Information Act",
    description:
      "Empowers citizens to request information from a public authority, promoting transparency and accountability.",
    category: "Right to Information",
    content:
      "The Right to Information Act, 2005 mandates timely response to citizen requests for government information. It aims to promote transparency and accountability in the working of every public authority.",
    pdfUrl: "/assets/pdfs/rti-act-2005.pdf",
    featured: true,
    publicationDate: "15 June 2005",
    officialSource: "Ministry of Law and Justice, Government of India",
    lastAmended: "2019",
  },
  {
    id: "domestic-violence-act",
    title: "Protection of Women from Domestic Violence Act",
    description: "Provides protection to women from domestic violence and abuse within the family.",
    category: "Women's Rights",
    content:
      "The Protection of Women from Domestic Violence Act, 2005 provides protection to women against domestic violence, including physical, sexual, verbal, emotional, and economic abuse. It allows women to seek protection orders, residence orders, custody orders, and compensation orders.",
    pdfUrl: "/assets/pdfs/domestic-violence-act-2005.pdf",
    featured: true,
    publicationDate: "13 September 2005",
    officialSource: "Ministry of Women and Child Development, Government of India",
    lastAmended: "2013",
  },
  {
    id: "sexual-harassment-act",
    title: "Sexual Harassment of Women at Workplace Act",
    description:
      "Protects women from sexual harassment at the workplace and provides a mechanism for redressal of complaints.",
    category: "Women's Rights",
    content:
      "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 aims to provide protection against sexual harassment of women at the workplace and for the prevention and redressal of complaints of sexual harassment.",
    pdfUrl: "/assets/pdfs/sexual-harassment-act-2013.pdf",
    publicationDate: "23 April 2013",
    officialSource: "Ministry of Women and Child Development, Government of India",
    lastAmended: "2016",
  },
  {
    id: "maternity-benefit-act",
    title: "Maternity Benefit Act",
    description: "Provides maternity leave and benefits to women employees during pregnancy and after childbirth.",
    category: "Women's Rights",
    content:
      "The Maternity Benefit (Amendment) Act, 2017 increased the duration of paid maternity leave from 12 weeks to 26 weeks. It also introduced provisions for work from home options and creche facilities.",
    pdfUrl: "/assets/pdfs/maternity-benefit-act.pdf",
    publicationDate: "27 March 2017",
    officialSource: "Ministry of Labour and Employment, Government of India",
    lastAmended: "2017",
  },
  {
    id: "minimum-wages-act",
    title: "Minimum Wages Act",
    description: "Ensures payment of minimum wages to workers in various sectors as fixed by the government.",
    category: "Labour Law",
    content:
      "The Minimum Wages Act, 1948 provides for fixing minimum rates of wages in certain employments. The minimum wages are reviewed and revised periodically by the Central and State Governments.",
    pdfUrl: "/assets/pdfs/minimum-wages-act-1948.pdf",
    publicationDate: "15 March 1948",
    officialSource: "Ministry of Labour and Employment, Government of India",
    lastAmended: "2017",
  },
  {
    id: "payment-of-wages-act",
    title: "Payment of Wages Act",
    description:
      "Regulates the payment of wages to certain classes of employed persons without unauthorized deductions.",
    category: "Labour Law",
    content:
      "The Payment of Wages Act, 1936 ensures timely payment of wages to employees and prevents unauthorized deductions from their wages.",
    pdfUrl: "/assets/pdfs/payment-of-wages-act.pdf",
    publicationDate: "23 April 1936",
    officialSource: "Ministry of Labour and Employment, Government of India",
    lastAmended: "2017",
  },
  {
    id: "equal-remuneration-act",
    title: "Equal Remuneration Act",
    description: "Provides for equal pay for equal work for both men and women workers.",
    category: "Labour Law",
    content:
      "The Equal Remuneration Act, 1976 provides for the payment of equal remuneration to men and women workers for the same work or work of a similar nature and prevents discrimination on the ground of sex against women in employment.",
    pdfUrl: "/assets/pdfs/equal-remuneration-act.pdf",
    publicationDate: "11 February 1976",
    officialSource: "Ministry of Labour and Employment, Government of India",
    lastAmended: "1987",
  },
  {
    id: "information-technology-act",
    title: "Information Technology Act",
    description:
      "Provides legal recognition for transactions carried out by means of electronic data interchange and other means of electronic communication.",
    category: "Cyber Law",
    content:
      "The Information Technology Act, 2000 provides legal recognition to electronic documents and digital signatures. It also defines cyber crimes and prescribes penalties for them.",
    pdfUrl: "/assets/pdfs/information-technology-act-2000.pdf",
    publicationDate: "9 June 2000",
    officialSource: "Ministry of Electronics and Information Technology, Government of India",
    lastAmended: "2008",
  },
  {
    id: "data-protection",
    title: "Data Protection Laws",
    description: "Protects personal data and provides for privacy rights of individuals in the digital space.",
    category: "Cyber Law",
    content:
      "India is in the process of enacting a comprehensive data protection law. Currently, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 provide some protection for personal data.",
    pdfUrl: "/assets/pdfs/it-data-protection-rules-2011.pdf",
    publicationDate: "11 April 2011",
    officialSource: "Ministry of Electronics and Information Technology, Government of India",
    lastAmended: "2021",
  },
]

export function getAllRights(): RightType[] {
  return rightsData
}

export function getFeaturedRights(): RightType[] {
  return rightsData.filter((right) => right.featured)
}

export function getCategoryRights(category: string): RightType[] {
  return rightsData.filter((right) => right.category === category)
}

export function getPdfRights(): RightType[] {
  return rightsData.filter((right) => right.pdfUrl)
}

export function getRightById(id: string): RightType | null {
  return rightsData.find((right) => right.id === id) ?? null
}

export function getRightCategories(): string[] {
  return [...new Set(rightsData.map((right) => right.category))].sort()
}
