FROM docker.io/library/node:22.19.0-bookworm@sha256:6fe286835c595e53cdafc4889e9eff903dd3008a3050c1675809148d8e0df805

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
