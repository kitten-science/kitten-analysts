FROM docker.io/library/node:22.15.1-bookworm@sha256:e558507eb799e3a76fcdaaee5e48dce1a00aebc85892128a9fca59f63bd49511

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
