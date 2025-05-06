import { UserScriptLoader } from "@kitten-science/kitten-scientists/UserScriptLoader.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenAnalysts } from "./KittenAnalysts.js";

(async () => {
  const userScript = await new UserScriptLoader().waitForGame(KittenAnalysts, "ka");

  window.kittenAnalysts = userScript;

  userScript.run();
})().catch(redirectErrorsToConsole(console));
