FROM docker.io/library/node:22.14.0-bookworm@sha256:4a126f3116c37fbd8583209f13518efa9e9f6efc6bf18917141c6e6d4068fea1

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
