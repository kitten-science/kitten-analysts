FROM docker.io/library/node:24.14.0-bookworm@sha256:6c0cc63a66a456c4574e230e5aec3cd0255bf718b93ebd785361bdc4688a07e6

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
