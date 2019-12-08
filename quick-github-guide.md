# Quick guide to working with a GitHub repo

This page is intended for people who want to update the
[Kubeflow docs](https://www.kubeflow.org/docs/) and
who don't use git or GitHub often. The page gives you a quick guide to
get going with a GitHub repo, using either the GitHub web user interface (UI)
or git on the command line.

## Using the GitHub web UI

**Note:** The GitHub web UI is suitable for quick updates to a single file. If
your update is more complex or you need to update more than one file within one
pull request (PR), then the command line provides a better experience.

Follow these steps to edit a page using the GitHub UI:

1. Sign in to GitHub if you haven't yet done so.

1. Go to the page that you want to edit on the
  [Kubeflow website](https://www.kubeflow.org/docs/).

1. Click **Edit this page**.

1. If this is the first time you're updating a file in the Kubeflow
  website repository, a screen opens asking you to *fork* the repository. A
  fork is a copy of the repository where you can make your updates before
  submitting them for review. You only have to do this once:

    * Click **Fork this repository**.
    * If GitHub asks you **Where should we fork website** and offers your
      username as an option, click the link on your username.	
    * Wait a few seconds while GitHub makes a copy of the repository at	
     `https://github.com/yourusername/website`. This copy is your *fork*	
     of the `kubeflow/website` repository.

1. The GitHub editor interface opens for the selected page.
  Make your updates to the content.

1. Click **Preview changes** at the top of the editing area to see the effect of your changes.

1. If you need to make more changes, click **Edit file** at the top of the preview area.

1. When you are ready to submit your changes, scroll down to the 
  **Propose file change**
   section at the bottom of the editing area.

      * Enter a short description of your update. This short description becomes the 
        title of your pull request (PR).

      * In the second text box (for the extended description), enter a more detailed
        description.

1. Click **Propose file change**. A new screen appears, offering you the 
  opportunity to open a pull request.

1. Click **Create pull request**. 

1. Optionally, edit the pull request title and description.

1. Make sure **Allow edits from maintainers** remains checked.

1. Click **Create pull request** again. You have now sent a request to the repository
  maintainers to review your change.

1. Check the online preview of your changes:

      * Wait for the automated PR workflow to do some checks. When it's ready,
        you should see a comment like this: **deploy/netlify — Deploy preview ready!**
      * Click **Details** to the right of "Deploy preview ready" to see a preview
        of your updates.

## Using the command line

Here's a quick guide to a fairly standard GitHub workflow using git on the command line:

1. Fork the kubeflow/website repo:

    * Go to the [kubeflow/website repo](https://github.com/kubeflow/website) on GitHub.
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

## More information

For further information about the GitHub workflow, refer to the
[GitHub guide to pull requests](https://help.github.com/en/articles/creating-a-pull-request).