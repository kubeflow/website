+++
title = "Nuclio functions"
description = "Nuclio - High performance serverless for data processing and ML"
weight = 40
toc = true
+++

## Nuclio Overview

[nuclio](https://github.com/nuclio/nuclio) is a high performance serverless platform which runs over docker or kubernetes 
and automate the development, operation, and scaling of code (written in 8 supported languages).
Nuclio is focused on data analytics and ML workloads, it provides extreme performance and parallelism, supports stateful and data intensive 
workloads, GPU resource optimization, check-pointing, and 14 native triggers/streaming protocols out of the box including HTTP, Cron, batch, Kafka, Kinesis, 
Google pub/sub, Azure event-hub, MQTT, etc. additional triggers can be added dynamically (e.g. [Twitter feed](https://github.com/v3io/tutorials/blob/master/demos/stocks/04-read-tweets.ipynb)).
  
nuclio can run in the cloud as a [managed offering](https://www.iguazio.com/), or on any Kubernetes cluster (cloud, on-prem, or edge)<br>
[read more about nuclio ...](https://github.com/nuclio/nuclio)

## Using Nuclio In Data Science Pipelines 

Nuclio functions can be used in the following ML pipline tasks:

- Data collectors, ETL, stream processing
- Data preparation and analysis
- Hyper parameter model training
- Real-time model serving
- Feature vector assembly (real-time data preparation)
 
Containerized functions (+ dependent files and spec) can be created directly from a Jupyter Notebook 
using `%nuclio` magic commands or SDK API calls (see [nuclio-jupyter](https://github.com/nuclio/nuclio-jupyter)), 
or they can be built/deployed using KubeFlow Pipeline (see: [nuclio pipeline components]()) 
e.g. if we want to deploy/update Inference functions right after we update an ML model. 

## Installing Nuclio over Kubernetes

Nuclio [Git repo](https://github.com/nuclio/nuclio) contain detailed documentation on the installation and usage.
can also follow this [interactive tutorial](https://www.katacoda.com/javajon/courses/kubernetes-serverless/nuclio).

The simplest way to install is using [`Helm`](https://helm.sh/docs/intro/install/), assuming you deployed Helm on your cluster, type the following commands:

```
helm repo add nuclio https://nuclio.github.io/nuclio/charts
kubectl create ns nuclio
helm install nuclio nuclio/nuclio --set dashboard.nodePort=31000

kubectl -n nuclio get all
```

Browse to the dashboard URL, you can create, test, and manage functions using a visual editor.

> Note: you can change the NodePort number or skip that option for in-cluster use.

## Writing and Deploying a Simple Function 

The simplest way to write a nuclio function is from within Jupyter.
the entire Notebook, portions of it, or code files can be turned into functions in a single magic/SDK command.
see [the SDK](https://github.com/nuclio/nuclio-jupyter) for detailed documentation. 

The full notebook with the example below can be [found here](https://github.com/nuclio/nuclio-jupyter/blob/master/docs/nlp-example.ipynb)

before you begin install the latest `nuclio-jupyter` package:

    pip install --upgrade nuclio-jupyter

We write and test our code inside a notebook like any other data science code.
We add some `%nuclio` magic commands to describe additional configurations such as which packages to install, 
CPU/Mem/GPU resources, how the code will get triggered (http, cron, stream), environment variables, 
additional files we want to bundle (e.g. ML model, libraries), versioning, etc.

First we need to import `nuclio` package (we add an `ignore` comment so this line wont be compiled later):

```python
# nuclio: ignore
import nuclio
```

We add function spec, environment, configuration details using magic commands:

```
%nuclio cmd pip install textblob
%nuclio env TO_LANG=fr
%nuclio config spec.build.baseImage = "python:3.6-jessie"
```

and we write our code as usual, just make sure we have a handler function which 
is invoked to initiate our run. The function accepts a context and an event, e.g.:
 `def handler(context, event)`
 
**Function code**

the following example show accepting text and doing NLP processing (correction, translation, sentiments):

```python
from textblob import TextBlob
import os

def handler(context, event):
    context.logger.info('This is an NLP example! ')

    # process and correct the text
    blob = TextBlob(str(event.body.decode('utf-8')))
    corrected = blob.correct()

    # debug print the text before and after correction
    context.logger.info_with("Corrected text", corrected=str(corrected), orig=str(blob))

    # calculate sentiments
    context.logger.info_with("Sentiment",
                             polarity=str(corrected.sentiment.polarity),
                             subjectivity=str(corrected.sentiment.subjectivity))

    # read target language from environment and return translated text
    lang = os.getenv('TO_LANG','fr')
    return str(corrected.translate(to=lang))
```

Now we can test the function using a built-in function context and examine its output  

```python
# nuclio: ignore
event = nuclio.Event(body=b'good morninng')
handler(context, event)
```

Finally we deploy our function using the magic commands, SDK, or KubeFlow Pipeline. 
we can simply write and run the following command a cell:

```python
%nuclio deploy -n nlp -p ai -d <nuclio-dashboard-url>
```

The dashboard URL is `http://cluster-ip:node-port`, which you can see with `kubectl get service nuclio-dashboard`.

If you want more control, you can use the SDK:

```python
# nuclio: ignore
# deploy the notebook code with extra configuration (env vars, config, etc.)
spec = nuclio.ConfigSpec(config={'spec.maxReplicas': 2}, env={'EXTRA_VAR': 'something'})
addr = nuclio.deploy_file(name='nlp',project='ai',verbose=True, spec=spec, 
                          tag='v1.1', dashboard_url='<dashboard-url>')

# invoke the generated function 
resp = requests.get('http://' + addr)
print(resp.text)
``` 

We can also deploy our function directly from Git:

```python
addr = nuclio.deploy_file('git://github.com/nuclio/nuclio#master:/hack/examples/python/helloworld',
                          name='hw', project='myproj', dashboard_url='<dashboard-url>')
resp = requests.get('http://' + addr)
print(resp.text)
```

## Using Nuclio with KubeFlow Pipelines

We can deploy and test functions as part of a KubeFlow pipeline step.
after installing nuclio in your cluster (see instructions above), you can run the following pipeline:

```python
import kfp
from kfp import dsl

# load nuclio kubeflow components
nuclio_deploy = kfp.components.load_component(url='https://raw.githubusercontent.com/kubeflow/pipelines/master/components/nuclio/deploy/component.yaml')
nuclio_invoke = kfp.components.load_component(url='https://raw.githubusercontent.com/kubeflow/pipelines/master/components/nuclio/invoker/component.yaml')

@dsl.pipeline(
    name='Nuclio deploy and invoke demo',
    description='Nuclio demo, build/deploy a function from notebook + test the function rest endpoint'
)
def nuc_pipeline(
   txt='good morningf',
):
    nb_path = 'https://raw.githubusercontent.com/nuclio/nuclio-jupyter/master/docs/nlp-example.ipynb'
    dashboard='http://nuclio-dashboard.nuclio.svc:8070'
    
    # build the function image & CRD from a notebook file (in the above URL)
    build = nuclio_deploy(url=nb_path, name='myfunc', project='myproj', tag='0.11', dashboard=dashboard)
    
    # test the function with real data (function URL is taken from the build output)
    test = nuclio_invoke(build.output, txt)
```
the code above assumes nuclio was deployed into the `nuclio` namespace on the same cluster, when using a remote cluster or a different namespace you just need to change the `dashboard` URL.

See [nuclio pipline components](https://github.com/kubeflow/pipelines/tree/master/components/nuclio) (allowing to deploy, delete, or invoke functions) 

> Note: Nuclio is not limited to Python, [see this example](https://github.com/nuclio/nuclio-jupyter/blob/master/docs/nuclio_bash.ipynb) showing how we create a simple `Bash` function from a 
Notebook, e.g. we can create `Go` functions if we need performance/concurrency for our inference. 

## Nuclio function examples

Some useful function example Notebooks:

- [Analyze Real-Time Data Using Spark Streaming, SQL, and ML](https://github.com/v3io/tutorials/blob/master/demos/stocks/02-explore.ipynb)
- [Twitter Feed NLP](https://github.com/v3io/tutorials/blob/master/demos/stocks/04-read-tweets.ipynb)
- [Real-time Stock data reader](https://github.com/v3io/tutorials/blob/master/demos/stocks/03-read-stocks.ipynb)

