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
# Note the npm install step is needed only the first time.
npm install
gulp
```

Note that if you didn't make any changes to style (most of the time you won't), you
don't need the above steps at all.
