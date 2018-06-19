### This site utilizes the Bourbon SASS framework within a Gulp workflow.

** Note that the preferred SASS syntax is indented .sass for reasons of concise simplicity.

* [Bourbon](https://bourbon.io)
* [Neat](https://neat.bourbon.io)
* [Bitters](https://bitters.bourbon.io)
* [Gulp](https://gulpjs.com/)

After cloning the repo, run `npm install` to setup node module dependencies from the 
directory containing this README file.

To create local-environment **.htaccess** and **robots.txt** files: 
Save copies of */\_local/ENV.htaccess* and */\_local/ENV.robots.txt* to the root of the */public/* directory

All work is done in the */src/* directory. 
Run `gulp` to process and copy files into the **../static/** directory, as defined in **/gulpfile.js**
