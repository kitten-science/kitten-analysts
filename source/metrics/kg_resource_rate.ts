import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_resource_rate = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    extract(client_type, guid, location, element, subject) {
      subject.set(
        {
          client_type,
          craftable: element.craftable.toString(),
          guid,
          label: ucfirst(element.label),
          location,
          name: element.name,
        },
        element.rate,
      );
    },
    help: "How many of the given resource are produced every second.",
    labelNames: ["client_type", "guid", "name", "label", "location", "craftable"] as const,
    name: "kg_resource_rate",
    remote,
    require: "getResourcePool",
  });
