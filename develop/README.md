# Kubeflow/Website Dev Tools

This directory contains a Dockerfile and convenience scripts which can be used to preview changes on a local website server during development.

Requirements:

* [Git][git-install-docs] to clone project repository
* [Docker][docker-install-docs] to build and run Docker image

## How to use

1. [Fork][github-fork-docs] the [kubeflow/website repo][kubeflow-website-repo]

1. Clone your fork locally. This example uses SSH cloning:
    ```bash
    mkdir kubeflow
    cd kubeflow/
    git clone git@github.com:<your-github-username>/website.git
    cd website/
    ```

1. Build the development Docker image

    ```bash
    ./develop/docker_build.sh
    ```

1. Running the Docker image will start the [hugo server][hugo-server-docs] by default

    ```bash
    ./develop/docker_run.sh
    ```

* The website will be served at [http://localhost:1313/][localhost-1313].

### Updating theme style

* You will have to install the `themes/kf/sass/package.json` npm dependencies to make changes to the website style (this only has to be done one time).

    ```bash
    ./develop/docker_npm_install.sh
    ```

* Run `gulp` after making style changes

    ```bash
    ./develop/docker_gulp.sh
    ```


[docker-install-docs]: https://docs.docker.com/install
[git-install-docs]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[github-fork-docs]: https://help.github.com/articles/fork-a-repo
[hugo-server-docs]: https://gohugo.io/commands/hugo_server/
[localhost-1313]: http://localhost:1313
[kubeflow-website-repo]: https://github.com/kubeflow/website