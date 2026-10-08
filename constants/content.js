export const BRAND = {
  name: "Asharib Khan",
  alias: "Asharib Khan",
  role: "Full-Stack AI Engineer • Founder & CTO of YEEZUS. Specializing in enterprise-grade infrastructure. Student at FAST-NUCES Karachi.",
  email: "asharib2khan@gmail.com",
  linkedin: "https://www.linkedin.com/in/asharib-khan-435230301/",
  github: "https://github.com/Asharib19khan",
  site: "https://asharibkhan.vercel.app"
};

export const ABOUT = {
  statement: "I engineer autonomous financial pipelines and code that thinks.",
  stats: [
    { label: "Projects Shipped", value: 12 },
    { label: "Technologies Used", value: 32 },
    { label: "Certifications", value: 4 },
    { label: "Leadership Roles", value: 3 }
  ]
};

export const SKILLS = [
  {
    category: "Python",
    items: ["OOP", "CLI Development", "Socket Programming", "Automation & Scripting"]
  },
  {
    category: "Other Languages",
    items: ["JavaScript", "C++", "C#", "SQL", "HTML/CSS", "Ruby"]
  },
  {
    category: "Frontend",
    items: ["React 18", "Next.js", "Tailwind CSS", "PyTorch Shadcn/UI", "TanStack Query", "Recharts", "Vite"]
  },
  {
    category: "Backend",
    items: ["Flask", "FastAPI", "Express.js", "REST API Design", "JWT Authentication"]
  },
  {
    category: "AI & Machine Learning",
    items: ["Scikit-Learn (Random Forest, k-NN)", "NumPy", "Pandas", "OpenCV", "ML Pipeline Design", "Power BI"]
  },
  {
    category: "Databases",
    items: ["MySQL", "Microsoft SQL Server", "Access", "Vercel", "SupaBase", "Zod", "Drizzle ORM"]
  },
  {
    category: "Cybersecurity",
    items: ["JWT & API Security", "Password Hashing (bcryptjs)", "Network Scanning (Nmap)", "Linux", "Android Permission Models"]
  },
  {
    category: "Tools & Platforms",
    items: ["Git", "Figma", "Unity (C#)"]
  }
];

/**
 * Project shape:
 *  title, meta (role · org · when), description, tech[], purpose?, link?, github?
 *  featured?  — gets the spotlight treatment and opens by default
 *  modules?   — [{ name, summary, signature }] for team builds where only part was mine
 *  flow?      — ordered pipeline stages, drawn as a diagram
 */
