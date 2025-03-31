FROM docker.io/library/node:22.14.0-bookworm@sha256:c7fd844945a76eeaa83cb372e4d289b4a30b478a1c80e16c685b62c54156285b

LABEL "org.opencontainers.image.description"="Kittens Game with Kitten Science DNA"

ARG REPO=https://github.com/nuclear-unicorn/kittensgame.git
ARG BRANCH=master

EXPOSE 8080

RUN git clone --branch "$BRANCH" --single-branch "$REPO" \
  && cd kittensgame \
  && yarn add -D watch-http-server

WORKDIR /kittensgame
COPY "headless.html" "headless.html"
COPY "overlay/" "overlay/"
COPY "overlay/devcontainer/*" "./mod/"
RUN [ "node", "mod/rewrite-index.mjs" ]
RUN [ "node", "mod/inject-scripts.mjs" ]

# Start the development server that serves the Kittens Game.
CMD [ "/bin/bash", "-c", "yarn run watch-http-server" ]
