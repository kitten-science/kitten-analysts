FROM docker.io/library/node:26.12.0-bookworm@sha256:bfb78a64f53d36c691f27dceecc9d4e73b3526411e1cee6fdf8d981d06fb2eb7

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
