#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
THEME_LINK = '<link rel="stylesheet" href="/subpage-theme.css" />'
HOME_BRAND = '<a class="brand" href="/"><strong>Mohammad Moin</strong><span>Independent Consultant &amp; Corporate Trainer</span></a>'

for html_path in PUBLIC.rglob("index.html"):
    text = html_path.read_text(encoding="utf-8")
    changed = False

    if THEME_LINK not in text:
        if "</head>" in text:
            text = text.replace("</head>", f"  {THEME_LINK}\n  </head>", 1)
            changed = True

    if 'href="../"' in text or 'href="../../"' in text or 'href="../../../"' in text:
        import re

        text = re.sub(
            r'<a class="brand" href="(?:\.\./)+"><strong>Mohammad Moin</strong><span>Independent Consultant &amp; Corporate Trainer</span></a>',
            HOME_BRAND,
            text,
        )
        changed = True

    if changed:
        html_path.write_text(text, encoding="utf-8")
        print(f"updated {html_path.relative_to(ROOT)}")
