FROM docker.io/library/node:22.17.1-bookworm@sha256:e515259afd26f60db74957c62203c93d45760f2ba864d94accfa2edfc1ac17cf

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
