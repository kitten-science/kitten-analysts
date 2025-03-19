FROM docker.io/library/node:22.14.0-bookworm@sha256:c7fd844945a76eeaa83cb372e4d289b4a30b478a1c80e16c685b62c54156285b

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "packages/kitten-analysts", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
