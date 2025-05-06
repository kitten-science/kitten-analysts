import { SavegameLoader } from "@kitten-science/kitten-scientists/tools/SavegameLoader.js";
import type { GamePage } from "@kitten-science/kitten-scientists/types/game.js";
import {
  type I18nEngine,
  type KGNetSavePersisted,
  type TabId,
  TechnologiesIgnored,
  type TechnologyIgnored,
} from "@kitten-science/kitten-scientists/types/index.js";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { cl } from "./tools/Log.js";
import { identifyExchange } from "./tools/MessageFormat.js";

declare global {
  interface Window {
    kittenAnalysts?: KittenAnalysts;
  }
}

export type KittenAnalystsMessageId =
  | "connected"
  | "getBuildings"
  | "getCalendar"
  | "getPollution"
  | "getRaces"
  | "getResourcePool"
  | "getStatistics"
  | "getTechnologies"
  | "injectSavegame"
  | "reportFrame"
  | "reportSavegame";

export type PayloadBuildings = Array<{
  group: string;
  label: string;
  name: string;
  on: number;
  tab: TabId;
  value: number;
}>;
export type PayloadCalendar = Array<{
  cryptoPrice: number;
  cycle: number;
  cycleYear: number;
  day: number;
  eventChance: number;
  festivalDays: number;
  futureSeasonTemporalParadox: number;
  season: number;
  seasonsPerYear: number;
  year: number;
  yearsPerCycle: number;
}>;
export type PayloadPollution = Array<{
  label: string;
  name: string;
  pollution: number;
}>;
export type PayloadRaces = Array<{
  embassyLevel: number;
  energy: number;
  name: string;
  standing: number;
  title: string;
  unlocked: boolean;
}>;
export type PayloadResources = Array<{
  craftable: boolean;
  label: string;
  maxValue: number;
  name: string;
  rate: number;
  value: number;
}>;
export type PayloadStatistics = Array<{
  label: string;
  name: string;
  type: "all_time" | "current";
  value: number;
}>;
export type PayloadTechnologies = Array<{
  label: string;
  name: string;
  researched: boolean;
  tab: TabId;
  unlocked: boolean;
}>;

export interface KittenAnalystsMessage<
  TMessage extends KittenAnalystsMessageId,
  TData = TMessage extends "getBuildings"
    ? PayloadBuildings
    : TMessage extends "getCalendar"
      ? PayloadCalendar
      : TMessage extends "getPollution"
        ? PayloadPollution
        : TMessage extends "getRaces"
          ? PayloadRaces
          : TMessage extends "getResourcePool"
            ? PayloadResources
            : TMessage extends "getStatistics"
              ? PayloadStatistics
              : TMessage extends "getTechnologies"
                ? PayloadTechnologies
                : TMessage extends "reportFrame"
                  ? unknown
                  : TMessage extends "reportSavegame"
                    ? unknown
                    : TMessage extends "injectSavegame"
                      ? KGNetSavePersisted
                      : never,
> {
  /**
   * The payload of the message.
   */
  data?: TData;

  client_type: "backend" | "browser" | "headless";

  /**
   * The HTTP URL that identifies the context of the client that sent the message.
   */
  location: string;

  /**
   * The telemetry guid of the client that sent the message.
   */
  guid: string;

  /**
   * If the message requires a response, it should declare a `responseId`, which the receiver
   * will also put on the response.
   */
  responseId?: string;

  /**
   * The type identifier for the message.
   */
  type: TMessage;
}

export class KittenAnalysts {
  /**
   * A reference to the Kittens Game.
   */
  readonly game: GamePage;

  /**
   * The websocket we're using to talk to the backend.
   */
  ws: WebSocket | null = null;

  /**
   * A function in the game that allows to retrieve translated messages.
   *
   * Ideally, you should never access this directly and instead use the
   * i18n interface provided by `Engine`.
   */
  readonly i18nEngine: I18nEngine;

