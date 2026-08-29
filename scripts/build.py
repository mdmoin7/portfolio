from pathlib import Path
import json
import re
import shutil
import htmlmin
import rcssmin
import rjsmin

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
SITE_URL = "https://mdmoin7.github.io/portfolio/"
PERSON_ID = f"{SITE_URL}#person"
PROFILE_IMAGE = "https://cdn.jsdelivr.net/gh/mdmoin7/portfolio@main/assets/profile.webp"

COPY_DIRS = ["assets", "about", "training", "consulting", "engineering"]
COPY_FILES = ["robots.txt", "sitemap.xml", "llms.txt", "index-old.html", "CNAME", "favicon.svg"]

PERSON = {
    "@type": "Person", "@id": PERSON_ID, "name": "Mohammad Moin", "url": SITE_URL,
    "image": PROFILE_IMAGE,
    "sameAs": ["https://github.com/mdmoin7", "https://www.linkedin.com/in/mohammadmoin/"],
    "jobTitle": "Independent Software Engineering Consultant & Corporate Technology Trainer",
    "description": "Mohammad Moin is an independent software engineering consultant and corporate technology trainer based in Bengaluru, India, combining production engineering, frontend architecture and practical enterprise technology training.",
    "address": {"@type": "PostalAddress", "addressLocality": "Bengaluru", "addressCountry": "IN"},
    "knowsAbout": ["Frontend Architecture", "Angular", "React", "React Native", "Terraform", "Microsoft Azure", "Corporate Technology Training", "TypeScript", "Node.js", "NestJS", "Nx Monorepo", "Microfrontends", "Module Federation", "Stack Migration", "Curriculum Design"],
}

PAGE_SEO = {
    "": (
        "Mohammad Moin — Independent Software Engineering Consultant & Corporate Trainer",
        "Mohammad Moin is an independent software engineering consultant and corporate technology trainer based in Bengaluru, India, specializing in frontend architecture, Angular, React, React Native and Terraform/Azure, with freelance consulting and corporate training engagements.",
        [
            "Mohammad Moin",
            "software engineering consultant",
            "corporate technology trainer",
            "frontend architect",
            "Angular consultant",
            "React consultant",
            "React Native",
            "Terraform Azure",
            "frontend architecture",
        ],
    ),
    "about": ("About Mohammad Moin — Independent Software Engineering Consultant & Corporate Technology Trainer", "Professional profile of Mohammad Moin, an independent software engineering consultant and corporate technology trainer based in Bengaluru, India, specializing in frontend architecture, Angular, React, React Native and Terraform/Azure.", ["Mohammad Moin", "software engineering consultant", "corporate technology trainer", "frontend architect", "Angular consultant", "React consultant", "React Native", "Terraform Azure"]),
    "training": ("Corporate Technology Training — Mohammad Moin | React, Angular, Node.js & Modern Engineering", "Corporate technology training by Mohammad Moin for engineering teams and organizations, covering React, Angular, React Native, Node.js, TypeScript, architecture, modern JavaScript stacks and practical upskilling programs.", ["Mohammad Moin trainer", "corporate technology training", "React training", "Angular training", "Node.js training", "React Native training", "TypeScript training", "engineering team upskilling"]),
    "consulting": ("Software Engineering Consulting — Mohammad Moin | Architecture, Modernization & Delivery", "Independent software engineering consulting by Mohammad Moin covering frontend architecture, full-stack web and mobile development, modernization, Nx monorepos, stack migration, technical delivery and engineering mentoring.", ["Mohammad Moin consultant", "software engineering consulting", "frontend architecture consultant", "React consultant", "Angular consultant", "stack migration", "Nx monorepo", "engineering modernization"]),
    "engineering/react": ("React Engineering & Application Architecture — Mohammad Moin", "React engineering and application architecture expertise by Mohammad Moin, covering React 19, TypeScript, component architecture, hooks, Redux Toolkit, Vite, performance, testing and scalable enterprise applications.", ["Mohammad Moin React", "React 19", "React architecture", "React consultant", "TypeScript", "Redux Toolkit", "Vite", "React performance", "React testing"]),
    "engineering/angular": ("Angular Engineering & Application Architecture — Mohammad Moin", "Angular engineering expertise by Mohammad Moin covering modern Angular, standalone components, Signals, application architecture, performance, testing, state management and enterprise frontend development.", ["Mohammad Moin Angular", "Angular consultant", "Angular architecture", "Angular Signals", "standalone components", "enterprise Angular", "Angular performance", "Angular training"]),
    "engineering/react-native": ("React Native Engineering & Mobile Application Development — Mohammad Moin", "React Native engineering expertise by Mohammad Moin covering cross-platform mobile architecture, React Native, Expo, TypeScript, native integration, performance and production mobile application delivery.", ["Mohammad Moin React Native", "React Native consultant", "React Native architecture", "Expo", "mobile application development", "cross-platform mobile", "React Native performance"]),
    "engineering/frontend-architecture": ("Frontend Architecture & Scalable UI Systems — Mohammad Moin", "Frontend architecture expertise by Mohammad Moin covering scalable UI systems, design systems, microfrontends, Module Federation, Nx monorepos, state management, performance and enterprise application architecture.", ["Mohammad Moin frontend architect", "frontend architecture", "microfrontends", "Module Federation", "Nx monorepo", "design systems", "enterprise frontend architecture", "scalable UI systems"]),
    "engineering/terraform": ("Terraform & Azure Infrastructure Engineering — Mohammad Moin", "Terraform and Azure infrastructure engineering expertise by Mohammad Moin covering infrastructure as code, Azure architecture, reusable Terraform modules, remote state, CI/CD and cloud engineering practices.", ["Mohammad Moin Terraform", "Terraform consultant", "Azure infrastructure", "Infrastructure as Code", "Terraform modules", "Azure architecture", "Terraform CI/CD", "cloud engineering"]),
}

