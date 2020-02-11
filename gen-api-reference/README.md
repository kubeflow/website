This folder contains scripts that automatically generate API reference pages for Kubeflow.

# Generating API References for Custom Resources

The tool used here can be found at https://github.com/ahmetb/gen-crd-api-reference-docs.

## Prerequisites
* Clone this repository (website)
* Clone the repository for which you are generating reference (e.g. kubeflow/tf-operator).

## Installation

1. Download the tool from https://github.com/ahmetb/gen-crd-api-reference-docs/releases.

1. Extract the tool to a local directory, for example:
```
tar -xvf gen-crd-api-reference-docs_linux_amd64.tar.gz -C gen-crd-api-reference-docs
```

## Usage

1. Open up `gen-tfjob-api.sh` script.

1. Set the `GEN_DOCS` variable to where you have `gen-crd-api-reference-docs` extracted.

1. Set the `WEBSITE_ROOT` variable to where your website repository is cloned. For example:
	```
	WEBSITE_ROOT=$GOPATH/src/github.com/kubeflow/website
	```

1. Go to the directory where your **API repository** is cloned. The tool assumes that you are
at the root of the repo, and that your GOPATH is set properly. For example:
	```
	cd $GOPATH/src/github.com/kubeflow/tf-operator/
	```
1. Run the `gen-tfjob-api.sh` script.

1. Run `git diff` to verify the changes.

1. Create a PR to merge your changes.

# Generating the Pipelines API Reference Page

These are instructions for generating a copy of the [Pipelines API Reference](https://www.kubeflow.org/docs/pipelines/reference/api/kubeflow-pipeline-api-spec/) page from the swagger file. 

## Prerequisites
* Download the [pipelines](https://github.com/kubeflow/pipelines) repository.
* Install [npm](https://www.npmjs.com/get-npm).

## Installation

1. Extract the pipelines repository to a local directory.

1. Install [bootprint](https://github.com/bootprint/bootprint-openapi) from the command line.

	```
	npm install -g bootprint
	npm install -g bootprint-openapi
	```
1. Install [html-inline](https://github.com/substack/html-inline) from the command line.

	```
	npm -g install html-inline
	```
## Usage

1. Run `bootprint openapi <swagger file> <target directory>`.

	```
	bootprint openapi C:\path\to\pipelines\backend\api\swagger\kfp_api_single_file.swagger.json C:\path\to\target\directory
	```
1. Navigate to the target directory and run `html-inline -i <input file> -o <output file>`.
	
	```
	html-inline -i index.html -o kubeflow-pipeline-api-spec.html
	```
1. This will generate `kubeflow-pipeline-api-spec` as a standalone html file that contains any changes and updates derived from the swagger file.
