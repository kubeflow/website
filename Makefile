.PHONY: setup serve build

setup:
	git submodule update --init --recursive
	npm install

serve:
	hugo server -D

build:
	hugo