RELATED = {
    "about": [("Consulting", "consulting/"), ("Corporate Training", "training/"), ("Engineering", "engineering/frontend-architecture/")],
    "training": [("Frontend Architecture", "../engineering/frontend-architecture/"), ("Consulting", "../consulting/"), ("About Mohammad Moin", "../about/")],
    "consulting": [("Frontend Architecture", "../engineering/frontend-architecture/"), ("Engineering", "../engineering/frontend-architecture/"), ("Corporate Training", "../training/"), ("About Mohammad Moin", "../about/")],
    "engineering/react": [("Frontend Architecture", "../frontend-architecture/"), ("Corporate Training", "../../training/"), ("Consulting", "../../consulting/"), ("About Mohammad Moin", "../../about/")],
    "engineering/angular": [("Frontend Architecture", "../frontend-architecture/"), ("Corporate Training", "../../training/"), ("Consulting", "../../consulting/"), ("About Mohammad Moin", "../../about/")],
    "engineering/react-native": [("Frontend Architecture", "../frontend-architecture/"), ("Corporate Training", "../../training/"), ("Consulting", "../../consulting/"), ("About Mohammad Moin", "../../about/")],
    "engineering/frontend-architecture": [("React Engineering", "../react/"), ("Angular Engineering", "../angular/"), ("Consulting", "../../consulting/"), ("About Mohammad Moin", "../../about/")],
    "engineering/terraform": [("Consulting", "../../consulting/"), ("Engineering", "../frontend-architecture/"), ("About Mohammad Moin", "../../about/")],
}

