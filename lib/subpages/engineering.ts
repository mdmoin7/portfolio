import type { EngineeringSlug, SubpageContent, SubpageSection } from "./types";

const trainingAction = { href: "/training/", label: "Explore training →" };
const consultingAction = { href: "/consulting/", label: "Explore consulting →" };

function applyExpertiseSection(
  trainingTitle: string,
  trainingBody: string,
  consultingTitle: string,
  consultingBody: string,
): SubpageSection {
  return {
    type: "cards",
    kicker: "Training & consulting",
    title: "Apply the expertise",
    muted: true,
    cards: [
      {
        title: trainingTitle,
        description: trainingBody,
        actions: [trainingAction],
      },
      {
        title: consultingTitle,
        description: consultingBody,
        actions: [consultingAction],
      },
    ],
  };
}

function relatedSection(links: { href: string; label: string }[]): SubpageSection {
  return {
    type: "related",
    kicker: "Explore related expertise",
    title: "Core engineering topics",
    links,
  };
}

const engineeringPages: Record<EngineeringSlug, SubpageContent> = {
  react: {
    path: "/engineering/react/",
    metadata: {
      title: "React Engineering & Application Architecture — Mohammad Moin",
      description:
        "React engineering expertise by Mohammad Moin covering React 19, component architecture, hooks, TypeScript, Redux Toolkit, performance, testing, Vite and scalable enterprise application development.",
      ogType: "article",
    },
    navActive: "engineering",
    hero: {
      eyebrow: "03 · Engineering · React",
      title: "React engineering for maintainable, scalable applications.",
      lede: "Mohammad Moin works with React to build production web applications with a strong emphasis on component architecture, TypeScript, state management, performance, testing and maintainable engineering practices. The focus extends beyond individual components to the architecture of the application around them.",
      actions: [
        { href: "/training/", label: "Training", primary: true },
        { href: "/consulting/", label: "Consulting" },
        { href: "/", label: "View Portfolio" },
      ],
    },
    sections: [
      {
        type: "cards",
        kicker: "React expertise",
        title: "Modern React from components to application architecture",
        intro:
          "Effective React engineering is about keeping UI composition, state, data flow and application boundaries understandable as the product and team grow.",
        cards: [
          {
            title: "Component Architecture",
            description:
              "Functional components, hooks, composition, reusable UI patterns and clear feature boundaries for maintainable React applications.",
          },
          {
            title: "React 19 & Modern Patterns",
            description:
              "Current React development practices with modern rendering, hooks, component patterns and a focus on predictable application behavior.",
          },
          {
            title: "TypeScript & State",
            description:
              "Strongly typed application models, Redux Toolkit and structured state management for predictable data flow and scalable feature development.",
          },
          {
            title: "Performance & Quality",
            description:
              "Rendering behavior, memoization where appropriate, code splitting, bundle awareness, testing and engineering practices that support production applications.",
          },
        ],
      },
      {
        type: "topics",
        kicker: "Enterprise focus",
        title: "React in larger engineering environments",
        intro:
          "For enterprise React applications, architecture needs to support multiple teams, evolving features and long-lived codebases.",
        muted: true,
        topics: [
          "Functional Components",
          "Hooks",
          "React 19",
          "TypeScript",
          "Redux Toolkit",
          "Vite",
          "Feature Architecture",
          "API Integration",
          "Code Splitting",
          "Performance",
          "Testing",
          "Design Systems",
          "Nx Monorepos",
          "CI/CD",
        ],
        callout: {
          title: "React + architecture",
          body: "The goal is not to introduce abstraction for its own sake. A good React architecture makes ownership, state boundaries, reusable components and feature delivery clear enough for teams to evolve the application without accumulating unnecessary complexity.",
        },
      },
      applyExpertiseSection(
        "React Training",
        "Hands-on programs covering React development, TypeScript, state management, architecture, performance and production engineering practices.",
        "Frontend Architecture Consulting",
        "Architecture guidance for React applications, modularization, monorepos, modernization and engineering enablement.",
      ),
      relatedSection([
        { href: "/engineering/angular/", label: "Angular" },
        { href: "/engineering/react-native/", label: "React Native" },
        { href: "/engineering/terraform/", label: "Terraform" },
        { href: "/engineering/frontend-architecture/", label: "Frontend Architecture" },
      ]),
    ],
    footer: "simple",
    footerNote: "React Engineering & Application Architecture",
  },

  angular: {
    path: "/engineering/angular/",
    metadata: {
      title: "Angular Engineering & Enterprise Application Development — Mohammad Moin",
      description:
        "Angular engineering expertise by Mohammad Moin covering application architecture, standalone components, signals, RxJS, performance, testing and enterprise delivery.",
      ogType: "article",
    },
    navActive: "engineering",
    hero: {
      eyebrow: "03 · Engineering · Angular",
      title: "Angular engineering for scalable, enterprise applications.",
      lede: "Mohammad Moin works with Angular across application architecture, component design, state and reactive programming, performance, testing and enterprise delivery. His Angular work connects framework-level practices with maintainable architecture and real production engineering.",
      actions: [
        { href: "/training/", label: "Angular Training", primary: true },
        { href: "/consulting/", label: "Consulting" },
        { href: "/", label: "View Portfolio" },
      ],
    },
    sections: [
      {
        type: "cards",
        kicker: "Angular expertise",
        title: "From framework fundamentals to enterprise architecture",
        intro:
          "The focus is not only on using Angular APIs, but on structuring applications so teams can develop, test, scale and maintain them over time.",
        cards: [
          {
            title: "Application Architecture",
            description:
              "Standalone application structure, feature boundaries, shared functionality, dependency injection, routing and scalable component organization.",
          },
          {
            title: "Modern Angular",
            description:
              "Signals, reactive patterns, modern component APIs and current Angular development practices for maintainable applications.",
          },
          {
            title: "RxJS & State",
            description:
              "Reactive data flows, observable composition, state management and API integration with an emphasis on predictable application behavior.",
          },
          {
            title: "Performance & Quality",
            description:
              "Change detection strategy, rendering performance, lazy loading, bundle considerations, testing and engineering practices that support production quality.",
          },
        ],
      },
      {
        type: "topics",
        kicker: "Enterprise focus",
        title: "Angular in larger engineering environments",
        intro:
          "Angular becomes particularly valuable when application structure, consistency and team-scale development matter. Areas of focus include:",
        muted: true,
        topics: [
          "Standalone Components",
          "Signals",
          "RxJS",
          "Dependency Injection",
          "Routing",
          "Forms",
          "State Management",
          "Lazy Loading",
          "Performance",
          "Testing",
          "Nx Monorepos",
          "Microfrontends",
          "CI/CD",
          "Code Quality",
        ],
        callout: {
          title: "Angular + architecture",
          body: "For enterprise teams, framework knowledge is only one layer. The stronger objective is an architecture that keeps features isolated, dependencies understandable and delivery predictable as the codebase and team grow.",
        },
      },
      applyExpertiseSection(
        "Angular Training",
        "Hands-on programs covering Angular development, architecture, modern APIs, performance, testing and enterprise patterns.",
        "Frontend Architecture Consulting",
        "Architecture guidance for application structure, modernization, monorepos, migration and engineering enablement.",
      ),
      relatedSection([
        { href: "/engineering/react/", label: "React" },
        { href: "/engineering/react-native/", label: "React Native" },
        { href: "/engineering/terraform/", label: "Terraform" },
        { href: "/engineering/frontend-architecture/", label: "Frontend Architecture" },
      ]),
    ],
    footer: "simple",
    footerNote: "Angular Engineering & Enterprise Application Development",
  },

  "react-native": {
    path: "/engineering/react-native/",
    metadata: {
      title: "React Native Engineering & Mobile Application Development — Mohammad Moin",
      description:
        "React Native engineering by Mohammad Moin covering mobile architecture, Expo, native integration, performance, debugging and production mobile delivery.",
      ogType: "article",
    },
    navActive: "engineering",
    hero: {
      eyebrow: "03 · Engineering · React Native",
      title: "React Native engineering for production mobile applications.",
      lede: "Mohammad Moin works with React Native to design and deliver cross-platform mobile applications, combining React expertise with mobile-specific architecture, native platform considerations, debugging, performance and production delivery.",
      actions: [
        { href: "/training/", label: "React Native Training", primary: true },
        { href: "/consulting/", label: "Consulting" },
        { href: "/", label: "View Portfolio" },
      ],
    },
    sections: [
      {
        type: "cards",
        kicker: "React Native expertise",
        title: "From React foundations to mobile engineering",
        intro:
          "Effective React Native development requires more than writing React components. The architecture must account for navigation, platform behavior, native capabilities, performance and the realities of shipping applications to mobile users.",
        cards: [
          {
            title: "Mobile Architecture",
            description:
              "Application structure, reusable components, navigation, state management, API integration and separation of platform-specific concerns.",
          },
          {
            title: "Expo & Development Workflow",
            description:
              "Modern React Native development workflows with Expo, development builds, emulators, physical devices and production-oriented debugging.",
          },
          {
            title: "Native & Platform Integration",
            description:
              "Understanding the boundary between JavaScript and native Android/iOS capabilities, including platform-specific behavior and native modules.",
          },
          {
            title: "Performance & UX",
            description:
              "Rendering performance, animations, list optimization, memory considerations and responsive mobile interactions using production-focused techniques.",
          },
        ],
      },
      {
        type: "topics",
        kicker: "Mobile engineering focus",
        title: "Building maintainable React Native applications",
        intro:
          "The engineering focus spans the complete application lifecycle rather than only the UI layer.",
        muted: true,
        topics: [
          "React Native",
          "Expo",
          "React",
          "TypeScript",
          "Redux Toolkit",
          "Navigation",
          "React Native Reanimated",
          "Android",
          "iOS",
          "Native Modules",
          "Device Debugging",
          "Emulators",
          "Performance",
          "Testing",
          "Production Builds",
          "CI/CD",
        ],
        callout: {
          title: "React Native + architecture",
          body: "A scalable mobile codebase needs clear boundaries between shared application logic, platform-specific behavior and reusable UI. The objective is to keep feature development predictable while preserving the ability to use native capabilities where they add value.",
        },
      },
      applyExpertiseSection(
        "React Native Training",
        "Hands-on programs covering React Native foundations, application architecture, device debugging, performance and production development workflows.",
        "Mobile & Frontend Architecture Consulting",
        "Architecture guidance for cross-platform applications, shared component systems, state management, performance and modernization.",
      ),
      {
        type: "topics",
        kicker: "Explore related expertise",
        title: "Core engineering topics",
        topics: [
          { label: "Angular", href: "/engineering/angular/" },
          { label: "React", href: "/engineering/react/" },
          { label: "Terraform", href: "/engineering/terraform/" },
          { label: "Frontend Architecture", href: "/engineering/frontend-architecture/" },
        ],
      },
    ],
    footer: "simple",
    footerNote: "React Native Engineering & Mobile Application Development",
  },

  terraform: {
    path: "/engineering/terraform/",
    metadata: {
      title: "Terraform & Azure Infrastructure Engineering — Mohammad Moin",
      description:
        "Terraform and Azure infrastructure engineering by Mohammad Moin covering Infrastructure as Code, reusable modules, state management, CI/CD, security and GitHub Actions automation.",
      ogType: "article",
    },
    navActive: "engineering",
    hero: {
      eyebrow: "03 · Engineering · Terraform · Azure",
      title: "Infrastructure as Code for repeatable, secure Azure environments.",
      lede: "Mohammad Moin works with Terraform as an Infrastructure as Code approach for defining, reusing and delivering infrastructure consistently across environments. The focus includes Azure, reusable modules, state management, CI/CD, security and GitHub Actions automation.",
      actions: [
        { href: "/training/", label: "Terraform Training", primary: true },
        { href: "/consulting/", label: "Consulting" },
        { href: "/", label: "View Portfolio" },
      ],
    },
    sections: [
      {
        type: "cards",
        kicker: "Terraform expertise",
        title: "From declarative infrastructure to automated delivery",
        intro:
          "Terraform is most useful when infrastructure configuration becomes repeatable engineering rather than a collection of manually managed environments.",
        cards: [
          {
            title: "Infrastructure as Code",
            description:
              "Declarative configuration using providers, resources, variables and outputs to define infrastructure consistently and make changes reviewable.",
          },
          {
            title: "Reusable Modules",
            description:
              "Module design and composition for repeatable infrastructure patterns, environment consistency and clearer ownership boundaries.",
          },
          {
            title: "State Management",
            description:
              "Local and remote state concepts, state lifecycle, collaboration, locking and safe handling of infrastructure state.",
          },
          {
            title: "Azure Infrastructure",
            description:
              "Terraform-based provisioning across Azure resources with attention to environment structure, identity, permissions and operational consistency.",
          },
        ],
      },
      {
        type: "topics",
        kicker: "Automation & governance",
        title: "Terraform in a CI/CD workflow",
        intro:
          "Infrastructure changes benefit from the same engineering discipline as application changes: validation, review, planning, controlled deployment and security checks.",
        muted: true,
        topics: [
          "terraform init",
          "terraform plan",
          "terraform apply",
          "terraform validate",
          "Variables & Outputs",
          "count / for_each",
          "Remote State",
          "State Locking",
          "GitHub Actions",
          "Plan & Apply Workflows",
          "Manual Approval",
          "Secure Secrets",
          "Drift Review",
        ],
        callout: {
          title: "Secure Infrastructure Delivery",
          body: "Infrastructure automation should separate planning from deployment, protect credentials and secrets, validate configuration before changes reach an environment, and make infrastructure changes auditable through version control and CI/CD.",
        },
      },
      {
        type: "cards",
        kicker: "Security",
        title: "Infrastructure security as part of the workflow",
        cards: [
          {
            title: "Identity & Secrets",
            description:
              "Secure authentication and authorization patterns for Azure deployments, service principals, IAM/RBAC and protected pipeline secrets.",
          },
          {
            title: "Configuration Quality",
            description:
              "Static analysis and policy-oriented checks using tools such as TFLint, tfsec and Checkov to identify configuration risks early.",
          },
          {
            title: "State Protection",
            description:
              "Remote state design, controlled access and appropriate protection of infrastructure state and sensitive values.",
          },
          {
            title: "Change & Drift Management",
            description:
              "Reviewable plans, controlled applies and periodic drift analysis to keep declared infrastructure aligned with deployed environments.",
          },
        ],
      },
      applyExpertiseSection(
        "Terraform & Azure Training",
        "Structured learning covering Terraform fundamentals, modules, state, Azure infrastructure, CI/CD and infrastructure security.",
        "Infrastructure Architecture",
        "Guidance around Infrastructure as Code structure, reusable modules, delivery workflows and engineering practices for maintainable environments.",
      ),
      {
        type: "topics",
        kicker: "Explore related expertise",
        title: "Core engineering topics",
        topics: [
          { label: "Angular", href: "/engineering/angular/" },
          { label: "React", href: "/engineering/react/" },
          { label: "React Native", href: "/engineering/react-native/" },
          { label: "Frontend Architecture", href: "/engineering/frontend-architecture/" },
        ],
      },
    ],
    footer: "simple",
    footerNote: "Terraform & Azure Infrastructure Engineering",
  },

  "frontend-architecture": {
    path: "/engineering/frontend-architecture/",
    metadata: {
      title: "Frontend Architecture & Enterprise Application Design — Mohammad Moin",
      description:
        "Frontend architecture expertise by Mohammad Moin covering application boundaries, component design, state, monorepos, microfrontends, performance, testing and delivery practices across Angular, React and React Native.",
      ogType: "article",
    },
    navActive: "engineering",
    hero: {
      eyebrow: "03 · Engineering · Frontend Architecture",
      title: "Frontend architecture for applications that need to scale.",
      lede: "Mohammad Moin focuses on designing maintainable frontend systems across Angular, React and React Native, with architecture spanning application boundaries, component design, state, monorepos, microfrontends, performance, testing and delivery practices.",
      actions: [
        { href: "/consulting/", label: "Architecture Consulting", primary: true },
        { href: "/training/", label: "Training" },
        { href: "/", label: "View Portfolio" },
      ],
    },
    sections: [
      {
        type: "cards",
        kicker: "Architecture principles",
        title: "Design the system, not just the components",
        intro:
          "A scalable frontend is more than a collection of reusable components. Architecture defines boundaries, ownership, dependencies and the way teams safely evolve the application over time.",
        cards: [
          {
            title: "Application Boundaries",
            description:
              "Feature-oriented structure, clear responsibilities, shared capabilities and dependency boundaries that keep large applications understandable.",
          },
          {
            title: "Component Architecture",
            description:
              "Reusable UI primitives, domain components, composition patterns and maintainable interfaces between presentation and application logic.",
          },
          {
            title: "State & Data Flow",
            description:
              "Choosing appropriate local, feature and global state patterns while keeping API integration and reactive data flows predictable.",
          },
          {
            title: "Engineering Quality",
            description:
              "Testing strategy, code quality, performance budgets, observability and CI/CD practices that make architecture enforceable in day-to-day delivery.",
          },
        ],
      },
      {
        type: "decisions",
        kicker: "Architecture decisions",
        title: "Choose patterns from constraints, not trends",
        intro:
          "Architecture should solve a product and organizational problem. The right choice depends on application size, team topology, deployment needs, domain boundaries, operational maturity and the cost of introducing additional complexity.",
        muted: true,
        items: [
          {
            title: "Monorepo vs. multiple repositories",
            body: "Use repository boundaries deliberately. A monorepo can improve discoverability, shared tooling and coordinated changes; separate repositories can strengthen autonomy when teams and release lifecycles genuinely need isolation.",
          },
          {
            title: "Modular frontend vs. microfrontends",
            body: "Start with strong internal boundaries when independent deployment is not a real requirement. Microfrontends become more compelling when autonomous teams, incremental modernization or independent delivery justify the additional operational and governance complexity.",
          },
          {
            title: "Local state vs. shared state",
            body: "Keep state close to the feature that owns it unless multiple domains genuinely need the same state. Shared state should have an explicit ownership and contract rather than becoming a default application-wide dependency.",
          },
          {
            title: "Abstraction vs. duplication",
            body: "Share stable concepts and genuinely common behavior. Premature abstraction can create coupling between features that should evolve independently; deliberate duplication can sometimes be cheaper and safer.",
          },
        ],
      },
      {
        type: "flow",
        kicker: "Enterprise patterns",
        title: "Architecture across the frontend ecosystem",
        items: [
          { title: "Angular", subtitle: "Standalone architecture · Signals · RxJS · DI" },
          { title: "React", subtitle: "Components · Hooks · State · TypeScript" },
          { title: "Nx", subtitle: "Monorepos · Libraries · Boundaries · Tooling" },
          { title: "Microfrontends", subtitle: "Module Federation · Independent delivery" },
        ],
        topics: [
          "Design Systems",
          "API Integration",
          "State Management",
          "Code Splitting",
          "Lazy Loading",
          "Performance",
          "Testing",
          "CI/CD",
          "Monorepos",
          "Module Federation",
          "Microfrontends",
          "Migration Strategy",
        ],
      },
      {
        type: "cards",
        kicker: "Architecture lifecycle",
        title: "From system design to delivery",
        intro:
          "Architecture decisions should remain connected to implementation and operational reality rather than becoming a document that sits outside the development workflow.",
        muted: true,
        callout: {
          title: "Architecture should enable delivery.",
          body: "The objective is not architectural complexity. It is a system that lets teams make changes safely, understand the impact of dependencies and continue delivering as the product grows.",
        },
        cards: [
          {
            title: "Assess",
            description:
              "Understand business constraints, existing application structure, technical debt, team boundaries and delivery requirements.",
          },
          {
            title: "Design",
            description:
              "Define application boundaries, technology choices, data flow, state strategy, repository structure and integration patterns.",
          },
          {
            title: "Implement",
            description:
              "Turn architecture into conventions, libraries, tooling, code-quality rules and reusable patterns that teams can apply consistently.",
          },
          {
            title: "Evolve",
            description:
              "Measure performance and maintainability, address technical debt and adapt architecture as products, teams and requirements change.",
          },
        ],
      },
      {
        type: "cards",
        kicker: "Performance & quality",
        title: "Architecture has runtime consequences",
        intro:
          "Architecture choices affect the browser, the build pipeline and the engineering workflow. Performance and quality should therefore be treated as architectural concerns rather than late-stage optimization tasks.",
        cards: [
          {
            title: "Runtime Performance",
            description:
              "Rendering strategy, change detection, component boundaries, data fetching, code splitting, lazy loading and bundle composition.",
          },
          {
            title: "Build Performance",
            description:
              "Repository tooling, dependency graphs, caching, affected builds and CI optimization so architecture scales with the development organization.",
          },
          {
            title: "Testing Strategy",
            description:
              "Unit, component, integration and end-to-end coverage chosen according to risk, ownership and architectural boundaries rather than maximizing test count.",
          },
          {
            title: "Maintainability",
            description:
              "Explicit conventions, linting, type safety, dependency boundaries and documentation that keep architectural intent visible during everyday development.",
          },
        ],
      },
      applyExpertiseSection(
        "Architecture-focused Training",
        "Hands-on learning around Angular, React, Nx, enterprise application architecture, code quality and scalable frontend practices.",
        "Frontend Architecture Consulting",
        "Architecture reviews, modernization, application structure, Nx monorepos, microfrontend strategy and engineering enablement.",
      ),
      relatedSection([
        { href: "/engineering/angular/", label: "Angular" },
        { href: "/engineering/react/", label: "React" },
        { href: "/engineering/react-native/", label: "React Native" },
        { href: "/engineering/terraform/", label: "Terraform" },
      ]),
    ],
    footer: "simple",
    footerNote: "Frontend Architecture & Enterprise Application Design",
  },
};

export const engineeringSlugs = Object.keys(engineeringPages) as EngineeringSlug[];

export function getEngineeringPage(slug: string): SubpageContent | undefined {
  return engineeringPages[slug as EngineeringSlug];
}

export function getAllEngineeringSlugs(): EngineeringSlug[] {
  return engineeringSlugs;
}
