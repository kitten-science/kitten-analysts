FROM docker.io/library/node:22.21.0-bookworm@sha256:23c24e85395992be118734a39903e08c8f7d1abc73978c46b6bda90060091a49

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
