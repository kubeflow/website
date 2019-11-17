# Creating and updating the Kubeflow docs

Welcome to the GitHub repository for Kubeflow's public website. The docs are
hosted at https://www.kubeflow.org.

We use [Hugo](https://gohugo.io/) to format and generate our website, the
[Docsy](https://github.com/google/docsy) theme for styling and site structure, 
and [Netlify](https://www.netlify.com/) to manage the deployment of the site. 
Hugo is an open-source static site generator that provides us with templates, 
content organization in a standard directory structure, and a website generation 
engine. You write the pages in Markdown, and Hugo wraps them up into a website.

## Quickstart

Here's a quick guide to updating the docs. It assumes you're familiar with the
GitHub workflow and you're happy to use the automated preview of your doc
updates:

1. Fork the [kubeflow/website repo][kubeflow-website-repo] on GitHub.
1. Make your changes and send a pull request (PR).
1. If you're not yet ready for a review, add "WIP" to the PR name to indicate 
  it's a work in progress. Alternatively, you can also add `/hold` in a comment
  to mark the PR as not ready for merge. (**Don't** add the Hugo property 
  "draft = true" to the page front matter, because that prevents the 
  auto-deployment of the content preview described in the next point.) See the 
  [Prow guide](https://prow.k8s.io/command-help) for help with the commands that
  you can use in a PR comment.
1. Wait for the automated PR workflow to do some checks. When it's ready,
  you should see a comment like this: **deploy/netlify — Deploy preview ready!**
1. Click **Details** to the right of "Deploy preview ready" to see a preview
  of your updates.
1. Continue updating your doc and pushing your changes until you're happy with 
  the content.
1. When you're ready for a review, add a comment to the PR, remove any holds or
  "WIP" markers, and assign a reviewer/approver. See the
  [Kubeflow contributor guide][kubeflow-contributor-guide].

If you need help with the GitHub workflow, take a look at the quick guide near
the bottom of this page.

## Previewing your changes on a local website server

If you'd like to preview your doc updates as you work, you can install Hugo
and run a local server to host your website. This section shows you how.

### Install Hugo and other dependencies

The Kubeflow website uses the Docsy theme, which recommends that you have 
**Hugo version 0.53 or later**, and it must be the **extended** version of Hugo.

To get the extended version of Hugo:

1.  Go to the [Hugo releases](https://github.com/gohugoio/hugo/releases).
1.  In the most recent release, scroll down until you find a list of
    **extended** versions.
1. Download the relevant file for your operating system.
1. Unzip the downloaded file into a location of your choice.

For example, to install Hugo on Linux:

1.  Download
    [hugo_extended_0.53_Linux-64bit.tar.gz](https://github.com/gohugoio/hugo/releases/download/v0.53/hugo_extended_0.53_Linux-64bit.tar.gz)
    (or the latest version).

1.  Create a new directory:

        mkdir $HOME/hugo

1.  Extract the file you downloaded to `$HOME/hugo`.

        tar -zxvf hugo_extended_0.53_Linux-64bit.tar.gz

For more details about installing Hugo, See the 
[Hugo installation guide](https://gohugo.io/getting-started/installing/). 

If you plan to make changes to the site styling, you need to install some 
**CSS libraries** as well. Follow the instructions in the 
[Docsy theme's setup guide](https://www.docsy.dev/docs/getting-started/#install-postcss).

### Fork and clone the website repo and run a local website server

Follow the usual GitHub workflow to fork the repo on GitHub and clone it to your
local machine, then use your local repo as input to your Hugo web server:

1. **Fork** the [kubeflow/website repo][kubeflow-website-repo] in the GitHub UI.
1. Clone your fork locally. This example uses SSH cloning:

    ```
    mkdir kubeflow
    cd kubeflow/
    git clone git@github.com:<your-github-username>/website.git
    cd website/
    ```

1. Start your website server. Make sure you run this command from the
   `/website/` directory, so that Hugo can find the config files it needs:

    ```
    hugo server -D
    ```

1. You can access your website at 
  [http://localhost:1313/](http://localhost:1313/).

1. Continue with the usual GitHub workflow to edit files, commit them, push the
  changes up to your fork, and create a pull request. (There's some help with
  the GitHub workflow near the bottom of this page.)

1. While making the changes, you can preview them on your local version of the
  website at [http://localhost:1313/](http://localhost:1313/). Note that if you
  have more than one local git branch, when you switch between git branches the
  local website reflects the files in the current branch.

Useful docs:
- [User guide for the Docsy theme](https://www.docsy.dev/docs/getting-started/)
- [Hugo installation guide](https://gohugo.io/getting-started/installing/)
- [Hugo basic usage](https://gohugo.io/getting-started/usage/)
- [Hugo site directory structure](https://gohugo.io/getting-started/directory-structure/)
- [hugo server reference](https://gohugo.io/commands/hugo_server/)

## Menu structure

The site theme has one Hugo menu (`main`), which defines the top navigation bar. 
You can find and adjust the definition of the menu in the [site configuration 
file](https://github.com/kubeflow/website/blob/master/config.toml). 

The left-hand navigation panel is defined by the directory structure under 
the 
[`docs` directory](https://github.com/kubeflow/website/tree/master/content/docs). 

A `weight` property in the _front matter_ of each page determines the position 
of the page relative to the others in the same directory. The lower the weight,
the earlier the page appears in the section. A weight of 1 appears before a
a weight of 2, and so on. For example, see the front matter of the
[Getting Started with Kubeflow](https://raw.githubusercontent.com/kubeflow/website/master/content/docs/started/getting-started.md)
page. The page front matter looks like this:

```
+++
title = "Getting Started with Kubeflow"
description = "Overview"
weight = 1
+++
```

## Working with the theme

The theme files are in the 
[`themes/docsy` directory](https://github.com/kubeflow/website/tree/master/themes/docsy).
**Do not change these files**, because they are overwritten each time we update
the website to a  later version of the theme, and your changes will be lost.

## Documentation style guide

For guidance on writing effective documentation, see the [style guide for the
Kubeflow docs](https://kubeflow.org/docs/about/style-guide/).

## Styling your content

The theme holds its styles in the 
[`assets/scss` directory](https://github.com/kubeflow/website/tree/master/themes/docsy/assets/scss).
**Do not change these files**, because they are overwritten each time we update
the website to a  later version of the theme, and your changes will be lost.

You can override the default styles and add new ones:

* In general, put your files in the project directory structure under `website` 
  rather than in the theme directory. Use the same file name as the theme does,
  and put the file in the same relative position. Hugo looks first at the file 
  in the main project directories, if present, then at the files under the theme 
  directory. For example, the Kubeflow website's 
  [`layouts/partials/navbar.html`](https://github.com/kubeflow/website/blob/master/layouts/partials/navbar.html)
  overrides the theme's 
  [`layouts/partials/navbar.html`](https://github.com/kubeflow/website/blob/master/themes/docsy/layouts/partials/navbar.html).
* You can update the Kubeflow website's project variables in the 
  [`_variables_project.scss` file](https://github.com/kubeflow/website/blob/master/assets/scss/_variables_project.scss).
  Values in that file override the
  [Docsy variables](https://github.com/kubeflow/website/blob/master/themes/docsy/assets/scss/_variables.scss).
  You can also use `_variables_project.scss` to specify your own values for any 
  of the default 
  [Bootstrap 4 variables](https://getbootstrap.com/docs/4.0/getting-started/theming/).


Styling of images:

* To see some examples of styled images, take a look at the
  [OAuth setup page](https://www.kubeflow.org/docs/gke/deploy/oauth-setup/) 
  in the Kubeflow docs. Search for `.png` in the
  [page source](https://raw.githubusercontent.com/kubeflow/website/master/content/docs/gke/deploy/oauth-setup.md).
* For more help, see the guide to
  [Bootstrap image styling](https://getbootstrap.com/docs/4.0/content/images/).
* Also see the Bootstrap utilities, such as 
  [borders](https://getbootstrap.com/docs/4.0/utilities/borders/).

The site's [front page](https://www.kubeflow.org/):

* See the [page source](https://github.com/kubeflow/website/blob/master/content/_index.html).
* The CSS styles are in the 
  [project variables file](https://github.com/kubeflow/website/blob/master/assets/scss/_variables_project.scss).
* The page uses the 
  [cover block](https://www.docsy.dev/docs/adding-content/shortcodes/#blocks-cover) 
  defined by the theme.
* The page also uses the 
  [linkdown block](https://www.docsy.dev/docs/adding-content/shortcodes/#blocks-link-down).

## Using Hugo shortcodes

Sometimes it's useful to define a snippet of information in one place and reuse
it wherever we need it. For example, we want to be able to refer to the minimum
version of various frameworks/libraries throughout the docs, without
causing a maintenance nightmare.

For this purpose, we use Hugo's "shortcodes". Shortcodes are similar to Django
variables. You define a shortcode in a file, then use a specific markup to
invoke the shortcode in the docs. That markup is replaced by the content of the
shortcode file when the page is built.

To create a shortcode:

1. Add an HTML file in  the `/website/layouts/shortcodes/` directory.
   The file name must be short and meaningful, as it determines the shortcode
   you and others use in the docs.

1. For the file content, add the text and HTML markup that should replace the
   shortcode markup when the web page is built.

To use a shortcode in a document, wrap the name of the shortcode in braces and
percent signs like this:

  ```
  {{% shortcode-name %}}
  ```

The shortcode name is the file name minus the `.html` file extension.

**Example:** The following shortcode defines the minimum required version of
Kubernetes:

- File name of the shortcode:

  ```
  kubernetes-min-version.html
  ```

- Content of the shortcode:

  ```
  1.8
  ```
- Usage in a document:

  ```
  You need Kubernetes version {{% kubernetes-min-version %}} or later.
  ```

Useful Hugo docs:
- [Shortcode templates][hugo-shortcode-templates]
- [Shortcodes][hugo-shortcodes]

## Versioning of the docs

For each stable release, we create a new branch for the relevant documentation. For
example, the documentation for the v0.2 stable release is maintained in the
[v0.2-branch](https://github.com/kubeflow/website/tree/v0.2-branch).
Each branch has a corresponding Netlify website that automatically syncs each merged PR.

The versioned sites follow this convention:
* `www.kubeflow.org` always points to the current *master branch*
* `master.kubeflow.org` always points to GitHub head
* `vXXX-YYY.kubeflow.org` points to the release at vXXX.YYY-branch

We also hook up each version to the dropdown on the website menu bar. For 
information on how to update the website to a new version, see the [Kubeflow
release guide](https://github.com/kubeflow/kubeflow/blob/master/docs_dev/releasing.md#releasing-a-new-version-of-the-website).

Whenever any documents reference any source code, you should use the version
shortcode in the links, like so:

```
https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deploy.sh
```
This ensures that all the links in a versioned webpage point to the correct branch.

## Quick guide to working with a GitHub repo

Here's a quick guide to a fairly standard GitHub workflow. This section is handy
for people who don't use git or GitHub often, and just need a quick guide to
get going:

1. Fork the kubeflow/website repo:

    * Go to the [kubeflow/website repo][kubeflow-website-repo] on GitHub.
    * Click **Fork** to make your own copy of the repo. GitHub creates a copy
      at `https://github.com/<your-github-username>/website`.

1. Open a command window on your local machine.

1. Clone your forked repo, to copy the files down to your local machine.
  This example creates a directory called `kubeflow` and uses SSH cloning to
  download the files:

    ```
    mkdir kubeflow
    cd kubeflow/
    git clone git@github.com:<your-github-username>/website.git
    cd website/
    ```

1. Add the upstream repo as a git remote repo:

    ```
    git remote add upstream https://github.com/kubeflow/website.git
    ```

1. Check your remotes:

    ```
    git remote -vv
    ```

    You should have 2 remote repos:

      -  `origin` - points to your own fork of the repo on gitHub -
         that is, the one you cloned my local repo from.
      -  `upstream` - points to the actual repo on gitHub.

1. Create a branch. In this example, replace `doc-updates` with any branch name
  you like. Choose a branch name that helps you recognise the updates you plan
  to make in that branch:

    ```
    git checkout -b doc-updates
    ```

1. Add and edit the files as you like. The doc pages are in the
  `/website/content/docs/` directory.

1. Run `git status` at any time, to check the status of your local files.
  Git tells you which files need adding or committing to your local repo.

1. Commit your updated files to your local git repo. Example commit:

    ```
    git commit -a -m "Fixed some doc errors."
    ```

    Or:

    ```
    git add add-this-doc.md
    git commit -a -m "Added a shiny new doc."
    ```

1. Push from your branch (for example, `doc-updates`) to **the relevant branch
  on your fork on GitHub:**

    ```
    git checkout doc-updates
    git push origin doc-updates
    ```

1. When you're ready to start the review process, create a pull request (PR)
  **in the branch** on **your fork** on the GitHub UI, based on the above push.
  The PR is auto-sent to the upstream repo - that is, the one you forked from.

1. If you need to make changes to the files in your PR, continue making them
  locally in the same branch, then push them again in the same way. GitHub
  automatically sends them through to the same PR on the upstream repo!

1. **Hint:** If you're authenticating to GitHub via SSH, use `ssh-add` to add
  your SSH key passphrase to the managing agent, so that you don't have to
  keep authenticating to GitHub. You need to do this again after every reboot.


[hugo-shortcode-templates]: https://gohugo.io/templates/shortcode-templates/
[hugo-shortcodes]: https://gohugo.io/content-management/shortcodes/

[kubeflow-contributor-guide]: https://github.com/kubeflow/community/blob/master/CONTRIBUTING.md
[kubeflow-website-repo]: https://github.com/kubeflow/website
