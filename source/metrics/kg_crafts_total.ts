import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_crafts_total = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    extract(client_type, guid, location, element, subject) {
      if (element.name !== "totalCrafts") {
        return;
      }

      subject.set(
        {
          client_type,
          guid,
          label: ucfirst(element.label),
          location,
          type: element.type,
        },
        element.value,
      );
    },
    help: "How many times you have crafted.",
    labelNames: ["client_type", "guid", "label", "location", "type"] as const,
    name: "kg_crafts_total",
    remote,
    require: "getStatistics",
  });
