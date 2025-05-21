import { UserScriptLoader } from "@kitten-science/kitten-scientists/UserScriptLoader.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenAnalysts } from "./KittenAnalysts.js";

export const main = async () => {
  const userScript = await new UserScriptLoader().waitForGame(KittenAnalysts, "ka");

  UserScriptLoader.window.kittenAnalysts = userScript;

  userScript.run();
};

// We auto-ignite the loader, unless we're running in GreaseMonkey (content script).
// The content script loader will handle the orchestration of that scenario.
if (typeof GM === "undefined" || GM?.info?.scriptHandler === "Tampermonkey") {
  main().catch(redirectErrorsToConsole(console));
}
