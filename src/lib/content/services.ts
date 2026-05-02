export type ServiceEntry = {
  slug: string;
  title: string;
  navLabel: string;
  path: string;
  icon:
  | "code"
  | "smartphone"
  | "globe"
  | "link"
  | "cloud"
  | "palette"
  | "chart"
  | "cpu"
  | "users";
  eyebrow: string;
  teaser: string;
  heroTitle: string;
  heroSummary: string;
  seoDescription: string;
  keywords: string[];
  introduction: string[];
  capabilities: string[];
  outcomes: string[];
  idealFor: string[];
  bestFit?: { title: string; description: string; features: string[]; icon: string }[];
  process: { title: string; description: string }[];
  stacks: string[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  image: string;
};

export const SERVICE_ENTRIES: ServiceEntry[] = [
  {
    slug: "custom-tech-solutions",
    title: "Custom Tech Solutions",
    navLabel: "Custom Tech Solutions",
    path: "/services/custom-tech-solutions",
    icon: "code",
    eyebrow: "Tailored Systems",
    teaser:
      "Bespoke platforms, internal systems, and business tools shaped around your exact workflow instead of forcing your team into generic software.",
    heroTitle:
      "Custom technology systems built around how your business actually works.",
    heroSummary:
      "TECHZOQ designs and delivers custom software for organizations that have outgrown spreadsheets, disconnected tools, and rigid off-the-shelf products. We focus on clean architecture, operational clarity, and long-term maintainability.",
    seoDescription:
      "Custom tech solutions by TECHZOQ for institutes, businesses, and operations teams that need tailored software systems, automation, integrations, and scalable architecture.",
    keywords: [
      "custom software development",
      "custom tech solutions Pakistan",
      "business automation software",
      "software architect services",
      "tailored software systems",
    ],
    introduction: [
      "Custom software is the right choice when your business process is a competitive advantage, when you need tighter control over workflows, or when existing tools create more operational friction than value.",
      "We build systems that align product experience, backend operations, permissions, reporting, and integrations into one dependable platform instead of a fragile patchwork of apps and manual workarounds.",
    ],
    capabilities: [
      "Business Workflow Mapping | Visualize and optimize complex operational processes into seamless digital journeys through strategic architectural analysis.",
      "Admin Panels | Robust internal tools designed for performance, allowing your teams to manage data and operations with zero friction.",
      "Customer Portals | Self-service interfaces that empower users while reducing support overhead through intuitive design and fast response times.",
      "Role-based Access Control | Granular security protocols ensuring the right people have the right access, maintaining data integrity at every level.",
      "Integrations | Deep connectivity between legacy systems and modern APIs, creating a unified ecosystem for your business intelligence.",
      "Scalable Data Models | Future-proof database architectures built to handle exponential growth and complex relational data requirements.",
    ],
    outcomes: [
      "Reduce manual coordination and duplicated data entry",
      "Create one reliable source of truth for operations",
      "Support growth without rewriting the system every quarter",
      "Improve visibility for management through structured reporting",
    ],
    idealFor: [
      "Institutes and training organizations managing admissions, finance, and operations",
      "Service businesses with approval flows and operational bottlenecks",
      "Teams replacing scattered spreadsheets and WhatsApp-only coordination",
      "Founders who need a software product built around their business model",
    ],
    bestFit: [
      {
        title: "Institutes & Agencies",
        description: "Large-scale organizations requiring rigid security protocols and complex multi-tenant permissions.",
        features: ["Enterprise Auth", "Legacy Migration"],
        icon: "building",
      },
      {
        title: "Founders building SaaS",
        description: "Rapid development without sacrificing the long-term architectural integrity of your product.",
        features: ["Multi-tenancy", "API-First Design"],
        icon: "rocket",
      },
      {
        title: "Data-Driven Teams",
        description: "Companies that treat data as their primary asset and require sophisticated visualization tools.",
        features: ["Real-time Streams", "Complex BI"],
        icon: "chart",
      },
    ],
    process: [
      {
        title: "Discovery and workflow mapping",
        description:
          "We document current operations, decision points, user roles, and failure areas before proposing architecture.",
      },
      {
        title: "System design and scope definition",
        description:
          "We define modules, data boundaries, access rules, reporting needs, and implementation phases with explicit tradeoffs.",
      },
      {
        title: "Build and validation",
        description:
          "We implement production-grade modules with validation, auditability, and safe operational behavior.",
      },
      {
        title: "Operational rollout",
        description:
          "We stabilize the system for real teams, real data, and live process adoption instead of demo-only delivery.",
      },
    ],
    stacks: [
      "Next.js",
      "Node.js",
      "MongoDB / PostgreSQL",
      "RBAC",
      "API integrations",
      "Analytics dashboards",
    ],
    faqs: [
      {
        question: "When should a company choose custom software over SaaS?",
        answer:
          "Choose custom software when your workflow is operationally unique, when off-the-shelf tools force bad compromises, or when data and permissions must be modeled around your process instead of generic assumptions.",
      },
      {
        question: "Can TECHZOQ replace an existing manual workflow gradually?",
        answer:
          "Yes. We prefer phased rollouts so teams can migrate module by module, reduce disruption, and avoid rewriting everything at once.",
      },
      {
        question:
          "Do you design both customer-facing and internal systems?",
        answer:
          "Yes. Most effective systems combine public experiences, staff operations, permissions, reporting, and finance or communication workflows into one coherent platform.",
      },
    ],
    relatedSlugs: [
      "web-application-development",
      "devops-as-a-service",
      "ui-ux-design-solutions",
    ],
    image: "/images/portfolio/custom-new.png",
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development (Android & iOS)",
    navLabel: "Mobile App Development (Android & iOS)",
    path: "/services/mobile-app-development",
    icon: "smartphone",
    eyebrow: "Mobile Products",
    teaser:
      "Android and iOS apps engineered for real business workflows, reliable performance, and clear user journeys across devices.",
    heroTitle:
      "Mobile products that feel fast, clear, and dependable in real-world usage.",
    heroSummary:
      "We build mobile applications for customer engagement, field operations, internal teams, and service workflows. The focus is not just app screens. It is the full product behavior, APIs, performance, and lifecycle behind them.",
    seoDescription:
      "Mobile app development by TECHZOQ for Android and iOS, including product UX, backend integration, dashboards, workflows, and production-ready delivery.",
    keywords: [
      "mobile app development Pakistan",
      "android ios app development",
      "cross platform app development",
      "business mobile applications",
      "custom app development",
    ],
    introduction: [
      "A good mobile app must do more than look polished. It should reduce friction for users, stay stable on real networks, and connect cleanly with the backend systems your business depends on.",
      "We design mobile experiences around task completion, speed, offline realities where needed, and maintainable architecture so the app can evolve without constant regression.",
    ],
    capabilities: [
      "Product Planning and defining clear mobile roadmaps that align device-specific features with business goals.",
      "Cross-platform Implementation and high-performance builds for Android and iOS using a single maintainable codebase.",
      "API & Auth Integration and secure connection to backend systems with real-time data synchronization and biometric security.",
      "Operational Dashboards and custom internal tools to manage app content, user sessions, and field-team activities.",
      "App Store Readiness and end-to-end support for store submissions, versioning, and seamless update rollouts.",
      "Performance Tuning and optimizing touch response, battery usage, and offline capabilities for real-world usage.",
    ],
    outcomes: [
      "Improve accessibility for customers and field users",
      "Make business workflows portable and faster to execute",
      "Reduce support load through clearer mobile UX",
      "Create a scalable foundation for future mobile features",
    ],
    idealFor: [
      "Customer-facing service and marketplace apps",
      "Field teams capturing data on-site",
      "Institutes and communities needing student or member apps",
      "Businesses converting manual interactions into mobile workflows",
    ],
    bestFit: [
      {
        title: "Service Marketplaces",
        description: "Platforms that need to connect service providers with customers in real-time efficiently.",
        features: ["Real-time Tracking", "In-app Payments"],
        icon: "globe",
      },
      {
        title: "Field Operations",
        description: "Teams that need to collect data or manage tasks while on-site with offline capabilities.",
        features: ["Offline Support", "Sync Engine"],
        icon: "smartphone",
      },
      {
        title: "Consumer Brands",
        description: "Brands looking to build loyalty through a direct, high-performance mobile presence.",
        features: ["Push Notifications", "Biometric Auth"],
        icon: "users",
      },
    ],
    process: [
      {
        title: "Use-case definition",
        description:
          "We identify what should happen on mobile, what should stay in admin systems, and where device-specific constraints matter.",
      },
      {
        title: "UX and product flow design",
        description:
          "We structure screens around the shortest practical path to completion, not around decorative layouts.",
      },
      {
        title: "App and backend implementation",
        description:
          "We build the mobile layer with the supporting APIs, state handling, auth, and operational hooks it needs.",
      },
      {
        title: "Release and iteration",
        description:
          "We prepare builds, verify critical flows, and improve based on real usage patterns after launch.",
      },
    ],
    stacks: [
      "React Native / Flutter",
      "Next.js backends",
      "REST / GraphQL APIs",
      "Push notifications",
      "Authentication",
      "Analytics and crash monitoring",
    ],
    faqs: [
      {
        question: "Do you build native or cross-platform apps?",
        answer:
          "We choose based on product constraints, performance needs, team budget, and future maintenance cost. Cross-platform is efficient for many business products, but not every case.",
      },
      {
        question: "Can the app connect with an existing web or admin system?",
        answer:
          "Yes. We often extend existing platforms with mobile apps while keeping auth, permissions, and operational data aligned.",
      },
      {
        question:
          "Do you handle admin dashboards behind the mobile app too?",
        answer:
          "Yes. Most mobile products need an operational backend for content, user management, reporting, and approvals.",
      },
    ],
    relatedSlugs: [
      "web-application-development",
      "ui-ux-design-solutions",
      "devops-as-a-service",
    ],
    image: "/images/portfolio/mobile2-new.png",
  },
  {
    slug: "web-application-development",
    title: "Web Application Development",
    navLabel: "Web Application Development",
    path: "/services/web-application-development",
    icon: "globe",
    eyebrow: "Web Platforms",
    teaser:
      "Modern web products, portals, dashboards, and internal systems designed for speed, clarity, and operational depth.",
    heroTitle:
      "Web applications built for real operations, not just polished demos.",
    heroSummary:
      "TECHZOQ delivers web applications that combine frontend usability with strong backend structure. We build platforms that are reliable under real traffic, evolving business logic, and multi-role operational workflows.",
    seoDescription:
      "Web application development by TECHZOQ including portals, dashboards, admin systems, business platforms, and scalable full-stack architecture.",
    keywords: [
      "web application development",
      "full stack development Pakistan",
      "admin dashboard development",
      "custom web platform development",
      "business portal development",
    ],
    introduction: [
      "Web apps fail when frontend polish hides weak data models, inconsistent permissions, and unstable backend behavior. We treat the web layer as part of a full system, not an isolated interface.",
      "That means architecture, validation, reporting, state management, and role scoping are designed together so the product remains usable as it grows.",
    ],
    capabilities: [
      "Portal Architecture and designing multi-role web environments that simplify complex admissions and finance workflows.",
      "High-Utility Admin Tools and advanced search, filtering, and bulk-action capabilities to speed up daily operations.",
      "Scoped User Experiences and delivering personalized dashboards based on user permissions, from students to global admins.",
      "State Management and robust frontend logic that ensures data consistency and speed across large-scale applications.",
      "Audit Logging & Security and implementing transparent tracking for every transaction and sensitive system change.",
      "SEO-Aware Public Flows and merging high-performance landing pages with conversion-focused sign-up funnels.",
    ],
    outcomes: [
      "Centralize workflows that are currently scattered across tools",
      "Improve operator speed with better tables, filters, and actions",
      "Create a stable product base for future modules and integrations",
      "Deliver better customer trust through cleaner digital experiences",
    ],
    idealFor: [
      "Teams needing portals, admin dashboards, or operations systems",
      "Institutes managing admissions, finance, and student workflows",
      "Businesses consolidating scattered tools into one platform",
      "Organizations that need multi-role access control and reporting",
    ],
    bestFit: [
      {
        title: "B2B SaaS Teams",
        description: "Founders building subscription tools with complex user roles and automated billing logic.",
        features: ["RBAC Implementation", "Stripe Integration"],
        icon: "code",
      },
      {
        title: "Internal Ops Units",
        description: "Organizations needing custom dashboards to automate manual and slow spreadsheet workflows.",
        features: ["Process Automation", "Custom Reporting"],
        icon: "cpu",
      },
      {
        title: "Scaling Platforms",
        description: "Businesses outgrowing their current tech stack and needing a robust, scalable architecture.",
        features: ["Cloud Scaling", "API Optimization"],
        icon: "rocket",
      },
    ],
    process: [
      {
        title: "Product and operations mapping",
        description:
          "We define user types, flows, business rules, and the operational surface area the web app must support.",
      },
      {
        title: "Interface and system architecture",
        description:
          "We shape the public UX, dashboard behavior, permissions, and database contracts together.",
      },
      {
        title: "Implementation and stabilization",
        description:
          "We build the platform with validation, auditability, reporting hooks, and production-safe patterns.",
      },
      {
        title: "Post-launch extension",
        description:
          "We leave the application ready for additional modules, roles, and integrations rather than painting it into a corner.",
      },
    ],
    stacks: [
      "Next.js",
      "TypeScript",
      "MongoDB / PostgreSQL",
      "RBAC",
      "SSR / SEO",
      "Admin dashboards",
    ],
    faqs: [
      {
        question:
          "Do you build both marketing pages and dashboard systems?",
        answer:
          "Yes. Strong platforms often need both: acquisition on the public side and clear operational workflows internally.",
      },
      {
        question:
          "Can a web app support multiple roles with different permissions?",
        answer:
          "Yes. We design role-based access explicitly so admins, staff, instructors, students, or clients see only what they should.",
      },
      {
        question: "Do you optimize for SEO as well?",
        answer:
          "Yes, where the product includes public discovery pages, landing pages, or lead generation flows.",
      },
    ],
    relatedSlugs: [
      "custom-tech-solutions",
      "ui-ux-design-solutions",
      "data-analytics-cloud-solutions",
    ],
    image: "/images/portfolio/web4.png",
  },
  {
    slug: "blockchain-technology",
    title: "Blockchain Technology",
    navLabel: "BlockChain Technology",
    path: "/services/blockchain-technology",
    icon: "link",
    eyebrow: "Blockchain Solutions",
    teaser:
      "Practical blockchain implementation for traceability, tokenized workflows, smart contracts, and tamper-resistant transaction logic where it genuinely adds value.",
    heroTitle:
      "Blockchain applied where trust, traceability, and verifiable logic actually matter.",
    heroSummary:
      "We approach blockchain as an engineering decision, not a trend label. TECHZOQ helps teams evaluate whether distributed trust, smart contracts, or immutable records solve a real business problem before implementation begins.",
    seoDescription:
      "Blockchain technology services by TECHZOQ including smart contracts, wallet flows, traceability systems, and practical blockchain integration for real business use cases.",
    keywords: [
      "blockchain development Pakistan",
      "smart contract development",
      "blockchain integration",
      "traceability systems",
      "web3 engineering services",
    ],
    introduction: [
      "Blockchain is useful when multiple parties need shared trust, when records must be verifiable, or when logic should execute in a tamper-resistant way. It is not the right answer for every workflow.",
      "Our job is to separate useful blockchain architecture from unnecessary complexity, then implement the surrounding systems that make the experience usable for operators and end users.",
    ],
    capabilities: [
      "Feasibility Analysis and identifying where distributed trust adds value versus where a central database is superior.",
      "Smart Contract Logic and developing tamper-resistant code to automate agreements and verifiable state changes.",
      "Wallet-Connected UX and creating intuitive interfaces for Web3 interactions, making crypto-logic accessible to everyone.",
      "On-chain Traceability and immutable record-keeping for supply chains, digital rights, and verifiable transactions.",
      "Verification Reporting and customized dashboards that translate raw blockchain data into readable business intelligence.",
      "Hybrid System Integration and bridging the gap between decentralized ledgers and conventional business software.",
    ],
    outcomes: [
      "Introduce verifiable logic where trust is distributed",
      "Reduce dispute risk through transparent records",
      "Connect blockchain workflows to usable business interfaces",
      "Avoid overengineering through clear architecture decisions",
    ],
    idealFor: [
      "Platforms requiring traceable asset or transaction records",
      "Multi-party ecosystems needing transparent state changes",
      "Businesses exploring tokenized or contract-driven workflows",
      "Teams that need expert evaluation before committing to blockchain build-out",
    ],
    bestFit: [
      {
        title: "Supply Chain Firms",
        description: "Industries needing immutable traceability for goods and transparent, real-time audit trails.",
        features: ["Traceability", "Audit Logs"],
        icon: "link",
      },
      {
        title: "DeFi Innovators",
        description: "Financial products leveraging smart contracts for secure and automated peer-to-peer transactions.",
        features: ["Smart Contracts", "Wallet Integration"],
        icon: "chart",
      },
      {
        title: "IP & Digital Rights",
        description: "Creators needing verifiable ownership and automated royalty distribution for digital assets.",
        features: ["Ownership Proof", "Royalty Systems"],
        icon: "palette",
      },
    ],
    process: [
      {
        title: "Use-case qualification",
        description:
          "We test whether blockchain is justified or whether a conventional backend would be the stronger solution.",
      },
      {
        title: "Architecture selection",
        description:
          "We define what belongs on-chain, what stays off-chain, and how the user and admin layers interact safely.",
      },
      {
        title: "Contract and integration build",
        description:
          "We implement contracts, API layers, transaction handling, and operational controls.",
      },
      {
        title: "Operational readiness",
        description:
          "We ensure monitoring, admin handling, and real user flows are workable beyond prototype stage.",
      },
    ],
    stacks: [
      "Smart contracts",
      "Wallet integration",
      "Node services",
      "Transaction monitoring",
      "Admin controls",
      "Security review mindset",
    ],
    faqs: [
      {
        question: "Is blockchain appropriate for every product?",
        answer:
          "No. Many products are better served by conventional systems. We recommend blockchain only when its trust and verification properties directly improve the product model.",
      },
      {
        question:
          "Can blockchain products still have normal admin dashboards and reports?",
        answer:
          "Yes. In practice, they need strong operational tooling around the blockchain layer for support, visibility, and user management.",
      },
      {
        question: "Do you help evaluate the idea before development?",
        answer:
          "Yes. That evaluation is often the highest-value step because it prevents expensive complexity with weak business justification.",
      },
    ],
    relatedSlugs: [
      "custom-tech-solutions",
      "devops-as-a-service",
      "web-application-development",
    ],
    image: "/images/portfolio/blockchain-new.png",
  },
  {
    slug: "devops-as-a-service",
    title: "DevOps as a Service Implementation",
    navLabel: "DevOps as a Service Implementation",
    path: "/services/devops-as-a-service",
    icon: "cloud",
    eyebrow: "Infrastructure and Delivery",
    teaser:
      "Cloud architecture, CI/CD, deployment automation, observability, and operational hardening for systems that need to stay reliable under change.",
    heroTitle:
      "Infrastructure and delivery pipelines that make shipping safer and operations calmer.",
    heroSummary:
      "DevOps is not just deployment automation. It is the discipline of making environments reproducible, releases safer, monitoring clearer, and system changes less risky. TECHZOQ builds that operational foundation into your product lifecycle.",
    seoDescription:
      "DevOps and cloud implementation by TECHZOQ including CI/CD, cloud architecture, deployment automation, monitoring, and production reliability engineering.",
    keywords: [
      "devops services Pakistan",
      "cloud infrastructure setup",
      "cicd implementation",
      "deployment automation",
      "production reliability engineering",
    ],
    introduction: [
      "When environments drift, deployments are manual, and observability is weak, every release becomes stressful. That slows business progress and increases failure risk.",
      "We standardize environments, delivery flows, and operational visibility so teams can release with confidence and respond to issues with better signal.",
    ],
    capabilities: [
      "Cloud Provisioning and architecting secure, auto-scaling environments on AWS or Azure tailored to your traffic.",
      "CI/CD Automation and building pipelines that make shipping code faster and safer through automated testing.",
      "Infrastructure as Code and standardizing environments using code to eliminate drift and manual setup errors.",
      "Observability & Alerting and setting up high-signal monitoring to catch issues before they impact your users.",
      "Secrets Management and hardening production security through automated vaulting and strict access protocols.",
      "Cost Optimization and constant review of cloud spend to ensure performance is achieved without wasted budget.",
    ],
    outcomes: [
      "Reduce deployment risk and environment drift",
      "Improve incident visibility and diagnosis speed",
      "Make scaling and operational changes more predictable",
      "Strengthen production readiness across teams",
    ],
    idealFor: [
      "Startups moving from ad hoc hosting to structured operations",
      "Teams with unreliable or manual deployment processes",
      "Products needing observability and uptime discipline",
      "Organizations preparing for growth or multi-environment workflows",
    ],
    bestFit: [
      {
        title: "Agile Startups",
        description: "Fast-moving teams that need to automate their deployment and infrastructure for speed.",
        features: ["CI/CD Pipelines", "Auto-scaling"],
        icon: "cloud",
      },
      {
        title: "Security-First Firms",
        description: "Organizations that need hardened environments, strict access control, and zero-trust setup.",
        features: ["Infrastructure as Code", "Compliance Audits"],
        icon: "building",
      },
      {
        title: "Legacy Systems",
        description: "Firms moving from on-premise to the cloud needing zero-downtime migration strategies.",
        features: ["Cloud Migration", "Disaster Recovery"],
        icon: "cpu",
      },
    ],
    process: [
      {
        title: "Current-state audit",
        description:
          "We review environments, deployment habits, secrets handling, access, and operational blind spots.",
      },
      {
        title: "Infrastructure blueprint",
        description:
          "We define environments, release flow, monitoring coverage, and risk controls.",
      },
      {
        title: "Automation and hardening",
        description:
          "We implement CI/CD, provisioning, runtime configuration, logging, and practical guardrails.",
      },
      {
        title: "Operational handoff",
        description:
          "We document the setup so the system is operable by your team, not dependent on hidden knowledge.",
      },
    ],
    stacks: [
      "Cloud infrastructure",
      "CI/CD pipelines",
      "Containerization",
      "Monitoring and logging",
      "Environment management",
      "Secrets and access control",
    ],
    faqs: [
      {
        question: "Do small teams really need DevOps discipline?",
        answer:
          "Yes, especially small teams. Weak operations create compounding risk because there are fewer people available to recover from deployment or infrastructure mistakes.",
      },
      {
        question:
          "Can you improve an existing setup instead of rebuilding it?",
        answer:
          "Yes. We often stabilize existing environments incrementally, focusing on the largest operational risks first.",
      },
      {
        question: "Do you cover monitoring as part of DevOps?",
        answer:
          "Yes. Delivery without visibility is incomplete. Monitoring, logs, and alerting are part of operational readiness.",
      },
    ],
    relatedSlugs: [
      "data-analytics-cloud-solutions",
      "custom-tech-solutions",
      "mobile-app-development",
    ],
    image: "/images/portfolio/infrastructure1.png",
  },
  {
    slug: "ui-ux-design-solutions",
    title: "UI/UX Design Solutions for B2B and B2C",
    navLabel: "UI/UX Design Solutions for B2B and B2C",
    path: "/services/ui-ux-design-solutions",
    icon: "palette",
    eyebrow: "Product Experience",
    teaser:
      "User-centered product design for customer journeys, admin systems, dashboards, onboarding flows, and conversion-heavy interfaces.",
    heroTitle:
      "Product interfaces that are visually sharp, operationally clear, and easier to use under real pressure.",
    heroSummary:
      "We design interfaces for both B2C and B2B environments, which means we care about conversion on the public side and efficiency on the operational side. The goal is usable systems, not decorative screens detached from product reality.",
    seoDescription:
      "UI/UX design services by TECHZOQ for B2B and B2C products, including dashboards, landing pages, workflows, design systems, and conversion-focused interfaces.",
    keywords: [
      "ui ux design Pakistan",
      "dashboard ux design",
      "b2b product design",
      "landing page design",
      "design systems",
    ],
    introduction: [
      "Weak product UX creates hidden operational costs: confused users, slower staff actions, higher support load, and lower conversion. Strong design reduces that friction across both public pages and internal tools.",
      "We design with hierarchy, user intent, and workflow clarity in mind so the experience supports the business instead of slowing it down.",
    ],
    capabilities: [
      "User Flow Engineering and mapping logical journeys that reduce cognitive load and lead users to action.",
      "Visual Hierarchy and designing interfaces where the most important tasks are always the most obvious ones.",
      "Design Systems and creating reusable component libraries that ensure consistency across every screen and module.",
      "Operational UX Refinement and cleaning up dense data tables and forms to improve staff productivity and speed.",
      "Interactive Prototyping and high-fidelity mockups that allow you to feel the product behavior before development starts.",
      "Accessibility Compliance and ensuring your digital products are usable by everyone, regardless of their device or ability.",
    ],
    outcomes: [
      "Increase clarity in both customer and staff experiences",
      "Reduce drop-offs caused by weak information hierarchy",
      "Improve consistency across product surfaces",
      "Create interfaces ready for scale, not one-off page design",
    ],
    idealFor: [
      "B2B platforms with dense operational workflows",
      "B2C landing pages and signup or purchase funnels",
      "Products needing cleaner dashboards and admin usability",
      "Teams redesigning an interface that feels generic or confusing",
    ],
    bestFit: [
      {
        title: "Product Owners",
        description: "Stakeholders looking to turn complex business requirements into intuitive user journeys.",
        features: ["User Research", "Wireframing"],
        icon: "palette",
      },
      {
        title: "Engineering Teams",
        description: "Dev teams needing clear design systems to speed up development and ensure consistency.",
        features: ["Design Systems", "Component Libraries"],
        icon: "code",
      },
      {
        title: "Conversion Focused",
        description: "Marketing teams focused on optimization, heatmaps, and high-performance landing pages.",
        features: ["A/B Testing UI", "Conversion UX"],
        icon: "chart",
      },
    ],
    process: [
      {
        title: "Flow and friction review",
        description:
          "We look at where users hesitate, misinterpret, or abandon key tasks.",
      },
      {
        title: "Information hierarchy and interface direction",
        description:
          "We structure the product so users understand what matters first and what happens next.",
      },
      {
        title: "Component and design system definition",
        description:
          "We make the interface reusable and consistent instead of page-by-page improvised.",
      },
      {
        title: "Implementation-ready refinement",
        description:
          "We align design choices with frontend realities so the build stays coherent in production.",
      },
    ],
    stacks: [
      "Design systems",
      "Responsive UI",
      "Landing pages",
      "Dashboard UX",
      "Accessibility-aware design",
      "Product flow optimization",
    ],
    faqs: [
      {
        question: "Do you design only marketing pages or full products too?",
        answer:
          "Both. Some of the highest-value UX work happens in dashboards, finance flows, admin tools, and operational systems, not just public pages.",
      },
      {
        question:
          "Can UX improve an existing application without rebuilding everything?",
        answer:
          "Yes. Many usability improvements come from reworking hierarchy, flow, components, and task structure without replacing the entire product.",
      },
      {
        question: "What is different about B2B UX?",
        answer:
          "B2B systems often involve dense information, repeated tasks, permissions, and speed-sensitive actions. The UX must support operator efficiency, not just visual appeal.",
      },
    ],
    relatedSlugs: [
      "web-application-development",
      "custom-tech-solutions",
      "mobile-app-development",
    ],
    image: "/images/portfolio/ui&ux-new.png",
  },
  {
    slug: "data-analytics-cloud-solutions",
    title: "Data Analytics and Cloud Solutions",
    navLabel: "Data Analytics and Cloud Solutions",
    path: "/services/data-analytics-cloud-solutions",
    icon: "chart",
    eyebrow: "Data and Cloud",
    teaser:
      "Data pipelines, dashboards, cloud-backed analytics workflows, and reporting systems that turn scattered activity into usable decision-making signal.",
    heroTitle:
      "Data and cloud systems that turn operational activity into clearer decisions.",
    heroSummary:
      "Many teams collect data without turning it into usable visibility. We design data flows, analytics views, and cloud-backed reporting systems that support management, operations, and business growth decisions.",
    seoDescription:
      "Data analytics and cloud solutions by TECHZOQ including reporting systems, dashboards, data pipelines, cloud architecture, and operational visibility tools.",
    keywords: [
      "data analytics services Pakistan",
      "cloud solutions",
      "business dashboards",
      "reporting systems",
      "data pipelines",
    ],
    introduction: [
      "Reporting becomes useful when the underlying data model is consistent, the metrics are defined correctly, and stakeholders can trust what the dashboard is showing.",
      "We help teams move from ad hoc exports and spreadsheet assembly toward structured analytics flows backed by sound data handling and cloud infrastructure.",
    ],
    capabilities: [
      "Operational reporting and management dashboard design",
      "Data model review for metric integrity and traceability",
      "Cloud-backed storage and analytics architecture",
      "Pipeline design for imports, transformations, and summaries",
      "Role-aware reporting access and export flows",
      "KPI alignment across product, finance, sales, and operations",
    ],
    outcomes: [
      "Improve management visibility across core business workflows",
      "Reduce time spent reconciling inconsistent reports",
      "Create more trustworthy KPI and funnel reporting",
      "Make cloud-hosted data systems easier to evolve over time",
    ],
    idealFor: [
      "Teams with growing operational data but weak reporting discipline",
      "Businesses needing dashboards across multiple modules or roles",
      "Organizations moving from spreadsheet reporting to structured analytics",
      "Products needing cloud-backed reporting and export capabilities",
    ],
    bestFit: [
      {
        title: "Decision Makers",
        description: "Executive leadership needing real-time high-level KPIs and business health metrics.",
        features: ["BI Dashboards", "KPI Tracking"],
        icon: "chart",
      },
      {
        title: "Marketing Teams",
        description: "Teams needing to track customer behavior and campaign ROI across multiple channels.",
        features: ["Funnel Analysis", "Attribution Modeling"],
        icon: "users",
      },
      {
        title: "Operations Managers",
        description: "Staff looking for data to optimize supply chains and internal team efficiency bottlenecks.",
        features: ["Predictive Analytics", "Resource Planning"],
        icon: "cpu",
      },
    ],
    process: [
      {
        title: "Metric definition and data audit",
        description:
          "We check what data exists, where the gaps are, and how metrics should actually be defined.",
      },
      {
        title: "Architecture and dashboard design",
        description:
          "We design the reporting model, cloud setup, and access patterns around real decision-making use cases.",
      },
      {
        title: "Pipeline and reporting implementation",
        description:
          "We build the queries, summaries, exports, and views needed for daily operational use.",
      },
      {
        title: "Validation and governance",
        description:
          "We verify calculation integrity and reduce the risk of dashboards that look polished but mislead the business.",
      },
    ],
    stacks: [
      "Dashboards and exports",
      "Cloud databases",
      "Data pipelines",
      "Reporting endpoints",
      "Operational KPIs",
      "Role-based analytics access",
    ],
    faqs: [
      {
        question: "Can you improve reporting in an existing system?",
        answer:
          "Yes. In many cases the key work is defining correct metrics, fixing data inconsistencies, and adding reporting endpoints and views on top of an existing product.",
      },
      {
        question: "Do you only build dashboards?",
        answer:
          "No. Useful analytics usually requires underlying schema, query, export, and access-control work as well.",
      },
      {
        question: "How do you avoid misleading KPI dashboards?",
        answer:
          "By validating definitions, separating raw events from business states, and aligning report logic with actual workflow transitions.",
      },
    ],
    relatedSlugs: [
      "devops-as-a-service",
      "web-application-development",
      "ai-machine-learning-integration",
    ],
    image: "/images/portfolio/analytics-new1.png"
  },
  {
    slug: "ai-machine-learning-integration",
    title: "AI & Machine Learning Integration",
    navLabel: "AI & Machine Learning Integration",
    path: "/services/ai-machine-learning-integration",
    icon: "cpu",
    eyebrow: "Applied AI",
    teaser:
      "AI-enabled features, decision support, document intelligence, copilots, and automation layers integrated into real products and workflows.",
    heroTitle:
      "AI features that serve a product goal instead of acting like a disconnected demo.",
    heroSummary:
      "We integrate AI and machine learning where they improve business outcomes: reducing manual effort, assisting users, accelerating analysis, or making structured decisions easier. The emphasis is applied value, guardrails, and operational fit.",
    seoDescription:
      "AI and machine learning integration by TECHZOQ including copilots, automation, document intelligence, predictive workflows, and AI-enabled product features.",
    keywords: [
      "ai integration Pakistan",
      "machine learning integration",
      "ai product features",
      "document intelligence",
      "business automation with ai",
    ],
    introduction: [
      "AI becomes valuable when it shortens effort, improves insight, or unlocks product behavior that would otherwise be too slow or expensive manually.",
      "We design AI integrations around product constraints, validation requirements, user trust, and operational traceability so the feature can be used in production, not just demonstrated.",
    ],
    capabilities: [
      "AI-assisted workflows, copilots, and guided interfaces",
      "Document extraction, classification, and summarization flows",
      "Prediction, recommendation, or triage support where relevant",
      "Human-in-the-loop approval and review paths",
      "Prompt, retrieval, and orchestration design for real products",
      "Operational dashboards to observe AI usage and outcomes",
    ],
    outcomes: [
      "Reduce repetitive manual work across staff workflows",
      "Improve response speed and structured decision support",
      "Enhance products with higher-value assistance features",
      "Keep AI functionality traceable and safer to operate",
    ],
    idealFor: [
      "Products with document-heavy or classification-heavy workflows",
      "Operations teams needing assisted analysis or triage",
      "Platforms that can benefit from guided automation",
      "Businesses exploring AI but needing practical implementation discipline",
    ],
    bestFit: [
      {
        title: "Product Innovators",
        description: "Teams building the next generation of smart apps that require integrated AI features like search or chat.",
        features: ["LLM Integration", "Semantic Search"],
        icon: "rocket",
      },
      {
        title: "Operational Leaders",
        description: "Managers looking to reduce costs by automating repetitive data entry or verification tasks.",
        features: ["Process Automation", "OCR Systems"],
        icon: "cpu",
      },
      {
        title: "Data Analysts",
        description: "Firms needing advanced predictive models to forecast sales, churn, or market trends accurately.",
        features: ["Predictive Models", "Data Insights"],
        icon: "chart",
      },
    ],
    process: [
      {
        title: "Use-case selection",
        description:
          "We identify high-value, realistic AI opportunities instead of forcing AI into low-value areas.",
      },
      {
        title: "Workflow and guardrail design",
        description:
          "We define what the AI does, what humans review, and how outputs are made trustworthy enough for use.",
      },
      {
        title: "Integration into the product stack",
        description:
          "We connect the AI layer to existing systems, permissions, data, and operational screens.",
      },
      {
        title: "Measurement and refinement",
        description:
          "We monitor quality, failure modes, and user behavior so the AI feature becomes more useful over time.",
      },
    ],
    stacks: [
      "LLM integrations",
      "Prompt and retrieval workflows",
      "Human review layers",
      "Document processing",
      "Workflow automation",
      "Usage analytics",
    ],
    faqs: [
      {
        question: "Can AI be added into an existing product safely?",
        answer:
          "Yes, when it is scoped properly, paired with review controls where needed, and instrumented so the business can observe quality and misuse risk.",
      },
      {
        question: "Do you only build chatbots?",
        answer:
          "No. Chat is only one interface. We focus more broadly on AI-assisted workflows, document processing, recommendations, and operational automation.",
      },
      {
        question: "How do you keep AI features practical?",
        answer:
          "By defining a clear business job, measurable value, controlled failure modes, and the surrounding UI and backend logic needed for real use.",
      },
    ],
    relatedSlugs: [
      "data-analytics-cloud-solutions",
      "custom-tech-solutions",
      "web-application-development",
    ],
    image: "/images/portfolio/ai-new.png",
  },
];

export const COWORKING_SERVICE_ENTRY = {
  title: "Coworking & Community Spaces",
  navLabel: "Coworking & Community Spaces",
  path: "/coworking",
  icon: "users" as const,
  teaser:
    "Flexible workspaces, collaboration energy, and meeting environments for makers, freelancers, and teams.",
};

export const SERVICE_NAV_ITEMS = [
  {
    href: "/services/custom-tech-solutions",
    label: "Custom Tech Solutions",
    icon: "🛠️",
  },
  {
    href: "/services/mobile-app-development",
    label: "Mobile App Development (Android & iOS)",
    icon: "📱",
  },
  {
    href: "/services/web-application-development",
    label: "Web Application Development",
    icon: "🌐",
  },
  {
    href: "/services/blockchain-technology",
    label: "BlockChain Technology",
    icon: "🔗",
  },
  {
    href: "/services/devops-as-a-service",
    label: "DevOps as a Service Implementation",
    icon: "⚙️",
  },
  {
    href: "/services/ui-ux-design-solutions",
    label: "UI/UX Design Solutions for B2B and B2C",
    icon: "🎨",
  },
  {
    href: "/services/data-analytics-cloud-solutions",
    label: "Data Analytics and Cloud Solutions",
    icon: "📊",
  },
  {
    href: "/services/ai-machine-learning-integration",
    label: "AI & Machine Learning Integration",
    icon: "🤖",
  },
  {
    href: "/coworking",
    label: "Coworking & Community Spaces",
    icon: "🏢",
  },
] as const;

export const SERVICE_ROUTE_ENTRIES = SERVICE_ENTRIES.map((service) => ({
  slug: service.slug,
  path: service.path,
  title: service.title,
}));

export function getServiceBySlug(slug: string) {
  return SERVICE_ENTRIES.find((service) => service.slug === slug);
}

export function getRelatedServices(slug: string) {
  const current = getServiceBySlug(slug);
  if (!current) return [];
  return current.relatedSlugs
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((service): service is ServiceEntry => Boolean(service));
}
