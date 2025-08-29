FROM docker.io/library/node:22.19.0-bookworm@sha256:c7fe4111436bcb0f7efaecffa1379b9bc21fb5dc6b7767ff2d288f71689bf933

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
