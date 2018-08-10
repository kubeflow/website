# website
Kubeflow's public website

## Development

### Getting started
macOS...sorry :-)

`brew install hugo`

`hugo serve -D`

### New content
`hugo new blog/another-blog-post.md`

`hugo new doc/add-this-doc.md`

### Making changes to CSS

The css/sass style code is located in the `themes/kf/sass` directory.

#### CSS Dev Setup
You'd need to install node.js. Download the binary for your platform 
[here](https://nodejs.org/en/download/). This will also install npm.


#### Updating theme style

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

## Versioning

For each stable release, we should create a new branch for the relevant documentation. For
example, the documentation for the v0.2 stable release are maintained in the
[v0.2-branch](https://github.com/kubeflow/website/tree/v0.2-branch).
Each branch has a corresponding netlify website that automatically syncs each merged PR.

Going forward, the versioned sites should follow this convention:
* `www.kubeflow.org` always points to the latest *stable* release
* `master.kubeflow.org` always points to Github head
* `vXXX-YYY.kubeflow.org` points to the release at vXXX.YYY-branch

Furthermore, whenever any documents reference any source code, the links should be created
using the version shortcode, like so:
```
https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deploy.sh
```
This ensures that all the links in a versioned webpage point to the correct branch.
