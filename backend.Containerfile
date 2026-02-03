FROM docker.io/library/node:24.13.0-bookworm@sha256:1de022d8459f896fff2e7b865823699dc7a8d5567507e8b87b14a7442e07f206

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
