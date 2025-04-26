+++
title =  "ডকুমেন্টেশন স্টাইল গাইড"
description = "Kubeflow ডকুমেন্টেশন লেখার জন্য স্টাইল গাইড"
weight = 90
+++

এই স্টাইল গাইডটি [Kubeflow ডকুমেন্টেশন](/docs/) এর জন্য।
স্টাইল গাইডটি অবদানকারীদের এমন ডকুমেন্টেশন লিখতে সহায়তা করে যা পাঠকরা দ্রুত এবং সঠিকভাবে বুঝতে পারে।

Kubeflow ডকসের লক্ষ্য:

- স্টাইল এবং পরিভাষায় সামঞ্জস্যতা, যাতে পাঠকরা নির্দিষ্ট কাঠামো এবং রীতিগুলি আশা করতে পারে।
  পাঠকদের ডকুমেন্টেশন ব্যবহার করার পদ্ধতি পুনরায় শেখার বা তারা কিছু সঠিকভাবে বুঝেছে কিনা তা নিয়ে প্রশ্ন করার প্রয়োজন নেই।
- পরিষ্কার, সংক্ষিপ্ত লেখা যাতে পাঠকরা দ্রুত প্রয়োজনীয় তথ্য খুঁজে এবং বুঝতে পারে।

## স্ট্যান্ডার্ড আমেরিকান বানান ব্যবহার করুন

