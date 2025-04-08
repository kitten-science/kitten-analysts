FROM docker.io/library/node:22.14.0-bookworm@sha256:4a126f3116c37fbd8583209f13518efa9e9f6efc6bf18917141c6e6d4068fea1

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
