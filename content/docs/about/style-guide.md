
+++
title =  "Style Guide for the Kubeflow Docs"
description = "Guidelines on effective writing"
weight = 6
+++

This style guide is for the
[Kubeflow documentation](https://www.kubeflow.org/docs/).
The style guide helps contributors to write documentation that
readers can understand quickly and correctly. The Kubeflow docs aim for:

* Consistency in style and terminology, so that readers can expect certain
  structures and conventions. Readers don't have to keep re-learning how to use
  the documentation or questioning whether they've understood something
  correctly.

* Clear, concise writing so that readers can quickly find and understand the
  information they need.

## Use standard American spelling

Use American spelling rather than Commonwealth or British spelling.
Refer to [Merriam-Webster's Collegiate Dictionary, Eleventh
Edition](http://www.merriam-webster.com/).

## Use capital letters sparingly

Some hints:

* Capitalize only the first letter of each heading within the page. (That is,
  use sentence case.)
* Capitalize (almost) every word in page titles. (That is, use title case.) The
  little words like "and", "in", etc, don't get a capital letter.
* In page content, use capitals only for brand names, like Kubeflow, Kubernetes,
  and so on. See more about brand names [below](#brand-names).
* Don't use capital letters to emphasize words.

## Spell out abbreviations and acronyms on first use

Always spell out the full term for every abbreviation or acronym the first time
you use it on the page. Don't assume people know what an abbreviation or acronym
means, even if it seems like common knowledge.

Example: "To run Kubernetes locally in a virtual machine (VM)"

## Use contractions if you want to

For example, it's fine to write "it's" instead of "it is".

<a id="brand-names"></a>
## Use full, correct brand names

When referring to a product or brand, use the full name. Capitalize the
name as the product owners do in the product documentation. Do
not use abbreviations even if they're in common use, unless the product owner
has sanctioned the abbreviation.

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

## Be consistent with punctuation

Use punctuation consistently within a page. For example, if you use a period
(full stop) after every item in list, then use a period on all other lists on
the page.

Check the other pages if you're unsure about a particular convention.
Examples:

* Most pages in the Kubeflow docs use a period at the end of every list item.
* There is no period at the end of the page subtitle and the subtitle need not
  be a full sentence. (The subtitle comes from the `description` in the front
  matter of each page.)

## Use active voice rather than passive voice

Passive voice is often confusing, as it's not clear who should perform the
action.

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

## Use simple present tense

Avoid future tense ("will") and complex syntax such as conjunctive mood
("would", "should").

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

**Exception:** Use future tense if it's necessary to convey the correct
meaning. This requirement is rare.

## Address the audience directly

Using "we" in a sentence can be confusing, because the reader may not know
whether they're part of the "we" you're describing. For example, compare the
following two statements:

* "In this release we've added many new features."
* "In this tutorial we build a flying saucer."

The words "the developer" or "the user" can be ambiguous. For example, if the
reader is building a product that also has users, then the reader does not
know whether you're referring to the reader or the users of their product.

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

## Use short, simple sentences

Keep sentences short. Short sentences are easier to read than long ones.
Below are some tips for writing short sentences.

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

## Avoid too much text styling

Use **bold text** when referring to UI controls or other UI elements.

Use `code style` for:

-  filenames, directories, and paths
-  inline code and commands
-  object field names

Avoid using bold text or capital letters for emphasis. If a page has too much
textual highlighting it becomes confusing and even annoying.

## Use angle brackets for placeholders

For example:

-  `export KUBEFLOW_USERNAME=<your username>`
-  `--email <your email address>`

## Style your images

The Kubeflow docs recognise Bootstrap classes to style images and other content.
The following code snippet shows the typical styling that makes an
image show up nicely on the page:

```
<img src="/docs/images/about/my-image.png"
  alt="My image"
  class="mt-3 mb-3 p-3 border border-info rounded">
```

To see some examples of styled images, take a look at the
[OAuth setup page](/docs/gke/deploy/oauth-setup/).
To see the markup, search for `.png` in the [page
source](https://raw.githubusercontent.com/kubeflow/website/master/content/docs/gke/deploy/oauth-setup.md).

For more help, see the guide to
[Bootstrap image styling](https://getbootstrap.com/docs/4.0/content/images/)
and the Bootstrap utilities, such as
[borders](https://getbootstrap.com/docs/4.0/utilities/borders/).

## A detailed style guide

The [Google Developer Documentation Style
Guide](https://developers.google.com/style/)
contains detailed information about specific aspects of writing clear, readable,
succinct documentation for a developer audience.

## Next steps

Take a look at the [documentation
README](https://github.com/kubeflow/website/blob/master/README.md) for
guidance on contributing to the Kubeflow docs.
