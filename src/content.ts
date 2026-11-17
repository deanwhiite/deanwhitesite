export type Picture = { src: string; alt: string; width: number; height: number };
export type Link = { label: string; href: string };

export type Entry = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  results?: string[];
  tags: string[];
  pictures: Picture[];
  command?: string;
  links: Link[];
};

export type Role = {
  title: string;
  company?: string;
  dates: string;
  summary?: string;
  points: string[];
};

export type Course = { title: string; school: string; dates: string };

export const profile = {
  name: "Dean White",
  tagline: "designer of web things",
  location: "Cape Town, South Africa",
  email: "info.deanwhite@gmail.com",
  linkedin: "https://www.linkedin.com/in/deanwhiite",
  behance: "https://www.behance.net/deanwhite3",
  blog: "https://medium.com/design-bootcamp",
  resources: "https://deanwhite4.gumroad.com",
  calendar: "https://calendar.app.google/ksafoVgoJghDsMhh9",
};

export const about = [
  "Hey, I'm Dean White and I'm a designer, indie game developer and music producer.",
  "By day I'm the sole product designer on DealerOS at DealersOnline, a dealership management platform covering leads and deals, task automation and omni-channel customer conversations.",
  "Before that I was at SnapScan, where I redesigned the SnapStore app, website and card machine UI.",
  "After hours I make small games as The Silliest Games, and build the odd tool for my own desktop.",
];

export const experience: Role[] = [
  {
    title: "Product Designer",
    company: "DealersOnline",
    dates: "May 2024 – Present",
    summary:
      "Sole product designer on DealerOS, a dealership management platform covering lead and deal management, task automation, and omni-channel customer conversations.",
    points: [
      "Own end-to-end design for multiple feature areas: discovery and spec audit, research, flows, interactive prototypes, production-ready Figma, and developer handoff.",
      "Built and maintain the DealerOS design system (tokens, components and usage rules), giving the platform one consistent visual and interaction language across product and marketing.",
      "Designed the lead and deal management workflows and the omni-channel conversation surface, keeping dense, high-volume screens readable for sales managers, F&I, and call centre agents.",
      "Supported rollout to 80+ new dealerships, designing onboarding and migration flows and resolving usability issues surfaced during live implementation.",
      "Use coded HTML prototypes to validate interactions with stakeholders before engineering commits, cutting rework and speeding up spec sign-off.",
      "Run design QA against shipped builds, lead accessibility work across the app, and design the DealerOS marketing site and brand expression.",
    ],
  },
  {
    title: "Associate Product Designer",
    company: "SnapScan",
    dates: "Aug 2022 – May 2024",
    summary: "Redesigned the SnapStore mobile app, website, and card machine UI.",
    points: [
      "224% growth in active merchants, sign-ups up from 1,489 to 4,436 accounts, and annual payments up from 27,561 to 323,847.",
      "Ran research and interviews with 100+ active and prospective merchants to define needs and build personas.",
      "Designed card machine animations in Figma that lifted engagement and retention for 680+ new card machine users.",
      "Partnered with front-end engineers, PMs, and researchers to turn business requirements into shipped design.",
    ],
  },
  {
    title: "Freelance Product Designer",
    dates: "2022 – 2024",
    points: [
      "Redesigned the 7QZ sports-betting platform with a new design system and reworked flows for gamification and usability. Active users grew from 70 to 1,200.",
      "Introduced three engagement features and rebuilt onboarding with regional variants, including FICA compliance requirements.",
    ],
  },
  {
    title: "UI/UX Designer",
    company: "Red Bear Studio",
    dates: "Apr 2022 – Aug 2022",
    points: [
      "Took a web-based real-estate service from business requirements to first usable MVP, and developed the studio's design system and brand identity.",
    ],
  },
  {
    title: "Intern Product Designer",
    company: "Estrela Digital Studio",
    dates: "Jan 2022 – Apr 2022",
    points: [
      "Designed an e-commerce PWA, mobile components, and wireframes for multiple local clients, working directly with the CEO and lead designers.",
    ],
  },
];

export const education: Course[] = [
  { title: "BA Interaction Design", school: "Cape Town Creative Academy", dates: "2020 – 2022" },
  { title: "Usability & UX Certificate", school: "Udemy", dates: "Sep 2023" },
  { title: "UX Writing Certificate", school: "Udemy", dates: "May 2023" },
  { title: "UX Design Certificate", school: "Google Creative Campus", dates: "Oct 2022" },
  { title: "UI Design Certificate", school: "California Institute of Arts", dates: "Feb 2021" },
  { title: "Web Design Certificate: HTML & CSS", school: "FreeCodeCamp", dates: "Jan 2021" },
];