AUTHORITY = {
    "training": {
        "title": "About Mohammad Moin's corporate training practice",
        "body": "Mohammad Moin delivers corporate technology training and engineering-team upskilling programs grounded in production software engineering. Training is designed for practical adoption: guided theory is combined with implementation exercises, proof-of-concept work, architecture discussions, debugging, performance analysis and code-quality practices.",
        "facts": [
            "15,000+ engineers trained across 350+ sessions",
            "Typical cohorts of 20–50 engineers",
            "Repeat engagements with returning corporate clients",
            "Curricula spanning React, Angular, Node.js, React Native, TypeScript, Nx and modern engineering practices",
        ],
        "proof": "Training clients represented in the professional portfolio include IBM, Amazon, Walmart, SAP and Dell.",
    },
    "consulting": {
        "title": "About Mohammad Moin's consulting practice",
        "body": "Mohammad Moin works as an independent software engineering consultant on architecture, modernization and production delivery problems across web, mobile and enterprise applications. Engagements can begin with an architecture review or proof of concept and extend through implementation, migration planning, delivery support and engineering enablement.",
        "facts": [
            "Frontend architecture across Angular and React",
            "Full-stack web and mobile application engineering",
            "Nx monorepos, shared libraries and platform architecture",
            "Stack migration, technical POCs and modernization",
            "Engineering mentoring, debugging and delivery enablement",
        ],
        "proof": "A recent consulting engagement with JLL involved re-architecting legacy AEM/Java web components to React within a 10–15 engineer team spanning multiple countries, including work around a shared SolidJS design system translated into React and Angular.",
    },
}

AUTHORITY_CSS = """
.authority-section{padding:28px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:linear-gradient(135deg,#f8faff,#fff)}
.authority-section .wrap{max-width:1160px}
.authority-section .kicker{display:inline-flex;margin-bottom:8px}
.authority-section h2{display:block;margin:0 0 10px;font:600 24px/1.2 var(--display);color:var(--navy);letter-spacing:-.015em}
.authority-section .intro{max-width:900px;margin:0;color:var(--muted);font-size:13px;line-height:1.7}
.authority-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 18px;margin:17px 0 0;padding:0;list-style:none}
.authority-facts li{position:relative;padding:9px 11px 9px 25px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink);font-size:11px;line-height:1.5}
.authority-facts li::before{content:"";position:absolute;left:11px;top:15px;width:6px;height:6px;border-radius:50%;background:var(--blue);box-shadow:0 0 0 3px var(--blue-soft)}
.authority-proof{margin:14px 0 0;padding:11px 13px;border-left:2px solid var(--blue);background:rgba(238,243,255,.55);color:var(--muted);font-size:11px;line-height:1.6}
.authority-proof strong{color:var(--navy);font-weight:800}
.related-pages{max-width:1160px;margin:0 auto;padding:24px 0 6px}
.related-pages h2{display:block;margin:0 0 5px;font:600 21px/1.25 var(--display);color:var(--navy)}
.related-pages p{margin:0 0 11px;color:var(--muted);font-size:11px}
.related-pages nav{height:auto;position:static;display:flex;flex-wrap:wrap;gap:7px;background:transparent;border:0;backdrop-filter:none}
.related-pages nav a{display:inline-flex;align-items:center;padding:7px 10px;border:1px solid #cfdcf1;border-radius:7px;background:var(--blue-soft);color:var(--blue-deep);text-decoration:none;font:800 10px/1.2 var(--mono)}
.related-pages nav a:hover{border-color:#aebfe0;background:#e7eeff}
@media(max-width:800px){.authority-section{padding:24px 0}.authority-section h2{font-size:21px}.authority-section .intro{font-size:12px}.authority-facts{grid-template-columns:1fr}.related-pages{padding-top:20px}.related-pages h2{font-size:19px}}
"""


def copy_site():
    if DIST.exists(): shutil.rmtree(DIST)
    DIST.mkdir(parents=True)
    for name in COPY_DIRS:
        src = ROOT / name
        if src.is_dir(): shutil.copytree(src, DIST / name)
    for name in COPY_FILES:
        src = ROOT / name
        if src.is_file(): shutil.copy2(src, DIST / name)
    for name in ["index.html", "styles.css", "main.js"]:
        shutil.copy2(ROOT / name, DIST / name)


def page_key(path):
    parent = path.relative_to(DIST).parent.as_posix()
    return "" if parent == "." else parent


def inject_favicon():
    marker = '<link rel="icon" href="/portfolio/favicon.svg" type="image/svg+xml">'
    for path in DIST.rglob("*.html"):
        source = path.read_text(encoding="utf-8")
        if 'rel="icon"' in source and '/portfolio/favicon.svg' in source: continue
        updated = source.replace("</head>", f"  {marker}\n</head>", 1)
        if updated != source: path.write_text(updated, encoding="utf-8")


