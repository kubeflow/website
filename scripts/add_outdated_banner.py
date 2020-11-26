"""Mark outdated docs as requiring updating

This script finds all markdown files under `content/` that haven't been updated
recently (default 30 days) according to git, and adds a header warning that the
file is out of date.

Example usage:

    python scripts/add_outdated_banner.py --old-version 1.0 --new-version 1.1

"""

import argparse
import re
from datetime import datetime, timedelta
from pathlib import Path
from subprocess import check_output


WARNING = """

{{%% alert title="Out of date" color="warning" %%}}
This guide contains outdated information pertaining to Kubeflow %s. This guide
needs to be updated for Kubeflow %s.
{{%% /alert %%}}

"""

WARNING_REGEX = r"""

{{% alert title="Out of date".*{{% /alert %}}

"""


def main(warning_text: str, cutoff: timedelta):
    now = datetime.utcnow().astimezone()

    for md in Path("content/").rglob("*.md"):
        last_changed = check_output(
            ["git", "log", "-1", "--pretty=format:%ci", md]
        ).decode("utf-8")
        last_changed = datetime.strptime(last_changed, "%Y-%m-%d %H:%M:%S %z")

        # If the docs are recent, don't add the header
        if now - last_changed < cutoff:
            continue

        contents = md.read_text()

        # If the doc already has an out of date warning, replace it with the new one
        if re.search(WARNING_REGEX, contents, flags=re.MULTILINE | re.DOTALL):
            md.write_text(
                re.sub(
                    WARNING_REGEX,
                    warning_text,
                    contents,
                    flags=re.MULTILINE | re.DOTALL,
                )
            )
        # Otherwise, check to see if there's a front matter section delimited by `+++`. If so,
        # add the out of date warning directly afterwards. A newline is included in the regex
        # to exclude documents such as `_index.md` that only contain front matter sections.
        else:
            pluses = list(re.finditer(r"\+\+\+\n", contents))
            if len(pluses) == 2:
                p = pluses[1]
                md.write_text(contents[:p.end()] + warning_text + contents[p.end():])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Mark old docs as requiring updating")

    parser.add_argument(
        "--old-version",
        required=True,
        help="The docs version that is considered out of date",
    )
    parser.add_argument("--new-version", required=True, help="The newest docs version")
    parser.add_argument(
        "--cutoff",
        default=30,
        type=int,
        help="Cutoff in days that a document must have been "
        "updated within to not be considered out of date",
    )
    args = parser.parse_args()

    main(WARNING % (args.old_version, args.new_version), timedelta(days=args.cutoff))
