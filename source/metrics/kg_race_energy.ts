import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_race_energy = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    extract(client_type, guid, location, element, subject) {
      subject.set(
        {
          client_type,
          guid,
          label: ucfirst(element.title),
          location,
          name: element.name,
        },
        element.energy,
      );
    },
    help: "The current energy of the race. Probably only relevant for Leviathans.",
    labelNames: ["client_type", "guid", "name", "label", "location"] as const,
    name: "kg_race_energy",
    remote,
    require: "getRaces",
  });
