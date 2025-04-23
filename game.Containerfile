FROM docker.io/library/node:22.15.0-bookworm@sha256:473b4362b26d05e157f8470a1f0686cab6a62d1bd2e59774079ddf6fecd8e37e

LABEL "org.opencontainers.image.description"="Kittens Game with Kitten Science DNA"

ARG REPO=https://github.com/nuclear-unicorn/kittensgame.git
ARG BRANCH=master

EXPOSE 8080

RUN git clone --branch "$BRANCH" --single-branch "$REPO" \
  && cd kittensgame \
  && yarn add -D @oliversalzburg/js-utils cheerio watch-http-server

COPY "headless.html" "/kittensgame/headless.html"
COPY "overlay/" "/kittensgame/overlay/"
COPY "overlay/devcontainer/*" "/kittensgame/mod/"

WORKDIR /kittensgame
RUN [ "node", "./mod/rewrite-index.mjs" ]
RUN [ "node", "./mod/inject-scripts.mjs", "overlay/kitten-scientists.inject.js", "overlay/kitten-analysts.inject.js" ]

# Start the development server that serves the Kittens Game.
CMD [ "/bin/bash", "-c", "yarn run watch-http-server" ]
