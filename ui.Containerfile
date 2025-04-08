FROM docker.io/library/node:22.14.0-bookworm@sha256:89b86535844dc9a7a2540b1cd3b3b1b84315fbc89369dc6d8f09591ca939562e

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