export const PROJECTS = [
  {
    title: "Developers Day 2026",
    meta: "Backend team · ACM FAST Karachi · Spring 2026",
    featured: true,
    description: "DevDay is FAST-NUCES Karachi's flagship annual tech event. I joined the web team on the event backend and owned two modules end to end, from the Prisma schema to emails landing in participants' inboxes.",
    modules: [
      {
        name: "PR Query Desk",
        summary: "The PR team logs a participant's competition-change request, then approves or rejects it. Permission-gated REST API with Zod validation, paginated status filters, and branded approval and rejection emails rendered at decision time.",
        signature: "PATCH /pr-queries/:id/status"
      },
      {
        name: "Email Delivery Queue",
        summary: "Every decision writes a ready-to-send email row. A cron worker drains the queue every minute in batches of 10 over Gmail SMTP, marks rows sent, and retries failures up to 3 times with the reason logged. Replaced Resend.",
        signature: "cron(* * * * *) → batch 10 → retry ×3"
      }
    ],
    flow: ["PR desk", "Email queue", "Cron worker", "Gmail SMTP", "Inbox"],
    tech: ["TypeScript", "Express 5", "Prisma", "PostgreSQL", "Zod", "node-cron", "Nodemailer"],
    link: null,
    github: null
  },
  {
    title: "Type 19C",
    meta: "Oracle 19c AI copilot · Solo build · 2026",
    description: "Ask an Oracle 19c database a question in plain English. Type 19C writes the SQL, runs it against the live database, repairs its own query when Oracle throws an error, and streams back a plain-language answer, with charts, PDF reports and voice input when you need them.",
    tech: ["Python", "FastAPI", "Oracle 19c (python-oracledb)", "Next.js 16", "OpenAI + Gemini fallback", "Ollama · Qwen2.5-Coder 14B", "Recharts", "NDJSON streaming"],
    purpose: "Analysts and ops teams who need answers from Oracle without writing SQL. Read-only by default; writes and DDL are permission-gated, and destructive statements wait for explicit confirmation. Runs on cloud models or fully offline.",
    link: null,
    github: null
  },
  {
    title: "BAAZ",
    meta: "Mobility platform for Pakistan · Founder & builder · In development",
    description: "Ride-hailing, carpooling and parcel delivery built around safety: a women-only Sanctuary mode, one-tap SOS that streams live GPS to trusted contacts, and on-server identity checks with CNIC OCR and liveness-checked face matching. Fares, wallet and escrow are enforced server-side.",
    tech: ["Expo (React Native)", "Express 5", "Socket.IO", "Supabase · Postgres + RLS", "WhatsApp OTP", "face-api (TF.js)", "Tesseract OCR", "Whisper voice booking", "JazzCash / Easypaisa"],
    purpose: "Commuters across Pakistan, especially women, students and seniors, who need affordable rides they can trust. Karachi first.",
    link: null,
    github: null
  },
  {
    title: "KYC Verification System",
    meta: "Identity & onboarding",
    description: "A secure verification system featuring WhatsApp-based 2FA, progressive web app capabilities, and dual portals. Enables seamless customer onboarding while providing admins with robust verification management.",
    tech: ["React + Vite", "TailwindCSS", "Python FastAPI", "SQLite", "Twilio API"],
    purpose: "Streamlines identity verification and loan applications for financial institutions, fintech startups, and enterprise compliance sectors.",
    link: "https://github.com/Asharib19khan/kycverificationsystem",
    github: "https://github.com/Asharib19khan/kycverificationsystem"
  },
  {
    title: "AML System",
    meta: "Compliance tooling",
    description: "A powerful Python CLI engine designed to detect smurfing deposit clusters and transactional anomalies. It features robust transaction monitoring and parsing logic to identify potential Anti-Money Laundering (AML) red flags in real-time banking environments.",
    tech: ["Python", "Pandas", "bcrypt"],
    purpose: "Anti-Money Laundering tracking and transactional anomaly detection tailored for banking institutions, compliance teams, and financial regulators.",
    link: "https://github.com/Asharib19khan/aml_sys",
    github: "https://github.com/Asharib19khan/aml_sys"
  },
  {
    title: "Skill Issue",
    meta: "Getting Over It tournament mod",
    description: "A full playable game featuring a custom BepInEx tournament timer and API leaderboard mod. Players compete to climb as high as possible within a configured time limit, with their peak distance automatically recorded and submitted to a live leaderboard.",
    tech: ["C#", "Unity", "ASP.NET", "BepInEx Modding"],
    purpose: "Live-tournament competitive gaming and e-sports events, providing real-time leaderboard syncing and custom modded game constraints.",
    link: "https://github.com/Asharib19khan/skillIssues_gettingOverIt",
    github: "https://github.com/Asharib19khan/skillIssues_gettingOverIt"
  },
  {
    title: "Arduino Sentry",
    meta: "Radar & auto-launcher",
    description: "An automated, multitasking Arduino sentry system that sweeps a radar to detect targets using an ultrasonic sensor. Once a target is locked, it triggers an alarm and automatically aims and fires a launcher mechanism.",
    tech: ["C++", "Arduino", "NewPing Library", "Hardware Sensors"],
    purpose: "Defense robotics prototyping and automated security systems, demonstrating advanced non-blocking state machine architecture without delays.",
    link: "https://github.com/Asharib19khan/missile_detector_Arduino",
    github: "https://github.com/Asharib19khan/missile_detector_Arduino"
  }
];
