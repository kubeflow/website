#!/bin/bash

HUGO_FLAVOUR="hugo_extended"
HUGO_VERSION="0.51"

[ -z "${NF_IMAGE_VERSION}" ] && exit 0

rm -fr *.deb 
wget --no-clobber http://security.ubuntu.com/ubuntu/pool/main/g/gcc-5/libstdc++6_5.4.0-6ubuntu1~16.04.10_amd64.deb || exit 1
wget --no-clobber https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_FLAVOUR}_${HUGO_VERSION}_Linux-64bit.deb || exit 1
grep "hugo=" ~/.bashrc || echo "alias hugo='LD_LIBRARY_PATH=$(pwd)/tmp/usr/lib/x86_64-linux-gnu $(pwd)/tmp/usr/local/bin/hugo'" >> ~/.bashrc 
find -name '*.deb' -exec dpkg -x {} $(pwd)/tmp \;
rm -fr *.deb

exit 0