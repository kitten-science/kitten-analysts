# Kitten Analysts

Telemetry and monitoring for [Kittens Game](https://kittensgame.com/), the incremental browser
game. Kitten Analysts scrapes live game state and exposes it as [Prometheus](https://prometheus.io/)
metrics, with a ready-made [Grafana](https://grafana.com/) dashboard to visualize your empire's
resources, buildings, kittens, tech, pollution, and more.

It is part of the [Kitten Science](https://github.com/kitten-science) family and builds on top of
[Kitten Scientists](https://github.com/kitten-science/kitten-scientists) (the automation mod, pulled
in as a dependency).

## How it works

Kitten Analysts has two halves:

- A **userscript** (`kitten-analysts.user.js`) that runs *inside* a Kittens Game tab. It reads the
  game state and pushes it to the backend over a WebSocket.
- A **backend** (`entrypoint-backend.js`, a Node/Koa server) that receives that data and exposes it.
  It listens on three ports:

  | Port   | Purpose                                                                 |
  | ------ | ----------------------------------------------------------------------- |
  | `9093` | WebSocket channel to the in-game userscript                             |
  | `9091` | Prometheus metrics endpoint (`GET /metrics`)                            |
  | `7780` | A minimal [KGNet](https://kittensgame.com/) save-sync service (savegame upload/persistence) |

The available metrics live in [`source/metrics/`](source/metrics/) — buildings, resource
values/rates/caps, kitten counts, researched/unlocked tech, pollution, crypto price, festival days,
embassy levels, and the in-game statistics counters.

> **Important:** the userscript connects to `ws://localhost:9093/` (hardcoded in
> `source/KittenAnalysts.ts`). The backend must run on the **same machine** as the browser you play
> in.

## Requirements

- Node.js **≥ 24** and npm **≥ 11** (see `engines` in `package.json`)
- A userscript manager ([Tampermonkey](https://www.tampermonkey.net/) recommended) for the browser
  path, **or** [Docker](https://www.docker.com/) for the fully containerized path.
- Optionally, Prometheus + Grafana to store and visualize the metrics

## Quick start — monitor your browser playthrough

1. **Build the userscript and backend:**

   ```shell
   make build
   ```

   This produces the userscript and `output/entrypoint-backend.js` (the backend), among other
   artifacts. The userscript filename carries the version: a plain local build writes
   `output/kitten-analysts-0.0.0-ci.user.js` (plus a minified `…-0.0.0-ci.min.user.js`). Set
   `RELEASE_VERSION` to stamp a specific version instead of `0.0.0-ci`.

   You can also grab one of the builds from the [Releases](https://github.com/kitten-science/kitten-analysts/releases)
   page of this repository.

2. **Start the backend** (keep it running):

   ```shell
   make run
   ```

   You should see it begin listening on ports 7780, 9091, and 9093.

   You can also pull the container image from <ghcr.io/kitten-science/kitten-analysts>. See the
   [systemd unit](contrib/kitten-analysts.service) for an example.

3. **Install the userscript.**

   Open `output/kitten-analysts-0.0.0-ci.user.js` in Tampermonkey (drag
   it in, or copy its contents into a new script). The non-minified file is easiest to debug; the
   `.min` variant behaves identically. It is configured to match `https://kittensgame.com/web/` (and
   the beta/alpha and localhost variants — see `metablock.json`).

   > Kitten Analysts is a *separate* userscript from [Kitten
   > Scientists](https://github.com/kitten-science/kitten-scientists) (the automation mod). Analysts
   > is read-only telemetry and is designed to run **alongside** Scientists — installing it won't
   > change how the game plays. If you already run Scientists, keep it and add this.

4. **Open Kittens Game** at <https://kittensgame.com/web/> and reload. The userscript connects to
   your local backend over the WebSocket.

5. **Scrape the metrics.**

   Point Prometheus at `localhost:9091`, or just check that data is flowing:

   ```shell
   curl localhost:9091/metrics
   ```

6. **Visualize.**

   Import [`contrib/grafana-dashboard.json`](contrib/grafana-dashboard.json) into
   Grafana, pointed at your Prometheus data source.

### Example Prometheus scrape config

```yaml
scrape_configs:
  - job_name: kitten-analysts
    static_configs:
      - targets: ["localhost:9091"]
```

To run the backend as a long-lived service, see the sample systemd unit in
[`contrib/kitten-analysts.service`](contrib/kitten-analysts.service).

## Alternative — fully containerized (headless game + backend)

Runs the backend *and* a headless copy of Kittens Game in containers, so metrics are produced
continuously without you playing in your own browser.

```shell
make build          # docker-compose mounts ./output into the containers
docker compose up
```

This starts:

- the **backend** on `9093`, and
- a **Prometheus instance**, configured to scrape the metrics from the backend,
- a **Grafana instance** on port `3000`, with the Prometheus instance already configured.
  Use `admin`/`grafana` to log into the web UI.

The [compose file](./docker-compose.yml) also includes examples for how to include:

- a **Kittens Game server** (built from `game.Containerfile`, which clones
  [nuclear-unicorn/kittensgame](https://github.com/nuclear-unicorn/kittensgame) and injects both the
  Kitten Scientists and Kitten Analysts mods), with its UI exposed on `9080`.

- 

## Development

Common `make` targets (see the [`Makefile`](Makefile)):

| Target          | What it does                                                                 |
| --------------- | ---------------------------------------------------------------------------- |
| `make build`    | Full build: injectable script, userscript, TypeScript lib, and entrypoints   |
| `make run`      | Run the backend (`node output/entrypoint-backend.js`)                         |
| `make lint`     | `biome check` + `tsc --noEmit`                                                |
| `make pretty`   | Auto-format with Biome and fix `package.json`                                 |
| `make clean`    | Remove build output, `node_modules`, and generated overlays                  |
| `make git-hook` | Install a pre-commit hook that runs `make pretty`                             |

### Configuration

The backend reads a few optional environment variables:

| Variable            | Default | Purpose                              |
| ------------------- | ------- | ------------------------------------ |
| `PORT_HTTP_KGNET`   | `7780`  | KGNet save-sync HTTP port            |
| `PORT_HTTP_METRICS` | `9091`  | Prometheus metrics HTTP port         |
| `PORT_WS_BACKEND`   | `9093`  | WebSocket port for the userscript    |
| `PROTOCOL_DEBUG`    | unset   | Set to any value for verbose logging |

Savegames received over the KGNet API are persisted to `/tmp/local_storage`
(`LOCAL_STORAGE_PATH` in `source/globals.ts`).

## Release process

```shell
npm version patch --message "chore: Version bump %s"
```

This runs `make lint test` first (`preversion`) and pushes the tag afterward (`postversion`).

## License

[MIT](LICENSE) © Oliver Salzburg
