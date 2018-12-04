#!/bin/sh

##### VARIABLES #####
build_context="develop/"          # arg $1 [PATH | URL | -]


##### FUNCTIONS #####
_help() {
cat << HELP

usage: docker_build.sh  [-h] [-b BUILD_OPTS] [-f FILE]
                        [-t TAG] [PATH | URL | -]

Build dev Docker image.

optional arguments:
-h                      Print this help page
-b BUILD_OPTS           Add 'docker build' options
                          Default: None
-f FILE	                Path to Dockerfile
                          Default: develop/Dockerfile
-t TAG	                Set tag name of image to build
                          Default: kf-web

example usage:
Run Help
  ./develop/docker_build.sh -h

Build Docker image with defaults
  ./develop/docker_build.sh

Build Docker image with a different file and build context
  ./develop/docker_build.sh -f path/to/Dockerfile .

Build Docker image with new tag and build_opts
  ./develop/docker_build.sh -t usr/repo:kf-dev -b "--no-cache"

HELP
}


##### FLAGS #####
build_opts=                       # flag -b
file_path="develop/Dockerfile"    # flag -f
tag="kf-web"                      # flag -t


##### MAIN #####
while getopts ":hb:f:t:" flag; do
  case "${flag}" in
    h) 
      _help
      exit 0
      ;;
    b) 
      build_opts="${OPTARG} ${build_opts}"
      ;;
    f) 
      file_path="${OPTARG}"
      ;;
    t) 
      tag="${OPTARG}"
      ;;
    *) 
      echo "ERROR: Invalid flag ${flag} - Arg ${OPTARG}"
      _help
      exit 1
      ;;
  esac
done
shift `expr $OPTIND - 1`

[ ! -z "$1" ] && build_context=$1

cat << ECHO
---------------------------------------
Beginning Docker Build
Dockerfile: ${file_path}
Context:    ${build_context}
Tag:        ${tag}
Build-opts: ${build_opts}
---------------------------------------
ECHO

docker build ${build_opts} -f ${file_path} -t ${tag} ${build_context}
