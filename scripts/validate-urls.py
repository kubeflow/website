# This script extract http/https URLs from .md files and validate them.

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
    'Path to the doc conetnt folder. (default: %(default)s)',
)

# http/https URLs
HTTP_PATTERN = re.compile(
    'http[s]?://[a-zA-Z\-_?/*\.#\$][a-zA-Z0-9\-_?/*\.#\$]+')

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
    # find all md file under INPUT_DIR.
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
                if r.status_code >= 303 and r.status_code < 500:
                    problematic_urls.append((file, url, r.status_code))
            except Exception as e:
                print(e)
                problematic_urls.append((file, url, "FAIL"))
    print("\nSummary:\n")  
    for u in problematic_urls:
        print(f"|{u[0]} | {u[1]} | {u[2]}|")

if __name__ == "__main__":
    main()
