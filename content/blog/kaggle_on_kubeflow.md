+++
title = "Kaggle on Kubeflow"
description = "Kubeflow Project Provides Ready-to-Go Kaggle Image"
weight = 20
publishDate = 2018-08-24T14:01:31-04:00
draft = false
+++

## Kaggle
[Kaggle](http://kaggle.com/) is home to the world's largest community of data scientists and AI/ML researchers. It's a diverse community ranging from newcomers to accredited research scientists, where participants collaborate and compete online to refine algorithms and techniques. In organized competitions, judges decide on the entries that produce the best model. The competitions can be organized by anyone but many companies and institutions award significant cash prizes to the winners. Beyond the academic benefit of the competitions, it also provides a means to identify top candidates for data science careers with these corporations as they increase their investments in AI and ML.

What kind of solutions are being sought by these money competitions? Here's just a few:

- DHS Passenger Screening Algorithm Challenge: $1,500,000
- Zillow Prize: Zillow’s Home Value Prediction (Zestimate): $1,200,000
- Heritage Health Prize (Identify patient hospital admission probability): $500,000
- The Nature Conservancy Fisheries Monitoring (Detect and classify species of fish): $150,000
- TGS Salt Identification Challenge (Segment salt deposits beneath the Earth's surface): $100,000

For new data scientists, there are competitions that are interesting thought experiments. The most notable of these is predicting which persons would survive the Titanic disaster, which in fact we will use for our example below.  

The Kaggle development platform itself is organized into competitions, "kernels", and datasets which are used to derive the models submitted to the competitions. There are also short form online classes for introductions to Python and machine learning. The kernels are considered [more than just the usual notion of a notebook](http://blog.kaggle.com/2016/07/08/kaggle-kernel-a-new-name-for-scripts/) combining environment, input, code, and output under version control.

## Yes, but what about Kubeflow?
Kaggle hosts its kernels at its site, so users can choose to run all their data science notebooks online there, but the underlying infrastucture is hosted and shared by over a million users. Individuals and institutions may have superior resource options at their disposal that are more performant, highly available, and private. Indeed, perhaps some institutions want to prepare and announce a new Kaggle competition, and want to do some basic modelling to frame the problem space. However, they potentially can't know in advance which combination of ML frameworks and libraries will achieve the win.

And this is where Kubeflow comes in. Due to its portability and scalability Kubeflow can be deployed into many different cloud providers: GKE, Azure, AKS, on-premise. It can provide the underlying infrastructure on Kubernetes that maximizes the compute resources (both CPU and GPU) to meet the demands of the data scientists who need to run their model experiments and serving. So, assuming you buy all that, we'll take a closer look...

## Images
### Kubeflow notebooks
The Kubeflow project early on made a decision to curate, build, and maintain Jupyter notebook images with specific content in them. Since TensorFlow ranks highest in popularity among ML frameworks, it was an obvious choice to have that anchor the notebooks starting with TF 1.4.1. After that there is Keras, Sci-Kit Learn, pandas, and various libraries for JupyterHub widgets and so on. But we had to draw a line somewhere: the more content and layers that go into a Dockerfile, the more the derived image grows in size. Also, we wanted to support both CPU and GPU flavors of TF.

Kubeflow opted for an opinionated balance between images that had somewhat manageable sizes (3-4GB) and core content, as opposed to installing all of the many different frameworks that are available. However, we modified ownership within the images to allow users to install any frameworks or libraries they wanted. We didn't want the initial experience for new developers using Kubeflow to be impacted by long download latency during docker pulls from the Kubeflow `gcr.io/kubeflow-images-public` container registry.

### Kaggle notebook
Kaggle maintains [its own Python Docker image project](https://github.com/Kaggle/docker-python) which is used as the basis for Kubeflow to provide an image that has all the rich goodness of virtually every available Python ML framework and tool while also having the necessary mods for it to be easily deployed into a Kubeflow environment. But as I mentioned previously, there is some cost associated with that.

- it's a very large notebook, over 21 GB in size. Docker pulls and notebook launches can take a lengthy period of time
- the versions of TensorFlow, PyTorch, XGBoost, and the other libraries included may change at any time
- the base image size for Docker devicemapper is 10 GB, which won't be large enough to run this image, so look to alternate Docker storage drivers
- the Kaggle image includes TensorFlow 1.9 or greater built with [AVX2 support](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#Advanced_Vector_Extensions_2), so the image may not run on some older CPU
- unlike the Kubeflow curated notebooks, the default notebook user (`jovyan`) does not have the permissions to install new packages to global locations (but more on that below)

## Let's Try This Out

### kaggle-api
The Kaggle project has developed [a Python CLI tool](https://github.com/Kaggle/kaggle-api) which essentially interacts with the REST API for the site. We'll use it for downloading datasets for our kernel. The CLI is under active development and I couldn't use it to download a kernel but your mileage may vary. Since I'm using a publicly available kernel, good old [curl](https://curl.haxx.se/) to the rescue.

### Spawning the Kaggle notebook
The Kubeflow website has [instructions for setting up a new deployment](https://www.kubeflow.org/docs/started/getting-started/) and I will assume that is in place. Once you navigate to the spawner UI, enter the most recent Kubeflow Kaggle image `gcr.io/kubeflow-images-public/kaggle-notebook:v20180713` and click "Spawn". As indicated previously, it can take several minutes for the spawn to complete due to the size of the image.

![Spawner UI](../spawner-ui-kaggle-nb.svg)

### Kaggle CLI

Once the notebook has successfully spawned, go to the "New" menu and open a terminal so that we can set a few things up. 

![Terminal](../terminal-menu.svg)

Ironically, the upstream Kaggle image does not come with the kaggle-api client pre-installed. Also note that our `jovyan` user doesn't have permission in _this_ image to install to the site package directory. So, we will do a local install of kaggle and add the script to our path.

```
export PYTHONUSERBASE=/home/jovyan/.local
pip install --user kaggle
export PATH=/home/jovyan/.local/bin:$PATH
```

You must register with Kaggle so that you can obtain an API key. 

![Kaggle API](../kaggle-api.svg)

Once you are registered, you can either put the key in your notebook at `~/.kaggle/kaggle.json` or use the contents to set the following environment variables.


```
export KAGGLE_USERNAME=<your_kaggle_account>
export KAGGLE_KEY=xxxxxxxxxxxxxx
```

### Prepare your environment

Next we'll grab the dataset from the Titanic competition. It's important to note that you must agree to the terms and conditions of the competition before downloading its datasets.

```
mkdir ~/input && cd ~/input
kaggle competitions download -c titanic
```

So this is the part [where I got stuck](https://github.com/Kaggle/kaggle-api/issues/84) trying to use the Kaggle client to pull down my kernel. It may be something to do with my environment but I'll update this blog when I find a resolution. Instead I opted to use curl to pull the notebook from Kaggle based on the code link at the site.

```
cd ~/work
curl https://www.kaggle.com/kernels/scriptcontent/4112920/download -o titanic.ipynb
```

### Run it

Finally we are ready to run our Titanic notebook. I'll assume at this point that the reader knows their way around a Jupyter notebook. 

![Run Notebook](../nb-run.svg)

I chose this [particular public notebook](https://www.kaggle.com/arthurtok/introduction-to-ensembling-stacking-in-python) based on the high number of votes it has as a kernel for the Titanic competition, the richness of some of the visualizations, and also because it uses XGBoost, a library that Kubeflow does not currently include in its supported TensorFlow notebooks.

![Titanic Barplot](../titanic-barplot.svg)


I hope this blog post gives readers enough information to get started on their own data science journey. Enjoy and happy Kubeflowing! (and Kaggling!)

*Pete MacKinnon*