  readonly location = window.location.toString().replace(/#$/, "");

  #interval = -1;
  #timeoutReconnect = -1;
  #connectTry = 0;
  #withAnalyticsBackend = false;

  constructor(game: GamePage, i18nEngine: I18nEngine) {
    console.warn(...cl("Kitten Analysts constructed."));

    this.game = game;
    this.i18nEngine = i18nEngine;
  }

  /**
   * Start the user script after loading and configuring it.
   */
  run() {
    this.connect(true);
  }

  /**
   * Connect the Kitten Analysts to all systems.
   * @param withAnalyticsBackend Should the Kitten Analysts report information to the
   * Kitten DnA backend? Because this only makes sense in a strict development environment,
   * this should usually be kept disabled for most users.
   * @returns Nothing
   */
  connect(withAnalyticsBackend: boolean) {
    if (this.ws !== null) {
      return;
    }

    if (-1 < this.#timeoutReconnect) {
      window.clearTimeout(this.#timeoutReconnect);
      this.#timeoutReconnect = -1;
    }

    document.removeEventListener("ks.reportFrame", this.reportFrameListener);
    document.addEventListener("ks.reportFrame", this.reportFrameListener);

    document.removeEventListener("ks.reportSavegame", this.reportSavegameListener);
    document.addEventListener("ks.reportSavegame", this.reportSavegameListener);

    if (!withAnalyticsBackend) {
      return;
    }

    this.#withAnalyticsBackend = true;

    // Manipulate game to use internal URL for KGNet.
    // KG would always return this exact URL itself, if it was running on localhost.
    // Because we might not be accessing the current instance of the game through localhost,
    // we need to override the entire method to _always_ return this URL.
    //
    // Temporarily disabled to further integration with the official game website.
    //this.game.server.getServerUrl = () => `http://${location.hostname}:7780`;

    const wsTarget = "ws://localhost:9093/";
    console.info(...cl(`Connecting ${wsTarget} (try ${this.#connectTry})...`));
    this.ws = new WebSocket(wsTarget);
    ++this.#connectTry;

    this.ws.onerror = error => {
      console.warn(...cl("Error on WS connection! Closing and reconnecting...", error.type));
      // This should also trigger the `onclose` handler below and, thus, the reconnect.
      this.ws?.close();
      this.ws = null;
    };

    this.ws.onclose = () => {
      console.warn(...cl("WS connection closed! Reconnecting..."));
      this.ws?.close();
      this.ws = null;
      this.reconnect();
    };

    this.ws.onopen = () => {
      console.info(...cl("WS connection established."));
      this.#connectTry = 0;
      this.postMessage({
        type: "connected",
        client_type: this.location.includes("headless.html") ? "headless" : "browser",
        location: this.location,
        guid: game.telemetry.guid,
      });
    };

    this.ws.onmessage = event => {
      const message = JSON.parse(
        event.data as string,
      ) as KittenAnalystsMessage<KittenAnalystsMessageId>;
      const response = this.processMessage(message);
      if (!response) {
        return;
      }
      this.postMessage(response);
    };
  }

  processMessage(
    message: KittenAnalystsMessage<KittenAnalystsMessageId>,
  ): KittenAnalystsMessage<KittenAnalystsMessageId> | undefined {
    console.debug(...cl(`=> ${identifyExchange(message)} received.`));

    switch (message.type) {
      case "connected":
        break;
      case "getBuildings": {
        const bonfire: PayloadBuildings = game.bld.meta[0].meta.flatMap(building => {
          if (building.stages) {
            return building.stages.map((stage, index) => ({
              group: "upgrade",
              label: stage.label,
              name: building.name,
              on: index === building.stage ? building.on : 0,
              tab: "Bonfire",
              value: index === building.stage ? building.val : 0,
            }));
          }
          return {
            group: "base",
            label: building.label ?? building.name,
            name: building.name,
            on: building.on,
            tab: "Bonfire",
            value: building.val,
          };
        });

        const religionGroups = ["ziggurats", "orderOfTheSun", "cryptotheology", "pacts"];
        const religion: PayloadBuildings = game.religion.meta.flatMap((meta, index) =>
          meta.meta.map(building => ({
            group: religionGroups[index],
            label: building.label,
            name: building.name,
            on: building.on ?? 0,
            tab: "Religion",
            value: building.val ?? 0,
          })),
        );

        const spaceGroups = [
          "groundControl",
          "cath",
          "moon",
          "dune",
          "piscine",
          "helios",
          "terminus",
          "kairo",
          "yarn",
          "umbra",
          "charon",
          "centaurusSystem",
          "furthestRing",
        ];
        const space: PayloadBuildings = game.space.meta.flatMap((meta, index) =>
          // index 0 is moon missions
          index === 0
            ? []
            : meta.meta.map(building => ({
                group: spaceGroups[index],
                label: building.label,
                name: building.name,
                on: building.on ?? 0,
                tab: "Space",
                value: building.val ?? 0,
              })),
        );

        const timeGroups = ["chronoForge", "voidSpace"];
        const time: PayloadBuildings = game.time.meta.flatMap((meta, index) =>
          meta.meta.map(item => ({
            group: timeGroups[index],
            label: item.label,
            name: item.name,
            on: item.on ?? 0,
            tab: "Time",
            value: item.val ?? 0,
          })),
        );

        return {
          client_type: this.location.includes("headless.html") ? "headless" : "browser",
          data: [...bonfire, ...religion, ...space, ...time],
          guid: game.telemetry.guid,
          location: this.location,
          responseId: message.responseId,
          type: message.type,
        };
      }

      case "getCalendar": {
        const data: PayloadCalendar = [
          {
            cryptoPrice: game.calendar.cryptoPrice,
            cycle: game.calendar.cycle,
            cycleYear: game.calendar.cycleYear,
            day: game.calendar.day,
            eventChance: game.calendar.eventChance,
            festivalDays: game.calendar.festivalDays,
            futureSeasonTemporalParadox: game.calendar.futureSeasonTemporalParadox,
            season: game.calendar.season,
            seasonsPerYear: game.calendar.seasonsPerYear,
            year: game.calendar.year,
            yearsPerCycle: game.calendar.yearsPerCycle,
          },
        ];
        return {
          client_type: this.location.includes("headless.html") ? "headless" : "browser",
          data,
          guid: game.telemetry.guid,
          location: this.location,
          responseId: message.responseId,
          type: message.type,
        };
      }

      case "getPollution": {
        const producers = game.bld.meta[0].meta.filter(
          _ => !isNil(_.effects?.cathPollutionPerTickProd),
        );
        const consumers = game.bld.meta[0].meta.filter(
          _ => !isNil(_.effects?.cathPollutionPerTickCon),
        );

        const data: PayloadPollution = [
          {
            label: "Total",
            name: "cathPollution",
            // Could be simplified, but this syntax matches the function getPollutionMod of the game.
            pollution: (game.bld.cathPollution / 10000000) * 100,
          },
          ...producers.map(_ => ({
            label: _.label ?? "",
            name: _.name,
            pollution: (_.effects?.cathPollutionPerTickProd ?? 0) * _.on,
          })),
          ...consumers.map(_ => ({
            label: _.label ?? "",
            name: _.name,
            pollution: (_.effects?.cathPollutionPerTickCon ?? 0) * _.on,
          })),
        ];

        return {
          client_type: this.location.includes("headless.html") ? "headless" : "browser",
          data,
          guid: game.telemetry.guid,
          location: this.location,
          responseId: message.responseId,

          type: message.type,
        };
      }

      case "getRaces": {
        const data: PayloadRaces = game.diplomacy.races.map(race => ({
          embassyLevel: race.embassyLevel,
          energy: race.energy,
          name: race.name,
          standing: race.standing,
          title: race.title,
          unlocked: race.unlocked,
        }));

        return {
          client_type: this.location.includes("headless.html") ? "headless" : "browser",
          data,
          guid: game.telemetry.guid,
          location: this.location,
          responseId: message.responseId,
          type: message.type,
        };
      }
      case "getResourcePool": {
        const isTimeParadox = this.game.calendar.day < 0;

        const resources: PayloadResources = this.game.resPool.resources.map(resource => {
          let rate =
            (isTimeParadox ? 0 : this.game.getResourcePerTick(resource.name, true)) *
            this.game.getTicksPerSecondUI();
          if (resource.calculatePerDay === true) {
            rate =
              this.game.getResourcePerDay(resource.name) *
              (resource.name === "necrocorn" ? 1 + this.game.timeAccelerationRatio() : 1);
          } else if (resource.calculateOnYear) {
            rate = this.game.getResourceOnYearProduction(resource.name);
          }

          return {
            name: resource.name,
            value: resource.value ?? 0,
            maxValue: resource.maxValue ?? 0,
            label: resource.title,
            craftable: resource.craftable ?? false,
            rate: rate,
          };
        });

        const pseudoResources: PayloadResources = [
          {
            craftable: false,
            label: "Worship",
            maxValue: Number.POSITIVE_INFINITY,
            name: "worship",
            rate: 0,
            value: game.religion.faith,
          },
          {
            craftable: false,
            label: "Epiphany",
            maxValue: Number.POSITIVE_INFINITY,
            name: "epiphany",
            rate: 0,
            value: game.religion.faithRatio,
          },
          {
            craftable: false,
            label: "Necrocorn deficit",
            maxValue: Number.POSITIVE_INFINITY,
            name: "necrocornDeficit",
            rate: 0,
            value: game.religion.pactsManager.necrocornDeficit,
          },
        ];

        return {
          client_type: this.location.includes("headless.html") ? "headless" : "browser",
          data: [...resources, ...pseudoResources],
          guid: game.telemetry.guid,
          location: this.location,
          responseId: message.responseId,
          type: message.type,
        };
      }
      case "getStatistics": {
        const data: PayloadStatistics = game.stats.statGroups.flatMap((group, index) =>
          group.group.map(member => ({
            name: member.name,
            label: member.title,
            type: index === 0 ? "all_time" : "current",
            value: member.val,
          })),
        );

        return {
          client_type: this.location.includes("headless.html") ? "headless" : "browser",
          data,
          guid: game.telemetry.guid,
          location: this.location,
          responseId: message.responseId,
          type: message.type,
        };
      }
      case "getTechnologies": {
        const data: PayloadTechnologies = game.science.techs
          .filter(tech => !TechnologiesIgnored.includes(tech.name as TechnologyIgnored))
          .map(tech => ({
            name: tech.name,
            label: tech.label,
            researched: tech.researched,
            unlocked: tech.unlocked,
            tab: "Science",
          }));

        return {
          client_type: this.location.includes("headless.html") ? "headless" : "browser",
          data,
          guid: game.telemetry.guid,
          location: this.location,
          responseId: message.responseId,
          type: message.type,
        };
      }
      case "injectSavegame": {
        console.warn(...cl("=> Injecting savegame..."));
        const data = message.data as KGNetSavePersisted;
        new SavegameLoader(this.game).load(data.saveData).catch(redirectErrorsToConsole(console));
        break;
      }
    }

    return undefined;
  }

  reportFrameListener = (event: Event): void => {
    const location = window.location.toString().replace(/#$/, "");
    this.postMessage({
      client_type: location.includes("headless.html") ? "headless" : "browser",
      data: (event as CustomEvent<unknown>).detail,
      guid: game.telemetry.guid,
      location,
      type: "reportFrame",
    });
  };

  reportSavegameListener = (event: Event): void => {
    const location = window.location.toString().replace(/#$/, "");
    this.postMessage({
      client_type: location.includes("headless.html") ? "headless" : "browser",
      data: (event as CustomEvent<unknown>).detail,
      guid: game.telemetry.guid,
      location,
      type: "reportSavegame",
    });
  };

  heartbeat() {
    console.debug(...cl("Heartbeat"));
    window.clearTimeout(this.#timeoutReconnect);
    this.#timeoutReconnect = window.setTimeout(() => this.ws?.close(), 30000);
  }

  reconnect() {
    if (-1 < this.#timeoutReconnect) {
      return;
    }

    console.info(...cl("Reconnecting..."));

    this.#timeoutReconnect = window.setTimeout(() => {
      this.connect(this.#withAnalyticsBackend);
    }, 5000);
  }

  postMessage<TMessage extends KittenAnalystsMessageId>(message: KittenAnalystsMessage<TMessage>) {
    if (this.ws === null) {
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
      if ("responseId" in message) {
        console.debug(...cl(`<= ${identifyExchange(message)} fulfilled.`));
      } else {
        console.debug(...cl(`<= ${identifyExchange(message)} dispatched.`));
      }
    } catch (error) {
      console.warn(...cl("Error while sending message. Closing socket.", error));
      this.ws.onclose?.(new CloseEvent("close"));
    }
  }

  start() {
    if (this.#interval !== -1) {
      return;
    }
  }
  stop() {
    window.clearInterval(this.#interval);
    this.#interval = -1;
  }
}
