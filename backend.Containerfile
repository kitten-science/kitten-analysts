FROM docker.io/library/node:22.15.0-bookworm@sha256:473b4362b26d05e157f8470a1f0686cab6a62d1bd2e59774079ddf6fecd8e37e

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
