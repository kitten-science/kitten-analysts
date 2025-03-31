FROM docker.io/library/node:22.14.0-bookworm@sha256:c7fd844945a76eeaa83cb372e4d289b4a30b478a1c80e16c685b62c54156285b

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
