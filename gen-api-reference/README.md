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

Use these instructions to generate an updated copy of the [Pipelines API Reference](https://www.kubeflow.org/docs/pipelines/reference/api/kubeflow-pipeline-api-spec/). 

## Prerequisites
* Clone the [kubeflow/pipelines](https://github.com/kubeflow/pipelines) repository.
* Install [npm](https://www.npmjs.com/get-npm).
* Install [bootprint](https://github.com/bootprint/bootprint-openapi) and [html-inline](https://github.com/substack/html-inline) using the following command.

	```
	npm install -g bootprint
	npm install -g bootprint-openapi
 	npm install -g html-inline
	```

## Usage

1. Run the following command to generate the updated documentation.

  	```
  	bootprint openapi <swagger file> <target directory>
  	```
  	For example:
  
	```
	bootprint openapi C:\path\to\pipelines\backend\api\swagger\kfp_api_single_file.swagger.json C:\path\to\target\directory
	```
1. From the target directory, run the following command to combine the html and css files, naming the output file `kubeflow-pipeline-api-spec.html`.

  	```
  	html-inline -i <input file> -o <output file>
  	```
	For example: 

	```
	html-inline -i index.html -o kubeflow-pipeline-api-spec.html
	```
1. In a fork of the kubeflow/website repository, overwrite `content/docs/pipelines/reference/api/kubeflow-pipeline-api-spec.html` with the new copy and submit a pull request. Refer to the [kubeflow/website readme](https://github.com/kubeflow/website/blob/master/README.md) for more detailed instructions.