def build_schema(key, title, description, keywords, canonical):
    graph = [PERSON, {
        "@type": ["WebPage", "ProfilePage"] if key == "about" else ["WebPage"],
        "@id": f"{canonical}#webpage", "url": canonical, "name": title, "description": description,
        "author": {"@id": PERSON_ID}, "about": {"@id": PERSON_ID}, "mainEntity": {"@id": PERSON_ID},
        "keywords": keywords, "inLanguage": "en",
    }, {"@type": "BreadcrumbList", "@id": f"{canonical}#breadcrumb", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Mohammad Moin", "item": SITE_URL},
        {"@type": "ListItem", "position": 2, "name": title.split(" — ")[0], "item": canonical},
    ]}]
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)


def inject_identity_seo():
    generated_marker = '<!-- portfolio-generated-identity-seo -->'
    generated_pattern = re.compile(
        r'\s*<!-- portfolio-generated-identity-seo -->.*?<!-- /portfolio-generated-identity-seo -->\s*',
        re.DOTALL,
    )

    for path in DIST.rglob("*.html"):
        key = page_key(path)
        if key not in PAGE_SEO:
            continue

        title, description, keywords = PAGE_SEO[key]
        source = path.read_text(encoding="utf-8")
        canonical = f"{SITE_URL}{key}/"
        schema = build_schema(key, title, description, keywords, canonical)

        additions = f'''{generated_marker}
    <link rel="canonical" href="{canonical}">
    <meta name="author" content="Mohammad Moin">
    <meta name="keywords" content="{', '.join(keywords)}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta property="og:type" content="{'profile' if key == 'about' else 'website'}">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:url" content="{canonical}">
    <meta property="og:site_name" content="Mohammad Moin">
    <meta property="og:image" content="{PROFILE_IMAGE}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{description}">
    <meta name="twitter:image" content="{PROFILE_IMAGE}">
    <script type="application/ld+json">
{schema}
    </script>
<!-- /portfolio-generated-identity-seo -->'''

        source = generated_pattern.sub("", source)
        source = source.replace("</head>", additions + "\n</head>", 1)
        path.write_text(source, encoding="utf-8")


def inject_authority_content():
    """Add concise, factual authority context to the training and consulting pages."""
    for key, data in AUTHORITY.items():
        path = DIST / key / "index.html"
        if not path.exists(): continue
        source = path.read_text(encoding="utf-8")
        if 'data-authority-content="true"' in source: continue
        facts = "".join(f"<li>{fact}</li>" for fact in data["facts"])
        block = f'''\n<section class="authority-section" data-authority-content="true" aria-labelledby="authority-title">\n  <div class="wrap">\n    <span class="kicker">Professional context</span>\n    <h2 id="authority-title">{data["title"]}</h2>\n    <p class="intro">{data["body"]}</p>\n    <ul class="authority-facts">{facts}</ul>\n    <p class="authority-proof"><strong>Selected proof:</strong> {data["proof"]}</p>\n  </div>\n</section>\n'''
        source = source.replace("</main>", block + "</main>", 1)
        path.write_text(source, encoding="utf-8")


def inject_related_links():
    """Add a compact, visible semantic navigation block to inner pages."""
    for path in DIST.rglob("*.html"):
        key = page_key(path)
        links = RELATED.get(key)
        if not links: continue
        source = path.read_text(encoding="utf-8")
        if 'data-related-links="true"' in source: continue
        items = " ".join(f'<a href="{href}">{label}</a>' for label, href in links)
        block = f'''\n<section class="related-pages" data-related-links="true" aria-labelledby="related-pages-title">\n  <h2 id="related-pages-title">Explore more from Mohammad Moin</h2>\n  <p>Related engineering, consulting and training work:</p>\n  <nav aria-label="Related pages">{items}</nav>\n</section>\n'''
        source = source.replace("</main>", block + "</main>", 1)
        if "</main>" not in source:
            source = source.replace("</body>", block + "</body>", 1)
        path.write_text(source, encoding="utf-8")


