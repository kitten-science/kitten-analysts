FROM docker.io/library/node:22.18.0-bookworm@sha256:73297e219c73d998158945abd3dbc648c2756d610191da1498b2749c208614dd

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
