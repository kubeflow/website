#!/bin/sh

##### FUNCTIONS #####
_help() {
cat << HELP

usage: docker_run.sh    [-h] [-k] [-f FILE] [-p PORT:PORT ...]
                        [-r RUN_OPTS] [-t TAG] [-u USER] [-w WORKDIR]
                        [-v VOLUME] [COMMAND] [ARG...]

Run commands inside dev Docker container.

optional arguments:
-h                      Print this help page
-k                      Don't automatically remove container on exit
-p PORT:PORT ...        Expose container ports
                            Default: 1313:1313
-r RUN_OPTS             Add 'docker run' options
                            Default: -it
-t TAG	                Set tag name of image to run
                            Default: kf-web
-u USER	                Set user
                            Default: \$(id -u):\$(id -g)
-w WORKDIR              Set workdir
                            Default: /workdir
-v VOLUME               Set volume
                            Default: \$(pwd):\${workdir}:rw

example usage:
Run Help
    ./develop/docker_run.sh -h

Run Docker image and keep container
    ./develop/docker_run.sh -k

Remove default port & run_opts, change work directory and run gulp
    ./develop/docker_run.sh  -p "" -r "" -w /workdir/themes/kf/sass gulp

Add 'docker run' options
    ./develop/docker_run.sh -r "--hostname 0.0.0.0 --memory-swap -1"

HELP
}


##### FLAGS #####
run_opts="-it"		                # flag -r
keep_opt="--rm"                     # flag -k (toggle keep container)
port_opt="-p 1313:1313"             # flag -p
tag="kf-web"                        # flag -t
user="$(id -u):$(id -g)"            # flag -u
workdir="/workdir"                  # flag -w
volume="$(pwd):${workdir}:rw"       # flag -v


##### MAIN #####
while getopts ":hkr:p:t:u:v:w:" flag; do
	case "${flag}" in
		h) 
			_help
			exit 0
			;;
		k)
			keep_opt=
			;;
		r) 
            if [ -z "${OPTARG}" ]; then
                run_opts=""
            else
                run_opts="${run_opts} ${OPTARG}"
            fi
			;;
		p) 
            if [ -z "${OPTARG}" ]; then
                port_opt=
            else
                port_opt="-p ${OPTARG}"
            fi
			;;
		t) 
			tag="${OPTARG}"
			;;
		u) 
			user=${OPTARG}
			;;
		v) 
			volume=${OPTARG}
			;;
		w) 
			workdir=${OPTARG}
			;;
		*) 
			echo "ERROR: Invalid flag ${flag} - Arg ${OPTARG}"
            _help
			exit 1
			;;
	esac
done
shift `expr $OPTIND - 1`

run_opts="${run_opts} ${keep_opt} ${port_opt}"

if [ ! "$(docker ps -q -f name=${tag})" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=${tag})" ]; then
        # cleanup
		docker container rm "${tag}"
    fi
    # run container
	docker run \
		${run_opts} \
		--name "${tag}" \
		-u "${user}" \
		-w "${workdir}" \
		-v "${volume}" \
		${tag} \
		"$@"
else
	# exec in running container
	docker exec ${run_opts} ${tag} bash -l "$@"
fi