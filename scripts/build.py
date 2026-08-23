from pathlib import Path
import json
import shutil

import htmlmin
import rcssmin
import rjsmin

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"

COPY_DIRS = ["assets", "about", "training", "consulting", "engineering"]
COPY_FILES = ["robots.txt", "sitemap.xml", "llms.txt", "index-old.html", "CNAME", "favicon.svg"]

CDN_ASSETS = {
    "assets/profile.webp": "https://cdn.jsdelivr.net/gh/mdmoin7/portfolio@b4e402c3adbefe8714c71c5917299d758f86ee9a/assets/profile.webp",
}

SITE_URL = "https://mdmoin7.github.io/portfolio/"
PERSON_ID = f"{SITE_URL}#person"
PROFILE_IMAGE = CDN_ASSETS["assets/profile.webp"]

PERSON = {
    "@type": "Person",
    "@id": PERSON_ID,
    "name": "Mohammad Moin",
    "url": SITE_URL,
    "image": PROFILE_IMAGE,
    "sameAs": [
        "https://github.com/mdmoin7",
        "https://www.linkedin.com/in/mohammadmoin/",
    ],
    "jobTitle": "Independent Software Engineering Consultant & Corporate Technology Trainer",
    "description": "Mohammad Moin is an independent software engineering consultant and corporate technology trainer based in Bengaluru, India, combining production engineering, frontend architecture and practical enterprise technology training.",
    "address": {"@type": "PostalAddress", "addressLocality": "Bengaluru", "addressCountry": "IN"},
    "knowsAbout": [
        "Frontend Architecture", "Angular", "React", "React Native", "Terraform",
        "Microsoft Azure", "Corporate Technology Training", "TypeScript", "Node.js",
        "NestJS", "Nx Monorepo", "Microfrontends", "Module Federation",
        "Stack Migration", "Curriculum Design",
    ],
}

PAGE_SEO = {
    "about": {
        "title": "About Mohammad Moin — Independent Software Engineering Consultant & Corporate Technology Trainer",
        "description": "Professional profile of Mohammad Moin, an independent software engineering consultant and corporate technology trainer based in Bengaluru, India, specializing in frontend architecture, Angular, React, React Native and Terraform/Azure.",
        "keywords": ["Mohammad Moin", "software engineering consultant", "corporate technology trainer", "frontend architect", "Angular consultant", "React consultant", "React Native", "Terraform Azure"],
    },
    "training": {
        "title": "Corporate Technology Training — Mohammad Moin | React, Angular, Node.js & Modern Engineering",
        "description": "Corporate technology training by Mohammad Moin for engineering teams and organizations, covering React, Angular, React Native, Node.js, TypeScript, architecture, modern JavaScript stacks and practical upskilling programs.",
        "keywords": ["Mohammad Moin trainer", "corporate technology training", "React training", "Angular training", "Node.js training", "React Native training", "TypeScript training", "engineering team upskilling"],
    },
    "consulting": {
        "title": "Software Engineering Consulting — Mohammad Moin | Architecture, Modernization & Delivery",
        "description": "Independent software engineering consulting by Mohammad Moin covering frontend architecture, full-stack web and mobile development, modernization, Nx monorepos, stack migration, technical delivery and engineering mentoring.",
        "keywords": ["Mohammad Moin consultant", "software engineering consulting", "frontend architecture consultant", "React consultant", "Angular consultant", "stack migration", "Nx monorepo", "engineering modernization"],
    },
    "engineering/react": {
        "title": "React Engineering & Application Architecture — Mohammad Moin",
        "description": "React engineering and application architecture expertise by Mohammad Moin, covering React 19, TypeScript, component architecture, hooks, Redux Toolkit, Vite, performance, testing and scalable enterprise applications.",
        "keywords": ["Mohammad Moin React", "React 19", "React architecture", "React consultant", "TypeScript", "Redux Toolkit", "Vite", "React performance", "React testing"],
    },
    "engineering/angular": {
        "title": "Angular Engineering & Application Architecture — Mohammad Moin",
        "description": "Angular engineering expertise by Mohammad Moin covering modern Angular, standalone components, Signals, application architecture, performance, testing, state management and enterprise frontend development.",
        "keywords": ["Mohammad Moin Angular", "Angular consultant", "Angular architecture", "Angular Signals", "standalone components", "enterprise Angular", "Angular performance", "Angular training"],
    },
    "engineering/react-native": {
        "title": "React Native Engineering & Mobile Application Development — Mohammad Moin",
        "description": "React Native engineering expertise by Mohammad Moin covering cross-platform mobile architecture, React Native, Expo, TypeScript, native integration, performance and production mobile application delivery.",
        "keywords": ["Mohammad Moin React Native", "React Native consultant", "React Native architecture", "Expo", "mobile application development", "cross-platform mobile", "React Native performance"],
    },
    "engineering/frontend-architecture": {
        "title": "Frontend Architecture & Scalable UI Systems — Mohammad Moin",
        "description": "Frontend architecture expertise by Mohammad Moin covering scalable UI systems, design systems, microfrontends, Module Federation, Nx monorepos, state management, performance and enterprise application architecture.",
        "keywords": ["Mohammad Moin frontend architect", "frontend architecture", "microfrontends", "Module Federation", "Nx monorepo", "design systems", "enterprise frontend architecture", "scalable UI systems"],
    },
    "engineering/terraform": {
        "title": "Terraform & Azure Infrastructure Engineering — Mohammad Moin",
        "description": "Terraform and Azure infrastructure engineering expertise by Mohammad Moin covering infrastructure as code, Azure architecture, reusable Terraform modules, remote state, CI/CD and cloud engineering practices.",
        "keywords": ["Mohammad Moin Terraform", "Terraform consultant", "Azure infrastructure", "Infrastructure as Code", "Terraform modules", "Azure architecture", "Terraform CI/CD", "cloud engineering"],
    },
}


