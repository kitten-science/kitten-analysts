import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_crypto_price = (cache: MessageCache, remote: KittensGameRemote) =>
  gaugeFactory({
    cache,
    extract(client_type, guid, location, element, subject) {
      subject.set(
        {
          client_type,
          guid,
          location,
        },
        element.cryptoPrice,
      );
    },
    help: "The current price of blackcoin.",
    labelNames: ["client_type", "guid", "location"] as const,
    name: "kg_crypto_price",
    remote,
    require: "getCalendar",
  });
