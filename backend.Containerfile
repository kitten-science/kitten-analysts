FROM docker.io/library/node:22.16.0-bookworm@sha256:74066d050011dd18c56390523cb255b38bce09b332221a4ec15ab0d8e1ac61fe

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
