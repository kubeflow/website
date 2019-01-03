+++
title = "Jupyter Notebooks"
description = "Using Jupyter notebooks in Kubeflow"
weight = 10
+++

## Bringing up a Jupyter Notebook

1. To connect to Jupyter follow the [instructions](/docs/guides/accessing-uis)
to access the Kubeflow UI. From there you will be able to navigate to JupyterHub   
   ![JupyterHub Link](/docs/images/jupyterlink.png)
1. Sign in 
   * On GCP you sign in using your Google Account
     * If you are already logged into your Google Account you may not 
       be prompted to login again
   * On all other platforms you can sign in using any username/password   
1. Click the "Start My Server" button, and you will be greeted by a dialog screen.
1. Select a CPU or GPU image from the Image dropdown menu depending on whether you are doing CPU or GPU training, or whether or not you have GPUs in your cluster. We currently offer a cpu and gpu image for each tensorflow minor version(eg: 1.4.1,1.5.1,1.6.0). Or you can type in the name of any TF image you want to run.
1. Allocate memory, CPU, GPU, or other resources according to your need (1 CPU and 2Gi of Memory are good starting points)
    * To allocate GPUs, make sure that you have GPUs available in your cluster
    * Run the following command to check if there are any nvidia gpus available:
    `kubectl get nodes "-o=custom-columns=NAME:.metadata.name,GPU:.status.allocatable.nvidia\.com/gpu"`
    * If you have GPUs available, you can schedule your server on a GPU node by specifying the following json in `Extra Resource Limits` section: `{"nvidia.com/gpu": "1"}`
  1. Click Spawn

      * The images are 10's of GBs in size and can take a long time to download
        depending on your network connection

      * You can check the status of your pod by doing

        ```
        kubectl -n ${NAMESPACE} describe pods jupyter-${USERNAME}
        ```

          * Where ${USERNAME} is the name you used to login
          * **GKE users** if you have IAP turned on the pod will be named differently

            * If you signed on as USER@DOMAIN.EXT the pod will be named

            ```
            jupyter-accounts-2egoogle-2ecom-3USER-40DOMAIN-2eEXT
            ```

1. You should now be greeted with a Jupyter Notebook interface.

The image supplied above can be used for training Tensorflow models with Jupyter. The images include all the requisite plugins, including [Tensorboard](https://www.tensorflow.org/get_started/summaries_and_tensorboard) that you can use for rich visualizations and insights into your models.

To test the install, we can run a basic hello world (adapted from [mnist_softmax.py](https://github.com/tensorflow/tensorflow/blob/r1.4/tensorflow/examples/tutorials/mnist/mnist_softmax.py) )

```
from tensorflow.examples.tutorials.mnist import input_data
mnist = input_data.read_data_sets("MNIST_data/", one_hot=True)

import tensorflow as tf

x = tf.placeholder(tf.float32, [None, 784])

W = tf.Variable(tf.zeros([784, 10]))
b = tf.Variable(tf.zeros([10]))

y = tf.nn.softmax(tf.matmul(x, W) + b)

y_ = tf.placeholder(tf.float32, [None, 10])
cross_entropy = tf.reduce_mean(-tf.reduce_sum(y_ * tf.log(y), reduction_indices=[1]))

train_step = tf.train.GradientDescentOptimizer(0.05).minimize(cross_entropy)

sess = tf.InteractiveSession()
tf.global_variables_initializer().run()

for _ in range(1000):
  batch_xs, batch_ys = mnist.train.next_batch(100)
  sess.run(train_step, feed_dict={x: batch_xs, y_: batch_ys})

correct_prediction = tf.equal(tf.argmax(y,1), tf.argmax(y_,1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
print(sess.run(accuracy, feed_dict={x: mnist.test.images, y_: mnist.test.labels}))
```

Paste the example into a new Python 3 Jupyter notebook and execute the code. This should result in a 0.9014 accuracy result against the test data.

Please note that when running on most cloud providers, the public IP address will be exposed to the internet and is an
unsecured endpoint by default. For a production deployment with SSL and authentication, refer to the [documentation](https://github.com/kubeflow/kubeflow/tree/{{< params "githubbranch" >}}/components/jupyterhub).


## Submitting k8s resources from Jupyter Notebook

The Jupyter Notebook pods are assigned the `jupyter-notebook` service account. This service account is bound to `jupyter-notebook` role which has namespace-scoped permissions to the following k8s resources:

* pods
* deployments
* services
* jobs
* tfjobs
* pytorchjobs

This means that you can directly create these k8s resources directly from your jupyter notebook. kubectl is already installed in the notebook, so you can create k8s resources running the following command in a jupyter notebook cell

```
!kubectl create -f myspec.yaml
```

## Building docker images from Jupyter Notebook on GCP

If using Jupyter Notebooks on GKE, you can submit docker image builds to Cloud Build which builds your docker images and pushes them to Google Container Registry.

Activate the attached service account using

```
!gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
```

If you have a Dockerfile in your current directory, you can submit a build using

```
!gcloud container builds submit --tag gcr.io/myproject/myimage:tag .
```

Advanced build documentation for docker images is available [here](https://cloud.google.com/cloud-build/docs/quickstart-docker)
