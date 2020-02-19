# This script finds .md files under a directory and its subdirectories, extracts
# http/https URLs from .md files and validates them.
#
# This script can be run periodically on kubeflow/website source repository
# to find outdated URLs, which indicate possible outdated document sections.
#
# To run this script, type the following on the command line:
#   python3.8 validate-urls.py -d /path/to/kubeflow/website/content/docs
#
# Input:
#   The path of a directory that contains .md files as `-d` command line flag.
#
# Output:
#   STDOUT logs in the format of `<file>: <URL> , <status>` and a summary of all
#   invalid URLs at the end.
#
# Dependency:
#   You may need to install the `requests` Python package via command line:
#   python3.8 -m pip install requests

import argparse
import os
import re
import requests

parser = argparse.ArgumentParser(
    description='Validate all URLs in the kubeflow.org website'
)

parser.add_argument(
    '-d',
    '--dir',
    dest='input_dir',
    nargs='?',
    default='kubeflow/website/content',
    help=
    'Path to the doc content folder. (Default: %(default)s)',
)

# http/https URLs
HTTP_PATTERN = re.compile(
    'http[s]?://[a-zA-Z\-_?/*\.#\$][a-zA-Z0-9\-_?/*\.#%=\$]+')

# Patterns in this white list are considered valid.
WHITE_LIST = [
    re.compile('http[s]?://localhost'),
    re.compile('http[s]?://\.\.'), # https://......
    re.compile('https://path/to/component.yaml'),
    re.compile('https://github.com/kubeflow/kfctl/releases/tag')
]

def should_skip(url):
    for p in WHITE_LIST:
        if p.match(url):
            return True
    return False

def main():
    args = parser.parse_args()
    # find all md files under INPUT_DIR.
    files = []
    for (dirpath, dirname, filenames) in os.walk(args.input_dir):
        for f in filenames:
            if f.endswith(".md"):
                files.append(os.path.join(dirpath, f))

    urls = {}
    for file in files:
        with open(file, "r") as f:
            u = HTTP_PATTERN.findall(f.read())
            if u:
                urls[file[len(args.input_dir):]] = u

    problematic_urls = []
    for file, urls in urls.items():
        for url in urls:
            if should_skip(url):
                print(f"skipping {url} ")
                continue
            print(f"{file}: URL {url}",end='')
            try:
                r = requests.head(url)
                print(f" , Status {r.status_code}")
                if r.status_code >= 400 and r.status_code < 500:
                    problematic_urls.append((file, url, r.status_code))
            except Exception as e:
                print(e)
                problematic_urls.append((file, url, "FAIL"))
    print("\nSummary:\n")  
    for u in problematic_urls:
        print(f"|{u[0]} | {u[1]} | {u[2]}|")

if __name__ == "__main__":
    main()
