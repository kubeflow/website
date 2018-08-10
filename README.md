# Creating and updating the Kubeflow docs

Welcome to the GitHub repository for Kubeflow's public website. The docs are
hosted at https://www.kubeflow.org.

We use [Hugo](https://gohugo.io/) to format and generate our website. Hugo is
an open-source static site generator that provides us with templates, content
organisation in a standard directory structure, and a website generation engine.
You write the pages in Markdown, and Hugo wraps them up into a website.

## Install Hugo

See the [Hugo installation guide][hugo-install]. Here are some examples:

### Mac OS X:

```
brew install hugo
```

### Debian:

1. Download the latest Debian package from the [Hugo website][hugo-install].
  For example, `hugo_0.46_Linux-64bit.deb`.
1. Install the package using `dpkg`:

    ```
    sudo dpkg -i hugo_0.46_Linux-64bit.deb
    ```

1. Verify your installation:

    ```  
    hugo version
    ```

## Clone the website repo from GitHub and run a local website server

Follow the usual GitHub workflow to fork the repo on GitHub and clone it to your
local machine, then use your local repo as input to your Hugo web server:

1. **Fork** the repo in the GitHub UI.
1. Clone your fork. This example uses SSH cloning:

    ```
    mkdir kubeflow
    cd kubeflow/
    git clone git@github.com:<your-github-username>/website.git
    cd website/
    ```

1. Start your website server - make sure you run this command from the
   `/website/` directory, so that Hugo can find the config files it needs: 

    ``` 
    hugo server -D
    ```

1. Your website is at [http://localhost:1313/](http://localhost:1313/).
1. Continue with the usual GitHub workflow to edit files, commit them, push the
  changes up to your fork, and create a pull request. (See below.)
1. While making the changes, you can preview them on your local version of the
  website at [http://localhost:1313/](http://localhost:1313/).

Here's a quick guide to the GitHub workflow plus a bit of Hugo for 
creating/editing pages:

1. Add the upstream repo as remote:

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

1. Create a branch - replace `doc-updates` with any branch name you like: 

    ```
    git checkout -b doc-updates
    ```

1. Add and edit the files as you like. The doc pages are in the
  `/website/content/docs/` directory.
1. To add a page using Hugo, go to the `/website/` directory so that Hugo can
  find its config files, then use `hugo new` to add the page:

    ```
    cd /website/  
    hugo new <path/to/doc>/add-this-doc.md
    ```

    Example:

    ```
    hugo new content/docs/guides/add-this-doc.md
    ```

1. As you work, you can see your changes on your local website at
  [http://localhost:1313/](http://localhost:1313/). Note that if you have more
  than one local git branch, when you switch between git branches the local
  website reflects the pages as they are in your current branch.
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

## Links

-  Useful Hugo docs
   -  [Hugo quickstart](https://gohugo.io/getting-started/quick-start/)
      (not very relevant, because we already have a site)
   -  [Hugo installation guide][hugo-install]
   -  [Hugo basic usage](https://gohugo.io/getting-started/usage/)
   -  [Hugo site directory structure](https://gohugo.io/getting-started/directory-structure/)
   -  [hugo server](https://gohugo.io/commands/hugo_server/) reference
   -  [hugo new](https://gohugo.io/commands/hugo_new/) reference

-  [Kubeflow generic contributor guide](https://github.com/kubeflow/community/blob/master/CONTRIBUTING.md)

## Making changes to CSS

The css/sass style code is located in the `themes/kf/sass` directory.

### CSS Dev Setup
You need to install node.js. Download the binary for your platform 
[here](https://nodejs.org/en/download/). This will also install npm.


### Updating theme style

If you need to make changes to the style, you can update the theme's style using:

```
cd themes/kf/sass
# Note the npm install steps are needed only the first time.
npm install
npm install gulp-cli -g
gulp
```

Note that if you didn't make any changes to style (most of the time you won't), you
don't need the above steps at all.

[hugo-install]: https://gohugo.io/getting-started/installing/
