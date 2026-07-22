import { ucfirst } from "@kitten-science/kitten-scientists/tools/Format.js";
import type { MessageCache } from "../entrypoint-backend.js";
import type { KittensGameRemote } from "../network/KittensGameRemote.js";
import { gaugeFactory } from "./factory.js";

export const kg_kittens_job = (
	cache: MessageCache,
	remote: KittensGameRemote,
) =>
	gaugeFactory({
		cache,
		extract(client_type, guid, location, element, subject) {
			// Only report jobs the player has actually unlocked.
			if (!element.unlocked) {
				return;
			}

			subject.set(
				{
					client_type,
					guid,
					job: element.name,
					label: ucfirst(element.label),
					location,
				},
				element.value,
			);
		},
		help: "How many kittens are assigned to each job.",
		labelNames: ["client_type", "guid", "job", "label", "location"] as const,
		name: "kg_kittens_job",
		remote,
		require: "getJobs",
	});
