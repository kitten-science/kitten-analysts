FROM docker.io/library/node:24.13.0-bookworm@sha256:bdc72529eb387cb3a2c0ef0c7c45192ef29600db5a3d62f0d6e62d59752df718

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
