FROM docker.io/library/node:22.17.1-bookworm@sha256:ec09419096c9cb8ff4c6fcf9c7b63332bbecab56d4cb6dcc83d98c180a7cdddf

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
