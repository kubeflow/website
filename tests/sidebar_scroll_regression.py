from pathlib import Path
import re

scss = Path("assets/scss/_styles_project.scss").read_text(encoding="utf-8")
match = re.search(r"\.td-sidebar\s*\{(?P<body>.*?)\n\s*\}\s*\n\s*// main content area", scss, re.S)
assert match, "could not find desktop sidebar rule"
body = match.group("body")
height = re.search(r"height:\s*calc\(100vh\s*-\s*7rem\s*-\s*var\(--kf-banner-height,\s*0rem\)\);", body)
assert height, "sidebar has no banner-aware viewport height"
assert re.search(r"overflow-y:\s*auto\s*;", body[height.end():]), "expected sidebar overflow-y: auto"
print("banner-aware sidebar has vertical scrolling")
