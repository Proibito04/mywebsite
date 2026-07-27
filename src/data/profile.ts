export type Locale = "en" | "it";
export type EvidenceCategory = "build" | "break" | "operate" | "lead";

export interface EvidenceItem {
  id: string;
  category: EvidenceCategory;
  eyebrow: string;
  title: string;
  summary: string;
  tags: string[];
  href?: string;
  featured?: boolean;
}

export interface Experience {
  organization: string;
  role: string;
  period: string;
  location?: string;
  summary: string;
  details?: string[];
  relatedProject?: {
    name: string;
    summary: string;
    href: string;
  };
}

export interface Credential {
  title: string;
  issuer: string;
  year: string;
  summary: string;
  preview: string;
  pdf: string;
}

export interface SkillGroup {
  title: string;
  summary: string;
  skills: string[];
}

export interface VisualEvidence {
  id: string;
  kind: "interface" | "diagram" | "certificate" | "photo";
  title: string;
  alt: string;
  src?: string;
  available: boolean;
}

export interface ExternalProfile {
  id: "github" | "htb" | "linkedin";
  title: string;
  handle: string;
  summary: string;
  href: string;
}

export interface Project {
  id: string;
  number: string;
  status: string;
  title: string;
  role: string;
  summary: string;
  detail: string;
  stack: string[];
  outcome?: string;
  limitation?: string;
  href: string;
  featured?: boolean;
}

export interface ProfileContent {
  locale: Locale;
  meta: {
    homeTitle: string;
    homeDescription: string;
    cvTitle: string;
    cvDescription: string;
  };
  nav: {
    home: string;
    notes: string;
    writeups: string;
    cv: string;
    contact: string;
    menu: string;
    theme: string;
  };
  hero: {
    kicker: string;
    title: string;
    introduction: string;
    availability: string;
    primaryAction: string;
    cvAction: string;
    contactAction: string;
    graphicLabel: string;
  };
  home: {
    proofKicker: string;
    proofTitle: string;
    proofIntro: string;
    projectKicker: string;
    projectTitle: string;
    projectIntro: string;
    architectureTitle: string;
    architectureIntro: string;
    interfaceCaption: string;
    homelabKicker: string;
    homelabTitle: string;
    homelabIntro: string;
    journeyKicker: string;
    journeyTitle: string;
    journeyIntro: string;
    credentialKicker: string;
    credentialTitle: string;
    writingKicker: string;
    writingTitle: string;
    writingIntro: string;
    notesTitle: string;
    writeupsTitle: string;
    profilesKicker: string;
    profilesTitle: string;
    profilesIntro: string;
    profileAction: string;
    viewAll: string;
    noEntries: string;
    close: string;
    openCertificate: string;
    downloadCertificate: string;
  };
  explorerLabels: Record<EvidenceCategory, string>;
  evidence: EvidenceItem[];
  projects: Project[];
  externalProfiles: ExternalProfile[];
  credential: Credential;
  visualEvidence: VisualEvidence[];
  cv: {
    eyebrow: string;
    title: string;
    intro: string;
    location: string;
    print: string;
    profileTitle: string;
    profile: string;
    educationTitle: string;
    projectsTitle: string;
    practiceTitle: string;
    credentialPdfLabel: string;
    credentialHtbLabel: string;
    credentialWriteupsLabel: string;
    leadershipTitle: string;
    skillsTitle: string;
    skillsToolsLabel: string;
    skillsContext: string;
    contactTitle: string;
    evidenceTitle: string;
    evidenceIntro: string;
    projectLabels: {
      contribution: string;
      evidence: string;
    };
  };
  education: Experience[];
  leadership: Experience[];
  skillGroups: SkillGroup[];
}

const links = {
  ctfHammer: "https://github.com/CTFHammer",
  malware: "https://github.com/Proibito04/project_malware",
  aquaSecure: "https://github.com/Proibito04/AquaSecure",
  github: "https://github.com/Proibito04",
  htb: "https://app.hackthebox.com/users/1960494",
  linkedin: "https://www.linkedin.com/in/edoardo-balzano-7bbb64190/",
};

const sharedVisualEvidence: VisualEvidence[] = [
  {
    id: "ctf-hammer-interface",
    kind: "interface",
    title: "CTF Hammer interface",
    alt: "CTF Hammer traffic view showing classified HTTP request and response conversations",
    src: "/media/ctf-hammer-interface.webp",
    available: true,
  },
  {
    id: "ctf-hammer-architecture",
    kind: "diagram",
    title: "CTF Hammer architecture",
    alt: "Responsive architecture diagram for CTF Hammer",
    available: true,
  },
  {
    id: "homelab",
    kind: "diagram",
    title: "Sanitized homelab topology",
    alt: "Sanitized topology showing private access paths to a Raspberry Pi Docker host",
    available: true,
  },
  {
    id: "cyberchallenge-certificate",
    kind: "certificate",
    title: "CyberChallenge.IT finalist certificate",
    alt: "CyberChallenge.IT 2024 finalist certificate issued to Edoardo Balzano",
    src: "/media/cyberchallenge-certificate.webp",
    available: true,
  },
  {
    id: "portrait",
    kind: "photo",
    title: "Portrait",
    alt: "",
    available: false,
  },
  {
    id: "workspace",
    kind: "photo",
    title: "Workspace and homelab",
    alt: "",
    available: false,
  },
];