export const work: Entry[] = [
  {
    id: "snapstore",
    title: "SnapStore",
    subtitle: "Card machine · Full mobile app design",
    description:
      "Redesigned SnapStore Beta so SnapScan could put the full merchant experience on phone, tablet, desktop, and card machine. Features landed in waves from real merchant feedback, not a one-shot mockathon.",
    results: [
      "224% growth in active merchants",
      "Sign-ups up from 1,489 to 4,436 accounts",
      "Annual payments up from 27,561 to 323,847",
      "Research and interviews with 100+ merchants",
    ],
    tags: ["Payments", "POS systems", "Fintech", "Phone", "Tablet", "Card machine"],
    pictures: [
      { src: "/projects/snapstore.png", alt: "SnapStore mobile app screens", width: 1029, height: 1200 },
    ],
    links: [
      {
        label: "Case study on Behance",
        href: "https://www.behance.net/gallery/194099195/SnapStore-App-Redesign-SnapScan",
      },
    ],
  },
  {
    id: "flyfair",
    title: "FlyFair",
    subtitle: "Airline · Full mobile app design",
    description:
      "A travel app that treats booking like a trip you'll actually take: clear flows for flights and status, plus light gamification so checking in doesn't feel like filling out a form at the airport.",
    tags: ["Airline", "Travel", "Booking flows", "Gamification"],
    pictures: [{ src: "/projects/flyfair.png", alt: "FlyFair airline app screens", width: 1200, height: 679 }],
    links: [
      {
        label: "Case study on Behance",
        href: "https://www.behance.net/gallery/155345983/FlyFair-Airline-Case-Study",
      },
    ],
  },
  {
    id: "ourflo",
    title: "Ourflo",
    subtitle: "Online subscription service",
    description:
      "A subscription concept built around one idea: buy a period box for someone who needs one. Designed the site so the donate path is obvious, fighting period poverty in South Africa without making the checkout feel like a lecture.",
    tags: ["Subscription", "Lifestyle", "Social impact", "E-commerce"],
    pictures: [{ src: "/projects/ourflo.png", alt: "Ourflo website pages", width: 1017, height: 630 }],
    links: [
      {
        label: "Case study on Behance",
        href: "https://www.behance.net/gallery/140574131/Ecommerce-Site-Design-UIUX",
      },
    ],
  },
  {
    id: "timelock",
    title: "TimeLock",
    subtitle: "PWA · Mobile & desktop app design",
    description:
      "Hours in, invoice out. Built for freelancers and agencies who hate reconstructing a week of work on Friday afternoon. Log rates once, export when the client asks.",
    tags: ["Time tracking", "Invoicing", "SaaS", "PWA"],
    pictures: [{ src: "/projects/timelock.png", alt: "TimeLock app screens", width: 698, height: 940 }],
    links: [
      {
        label: "Case study on Behance",
        href: "https://www.behance.net/gallery/143566885/Time-Tracking-Web-App",
      },
    ],
  },
];

export const projects: Entry[] = [
  {
    id: "rocket-plonk",
    title: "Rocket Plonk",
    subtitle: "Android game · The Silliest Games",
    description:
      "A space block puzzle. Clear lines to thrust a rocket from Earth past Neptune to the Core. Thirteen planets, each with its own twist, and asteroids to block before they land. Designed, drawn and built solo in Godot.",
    tags: ["13 planets", "Ice, gravity, solar wind", "Asteroid strikes", "Pixel art", "Godot 4"],
    pictures: [
      { src: "/side/rocket-plonk-1.png", alt: "Rocket Plonk: every planet is different", width: 720, height: 1280 },
      { src: "/side/rocket-plonk-2.png", alt: "Rocket Plonk gameplay", width: 720, height: 1280 },
      { src: "/side/rocket-plonk-3.png", alt: "Rocket Plonk: dodge asteroids", width: 720, height: 1280 },
    ],
    links: [
      {
        label: "Get it on Google Play",
        href: "https://play.google.com/store/apps/details?id=com.blockrocket.game",
      },
      { label: "The Silliest Games", href: "https://thesilliestgames.github.io" },
    ],
  },
  {
    id: "launch-schedule",
    title: "Launch Schedule",
    subtitle: "Omarchy bar plugin · Open source",
    description:
      "A rocket in the bar counts down to the next launch. Click it for the schedule, live webcasts, crew, and a text-mode globe that traces each mission's ground track against its destination station.",
    tags: ["Next 14 launches", "Live webcasts", "ISS + Tiangong", "Trajectory globe", "Keyboard-first"],
    pictures: [
      {
        src: "/side/launch-schedule.png",
        alt: "Launch Schedule panel: upcoming launches and a text-mode globe tracking the ISS",
        width: 2180,
        height: 1380,
      },
    ],
    command: "omarchy plugin add https://github.com/deandesign/omalaunchschedule.git --enable --yes",
    links: [{ label: "View on GitHub", href: "https://github.com/deandesign/omalaunchschedule" }],
  },
];

export const contactIntro =
  "If you're hiring, or you've got a product that needs a designer who can think in systems, say hello.";

export const contactLinks: Link[] = [
  { label: "Email me", href: `mailto:${profile.email}` },
  { label: "Book a 30 min call", href: profile.calendar },
];

export type SocialIcon = "linkedin" | "behance" | "medium" | "gumroad";

export const socials: (Link & { icon: SocialIcon })[] = [
  { label: "LinkedIn", href: profile.linkedin, icon: "linkedin" },
  { label: "Behance", href: profile.behance, icon: "behance" },
  { label: "Medium", href: profile.blog, icon: "medium" },
  { label: "Gumroad", href: profile.resources, icon: "gumroad" },
];
