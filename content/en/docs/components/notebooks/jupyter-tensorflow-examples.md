+++
title = "Jupyter TensorFlow Examples"
description = "Examples using Jupyter and TensorFlow in Kubeflow Notebooks"
weight = 40

+++

## Mnist Example

(adapted from [tensorflow/tensorflow - mnist_softmax.py](https://github.com/tensorflow/tensorflow/blob/r1.4/tensorflow/examples/tutorials/mnist/mnist_softmax.py))

1. When creating your notebook server choose a [container image](/docs/components/notebooks/container-images/) which has Jupyter and TensorFlow installed.

2. Use Jupyter's interface to create a new **Python 3** notebook.

3. Copy the following code and paste it into your notebook:

    ```python
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
    print("Accuracy: ", sess.run(accuracy, feed_dict={x: mnist.test.images, y_: mnist.test.labels}))
    ```

4. Run the code. You should see a number of `WARNING` messages from TensorFlow, followed by a line showing a training accuracy something like this:

    ```
    Accuracy:  0.9012
    ```

## Next steps

- See a [simple example](https://github.com/kubeflow/examples/tree/master/pipelines/simple-notebook-pipeline) of creating Kubeflow pipelines in a Jupyter notebook.
- Build machine-learning pipelines with the [Kubeflow Pipelines SDK](/docs/components/pipelines/legacy-v1/sdk/sdk-overview/).
- Learn the advanced features available from a Kubeflow notebook, such as [submitting Kubernetes resources](/docs/components/notebooks/submit-kubernetes/) or [building Docker images](/docs/components/notebooks/container-images/#custom-images/). 
