FROM docker.io/library/node:22.19.0-bookworm@sha256:d6ba961be11a08d00369a01dec7566fc8f2dd895a8edd5b983915123f0e81c63

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
