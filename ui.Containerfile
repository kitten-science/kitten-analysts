FROM docker.io/library/node:24.14.1-bookworm@sha256:bb20cf73b3ad7212834ec48e2174cdcb5775f6550510a5336b842ae32741ce6c

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
