+++
title = "Container Images"
description = "About Container Images for Kubeflow Notebooks"
weight = 30
                    
+++
Kubeflow Notebooks natively supports three types of notebooks, [JupyterLab](https://github.com/jupyterlab/jupyterlab), [RStudio](https://github.com/rstudio/rstudio), and [Visual Studio Code (code-server)](https://github.com/cdr/code-server), but any web-based IDE should work.
Notebook servers run as containers inside a Kubernetes Pod, which means the type of IDE (and which packages are installed) is determined by the Docker image you pick for your server.

## Images

We provide a number of [example container images](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers) to get you started.

### Base Images

These images provide a common starting point for Kubeflow Notebook containers.
See [custom images](#custom-images) to learn how to extend them with your own packages.

Dockerfile | Registry | Notes
--- | --- | ---
[base](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/base) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/base:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/base) | common base image
[codeserver](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/codeserver) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/codeserver:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/codeserver) | base [code-server](https://github.com/cdr/code-server) (Visual Studio Code) image
[jupyter](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter) | base [JupyterLab](https://github.com/jupyterlab/jupyterlab) image
[rstudio](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/rstudio) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/rstudio:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/rstudio) | base [RStudio](https://github.com/rstudio/rstudio) image

### Full Images

These images extend the [base images](#base-images) with common packages used by Data Scientists and ML Engineers.

Dockerfile | Registry | Notes
--- | --- | ---
[codeserver-python](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/codeserver-python) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/codeserver-python:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/codeserver-python) | code-server (Visual Studio Code) + Conda Python
[jupyter-pytorch (CPU)](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-pytorch) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-pytorch:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-pytorch) | JupyterLab + PyTorch (CPU)
[jupyter-pytorch (CUDA)](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-pytorch) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-pytorch-cuda:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-pytorch-cuda) | JupyterLab + PyTorch (CUDA)
[jupyter-pytorch-full (CPU)](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-pytorch-full) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-pytorch-full:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-pytorch-full) | JupyterLab + PyTorch (CPU) + [common](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-pytorch-full/requirements.txt) packages
[jupyter-pytorch-full (CUDA)](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-pytorch-full) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-pytorch-cuda-full:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-pytorch-cuda-full) | JupyterLab + PyTorch (CUDA) + [common](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-pytorch-full/requirements.txt) packages
[jupyter-scipy](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-scipy) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-scipy:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-scipy) | JupyterLab + [SciPy](https://www.scipy.org/) packages
[jupyter-tensorflow (CPU)](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-tensorflow) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-tensorflow:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-tensorflow) | JupyterLab + TensorFlow (CPU)
[jupyter-tensorflow (CUDA)](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-tensorflow) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-tensorflow-cuda:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-tensorflow-cuda) | JupyterLab + TensorFlow (CUDA)
[jupyter-tensorflow-full (CPU)](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-tensorflow-full) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-tensorflow-full:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-tensorflow-full) | JupyterLab + TensorFlow (CPU) + [common](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-tensorflow-full/requirements.txt) packages
[jupyter-tensorflow-full (CUDA)](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-tensorflow-full) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-tensorflow-cuda-full:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/jupyter-tensorflow-cuda-full) | JupyterLab + TensorFlow (CUDA) + [common](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/jupyter-tensorflow-full/requirements.txt) packages
[rstudio-tidyverse](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers/rstudio-tidyverse) | [`public.ecr.aws/j1r0q0g6/notebooks/notebook-servers/rstudio-tidyverse:{TAG}`](https://gallery.ecr.aws/j1r0q0g6/notebooks/notebook-servers/rstudio-tidyverse) | RStudio + [Tidyverse](https://www.tidyverse.org/) packages

### Image Dependency Chart

This flow-chart shows how our notebook container images depend on each other.

<img src="/docs/images/notebook-container-image-chart.png" 
     alt="A flow-chart showing how notebook container images depend on each other"  
     class="mt-3 mb-3 border border-info rounded">

## Custom Images

Packages installed by users __after spawning__ a Kubeflow Notebook will only last the lifetime of the pod (unless installed into a PVC-backed directory).

To ensure packages are preserved throughout Pod restarts users will need to either:
1. [Build custom images that include them](https://github.com/kubeflow/kubeflow/tree/master/components/example-notebook-servers#custom-images), or
2. Ensure they are installed in a PVC-backed directory

### Image Requirements

For Kubeflow Notebooks to work with a container image, the image must:
- expose an HTTP interface on port `8888`:
  - kubeflow sets an environment variable `NB_PREFIX` at runtime with the URL path we expect the container be listening under
  - kubeflow uses IFrames, so ensure your application sets `Access-Control-Allow-Origin: *` in HTTP response headers
- run as a user called `jovyan`:
  - the home directory of `jovyan` should be `/home/jovyan`
  - the UID of `jovyan` should be `1000`
- start successfully with an empty PVC mounted at `/home/jovyan`:
  - kubeflow mounts a PVC at `/home/jovyan` to keep state across Pod restarts

### Group Requirements
Kubeflow Notebooks images are grouped by server type to ensure networking is configured correctly for Kubeflow usage. Therefore, when using a custom image that is natively supported, it should be manually added to the appropriate group during creation or as an entry to the notebook [configuration file](https://github.com/kubeflow/manifests/blob/f40fefafab30834515889d712697e915eeca123b/apps/jupyter/jupyter-web-app/upstream/base/configs/spawner_ui_config.yaml#L18).

- Jupyterlab images should reside in the notebook images group "jupyterlab"  
<img src="/docs/images/notebook-images-group-jupyterlab.png" 
     alt="description"  
     class="mt-3 mb-3 border border-info rounded">  
- Visual Studio Code (code-server) images should reside in the notebook images group 1  
<img src="/docs/images/notebook-images-group-1.png" 
     alt="description"  
     class="mt-3 mb-3 border border-info rounded">
- RStudio images should reside in the notebook images group 2  
<img src="/docs/images/notebook-images-group-2.png" 
     alt="description"  
     class="mt-3 mb-3 border border-info rounded">  

## Next steps

- Use your container image by specifying it when spawning your notebook server.
  (See the [quickstart guide](/docs/components/notebooks/quickstart-guide/).)
