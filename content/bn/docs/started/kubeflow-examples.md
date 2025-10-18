+++
title = "উদাহরণসমূহ"
description = "Kubeflow দিয়ে মেশিন লার্নিং প্রদর্শনকারী উদাহরণসমূহ"
weight = 99
+++

{{% alert title="সতর্কতা" color="warning" %}}
[kubeflow/examples](https://github.com/kubeflow/examples) রিপোজিটরির কিছু উদাহরণ নতুন সংস্করণের Kubeflow দিয়ে পরীক্ষা করা হয়নি। আপনার নির্বাচিত উদাহরণের README দেখুন।
{{% /alert %}}

{{% blocks/sample-section title="MNIST ইমেজ ক্লাসিফিকেশন"
  kfctl="v1.0.0"
  url="https://github.com/kubeflow/examples/tree/master/mnist"
  api="https://api.github.com/repos/kubeflow/examples/commits?path=mnist&sha=master" %}}
MNIST ডেটাসেট ব্যবহার করে একটি ইমেজ ক্লাসিফিকেশন মডেল প্রশিক্ষণ এবং সার্ভ করুন।
এই টিউটোরিয়ালটি আপনার Kubeflow ক্লাস্টারে চলমান একটি Jupyter নোটবুকের আকারে আসে।
আপনি বিভিন্ন ক্লাউডে Kubeflow স্থাপন এবং মডেল প্রশিক্ষণ করতে পারেন,
যেমন Amazon Web Services (AWS), Google Cloud Platform (GCP), IBM Cloud,
Microsoft Azure, এবং অন-প্রিমিসেস। TensorFlow Serving দিয়ে মডেলটি সার্ভ করুন।
{{% /blocks/sample-section %}}

{{% blocks/sample-section title="আর্থিক সময় সিরিজ"
  kfctl="v0.7"
  url="https://github.com/kubeflow/examples/tree/master/financial_time_series"
  api="https://api.github.com/repos/kubeflow/examples/commits?path=financial_time_series&sha=master" %}}
Google Cloud Platform (GCP)-এ TensorFlow ব্যবহার করে আর্থিক সময় সিরিজ বিশ্লেষণের জন্য একটি মডেল প্রশিক্ষণ এবং সার্ভ করুন।
ওয়ার্কফ্লো স্বয়ংক্রিয় করতে Kubeflow Pipelines SDK ব্যবহার করুন।
{{% /blocks/sample-section %}}

## পরবর্তী পদক্ষেপ

[Kubeflow Pipelines নমুনা](/docs/components/pipelines/legacy-v1/tutorials/build-pipeline/) এর একটি কাজ করুন।
