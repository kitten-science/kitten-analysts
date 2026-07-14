import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_energy_consumption = (
	cache: MessageCache,
	remote: KittensGameRemote,
) =>
	gaugeFactory({
		cache,
		extract(client_type, guid, location, element, subject) {
			// The grand total (name "energy") is always reported; individual
			// buildings are only reported when they actually consume energy.
			if (element.name !== "energy" && element.consumption === 0) {
				return;
			}

			subject.set(
				{
					client_type,
					guid,
					label: ucfirst(element.label),
					location,
					name: element.name,
				},
				element.consumption,
			);
		},
		help: "How much energy is consumed, in total (name 'energy') and per building.",
		labelNames: ["client_type", "guid", "label", "location", "name"] as const,
		name: "kg_energy_consumption",
		remote,
		require: "getEnergy",
	});
