FROM docker.io/library/node:22.17.1-bookworm@sha256:ec09419096c9cb8ff4c6fcf9c7b63332bbecab56d4cb6dcc83d98c180a7cdddf

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
