+++
title = "সহায়তা পান"
description = "Kubeflow-এর জন্য কোথায় সহায়তা পাবেন"
weight = 80
+++

এই পৃষ্ঠাটি Kubeflow সম্পর্কিত সমস্যা, প্রশ্ন বা পরামর্শের জন্য উপলব্ধ সম্পদ এবং সহায়তার বিকল্পগুলি বর্ণনা করে।

<a id="application-status"></a>

## উপাদান স্থিতি

প্রথমে [Kubeflow-এর গঠন](https://www.kubeflow.org/docs/started/introduction/#what-is-kubeflow) সম্পর্কে নিজেকে পরিচিত করুন।
যখন আপনি একটি Kubernetes ক্লাস্টারে Kubeflow স্থাপন করেন, তখন আপনার স্থাপনায় একাধিক প্রকল্প অন্তর্ভুক্ত থাকে। মনে রাখবেন যে প্রকল্প সংস্করণিং Kubeflow প্ল্যাটফর্ম সংস্করণ থেকে স্বাধীন। প্রতিটি প্রকল্পকে স্থিতিশীলতা, আপগ্রেডযোগ্যতা, লগিং, মনিটরিং এবং নিরাপত্তা (PodSecurityStandards সীমাবদ্ধ, নেটওয়ার্ক নীতিমালা এবং প্রমাণীকরণ এবং অনুমোদনের জন্য ইন্টিগ্রেশন টেস্ট) সম্পর্কিত নির্দিষ্ট [মানদণ্ড](https://github.com/kubeflow/community/blob/master/guidelines/application_requirements.md) পূরণ করতে হবে।

উপাদান স্থিতি সূচক:

- **স্থিতিশীল**: অ্যাপ্লিকেশনটি বেশিরভাগ মানদণ্ড পূরণ করে এবং এই রিলিজের জন্য স্থিতিশীল বলে বিবেচিত হয়।
- **বেটা**: অ্যাপ্লিকেশনটি বেশিরভাগ মানদণ্ড পূরণের দিকে অগ্রসর হচ্ছে।
- **আলফা**: অ্যাপ্লিকেশনটি প্রাথমিক উন্নয়ন বা ইন্টিগ্রেশন পর্যায়ে রয়েছে।

<a id="levels-of-support"></a>

## সহায়তার স্তর

1. Kubeflow সম্প্রদায় স্থিতিশীল উপাদানগুলির জন্য সর্বোত্তম প্রচেষ্টার সহায়তা প্রদান করে।
2. আপনি নীচে তালিকাভুক্ত একটি কোম্পানি বা ফ্রিল্যান্সারের কাছ থেকে বাণিজ্যিক সহায়তা অনুরোধ করতে পারেন।

<a id="community-support"></a>

## Kubeflow সম্প্রদায় থেকে সহায়তা

Kubeflow-এর একটি সক্রিয় এবং সহায়ক ব্যবহারকারী এবং অবদানকারীদের সম্প্রদায় রয়েছে।
Kubeflow সম্প্রদায় স্থিতিশীল এবং বেটা অ্যাপ্লিকেশনগুলির জন্য সর্বোত্তম প্রচেষ্টার ভিত্তিতে সহায়তা প্রদান করে। যদি আপনার বাণিজ্যিক সহায়তার প্রয়োজন হয়, অনুগ্রহ করে নীচের বিভাগগুলি দেখুন।

**সর্বোত্তম প্রচেষ্টার সহায়তা** মানে কোনও আনুষ্ঠানিক চুক্তি বা সমস্যা সমাধানের প্রতিশ্রুতি নেই তবে সম্প্রদায় যত তাড়াতাড়ি সম্ভব সমস্যাটি সমাধানের গুরুত্বকে স্বীকার করে। সম্প্রদায় প্রতিশ্রুতি দেয় যে নিম্নলিখিত প্রয়োজনীয়তাগুলি পূরণ হলে আপনাকে সমস্যা নির্ণয় এবং সমাধানে সহায়তা করবে:

- কারণটি Kubeflow দ্বারা নিয়ন্ত্রিত প্রযুক্তিগত কাঠামোর মধ্যে পড়ে। উদাহরণস্বরূপ, যদি সমস্যাটি আপনার সংস্থার নির্দিষ্ট নেটওয়ার্ক কনফিগারেশনের কারণে হয় তবে Kubeflow সম্প্রদায় সহায়তা করতে সক্ষম নাও হতে পারে।
- সম্প্রদায়ের সদস্যরা সমস্যাটি পুনরুত্পাদন করতে পারে।
- রিপোর্টার সমস্যা সমাধানে সহায়তা করতে পারে।

আপনি নিম্নলিখিত জায়গাগুলিতে প্রশ্ন করতে এবং পরামর্শ দিতে পারেন:

- **Slack** অনলাইন চ্যাট এবং মেসেজিংয়ের জন্য, দেখুন [Slack ওয়ার্কস্পেস এবং চ্যানেল](/docs/about/community/#kubeflow-slack-channels)।
- **GitHub আলোচনা** প্রতি রিপোজিটরিতে, যেমন [এখানে](https://github.com/kubeflow/manifests/discussions)
- **Kubeflow আলোচনা** ইমেল-ভিত্তিক গ্রুপ আলোচনার জন্য। যোগ দিন [kubeflow-discuss](/docs/about/community/#kubeflow-mailing-list) গ্রুপ।
- **Kubeflow ডকুমেন্টেশন** ওভারভিউ এবং কিভাবে-করুন গাইডের জন্য। বিশেষ করে, একটি সমস্যা সমাধানের সময় নিম্নলিখিত ডকুমেন্টগুলি দেখুন:

  - [Kubeflow ইনস্টলেশন এবং সেটআপ](/docs/started/installing-kubeflow/)
  - [Kubeflow উপাদান](/docs/components/)

- **Kubeflow ইস্যু ট্র্যাকার** পরিচিত সমস্যা, প্রশ্ন এবং বৈশিষ্ট্য অনুরোধের জন্য। খোলা ইস্যুগুলি অনুসন্ধান করুন এটি দেখতে যে কেউ ইতিমধ্যে আপনার সম্মুখীন সমস্যাটি লগ করেছে কিনা এবং কোনও সমাধান সম্পর্কে জানুন। যদি কেউ আপনার সমস্যাটি লগ না করে থাকে, তাহলে সমস্যাটি বর্ণনা করতে একটি নতুন ইস্যু তৈরি করুন।

  প্রতিটি Kubeflow উপাদানের নিজস্ব ইস্যু ট্র্যাকার রয়েছে [GitHub-এ Kubeflow সংস্থার মধ্যে](https://github.com/kubeflow)। আপনাকে শুরু করতে, এখানে প্রাথমিক ইস্যু ট্র্যাকার রয়েছে:

  - [Kubeflow Spark Operator](https://github.com/kubeflow/spark-operator/issues)
  - [Kubeflow Pipelines](https://github.com/kubeflow/pipelines/issues)
  - [Kubeflow Katib](https://github.com/kubeflow/katib/issues)
  - [Kubeflow Trainer](https://github.com/kubeflow/trainer/issues)
  - [Kubeflow Notebooks](https://github.com/kubeflow/notebooks/issues)
  - [Kubeflow Model Registry](https://github.com/kubeflow/model-registry/issues)
  - [Kubeflow Dashboard](https://github.com/kubeflow/dashboard/issues)
  - [Kubeflow Kserve](https://github.com/kserve/kserve/issues)
  - [Kubeflow Platform / Manifests](https://github.com/kubeflow/manifests/issues)
  - [Kubeflow Website](https://github.com/kubeflow/website/issues)

<a id="provider-support"></a>

## Kubeflow ইকোসিস্টেমে বাণিজ্যিক প্রদানকারীদের কাছ থেকে সহায়তা

আমরা বাণিজ্যিক কোম্পানি এবং ব্যক্তিদের প্রচার করতে চাই যারা ওপেন সোর্স প্রকল্পে অবদান রাখে।
নিচে এমন সংস্থাগুলির একটি টেবিল রয়েছে যারা Kubeflow-এ অবদান রাখে এবং বাণিজ্যিক সহায়তা প্রদান করে:

| প্রদানকারী                   | সহায়তা লিঙ্ক                                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aranui Solutions             | [Aranui Solutions](https://www.aranui.solutions/services)                                                                                                       |
| Canonical                    | [Ubuntu Kubeflow](https://ubuntu.com/kubeflow#get-in-touch)                                                                                                     |
| Freelancer Julius von Kohout | [LinkedIn](https://de.linkedin.com/in/juliusvonkohout/), [Slack](https://cloud-native.slack.com/team/U06LW431SJF), [GitHub](https://github.com/juliusvonkohout) |
| Red Hat                      | [Red Hat](https://www.redhat.com/en/technologies/cloud-computing/openshift/openshift-ai)                                                                        |
| অন্যান্য প্রদানকারী          | অনুগ্রহ করে Kubeflow স্টিয়ারিং কমিটির সাথে যোগাযোগ করুন Kubeflow ওপেন সোর্স প্রকল্পে উল্লেখযোগ্য অবদানের প্রমাণ সহ।                                            |

<a id="cloud-support"></a>
যদি আপনি Kubeflow-এর জন্য একটি ক্লাউড প্রদানকারীর পরিচালিত অফার ব্যবহার করেন, তাহলে ক্লাউড প্রদানকারী আপনাকে একটি সমস্যা নির্ণয় এবং সমাধানে সহায়তা করতে পারে।

## জড়িত হওয়া

আপনি তহবিল, কোড, ডকুমেন্টেশন, ব্যবহার কেস অবদান রেখে বা সম্প্রদায়ের মিটিংয়ে যোগ দিয়ে Kubeflow-এ অংশগ্রহণ করতে পারেন। আরও তথ্যের জন্য, দেখুন [Kubeflow সম্প্রদায় পৃষ্ঠা](/docs/about/community/)।

## আপডেট থাকুন

Kubeflow খবরের সাথে আপডেট থাকুন:

- [সম্প্রদায় পৃষ্ঠা](https://www.kubeflow.org/docs/about/community/) Slack চ্যানেল, নিয়মিত মিটিং এবং অন্যান্য নির্দেশিকা সহ।
- [Kubeflow ব্লগ](https://blog.kubeflow.org/) রিলিজ ঘোষণা, ইভেন্ট এবং টিউটোরিয়ালের জন্য।
- [Kubeflow টুইটারে](https://twitter.com/kubeflow) প্রযুক্তিগত টিপসের জন্য।
- প্রতিটি Kubeflow অ্যাপ্লিকেশনের বিস্তারিত আপডেটের জন্য রিলিজ নোট।
