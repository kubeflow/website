#!/usr/bin/env bash

set -euo pipefail

THIS_SCRIPT_PATH=$(cd "$(dirname "$0")" && pwd)
cd "$THIS_SCRIPT_PATH"

GITHUB_ORGANIZATION="kubeflow"
GITHUB_REPOSITORY="manifests"

# ensure bash version 4.4+
if [[ ${BASH_VERSINFO[0]} -lt 4 || (${BASH_VERSINFO[0]} -eq 4 && ${BASH_VERSINFO[1]} -lt 4) ]]; then
  echo ">>> ERROR: Bash version 4.4+ is required to run this script, current version: '${BASH_VERSION}'"
  exit 1
fi

# ensure 'jq' is installed
if [[ -z "$(command -v jq)" ]]; then
  echo ">>> ERROR: 'jq' must be installed to run this script"
  exit 1
fi

#######################################
# Latest release
#######################################

# fetch the latest release from the GitHub API
GITHUB_API_URL="https://api.github.com/repos/${GITHUB_ORGANIZATION}/${GITHUB_REPOSITORY}/releases/latest"
echo ">>> Fetching latest release from: ${GITHUB_API_URL}"
latest_release_json=$(curl -sSfL "$GITHUB_API_URL")

# get the latest release details
latest_release_tag=$(echo "$latest_release_json" | jq -r '.tag_name')
latest_release_url=$(echo "$latest_release_json" | jq -r '.html_url')
latest_commit_date=$(echo "$latest_release_json" | jq -r '.created_at')
latest_publish_date=$(echo "$latest_release_json" | jq -r '.published_at')

# create the latest release file
latest_release_file="./release-info/latest.json"
echo ">>> Updating latest release file: ${latest_release_file}"
cat > "$latest_release_file" <<EOF
{
  "tag": "${latest_release_tag}",
  "url": "${latest_release_url}",
  "commit_date": "${latest_commit_date}",
  "publish_date": "${latest_publish_date}"
}
EOF

#######################################
# All releases
#######################################

# fetch the releases from the GitHub API
GITHUB_API_URL="https://api.github.com/repos/${GITHUB_ORGANIZATION}/${GITHUB_REPOSITORY}/releases?per_page=100"
echo ">>> Fetching releases from: ${GITHUB_API_URL}"
releases_json=$(curl -sSfL "$GITHUB_API_URL")

# get the list of releases
releases_list=$(echo "$releases_json" | jq -c '.[]?')

# for each release, update its .json file in this folder
IFS=$'\n'
for release_json in $releases_list; do

  # skip pre-releases and drafts
  is_pre_release=$(echo "$release_json" | jq -r '.prerelease')
  is_draft=$(echo "$release_json" | jq -r '.draft')
  if [[ "$is_pre_release" == "true" || "$is_draft" == "true" ]]; then
    continue
  fi

  # get the release details
  release_tag=$(echo "$release_json" | jq -r '.tag_name')
  release_url=$(echo "$release_json" | jq -r '.html_url')
  commit_date=$(echo "$release_json" | jq -r '.created_at')
  publish_date=$(echo "$release_json" | jq -r '.published_at')

  # create the release file
  release_file="./release-info/${release_tag}.json"
  echo ">>> Updating release file: ${release_file}"
  cat > "$release_file" <<EOF
{
  "tag": "${release_tag}",
  "url": "${release_url}",
  "commit_date": "${commit_date}",
  "publish_date": "${publish_date}"
}
EOF

done