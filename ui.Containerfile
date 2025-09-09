FROM docker.io/library/node:22.19.0-bookworm@sha256:978e96850e9e828eda68610829a01f70317e353dcd3d146f2fff93880f13dcb4

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
