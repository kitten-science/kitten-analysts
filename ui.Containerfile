FROM docker.io/library/node:22.20.0-bookworm@sha256:2bb201f33898d2c0ce638505b426f4dd038cc00e5b2b4cbba17b069f0fff1496

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
