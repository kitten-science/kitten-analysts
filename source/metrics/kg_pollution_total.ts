import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_pollution_total = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    extract(client_type, guid, location, element, subject) {
      // Contributors are tracked in kg_pollution_production
      if (element.name !== "cathPollution") {
        return;
      }

      subject.set(
        {
          client_type,
          guid,
          location,
        },
        element.pollution,
      );
    },
    help: "The current pollution level on Cath.",
    labelNames: ["client_type", "guid", "location"] as const,
    name: "kg_pollution_total",
    remote,
    require: "getPollution",
  });
