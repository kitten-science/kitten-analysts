FROM docker.io/library/node:22.17.0-bookworm@sha256:0c0734eb7051babbb3e95cd74e684f940552b31472152edf0bb23e54ab44a0d7

LABEL "org.opencontainers.image.description"="Kittens Game with Kitten Science DNA"

ARG REPO=https://github.com/nuclear-unicorn/kittensgame.git
ARG BRANCH=master

EXPOSE 8080

RUN git clone --branch "$BRANCH" --single-branch "$REPO" \
  && cd kittensgame \
  && yarn add -D @oliversalzburg/js-utils cheerio watch-http-server

WORKDIR /kittensgame
COPY "devcontainer/headless.html" "./headless.html"
COPY "devcontainer/overlay/*" "./overlay/"
COPY "output/devcontainer/*" "./mod/"
RUN [ "node", "./mod/rewrite-index.mjs" ]
RUN [ "node", "./mod/inject-scripts.mjs", "overlay/kitten-scientists.inject.js", "overlay/kitten-analysts.inject.js" ]

# Start the development server that serves the Kittens Game.
CMD [ "/bin/bash", "-c", "yarn run watch-http-server -p 8080" ]