export const profiles: Record<Locale, ProfileContent> = {
  en: {
    locale: "en",
    meta: {
      homeTitle: "Infrastructure Security Portfolio",
      homeDescription:
        "Portfolio of Edoardo Balzano, Computer Science graduate and MSc Cybersecurity student focused on infrastructure security, Docker and networking.",
      cvTitle: "About & CV",
      cvDescription:
        "Recruiter-oriented CV for Edoardo Balzano: cybersecurity education, infrastructure projects, hands-on security practice and operational leadership.",
    },
    nav: {
      home: "Home",
      notes: "Notes",
      writeups: "Writeups",
      cv: "About / CV",
      contact: "Contact",
      menu: "Open navigation",
      theme: "Switch color theme",
    },
    hero: {
      kicker: "Computer Science × Infrastructure Security",
      title: "I build, break, and operate systems to understand how to secure them.",
      introduction:
        "I’m Edoardo Balzano, a University of Turin Computer Science graduate and current MSc Cybersecurity student. My work sits where Linux, containers, networks, and practical attack/defense meet.",
      availability:
        "Currently in Turin, completing my MSc in Cybersecurity · Open to security and infrastructure opportunities",
      primaryAction: "Explore my work",
      cvAction: "Read my CV",
      contactAction: "Get in touch",
      graphicLabel:
        "Animated infrastructure path from exposed traffic through analysis and containerized services",
    },
    home: {
      proofKicker: "Evidence, not adjectives",
      proofTitle: "Four ways I approach systems",
      proofIntro:
        "Each claim below points to a project, a lab, or an experience. Select a lens—or read every item with JavaScript disabled.",
      projectKicker: "Selected work",
      projectTitle: "Security work with systems underneath it",
      projectIntro:
        "The flagship began as a practical response to Attack/Defense CTF friction. The supporting projects extend that work into malware analysis and OT/ICS exposure.",
      architectureTitle: "One workflow, explicit boundaries",
      architectureIntro:
        "A site-native redraw of the thesis architecture: capture, queue, analysis, storage, and live presentation are separated so slow work does not block the operator.",
      interfaceCaption:
        "Authentic CTF Hammer capture from the thesis: HTTP conversations classified during a CyberChallenge simulation.",
      homelabKicker: "Operate",
      homelabTitle: "A small lab, treated like infrastructure",
      homelabIntro:
        "A sanitized view of the Raspberry Pi 5 Docker host. Public and private access paths stay separate; domains, addresses, and ports are intentionally omitted.",
      journeyKicker: "International experience",
      journeyTitle: "Turin → Istanbul",
      journeyIntro:
        "The 2025/26 Sabancı exchange adds independence, English communication, and cross-cultural teamwork to the technical work—including the AquaSecure coursework project.",
      credentialKicker: "Verified credential",
      credentialTitle: "CyberChallenge.IT Finalist — 8th Edition, 2024",
      writingKicker: "Field notes",
      writingTitle: "Learning in public",
      writingIntro:
        "Notes capture concepts as I study them; writeups document the reasoning behind practical HTB work. Entries remain in their original language.",
      notesTitle: "Recent notes",
      writeupsTitle: "Recent HTB writeups",
      profilesKicker: "External profiles",
      profilesTitle: "Code, practice, and professional context",
      profilesIntro:
        "Explore the repositories behind the projects, my hands-on security activity, and my professional profile.",
      profileAction: "Open profile",
      viewAll: "View all",
      noEntries: "No public entries yet.",
      close: "Close",
      openCertificate: "Open certificate preview",
      downloadCertificate: "Download original PDF",
    },
    explorerLabels: {
      build: "Build",
      break: "Break",
      operate: "Operate",
      lead: "Lead",
    },
    evidence: [
      {
        id: "build-ctf-hammer",
        category: "build",
        eyebrow: "BSc thesis · Flagship",
        title: "CTF Hammer",
        summary:
          "A unified workflow for capturing, parsing, and reviewing Attack/Defense CTF traffic without stitching together the operator experience by hand.",
        tags: ["Flask", "SvelteKit", "tshark", "Celery", "Docker Compose"],
        href: links.ctfHammer,
        featured: true,
      },
      {
        id: "build-malware",
        category: "build",
        eyebrow: "Security tooling",
        title: "HTA & JAR analyzer",
        summary:
          "A modular Python pipeline for feature extraction, heuristic classification, LLM-assisted assessment, CLI use, and functional tests.",
        tags: ["Python", "Static analysis", "Testing"],
        href: links.malware,
      },
      {
        id: "build-aqua",
        category: "build",
        eyebrow: "Sabancı coursework · Team",
        title: "AquaSecure",
        summary:
          "A simulated water-treatment SCADA environment used to explore Docker isolation and an SQLi → SSRF → unauthorized Modbus write chain.",
        tags: ["OT / ICS exposure", "Docker networks", "Modbus"],
        href: links.aquaSecure,
      },
      {
        id: "break-cyberchallenge",
        category: "break",
        eyebrow: "National training program",
        title: "CyberChallenge.IT Finalist",
        summary:
          "Represented the University of Turin in the 8th edition after hands-on web, binary, crypto, network, and Attack/Defense training.",
        tags: ["Finalist 2024", "A/D CTF", "Team practice"],
      },
      {
        id: "break-htb",
        category: "break",
        eyebrow: "Continuous practice",
        title: "Hack The Box",
        summary:
          "Machine and challenge work used to turn reconnaissance, exploitation, and post-exploitation into a repeatable written process.",
        tags: ["Web", "Linux", "Active Directory"],
        href: links.htb,
      },
      {
        id: "break-writeups",
        category: "break",
        eyebrow: "Reasoning trail",
        title: "Writeups",
        summary:
          "Technical records of attack paths, including assumptions, failed branches, evidence, and remediation context.",
        tags: ["Documentation", "Reproducibility", "Reflection"],
        href: "/writeups",
      },
      {
        id: "operate-homelab",
        category: "operate",
        eyebrow: "Self-hosted lab",
        title: "Raspberry Pi 5 Docker host",
        summary:
          "A compact environment for containerized services, private access, controlled exposure, upgrades, and troubleshooting.",
        tags: ["Docker", "Tailscale", "Cloudflare Tunnel"],
      },
      {
        id: "operate-affine",
        category: "operate",
        eyebrow: "Operated service",
        title: "AFFiNE",
        summary:
          "A real containerized workload for practicing deployment, persistence, access paths, service upkeep, and recovery thinking.",
        tags: ["Self-hosting", "Containers", "Maintenance"],
      },
      {
        id: "operate-ai",
        category: "operate",
        eyebrow: "Exploration",
        title: "Self-hosted AI workloads",
        summary:
          "OpenClaw is an exploration area for understanding the boundaries and resource demands of local AI workloads—not a claimed production service.",
        tags: ["OpenClaw", "Resource isolation", "Learning"],
      },
      {
        id: "lead-muma",
        category: "lead",
        eyebrow: "Front-of-House Manager",
        title: "Il MuMa",
        summary:
          "Coordinates reservations, suppliers, cash, inventory, team flow, guest experience, and stewardship of an 80+ label wine cellar.",
        tags: ["Ownership", "Composure", "Communication"],
      },
      {
        id: "lead-erasmus",
        category: "lead",
        eyebrow: "2025/26 exchange",
        title: "Sabancı University",
        summary:
          "Independent study in Istanbul, technical collaboration in English, and adaptation to a new academic and cultural environment.",
        tags: ["International teamwork", "English", "Adaptability"],
      },
      {
        id: "lead-cantinella",
        category: "lead",
        eyebrow: "Front of house",
        title: "Osteria La Cantinella",
        summary:
          "Built the reliability, pace, and clear communication needed to keep guest-facing operations moving under pressure.",
        tags: ["Reliability", "Service", "Teamwork"],
      },
    ],
    projects: [
      {
        id: "ctf-hammer",
        number: "01",
        status: "Flagship · BSc thesis",
        title: "CTF Hammer",
        role: "Individual project",
        summary: "A unified A/D CTF traffic-analysis workflow.",
        detail:
          "CTF Hammer collects PCAP traffic from vulnerable hosts, parses conversations with tshark, classifies useful patterns, and streams results into a web interface. Async workers keep analysis away from the operator path; SSH/SCP and Docker Compose connect the pieces.",
        stack: [
          "Flask",
          "Svelte / SvelteKit",
          "tshark",
          "MongoDB",
          "RabbitMQ / Celery",
          "WebSockets",
          "SSH / SCP",
          "Docker Compose",
        ],
        outcome:
          "Tested during CyberChallenge simulations to review traffic and identify attack patterns in a unified interface.",
        limitation:
          "Under heavy traffic, SSH/SCP connections degraded and risked saturating the vulbox network path. The prototype was therefore not used in the national final; throttling and resource controls informed the next iteration.",
        href: links.ctfHammer,
        featured: true,
      },
      {
        id: "malware-analyzer",
        number: "02",
        status: "Supporting security project",
        title: "Smart HTA & JAR analyzer",
        role: "Python tooling",
        summary: "Static features first; model-assisted context second.",
        detail:
          "A modular pipeline extracts features from HTA and JAR files, applies explainable heuristic rules, and can ask language models for a second assessment. CLI entry points and functional tests make each stage inspectable.",
        stack: ["Python", "BeautifulSoup", "javap", "Heuristics", "LLM APIs", "Tests"],
        href: links.malware,
      },
      {
        id: "aquasecure",
        number: "03",
        status: "Sabancı coursework · Collaboration",
        title: "AquaSecure",
        role: "Academic team project",
        summary: "A simulated water-treatment SCADA security exercise.",
        detail:
          "The team isolated services with Docker networks and modeled an attack chain from SQL injection to SSRF and an unauthorized Modbus write. It demonstrates applying security concepts to an OT/ICS-shaped environment—not professional industrial-security expertise.",
        stack: ["Docker networks", "SCADA simulation", "SQL injection", "SSRF", "Modbus"],
        href: links.aquaSecure,
      },
    ],
    externalProfiles: [
      {
        id: "github",
        title: "GitHub",
        handle: "@Proibito04",
        summary:
          "Source code for security tooling, infrastructure experiments, and selected academic projects.",
        href: links.github,
      },
      {
        id: "htb",
        title: "Hack The Box",
        handle: "Hands-on security practice",
        summary:
          "Machines and challenges used to develop repeatable reconnaissance, exploitation, and documentation habits.",
        href: links.htb,
      },
      {
        id: "linkedin",
        title: "LinkedIn",
        handle: "Edoardo Balzano",
        summary:
          "Education, international experience, technical direction, and professional background in one place.",
        href: links.linkedin,
      },
    ],
    credential: {
      title: "CyberChallenge.IT Finalist — 8th Edition, 2024",
      issuer: "Cybersecurity National Lab · University of Turin",
      year: "2024",
      summary:
        "Official certificate of participation as a finalist. No uncertain team placement is claimed.",
      preview: "/media/cyberchallenge-certificate.webp",
      pdf: "/media/cyberchallenge-2024-edoardo-balzano.pdf",
    },
    visualEvidence: sharedVisualEvidence,
    cv: {
      eyebrow: "Profile / CV",
      title: "Edoardo Balzano",
      intro:
        "Computer Science graduate and MSc Cybersecurity student building toward infrastructure, container, and cloud security.",
      location: "Turin, Italy · MSc Cybersecurity at the University of Turin",
      print: "Print / Save as PDF",
      profileTitle: "Professional profile",
      profile:
        "I learn security by operating real systems and examining how they fail. My strongest evidence sits across Linux, containerized services, network traffic, and practical attack/defense: from a distributed CTF analysis tool to a Raspberry Pi homelab and ongoing HTB practice. Hospitality management adds day-to-day ownership, calm under pressure, and clear communication.",
      educationTitle: "Education & international experience",
      projectsTitle: "Selected security projects",
      practiceTitle: "Security practice & credential",
      credentialPdfLabel: "Certificate PDF",
      credentialHtbLabel: "Hack The Box",
      credentialWriteupsLabel: "Technical writeups",
      leadershipTitle: "Leadership & operations",
      skillsTitle: "Skills",
      skillsToolsLabel: "Tools",
      skillsContext:
        "Project exposure: AWS, Google Cloud Platform, Firebase. Current direction: container and cloud security.",
      contactTitle: "Contact",
      evidenceTitle: "Evidence map",
      evidenceIntro:
        "Skills are useful only when they connect to work. This map shows where each focus area is visible.",
      projectLabels: {
        contribution: "What it demonstrates",
        evidence: "Evidence",
      },
    },
    education: [
      {
        organization: "University of Turin",
        role: "MSc Cybersecurity",
        period: "Current",
        location: "Turin, Italy",
        summary:
          "Advanced study in cybersecurity with a direction toward container, cloud, and infrastructure security.",
      },
      {
        organization: "Sabancı University",
        role: "Erasmus exchange",
        period: "Academic year 2025/26",
        location: "Istanbul, Türkiye",
        summary:
          "International study experience demonstrating independence, adaptability, English communication, and cross-cultural teamwork.",
        relatedProject: {
          name: "AquaSecure · coursework collaboration",
          summary:
            "Simulated water-treatment SCADA environment with Docker network isolation and an SQLi → SSRF → unauthorized Modbus write attack chain.",
          href: links.aquaSecure,
        },
      },
      {
        organization: "University of Turin",
        role: "BSc Computer Science",
        period: "Completed 2024",
        location: "Turin, Italy",
        summary:
          "Foundations in networks, operating systems, software development, and security. Thesis project: CTF Hammer.",
      },
    ],
    leadership: [
      {
        organization: "Il MuMa",
        role: "Front-of-House Manager",
        period: "Approx. 2024–present",
        summary:
          "Owns supplier orders, reservations, phone management, cash responsibility, linen inventory, team coordination, guest experience, and an 80+ label wine cellar.",
        details: ["Ownership", "Composure under pressure", "Reliable communication"],
      },
      {
        organization: "Osteria La Cantinella",
        role: "Server / Front of house",
        period: "Approx. Sep 2022–2024",
        summary:
          "Delivered attentive guest service in a fast-moving environment while coordinating clearly with the wider team.",
        details: ["Reliability", "Service judgment", "Team coordination"],
      },
    ],
    skillGroups: [
      {
        title: "Infrastructure & container operations",
        summary:
          "Linux-based Docker environments, service isolation, homelab operation, and controlled access.",
        skills: [
          "Linux",
          "Docker",
          "Docker Compose",
          "Docker networks",
          "Tailscale",
          "Cloudflare Tunnel",
        ],
      },
      {
        title: "Security analysis & automation",
        summary:
          "Python security tooling and application/network-traffic analysis demonstrated through CTF Hammer, malware analysis, and HTB.",
        skills: [
          "Python",
          "tshark",
          "Traffic analysis",
          "Static analysis",
          "Testing",
        ],
      },
      {
        title: "Web & distributed systems",
        summary:
          "Connecting interfaces, APIs, workers, databases, and queues in end-to-end security projects.",
        skills: [
          "Flask",
          "TypeScript / Svelte",
          "MongoDB",
          "RabbitMQ / Celery",
          "WebSockets",
        ],
      },
    ],
  },
  it: {
    locale: "it",
    meta: {
      homeTitle: "Portfolio di sicurezza infrastrutturale",
      homeDescription:
        "Portfolio di Edoardo Balzano, laureato in Informatica e studente magistrale in Cybersecurity, con focus su infrastrutture, Docker e reti.",
      cvTitle: "Profilo e CV",
      cvDescription:
        "CV di Edoardo Balzano: formazione in cybersecurity, progetti infrastrutturali, pratica tecnica e responsabilità operative.",
    },
    nav: {
      home: "Home",
      notes: "Note",
      writeups: "Writeup",
      cv: "Profilo / CV",
      contact: "Contatti",
      menu: "Apri navigazione",
      theme: "Cambia tema colore",
    },
    hero: {
      kicker: "Informatica × Sicurezza infrastrutturale",
      title: "Costruisco, attacco e gestisco sistemi per capire come proteggerli.",
      introduction:
        "Sono Edoardo Balzano, laureato in Informatica all’Università di Torino e studente magistrale in Cybersecurity. Lavoro nel punto d’incontro tra Linux, container, reti e pratica Attack/Defense.",
      availability:
        "Attualmente a Torino, sto completando la laurea magistrale in Cybersecurity · Aperto a opportunità in sicurezza e infrastrutture",
      primaryAction: "Esplora i progetti",
      cvAction: "Leggi il CV",
      contactAction: "Contattami",
      graphicLabel:
        "Percorso infrastrutturale animato dal traffico esposto all’analisi e ai servizi containerizzati",
    },
    home: {
      proofKicker: "Evidenze, non aggettivi",
      proofTitle: "Quattro modi di affrontare i sistemi",
      proofIntro:
        "Ogni affermazione rimanda a un progetto, un laboratorio o un’esperienza. Scegli una prospettiva oppure leggi tutto con JavaScript disattivato.",
      projectKicker: "Progetti selezionati",
      projectTitle: "Sicurezza con sistemi concreti alla base",
      projectIntro:
        "Il progetto principale nasce da un problema operativo nelle CTF Attack/Defense. Gli altri lavori estendono l’esperienza all’analisi malware e all’esposizione OT/ICS.",
      architectureTitle: "Un solo flusso, confini espliciti",
      architectureIntro:
        "Ridisegno nativo dell’architettura della tesi: acquisizione, code, analisi, persistenza e visualizzazione live sono separate per non bloccare l’operatore.",
      interfaceCaption:
        "Cattura autentica di CTF Hammer dalla tesi: conversazioni HTTP classificate durante una simulazione CyberChallenge.",
      homelabKicker: "Operate",
      homelabTitle: "Un piccolo lab, trattato come infrastruttura",
      homelabIntro:
        "Vista anonimizzata dell’host Docker su Raspberry Pi 5. Gli accessi pubblici e privati restano separati; domini, indirizzi e porte sono volutamente omessi.",
      journeyKicker: "Esperienza internazionale",
      journeyTitle: "Torino → Istanbul",
      journeyIntro:
        "L’Erasmus 2025/26 a Sabancı aggiunge indipendenza, comunicazione in inglese e collaborazione interculturale—compreso il progetto accademico AquaSecure.",
      credentialKicker: "Credenziale verificata",
      credentialTitle: "Finalista CyberChallenge.IT — 8ª Edizione, 2024",
      writingKicker: "Appunti sul campo",
      writingTitle: "Imparare in pubblico",
      writingIntro:
        "Le note fissano i concetti studiati; i writeup documentano il ragionamento dietro la pratica su HTB. Ogni contenuto resta nella lingua originale.",
      notesTitle: "Note recenti",
      writeupsTitle: "Writeup HTB recenti",
      profilesKicker: "Profili esterni",
      profilesTitle: "Codice, pratica e percorso professionale",
      profilesIntro:
        "Esplora i repository dei progetti, la mia attività pratica in sicurezza e il profilo professionale.",
      profileAction: "Apri profilo",
      viewAll: "Vedi tutti",
      noEntries: "Nessun contenuto pubblico.",
      close: "Chiudi",
      openCertificate: "Apri anteprima attestato",
      downloadCertificate: "Scarica il PDF originale",
    },
    explorerLabels: {
      build: "Build",
      break: "Break",
      operate: "Operate",
      lead: "Lead",
    },
    evidence: [
      {
        id: "build-ctf-hammer-it",
        category: "build",
        eyebrow: "Tesi triennale · Progetto principale",
        title: "CTF Hammer",
        summary:
          "Un flusso unificato per acquisire, analizzare e leggere il traffico di una CTF Attack/Defense senza ricomporre manualmente l’esperienza operativa.",
        tags: ["Flask", "SvelteKit", "tshark", "Celery", "Docker Compose"],
        href: links.ctfHammer,
        featured: true,
      },
      {
        id: "build-malware-it",
        category: "build",
        eyebrow: "Tool di sicurezza",
        title: "Analizzatore HTA & JAR",
        summary:
          "Pipeline Python modulare per estrazione delle feature, classificazione euristica, valutazione assistita da LLM, uso CLI e test funzionali.",
        tags: ["Python", "Analisi statica", "Test"],
        href: links.malware,
      },
      {
        id: "build-aqua-it",
        category: "build",
        eyebrow: "Corso Sabancı · Team",
        title: "AquaSecure",
        summary:
          "Ambiente SCADA simulato per il trattamento dell’acqua, usato per studiare isolamento Docker e una catena SQLi → SSRF → scrittura Modbus non autorizzata.",
        tags: ["Esposizione OT / ICS", "Reti Docker", "Modbus"],
        href: links.aquaSecure,
      },
      {
        id: "break-cyberchallenge-it",
        category: "break",
        eyebrow: "Programma nazionale",
        title: "Finalista CyberChallenge.IT",
        summary:
          "Ho rappresentato l’Università di Torino nell’8ª edizione dopo attività pratiche web, binary, crypto, network e Attack/Defense.",
        tags: ["Finalista 2024", "A/D CTF", "Team practice"],
      },
      {
        id: "break-htb-it",
        category: "break",
        eyebrow: "Pratica continua",
        title: "Hack The Box",
        summary:
          "Macchine e challenge per trasformare ricognizione, exploit e post-exploitation in un processo scritto e ripetibile.",
        tags: ["Web", "Linux", "Active Directory"],
        href: links.htb,
      },
      {
        id: "break-writeups-it",
        category: "break",
        eyebrow: "Traccia del ragionamento",
        title: "Writeup",
        summary:
          "Documentazione tecnica di percorsi d’attacco, ipotesi, rami falliti, evidenze e contesto di mitigazione.",
        tags: ["Documentazione", "Riproducibilità", "Riflessione"],
        href: "/writeups",
      },
      {
        id: "operate-homelab-it",
        category: "operate",
        eyebrow: "Laboratorio self-hosted",
        title: "Host Docker Raspberry Pi 5",
        summary:
          "Ambiente compatto per servizi containerizzati, accessi privati, esposizione controllata, aggiornamenti e troubleshooting.",
        tags: ["Docker", "Tailscale", "Cloudflare Tunnel"],
      },
      {
        id: "operate-affine-it",
        category: "operate",
        eyebrow: "Servizio gestito",
        title: "AFFiNE",
        summary:
          "Un workload containerizzato reale per fare pratica con deploy, persistenza, percorsi d’accesso, manutenzione e ragionamento sul ripristino.",
        tags: ["Self-hosting", "Container", "Manutenzione"],
      },
      {
        id: "operate-ai-it",
        category: "operate",
        eyebrow: "Esplorazione",
        title: "Workload AI self-hosted",
        summary:
          "OpenClaw è un’area di esplorazione per capire confini e richieste di risorse dei workload AI locali, non un servizio dichiarato in produzione.",
        tags: ["OpenClaw", "Isolamento risorse", "Apprendimento"],
      },
      {
        id: "lead-muma-it",
        category: "lead",
        eyebrow: "Responsabile di sala",
        title: "Il MuMa",
        summary:
          "Coordino prenotazioni, fornitori, cassa, inventario, flusso del team, esperienza ospite e una cantina da oltre 80 etichette.",
        tags: ["Responsabilità", "Lucidità", "Comunicazione"],
      },
      {
        id: "lead-erasmus-it",
        category: "lead",
        eyebrow: "Scambio 2025/26",
        title: "Sabancı University",
        summary:
          "Studio indipendente a Istanbul, collaborazione tecnica in inglese e adattamento a un nuovo ambiente accademico e culturale.",
        tags: ["Team internazionale", "Inglese", "Adattabilità"],
      },
      {
        id: "lead-cantinella-it",
        category: "lead",
        eyebrow: "Sala",
        title: "Osteria La Cantinella",
        summary:
          "Ho sviluppato affidabilità, ritmo e comunicazione chiara per sostenere operazioni rivolte al cliente anche sotto pressione.",
        tags: ["Affidabilità", "Servizio", "Teamwork"],
      },
    ],
    projects: [
      {
        id: "ctf-hammer-it",
        number: "01",
        status: "Progetto principale · Tesi triennale",
        title: "CTF Hammer",
        role: "Progetto individuale",
        summary: "Un flusso unificato per analizzare il traffico nelle CTF A/D.",
        detail:
          "CTF Hammer raccoglie PCAP dagli host vulnerabili, ricostruisce le conversazioni con tshark, classifica pattern utili e invia i risultati in tempo reale all’interfaccia web. Worker asincroni separano l’analisi dal percorso dell’operatore; SSH/SCP e Docker Compose collegano i componenti.",
        stack: [
          "Flask",
          "Svelte / SvelteKit",
          "tshark",
          "MongoDB",
          "RabbitMQ / Celery",
          "WebSocket",
          "SSH / SCP",
          "Docker Compose",
        ],
        outcome:
          "Testato durante simulazioni CyberChallenge per analizzare il traffico e riconoscere pattern d’attacco in un’unica interfaccia.",
        limitation:
          "Con traffico elevato, le connessioni SSH/SCP degradavano e rischiavano di saturare il percorso di rete della vulbox. Il prototipo non è quindi stato usato nella finale nazionale; throttling e controllo delle risorse hanno guidato l’iterazione successiva.",
        href: links.ctfHammer,
        featured: true,
      },
      {
        id: "malware-analyzer-it",
        number: "02",
        status: "Progetto di sicurezza",
        title: "Smart HTA & JAR analyzer",
        role: "Tooling Python",
        summary: "Prima feature statiche, poi contesto assistito da modelli.",
        detail:
          "Una pipeline modulare estrae feature da file HTA e JAR, applica regole euristiche spiegabili e può richiedere una seconda valutazione a modelli linguistici. Comandi CLI e test funzionali rendono ogni passaggio ispezionabile.",
        stack: ["Python", "BeautifulSoup", "javap", "Euristiche", "API LLM", "Test"],
        href: links.malware,
      },
      {
        id: "aquasecure-it",
        number: "03",
        status: "Corso Sabancı · Collaborazione",
        title: "AquaSecure",
        role: "Progetto accademico di gruppo",
        summary: "Esercizio di sicurezza su uno SCADA simulato per il trattamento dell’acqua.",
        detail:
          "Il team ha isolato i servizi con reti Docker e modellato una catena da SQL injection a SSRF e scrittura Modbus non autorizzata. Dimostra l’applicazione di concetti di sicurezza in un contesto OT/ICS simulato, non esperienza professionale di sicurezza industriale.",
        stack: ["Reti Docker", "SCADA simulato", "SQL injection", "SSRF", "Modbus"],
        href: links.aquaSecure,
      },
    ],
    externalProfiles: [
      {
        id: "github",
        title: "GitHub",
        handle: "@Proibito04",
        summary:
          "Codice sorgente di strumenti di sicurezza, esperimenti infrastrutturali e progetti accademici selezionati.",
        href: links.github,
      },
      {
        id: "htb",
        title: "Hack The Box",
        handle: "Pratica tecnica in sicurezza",
        summary:
          "Macchine e challenge usate per sviluppare abitudini ripetibili di ricognizione, exploit e documentazione.",
        href: links.htb,
      },
      {
        id: "linkedin",
        title: "LinkedIn",
        handle: "Edoardo Balzano",
        summary:
          "Formazione, esperienza internazionale, direzione tecnica e percorso professionale in un unico spazio.",
        href: links.linkedin,
      },
    ],
    credential: {
      title: "Finalista CyberChallenge.IT — 8ª Edizione, 2024",
      issuer: "Cybersecurity National Lab · Università di Torino",
      year: "2024",
      summary:
        "Attestato ufficiale di partecipazione come finalista. Non viene indicato alcun piazzamento di squadra incerto.",
      preview: "/media/cyberchallenge-certificate.webp",
      pdf: "/media/cyberchallenge-2024-edoardo-balzano.pdf",
    },
    visualEvidence: sharedVisualEvidence,
    cv: {
      eyebrow: "Profilo / CV",
      title: "Edoardo Balzano",
      intro:
        "Laureato in Informatica e studente magistrale in Cybersecurity, orientato alla sicurezza di infrastrutture, container e cloud.",
      location: "Torino, Italia · Laurea magistrale in Cybersecurity all’Università di Torino",
      print: "Stampa / Salva come PDF",
      profileTitle: "Profilo professionale",
      profile:
        "Studio la sicurezza gestendo sistemi reali e osservando come falliscono. Le mie evidenze principali attraversano Linux, servizi containerizzati, traffico di rete e pratica Attack/Defense: da uno strumento distribuito per le CTF a un homelab Raspberry Pi e alla pratica continua su HTB. La gestione di sala aggiunge responsabilità quotidiana, lucidità sotto pressione e comunicazione chiara.",
      educationTitle: "Formazione ed esperienza internazionale",
      projectsTitle: "Progetti di sicurezza selezionati",
      practiceTitle: "Pratica e credenziale",
      credentialPdfLabel: "Certificato PDF",
      credentialHtbLabel: "Hack The Box",
      credentialWriteupsLabel: "Writeup tecnici",
      leadershipTitle: "Leadership e operazioni",
      skillsTitle: "Competenze",
      skillsToolsLabel: "Strumenti",
      skillsContext:
        "Esposizione progettuale: AWS, Google Cloud Platform, Firebase. Direzione attuale: sicurezza di container e cloud.",
      contactTitle: "Contatti",
      evidenceTitle: "Mappa delle evidenze",
      evidenceIntro:
        "Le competenze contano quando sono collegate al lavoro svolto. Questa mappa mostra dove è visibile ogni area.",
      projectLabels: {
        contribution: "Cosa dimostra",
        evidence: "Evidenza",
      },
    },
    education: [
      {
        organization: "Università di Torino",
        role: "Laurea magistrale in Cybersecurity",
        period: "In corso",
        location: "Torino, Italia",
        summary:
          "Formazione avanzata in cybersecurity, con direzione verso sicurezza di container, cloud e infrastrutture.",
      },
      {
        organization: "Sabancı University",
        role: "Scambio Erasmus",
        period: "Anno accademico 2025/26",
        location: "Istanbul, Türkiye",
        summary:
          "Esperienza internazionale che dimostra indipendenza, adattabilità, comunicazione in inglese e collaborazione interculturale.",
        relatedProject: {
          name: "AquaSecure · progetto accademico collaborativo",
          summary:
            "Ambiente SCADA simulato per il trattamento dell’acqua, con isolamento delle reti Docker e catena SQLi → SSRF → scrittura Modbus non autorizzata.",
          href: links.aquaSecure,
        },
      },
      {
        organization: "Università di Torino",
        role: "Laurea triennale in Informatica",
        period: "Completata nel 2024",
        location: "Torino, Italia",
        summary:
          "Basi in reti, sistemi operativi, sviluppo software e sicurezza. Progetto di tesi: CTF Hammer.",
      },
    ],
    leadership: [
      {
        organization: "Il MuMa",
        role: "Responsabile di sala",
        period: "Circa 2024–presente",
        summary:
          "Gestione di ordini ai fornitori, prenotazioni, telefono, cassa, inventario biancheria, coordinamento del team, esperienza ospite e cantina da oltre 80 etichette.",
        details: ["Responsabilità", "Lucidità sotto pressione", "Comunicazione affidabile"],
      },
      {
        organization: "Osteria La Cantinella",
        role: "Cameriere / Sala",
        period: "Circa set 2022–2024",
        summary:
          "Servizio attento in un ambiente dinamico, mantenendo un coordinamento chiaro con il resto del team.",
        details: ["Affidabilità", "Giudizio nel servizio", "Coordinamento"],
      },
    ],
    skillGroups: [
      {
        title: "Operazioni infrastrutturali e container",
        summary:
          "Ambienti Docker basati su Linux, isolamento dei servizi, gestione dell’homelab e accesso controllato.",
        skills: [
          "Linux",
          "Docker",
          "Docker Compose",
          "Reti Docker",
          "Tailscale",
          "Cloudflare Tunnel",
        ],
      },
      {
        title: "Analisi della sicurezza e automazione",
        summary:
          "Tooling di sicurezza in Python e analisi di applicazioni e traffico di rete dimostrate attraverso CTF Hammer, malware analysis e HTB.",
        skills: [
          "Python",
          "tshark",
          "Analisi del traffico",
          "Analisi statica",
          "Testing",
        ],
      },
      {
        title: "Web e sistemi distribuiti",
        summary:
          "Connessione di interfacce, API, worker, database e code in progetti di sicurezza end-to-end.",
        skills: [
          "Flask",
          "TypeScript / Svelte",
          "MongoDB",
          "RabbitMQ / Celery",
          "WebSockets",
        ],
      },
    ],
  },
};

export const socialLinks = links;