def copy_site():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)
    for name in COPY_DIRS:
        src = ROOT / name
        if src.is_dir():
            shutil.copytree(src, DIST / name)
    for name in COPY_FILES:
        src = ROOT / name
        if src.is_file():
            shutil.copy2(src, DIST / name)
    shutil.copy2(ROOT / "index.html", DIST / "index.html")
    shutil.copy2(ROOT / "styles.css", DIST / "styles.css")
    shutil.copy2(ROOT / "main.js", DIST / "main.js")


def page_key(path):
    relative = path.relative_to(DIST).parent.as_posix()
    return relative if relative != "." else ""


def inject_favicon():
    marker = '<link rel="icon" href="/portfolio/favicon.svg" type="image/svg+xml">'
    for path in DIST.rglob("*.html"):
        source = path.read_text(encoding="utf-8")
        if 'rel="icon"' in source and "/portfolio/favicon.svg" in source:
            continue
        updated = source.replace("</head>", f"  {marker}\n  </head>", 1)
        if updated != source:
            path.write_text(updated, encoding="utf-8")


def inject_identity_seo():
    for path in DIST.rglob("*.html"):
        key = page_key(path)
        config = PAGE_SEO.get(key)
        if not config:
            continue

        source = path.read_text(encoding="utf-8")
        canonical = f"{SITE_URL}{key}/"
        title = config["title"]
        description = config["description"]
        keywords = ", ".join(config["keywords"])
        page_type = ["WebPage", "ProfilePage"] if key == "about" else ["WebPage"]
        breadcrumb_name = title.split(" — ")[0]

        webpage = {
            "@type": page_type,
            "@id": f"{canonical}#webpage",
            "url": canonical,
            "name": title,
            "description": description,
            "author": {"@id": PERSON_ID},
            "about": {"@id": PERSON_ID},
            "mainEntity": {"@id": PERSON_ID},
            "keywords": config["keywords"],
            "inLanguage": "en",
        }
        breadcrumb = {
            "@type": "BreadcrumbList",
            "@id": f"{canonical}#breadcrumb",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Mohammad Moin", "item": SITE_URL},
                {"@type": "ListItem", "position": 2, "name": breadcrumb_name, "item": canonical},
            ],
        }
        schema = json.dumps({"@context": "https://schema.org", "@graph": [PERSON, webpage, breadcrumb]}, ensure_ascii=False, indent=2)

        additions = f'''\n    <meta name="author" content="Mohammad Moin" />
    <meta name="keywords" content="{keywords}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta property="og:type" content="{'profile' if key == 'about' else 'website'}" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{description}" />
    <meta property="og:url" content="{canonical}" />
    <meta property="og:site_name" content="Mohammad Moin" />
    <meta property="og:image" content="{PROFILE_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{description}" />
    <meta name="twitter:image" content="{PROFILE_IMAGE}" />
    <script type="application/ld+json">
{schema}
    </script>
'''
        if 'name="author" content="Mohammad Moin"' not in source:
            source = source.replace("</head>", additions + "  </head>", 1)
        path.write_text(source, encoding="utf-8")


