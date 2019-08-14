+++
title = "Python Based Visualizations"
description = "Predefined and arbitrary visualizations of pipeline outputs"
weight = 80
+++

This page describes python based visualizations, how to create them, and how to
use them to visualize results within the Pipelines UI.

## Introduction

Python based visualizations are a new method to visualize results within the
Pipelines UI. This new method of visualizing results is done through the usage
of [nbcovert](https://github.com/jupyter/nbconvert), the tool used by Jupyter
Notebook that generates outputs. Alongside the usage of nbconvert, results of a
pipeline can now be visualized without a component being included within the
pipeline itself. The process of visualizing results are now decoupled from a
pipeline.

Python based visualizations provide two categories of visualizations. The first
being **predefined visualizations**. These visualizations are curated by the
Kubeflow Pipelines Team and serve as a way for users to easily and quickly
generate powerful visualizations. However, these are not limited to just the
Pipelines Team and this will be discussed further below in
[Why Predefined Visualizations are Important](/docs/pipelines/sdk/
python-based-visualizations/#why-predefined-visualizations-are-important).
The second category is **arbitrary visualizations**. Arbitrary visualizations
allow for user provided python visualization code to be used to generate
visualizations. These visualizations allow for rapid development,
experimentation, and customizability when visualizing results.

## Why Predefined Visualizations are Important

Predefined visualizations provide major benefits for the Pipelines Team and
users of Pipelines. The Pipelines Team is able to develop predefined
visualizations to provide users of Pipelines with powerful, extensible, and
standardized visualizations that work out of the box. For users of Pipelines,
they are able to utilize existing predefined visualization and build their own.
For some users, such as those who use Pipelines with a team or those who
frequently generate complex and specialized visualizations, predefined
visualizations can be leveraged to reduce development time and provide
standardizations of visualized results. Details about how to create predefined
visualizations can be found [below](/docs/pipelines/sdk/
python-based-visualizations/#how-to-create-predefined-visualizations).

## How to Create Predefined Visualizations

1. Determine what the new visualization will be.
2. Add a new type for the visualization within the.
[visualization.proto](https://github.com/kubeflow/pipelines/blob
/master/backend/api/visualization.proto#L78) file.
    * The name of the visualization should be in screaming snake case
    (i.e. `VISUALIZATION_NAME`).
3. Run [`./generate_api.sh`](https://github.com/kubeflow/pipelines/blob/master
/backend/api/generate_api.sh) within the `backend/api` directory.
4. Download the [Swagger Codegen](https://swagger.io/tools/swagger-codegen/)
jar file.
    * Currently, version 2.3.1 is used to generate the api. Should this become
    out of date, the version can be checked [here](https://github.com/kubeflow/
    pipelines/blob/master/frontend/src/apis/visualization/.swagger-codegen/
    VERSION).
    * This step is only required if the Swagger Codegen jar file is not present
    in the `frontend` directory. If you already have the jar file, you can skip
    steps 5 and 6.
5. Place the Swagger Codegen jar file in the `frontend` directory.
6. Rename the Swagger Codegen har file to **swagger-codegen-cli.jar**.
7. Run `npm run apis:visualization` within the `frontend` directory.
8. Create a new python file that will be executed to generate a visualization.
    * Python 3 **MUST** be used.
    * The new python file should be created within the
    `backend/src/apiserver/visualization` directory and it should have the same
    name as the type that was created earlier, use snake case instead of
    screaming snake case (i.e. `visualization.py`).
    * Dependency injection is used to pass variables from the Pipelines UI to
    a visualization.
        * To obtain a path or path pattern from the Pipelines UI, you can use
        the following syntax:

            ```python
            # The variable "source" will be injected to any visualization. The
            # value of "source" will be provided by the Pipelines UI and will
            # never be an empty string.
            ...
            # Open a file with a provided path or path pattern from the
            # Pipelines UI and append DataFrame to an array of DataFrames
            dfs = []
            for f in file_io.get_matching_files(source):
                dfs.append(pd.read_csv(f))
            ...
            # Get a path from the Pipelines UI and create a DataFrame
            df = pd.read_csv(source)
            ...
            ```
            * Additional details about how this is implemented can be found
            [here](https://github.com/kubeflow/pipelines/blob/master/backend/
            src/apiserver/visualization/server.py#L127).
        * To obtain additional variables from the Pipelines UI, you can use
        the following syntax:

            ```python
            ...
            # Check if a variable is provided
            # You should always check if the desired variable is provided before
            # accessing it because accessing a key from a dict when it does not
            # exist will result in an exception being raised.
            if "key" in variables:
              # Variable of name key is provided.
              # Use the value of the specified variable to manipulate the way
              # a visualization is generated here.
              pass
            else:
              # Variable of name key is not provided.
              # You can provide a default operation here if a variable is not
              # provided or throw an error if the variable must be provided.
              pass
            ...
            # Accessing a variable
            key = variables["key"]
            # or
            key = variables.get("key")
            ...
            ```
            * Additional details about how this is implemented can be found
            [here](https://github.com/kubeflow/pipelines/blob/master/backend/
            src/apiserver/visualization/exporter.py#L93).
9. Add any new dependencies to the **requirements.txt** file in the
`backend/src/apiserver/visualization` directory.
    * This only needs to be updated if new dependencies are added.
    * If new dependencies are added, the
    [**third_party_licenses.csv**](https://github.com/kubeflow/pipelines/blob/
    master/backend/src/apiserver/visualization/third_party_licenses.csv) file
    must also be updated.
        
        ```csv
        package_name,url_to_package_license,license_name
        ```
        * `package_name`: the name of the package on [pypi](https://pypi.org/)
        * `url_to_package_license`: the url where the license of the package can
        be downloaded from
        * `license_name`: name of package license
        * Examples for all the columns can be found [here](https://github.com/
        kubeflow/pipelines/blob/master/backend/src/apiserver/visualization/
        third_party_licenses.csv).
10. Submit these changes as a PR or build docker image for usage within your
cluster.

## Using Predefined Visualizations

1. Open the details of a run
2. Select a component
    * The component that is selected does not matter. But, if you want to
    visualize the output of a specific component, it is easier to do that within
    that component.
3. Select the **Artifacts** tab
4. At the top of the tab you should see a card named **Visualization Creator**
5. Within the card, provide a visualization type, a source, and any necessary
arguments
    * Any required or optional arguments will be shown as a placeholder
6. Click **Generate Visualization**
7. View generated visualization by scrolling down

## Using Arbitrary Visualizations

1. Enable arbitrary visualizations within Kubeflow Pipelines
2. Open the details of a run
3. Select a component
    * The component that is selected does not matter. But, if you want to
    visualize the output of a specific component, it is easier to do that within
    that component.
4. Select the **Artifacts** tab
5. At the top of the tab you should see a card named **Visualization Creator**
6. Within the card, select the **CUSTOM** visualization type then provide a
source, and any necessary arguments (the source and argument variables are
optional for custom visualizations)
7. Provide the arbitrary visualization code
8. Click **Generate Visualization**
9. View generated visualization by scrolling down