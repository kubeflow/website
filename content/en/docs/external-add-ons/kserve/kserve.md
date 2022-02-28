+++
title = "KServe"
description = "Model serving using KServe"
weight = 2
 
+++
 
{{% beta-status
  feedbacklink="https://github.com/KServe/KServe/issues" %}}

!!! note 
      ### [KFServing is now KServe](https://kserve.github.io/website/0.7/blog/articles/2021-09-27-kfserving-transition/)
            The KFServing GitHub repository  transferred to an independent KServe GitHub organization under the stewardship of the Kubeflow Serving Working Group leads.
      ### [KServe Docs](https://kserve.github.io/website/0.7/)
          The majority of KServe docs will be available on the new docs website and it is recommended to refer to the docs on the KServe website rather than this website


<img src="./pics/kserve.png" alt="KServe">

 
KServe enables serverless inferencing on Kubernetes and provides performant, high abstraction interfaces for common machine learning (ML) frameworks like TensorFlow, XGBoost, scikit-learn, PyTorch, and ONNX to solve production model serving use cases.
 
You can use KServe to do the following:
 
* Provide a Kubernetes [Custom Resource Definition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for serving ML models on arbitrary frameworks.
 
* Encapsulate the complexity of autoscaling, networking, health checking, and server configuration to bring cutting edge serving features like GPU autoscaling, scale to zero, and canary rollouts to your ML deployments.
 
* Enable a simple, pluggable, and complete story for your production ML inference server by providing prediction, pre-processing, post-processing and explainability out of the box.
 
Our strong community contributions help KServe to grow. We have a Technical Steering Committee driven by Bloomberg, IBM Cloud, Seldon, Amazon Web Services (AWS) and NVIDIA. [Browse the KServe GitHub repo](https://github.com/KServe/KServe) to give us feedback!
 
## Install with Kubeflow
 
KServe works with Kubeflow 1.5. Kustomize installation files are [located in the manifests repo](https://github.com/kubeflow/manifests/tree/master/contrib/kserve).
Check the examples running KServe on Istio/Dex in the [`KServe/KServe`](https://github.com/KServe/KServe/tree/master/docs/samples/istio-dex) repository. For installation on major cloud providers with Kubeflow, follow their installation docs.
 
Kubeflow 1.5 includes KServe v0.7 which promoted the core InferenceService API from v1alpha2 to v1beta1 stable and added ModelMesh component to the release. Additionally, LFAI Trusted AI Projects on AI Fairness, AI Explainability and Adversarial Robustness have been integrated with KServe, and we have made KServe available on OpenShift as well. To know more, please read the [release blog](https://kserve.github.io/website/blog/articles/2021-10-11-KServe-0.7-release/) and follow the [release notes](https://github.com/KServe/KServe/releases/tag/v0.7.0)
 
## Standalone KServe
  ### [Quickstart Install](https://kserve.github.io/website/0.7/get_started/)
!!! warning
    KServe Quickstart Environments are for experimentation use only. For production installation, see our [Administrator's Guide](../admin)
  
## Learn more
 
* [Kubeflow 101: What is KFserving?](https://www.youtube.com/watch?v=lj_X2ND2BBI) 
* [KFServing 101 slides](https://drive.google.com/file/d/16oqz6dhY5BR0u74pi9mDThU97Np__AFb/view).
* [Kubecon Introducing KFServing](https://kccncna19.sched.com/event/UaZo/introducing-kfserving-serverless-model-serving-on-kubernetes-ellis-bigelow-google-dan-sun-bloomberg).
* [Serving Machine Learning Models at Scale Using KServe - Yuzhui Liu, Bloomberg](https://www.youtube.com/watch?v=sE_A54T2n6k)
* [KServe (Kubeflow KFServing) Live Coding Session](https://www.youtube.com/watch?v=0YmM_h7PvpI)
* [TFiR: Let’s Talk About IBM’s ModelMesh, KServe And Other Open Source AI/ML Technologies](https://www.youtube.com/watch?v=0H-HvK8zIUI) | Animesh Singh |
* [KubeCon 2021: Serving Machine Learning Models at Scale Using KServe](https://www.youtube.com/watch?v=la3Y0lXuKRM) | Animesh Singh |


### **KServe Key Links**
- [<u>Website</u>](https://kserve.github.io/website/)
- [<u>Github</u>](https://github.com/kserve/kserve/)
- [<u>Slack(#kubeflow-kfserving)</u>](https://kubeflow.slack.com/join/shared_invite/zt-n73pfj05-l206djXlXk5qdQKs4o1Zkg#/)