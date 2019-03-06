This folder contains scripts that automatically generate API reference pages for Kubeflow.
The tool used here can be found at https://github.com/ahmetb/gen-crd-api-reference-docs.

## Prerequisites
* Clone this repository
* Clone of the repository for which you are generating reference (e.g. kubeflow/tf-operator).

## Installation

1. Download the tool from https://github.com/ahmetb/gen-crd-api-reference-docs/releases.

1. Extract the tool to a local directory, for example:
```
tar -xvf gen-crd-api-reference-docs_linux_amd64.tar.gz -C gen-crd-api-reference-docs
```

## Usage

1. Open up `gen-tfjob-api.sh` script.

1. Set the `GEN_DOCS` variable to where you have gen-crd-api-reference extracted.

1. Set the `WEBSITE_ROOT` variable to where your website repository is cloned.

1. Go to the directory where your **API repository** is cloned. The tool assumes that you are
at the root of the repo, and that your GOPATH is set properly. For example:
```
cd $GOPATH/src/github.com/kubeflow/tf-operator/
```

1. Run the `gen-tfjob-api.sh` script.

1. Run `git diff` to verify the changes.

1. Create a PR to merge your changes.
