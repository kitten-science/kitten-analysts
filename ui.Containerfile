FROM docker.io/library/node:22.14.0-bookworm@sha256:83355e9c59b3201495ef828a92feb8b16f57f50f5ac125781f17439f12c62e82

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "packages/kitten-analysts", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
