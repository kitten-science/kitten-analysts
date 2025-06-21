import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_festival_days = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    extract(client_type, guid, location, element, subject) {
      subject.set(
        {
          client_type,
          guid,
          location,
        },
        element.festivalDays,
      );
    },
    help: "The remaining duration of the festival.",
    labelNames: ["client_type", "guid", "location"] as const,
    name: "kg_festival_days",
    remote,
    require: "getCalendar",
  });
