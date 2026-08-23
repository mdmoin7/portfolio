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
    "training": [("Engineering", "engineering/"), ("Consulting", "consulting/"), ("About Mohammad Moin", "about/")],
    "consulting": [("Frontend Architecture", "engineering/frontend-architecture/"), ("Engineering", "engineering/"), ("Corporate Training", "training/"), ("About Mohammad Moin", "about/")],
    "engineering/react": [("Frontend Architecture", "../frontend-architecture/"), ("Corporate Training", "../../training/"), ("Consulting", "../../consulting/"), ("About Mohammad Moin", "../../about/")],
    "engineering/angular": [("Frontend Architecture", "../frontend-architecture/"), ("Corporate Training", "../../training/"), ("Consulting", "../../consulting/"), ("About Mohammad Moin", "../../about/")],
    "engineering/react-native": [("Frontend Architecture", "../frontend-architecture/"), ("Corporate Training", "../../training/"), ("Consulting", "../../consulting/"), ("About Mohammad Moin", "../../about/")],
    "engineering/frontend-architecture": [("React Engineering", "../react/"), ("Angular Engineering", "../angular/"), ("Consulting", "../../consulting/"), ("About Mohammad Moin", "../../about/")],
    "engineering/terraform": [("Consulting", "../../consulting/"), ("Engineering", "../"), ("About Mohammad Moin", "../../about/")],
}


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
    for path in DIST.rglob("*.html"):
        key = page_key(path)
        if key not in PAGE_SEO: continue
        title, description, keywords = PAGE_SEO[key]
        source = path.read_text(encoding="utf-8")
        canonical = f"{SITE_URL}{key}/"
        schema = build_schema(key, title, description, keywords, canonical)
        additions = f'''\n    <meta name="author" content="Mohammad Moin">\n    <meta name="keywords" content="{', '.join(keywords)}">\n    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">\n    <meta property="og:type" content="{'profile' if key == 'about' else 'website'}">\n    <meta property="og:title" content="{title}">\n    <meta property="og:description" content="{description}">\n    <meta property="og:url" content="{canonical}">\n    <meta property="og:site_name" content="Mohammad Moin">\n    <meta property="og:image" content="{PROFILE_IMAGE}">\n    <meta name="twitter:card" content="summary_large_image">\n    <meta name="twitter:title" content="{title}">\n    <meta name="twitter:description" content="{description}">\n    <meta name="twitter:image" content="{PROFILE_IMAGE}">\n    <script type="application/ld+json">\n{schema}\n    </script>\n'''
        if 'application/ld+json' not in source or PERSON_ID not in source:
            source = source.replace("</head>", additions + "</head>", 1)
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
        if key in PAGE_SEO:
            if 'name="author" content="Mohammad Moin"' not in content: raise SystemExit(f"Build failed; author metadata missing in {path.relative_to(DIST)}")
            if 'application/ld+json' not in content or PERSON_ID not in content: raise SystemExit(f"Build failed; identity schema missing in {path.relative_to(DIST)}")
        if key in RELATED and 'data-related-links="true"' not in content: raise SystemExit(f"Build failed; related links missing in {path.relative_to(DIST)}")
    print(f"Built {len(html_files)} HTML pages")


if __name__ == "__main__":
    copy_site()
    inject_favicon()
    inject_identity_seo()
    inject_related_links()
    rewrite_cdn_assets()
    minify_assets()
    minify_html()
    validate()
