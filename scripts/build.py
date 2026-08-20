from pathlib import Path
import shutil
import htmlmin
import rcssmin
import rjsmin

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"

COPY_DIRS = ["assets", "training", "consulting", "engineering"]
COPY_FILES = [
    "robots.txt",
    "sitemap.xml",
    "llms.txt",
    "index-old.html",
    "CNAME",
]


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
    ]
    missing = [str(p.relative_to(DIST)) for p in required if not p.exists()]
    if missing:
        raise SystemExit(f"Build failed; missing: {', '.join(missing)}")

    html_files = list(DIST.rglob("*.html"))
    if not html_files:
        raise SystemExit("Build failed; no HTML pages found.")

    print(f"Built {len(html_files)} HTML pages")
    print(f"CSS: {(DIST / 'styles.css').stat().st_size:,} bytes")
    print(f"JS:  {(DIST / 'main.js').stat().st_size:,} bytes")


if __name__ == "__main__":
    copy_site()
    minify_assets()
    minify_html()
    validate()
