FROM node:lts-slim

ARG HUGO_VER=0.52
ARG HUGO_ARCH=64bit

ARG HUGO_URL=https://github.com/gohugoio/hugo/releases/download
ARG HUGO_DPKG=hugo_${HUGO_VER}_Linux-${HUGO_ARCH}.deb
ARG HUGO_DL=${HUGO_URL}/v${HUGO_VER}/${HUGO_DPKG}

RUN npm install -g gulp-cli

RUN cd /tmp \
    && wget --no-verbose ${HUGO_DL} \
    && dpkg -i ${HUGO_DPKG} \
    && rm *

EXPOSE 1313

CMD ["bash", "-c", "hugo server -D --bind=0.0.0.0"]