কমনওয়েলথ বা ব্রিটিশ বানানের পরিবর্তে আমেরিকান বানান ব্যবহার করুন।
[Merriam-Webster's Collegiate Dictionary, Eleventh Edition](https://www.merriam-webster.com/) দেখুন।

## বড় অক্ষর কম ব্যবহার করুন

কিছু টিপস:

- পৃষ্ঠার প্রতিটি শিরোনামের প্রথম অক্ষর বড় করুন। (অর্থাৎ, বাক্য কেস ব্যবহার করুন।)
- পৃষ্ঠার শিরোনামে (প্রায়) প্রতিটি শব্দ বড় করুন। (অর্থাৎ, শিরোনাম কেস ব্যবহার করুন।)
  "and", "in" ইত্যাদি ছোট শব্দগুলি বড় অক্ষর পায় না।
- পৃষ্ঠার বিষয়বস্তুতে, ব্র্যান্ড নামের জন্য বড় অক্ষর ব্যবহার করুন, যেমন Kubeflow, Kubernetes ইত্যাদি।
  ব্র্যান্ড নাম সম্পর্কে আরও দেখুন [নিচে](#use-full-correct-brand-names)।
- শব্দ জোর দেওয়ার জন্য বড় অক্ষর ব্যবহার করবেন না।

## প্রথম ব্যবহারে সংক্ষিপ্ত রূপ এবং সংক্ষিপ্ত রূপ বর্ণনা করুন

আপনি পৃষ্ঠায় যে কোনও সংক্ষিপ্ত রূপ বা সংক্ষিপ্ত রূপ প্রথমবার ব্যবহার করার সময় সম্পূর্ণ শর্তটি সর্বদা বর্ণনা করুন।
মানুষ জানে না যে একটি সংক্ষিপ্ত রূপ বা সংক্ষিপ্ত রূপের অর্থ কী, এমনকি এটি সাধারণ জ্ঞান মনে হলেও।

উদাহরণ: "স্থানীয়ভাবে একটি ভার্চুয়াল মেশিন (ভিএম) এ Kubernetes চালানোর জন্য"

## আপনি চাইলে সংকোচন ব্যবহার করুন

যেমন, "এটি" এর পরিবর্তে "এটি" লেখা ঠিক আছে।

<a id="brand-names"></a>

## সম্পূর্ণ, সঠিক ব্র্যান্ড নাম ব্যবহার করুন

যখন একটি পণ্য বা ব্র্যান্ডের উল্লেখ করা হয়, তখন সম্পূর্ণ নাম ব্যবহার করুন।
পণ্য মালিকরা পণ্য ডকুমেন্টেশনে যেমন নামকরণ করেন তেমন নামকরণ করুন।
অবশ্যই সংক্ষিপ্ত রূপ ব্যবহার করবেন না এমনকি সেগুলি সাধারণ ব্যবহারে থাকলেও, যতক্ষণ না পণ্য মালিক সংক্ষিপ্ত রূপটি অনুমোদন করেন।

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Use this</th>
        <th>Instead of this</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Kubeflow</td>
        <td>kubeflow</td>
      </tr>
      <tr>
        <td>Kubernetes</td>
        <td>k8s</td>
      </tr>
      <tr>
        <td>ksonnet</td>
        <td>Ksonnet</td>
      </tr>
    </tbody>
  </table>
</div>

## বিরাম চিহ্নের সাথে সঙ্গতিপূর্ণ হন

একটি পৃষ্ঠার মধ্যে বিরাম চিহ্ন ব্যবহার করুন।
যেমন, যদি আপনি তালিকার প্রতিটি আইটেমের পরে একটি পিরিয়ড (পূর্ণ বিরতি) ব্যবহার করেন, তবে পৃষ্ঠার সমস্ত অন্যান্য তালিকার পরে একটি পিরিয়ড ব্যবহার করুন।

আপনি যদি একটি নির্দিষ্ট রীতির বিষয়ে নিশ্চিত না হন তবে অন্যান্য পৃষ্ঠাগুলি পরীক্ষা করুন।

উদাহরণ:

- Kubeflow ডকসের বেশিরভাগ পৃষ্ঠায় প্রতিটি তালিকা আইটেমের শেষে একটি পিরিয়ড রয়েছে।
- পৃষ্ঠার উপশিরোনামের শেষে একটি পিরিয়ড নেই এবং উপশিরোনামটি একটি সম্পূর্ণ বাক্য হতে হবে না।
  (উপশিরোনামটি প্রতিটি পৃষ্ঠার সামনের বিষয়ে `বর্ণনা` থেকে আসে।)

## ক্রিয়ামূলক কণ্ঠস্বর ব্যবহার করুন প্যাসিভ ভয়েসের পরিবর্তে

প্যাসিভ ভয়েস প্রায়ই বিভ্রান্তিকর, কারণ এটি স্পষ্ট নয় যে ক্রিয়াটি কে সম্পাদন করা উচিত।

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Use active voice</th>
        <th>Instead of passive voice</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>You can configure Kubeflow to</td>
        <td>Kubeflow can be configured to</td>
      </tr>
      <tr>
        <td>Add the directory to your path</td>
        <td>The directory should be added to your path</td>
      </tr>
    </tbody>
  </table>
</div>

## সহজ বর্তমান কাল ব্যবহার করুন

ভবিষ্যৎ কাল ("হবে") এবং জটিল সিনট্যাক্স যেমন সংযোজক মুড ("হতো", "চাই") এড়িয়ে চলুন।

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Use simple present tense</th>
        <th>Instead of future tense or complex syntax</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>The following command provisions a virtual machine</td>
        <td>The following command will provision a virtual machine</td>
      </tr>
      <tr>
        <td>If you add this configuration element, the system is open to
          the Internet</td>
        <td>If you added this configuration element, the system would be open to
          the Internet</td>
      </tr>
    </tbody>
  </table>
</div>

**ব্যতিক্রম:** সঠিক অর্থ প্রকাশ করতে হলে ভবিষ্যৎ কাল ব্যবহার করুন। এই প্রয়োজনীয়তা বিরল।

## সরাসরি দর্শকদের ঠিকানা

একটি বাক্যে "আমরা" ব্যবহার করা বিভ্রান্তিকর হতে পারে, কারণ পাঠক হয়তো জানেন না যে তারা আপনার বর্ণনা করা "আমরা" এর অংশ কিনা।

যেমন, নিম্নলিখিত দুটি বিবৃতির তুলনা করুন:

- "এই রিলিজে আমরা অনেক নতুন বৈশিষ্ট্য যোগ করেছি।"
- "এই টিউটোরিয়ালে আমরা একটি উড়ন্ত সসার তৈরি করি।"

"ডেভেলপার" বা "ব্যবহারকারী" শব্দগুলি অস্পষ্ট হতে পারে।
যেমন, যদি পাঠক একটি পণ্য তৈরি করে যা ব্যবহারকারীদেরও রয়েছে,
তাহলে পাঠক জানেন না যে আপনি পাঠক বা তাদের পণ্যের ব্যবহারকারীদের উল্লেখ করছেন কিনা।

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Address the reader directly</th>
        <th>Instead of "we", "the user", or "the developer"</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Include the directory in your path</td>
        <td>The user must make sure that the directory is included in their path
        </td>
      </tr>
      <tr>
        <td>In this tutorial you build a flying saucer</td>
        <td>In this tutorial we build a flying saucer</td>
      </tr>
    </tbody>
  </table>
</div>

## সংক্ষিপ্ত, সহজ বাক্য ব্যবহার করুন

বাক্য সংক্ষিপ্ত রাখুন। সংক্ষিপ্ত বাক্যগুলি দীর্ঘ বাক্যের চেয়ে পড়তে সহজ।
সংক্ষিপ্ত বাক্য লেখার জন্য নীচে কিছু টিপস দেওয়া হল।

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th colspan="2">Use fewer words instead of many words that convey the same meaning</th>
      </tr>
      <tr>
        <th>Use this</th>
        <th>Instead of this</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>You can use</td>
        <td>It is also possible to use</td>
      </tr>
      <tr>
        <td>You can</td>
        <td>You are able to</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th colspan="2">Split a single long sentence into two or more shorter ones</th>
      </tr>
      <tr>
        <th>Use this</th>
        <th>Instead of this</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>You do not need a running GKE cluster. The deployment process
          creates a cluster for you</td>
        <td>You do not need a running GKE cluster, because the deployment 
          process creates a cluster for you</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th colspan="2">Use a list instead of a long sentence showing various options</th>
      </tr>
      <tr>
        <th>Use this</th>
        <th>Instead of this</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <p>To train a model:</p>
          <ol>
            <li>Package your program in a Kubernetes container.</li>
            <li>Upload the container to an online registry.</li>
            <li>Submit your training job.</li>
          </ol>
        </td>
        <td>To train a model, you must package your program in a Kubernetes 
          container, upload the container to an online registry, and submit your 
          training job.</td>
      </tr>
    </tbody>
  </table>
</div>

## অতিরিক্ত টেক্সট স্টাইলিং এড়িয়ে চলুন

UI নিয়ন্ত্রণ বা অন্যান্য UI উপাদানগুলির উল্লেখ করার সময় **বোল্ড টেক্সট** ব্যবহার করুন।

নিম্নলিখিতগুলির জন্য `কোড শৈলী` ব্যবহার করুন:

- ফাইলের নাম, ডিরেক্টরি এবং পথ
- ইনলাইন কোড এবং কমান্ড
- অবজেক্ট ক্ষেত্রের নাম

জোর দেওয়ার জন্য বোল্ড টেক্সট বা বড় অক্ষর ব্যবহার এড়িয়ে চলুন।
যদি একটি পৃষ্ঠায় খুব বেশি টেক্সট হাইলাইটিং থাকে তবে এটি বিভ্রান্তিকর এবং এমনকি বিরক্তিকর হয়ে ওঠে।

## প্লেসহোল্ডার জন্য কোণার ব্র্যাকেট ব্যবহার করুন

যেমন:

- `export KUBEFLOW_USERNAME=<your username>`
- `--email <your email address>`

## আপনার চিত্রগুলি শৈলী

Kubeflow ডকস Bootstrap ক্লাসগুলি চিত্র এবং অন্যান্য সামগ্রীর শৈলী করতে স্বীকৃতি দেয়।

নিচের কোড স্নিপেটটি একটি চিত্রকে পৃষ্ঠায় সুন্দরভাবে প্রদর্শিত করতে সাধারণত ব্যবহৃত শৈলী দেখায়:

```html
<!-- for wide images -->
<img src="/docs/images/my-image.png" alt="My image" class="mt-3 mb-3 border rounded" />

<!-- for tall images -->
<img
  src="/docs/images/my-image.png"
  alt="My image"
  class="mt-3 mb-3 border rounded"
  style="width: 100%; max-width: 30em" />
```

শৈলীযুক্ত চিত্রের কিছু উদাহরণ দেখতে, [OAuth সেটআপ পৃষ্ঠা](https://googlecloudplatform.github.io/kubeflow-gke-docs/docs/deploy/oauth-setup/) দেখুন।

আরও সহায়তার জন্য, [বুটস্ট্র্যাপ ইমেজ স্টাইলিং](https://getbootstrap.com/docs/4.6/content/images/) এবং বুটস্ট্র্যাপ ইউটিলিটিগুলির মতো [সীমান্ত](https://getbootstrap.com/docs/4.6/utilities/borders/) এর গাইড দেখুন।

## একটি বিস্তারিত শৈলী গাইড

[গুগল ডেভেলপার ডকুমেন্টেশন স্টাইল গাইড](https://developers.google.com/style/) একটি ডেভেলপার দর্শকের জন্য পরিষ্কার, পাঠযোগ্য, সংক্ষিপ্ত ডকুমেন্টেশন লেখার নির্দিষ্ট দিকগুলির বিষয়ে বিস্তারিত তথ্য ধারণ করে।

## পরবর্তী পদক্ষেপ

- Kubeflow ডকসের অবদান রাখার জন্য নির্দেশিকা জন্য [ডকুমেন্টেশন README](https://github.com/kubeflow/website/blob/master/README.md) দেখুন।