def inject_authority_styles():
    """Keep injected authority/related content visually native to the existing UI."""
    style = f"<style id=\"authority-content-styles\">{AUTHORITY_CSS}</style>"
    for path in DIST.rglob("*.html"):
        key = page_key(path)
        if key not in AUTHORITY and key not in RELATED: continue
        source = path.read_text(encoding="utf-8")
        if 'id="authority-content-styles"' in source: continue
        source = source.replace("</head>", style + "</head>", 1)
        path.write_text(source, encoding="utf-8")


def rewrite_cdn_assets():
    cdn = PROFILE_IMAGE
    absolute_pattern = re.compile(r"https://cdn\.jsdelivr\.net/gh/mdmoin7/portfolio@[^\"'\s)]+/assets/profile\.webp")
    for path in DIST.rglob("*.html"):
        source = path.read_text(encoding="utf-8")
        updated = absolute_pattern.sub(cdn, source)
        if re.search(r'(?<![A-Za-z0-9_:/.-])assets/profile\.webp', updated):
            updated = re.sub(r'(?<![A-Za-z0-9_:/.-])assets/profile\.webp', cdn, updated)
        updated = absolute_pattern.sub(cdn, updated)
        if updated != source: path.write_text(updated, encoding="utf-8")


def minify_assets():
    css = DIST / "styles.css"
    css.write_text(rcssmin.cssmin(css.read_text(encoding="utf-8")), encoding="utf-8")
    js = DIST / "main.js"
    js.write_text(rjsmin.jsmin(js.read_text(encoding="utf-8")), encoding="utf-8")


def minify_html():
    for path in DIST.rglob("*.html"):
        source = path.read_text(encoding="utf-8")
        path.write_text(htmlmin.minify(source, remove_comments=True, remove_empty_space=True, reduce_boolean_attributes=False, remove_optional_attribute_quotes=False, keep_pre=True), encoding="utf-8")


def validate():
    required = [DIST / "index.html", DIST / "styles.css", DIST / "main.js", DIST / "favicon.svg", DIST / "assets" / "profile.webp", DIST / "about" / "index.html"]
    missing = [str(p.relative_to(DIST)) for p in required if not p.exists()]
    if missing: raise SystemExit(f"Build failed; missing: {', '.join(missing)}")
    html_files = list(DIST.rglob("*.html"))
    if not html_files: raise SystemExit("Build failed; no HTML pages found.")
    nested_pattern = re.compile(r"https://cdn\.jsdelivr\.net/gh/mdmoin7/portfolio@[^\"'\s]+/https://")
    for path in html_files:
        content = path.read_text(encoding="utf-8")
        if 'rel="icon"' not in content or '/portfolio/favicon.svg' not in content: raise SystemExit(f"Build failed; favicon missing in {path.relative_to(DIST)}")
        if nested_pattern.search(content): raise SystemExit(f"Build failed; nested CDN URL found in {path.relative_to(DIST)}")
        key = page_key(path)
        if key not in PAGE_SEO:
            raise SystemExit(f"Build failed; PAGE_SEO entry missing for {path.relative_to(DIST)}")
        canonical = f"{SITE_URL}{key}/"
        if 'name="author" content="Mohammad Moin"' not in content:
            raise SystemExit(f"Build failed; author metadata missing in {path.relative_to(DIST)}")
        if f'<link rel="canonical" href="{canonical}">' not in content:
            raise SystemExit(f"Build failed; canonical metadata missing in {path.relative_to(DIST)}")
        if 'application/ld+json' not in content or PERSON_ID not in content:
            raise SystemExit(f"Build failed; identity schema missing in {path.relative_to(DIST)}")
        if key in RELATED and 'data-related-links="true"' not in content: raise SystemExit(f"Build failed; related links missing in {path.relative_to(DIST)}")
        if key in AUTHORITY and 'data-authority-content="true"' not in content: raise SystemExit(f"Build failed; authority content missing in {path.relative_to(DIST)}")
    print(f"Built {len(html_files)} HTML pages")


if __name__ == "__main__":
    copy_site()
    inject_favicon()
    inject_identity_seo()
    inject_authority_content()
    inject_related_links()
    inject_authority_styles()
    rewrite_cdn_assets()
    minify_assets()
    minify_html()
    validate()
