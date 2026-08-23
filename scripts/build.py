from pathlib import Path
import shutil
import htmlmin
import rcssmin
import rjsmin

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"

COPY_DIRS = ["assets", "about", "training", "consulting", "engineering"]
COPY_FILES = [
    "robots.txt",
    "sitemap.xml",
    "llms.txt",
    "index-old.html",
    "CNAME",
    "favicon.svg",
]

CDN_ASSETS = {
    "assets/profile.webp": "https://cdn.jsdelivr.net/gh/mdmoin7/portfolio@b4e402c3adbefe8714c71c5917299d758f86ee9a/assets/profile.webp",
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


def inject_favicon():
    """Add the favicon link to every deployed HTML page if it is absent."""
    marker = '<link rel="icon" href="/portfolio/favicon.svg" type="image/svg+xml" />'

    for path in DIST.rglob("*.html"):
        source = path.read_text(encoding="utf-8")
        if 'rel="icon"' in source:
            continue

        updated = source.replace("</head>", f"  {marker}\n  </head>", 1)
        if updated != source:
            path.write_text(updated, encoding="utf-8")


def rewrite_cdn_assets():
    """Rewrite local asset references in deployed HTML to CDN URLs."""
    rewritten = 0
    skipped = 0

    for path in DIST.rglob("*.html"):
        source = path.read_text(encoding="utf-8")
        updated = source

        for local_path, cdn_url in CDN_ASSETS.items():
            if cdn_url in updated:
                skipped += 1
                continue
            if local_path in updated:
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
    css_path.write_text(
        rcssmin.cssmin(css_path.read_text(encoding="utf-8")),
        encoding="utf-8",
    )

    js_path = DIST / "main.js"
    js_path.write_text(
        rjsmin.jsmin(js_path.read_text(encoding="utf-8")),
        encoding="utf-8",
    )


def minify_html():
    for path in DIST.rglob("*.html"):
        source = path.read_text(encoding="utf-8")
        path.write_text(
            htmlmin.minify(
                source,
                remove_comments=True,
                remove_empty_space=True,
                reduce_boolean_attributes=False,
                remove_optional_attribute_quotes=False,
                keep_pre=True,
            ),
            encoding="utf-8",
        )


def validate():
    required = [
        DIST / "index.html",
        DIST / "styles.css",
        DIST / "main.js",
        DIST / "favicon.svg",
        DIST / "about" / "index.html",
    ]
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
        if '<link rel="icon" href="/portfolio/favicon.svg" type="image/svg+xml" />' not in content:
            raise SystemExit(f"Build failed; favicon missing in {path.relative_to(DIST)}")

    print(f"Built {len(html_files)} HTML pages")
    print(f"CSS: {(DIST / 'styles.css').stat().st_size:,} bytes")
    print(f"JS:  {(DIST / 'main.js').stat().st_size:,} bytes")


if __name__ == "__main__":
    copy_site()
    inject_favicon()
    rewrite_cdn_assets()
    minify_assets()
    minify_html()
    validate()
