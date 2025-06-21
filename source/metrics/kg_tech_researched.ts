import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_tech_researched = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    extract(client_type, guid, location, element, subject) {
      subject.set(
        {
          client_type,
          guid,
          label: ucfirst(element.label),
          location,
          name: element.name,
          tab: element.tab,
        },
        element.researched ? 1 : 0,
      );
    },
    help: "Has the given technology been researched?",
    labelNames: ["client_type", "client_type", "guid", "name", "label", "location", "tab"] as const,
    name: "kg_tech_researched",
    remote,
    require: "getTechnologies",
  });