def rewrite_cdn_assets():
    rewritten = 0
    skipped = 0
    for path in DIST.rglob("*.html"):
        source = path.read_text(encoding="utf-8")
        updated = source
        for local_path, cdn_url in CDN_ASSETS.items():
            if cdn_url in updated:
                skipped += 1
            elif local_path in updated:
                updated = updated.replace(local_path, cdn_url)
                rewritten += 1
        if updated != source:
            path.write_text(updated, encoding="utf-8")
    for local_path in CDN_ASSETS:
        deployed_asset = DIST / local_path
        if deployed_asset.exists():
            deployed_asset.unlink()
    print(f"CDN asset rewrite: {rewritten} HTML pages updated, {skipped} already using CDN")


def minify_assets():
    css_path = DIST / "styles.css"
    css_path.write_text(rcssmin.cssmin(css_path.read_text(encoding="utf-8")), encoding="utf-8")
    js_path = DIST / "main.js"
    js_path.write_text(rjsmin.jsmin(js_path.read_text(encoding="utf-8")), encoding="utf-8")


def minify_html():
    for path in DIST.rglob("*.html"):
        source = path.read_text(encoding="utf-8")
        path.write_text(htmlmin.minify(source, remove_comments=True, remove_empty_space=True, reduce_boolean_attributes=False, remove_optional_attribute_quotes=False, keep_pre=True), encoding="utf-8")


def validate():
    required = [DIST / "index.html", DIST / "styles.css", DIST / "main.js", DIST / "favicon.svg", DIST / "about" / "index.html"]
    missing = [str(p.relative_to(DIST)) for p in required if not p.exists()]
    if missing:
        raise SystemExit(f"Build failed; missing: {', '.join(missing)}")

    html_files = list(DIST.rglob("*.html"))
    if not html_files:
        raise SystemExit("Build failed; no HTML pages found.")

    for path in html_files:
        content = path.read_text(encoding="utf-8")
        for cdn_url in CDN_ASSETS.values():
            if f"{cdn_url}/https://" in content:
                raise SystemExit(f"Build failed; nested CDN URL found in {path.relative_to(DIST)}")
        if 'rel="icon"' not in content or "/portfolio/favicon.svg" not in content:
            raise SystemExit(f"Build failed; favicon missing in {path.relative_to(DIST)}")
        key = page_key(path)
        if key in PAGE_SEO:
            if 'name="author" content="Mohammad Moin"' not in content:
                raise SystemExit(f"Build failed; author metadata missing in {path.relative_to(DIST)}")
            if 'application/ld+json' not in content or PERSON_ID not in content:
                raise SystemExit(f"Build failed; identity schema missing in {path.relative_to(DIST)}")

    print(f"Built {len(html_files)} HTML pages")
    print(f"CSS: {(DIST / 'styles.css').stat().st_size:,} bytes")
    print(f"JS:  {(DIST / 'main.js').stat().st_size:,} bytes")


if __name__ == "__main__":
    copy_site()
    inject_favicon()
    inject_identity_seo()
    rewrite_cdn_assets()
    minify_assets()
    minify_html()
    validate()
