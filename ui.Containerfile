FROM docker.io/library/node:24.14.0-bookworm@sha256:6c0cc63a66a456c4574e230e5aec3cd0255bf718b93ebd785361bdc4688a07e6

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
