import { AppController } from "./controllers/appController.js";
import { initEmbedMode } from "./embedController.js";

if (document.getElementById("app-header-host")) {
  const app = new AppController();
  app.start();

  if (new URLSearchParams(location.search).has("embed")) {
    initEmbedMode(app.invoice, app.theme);
  }
}
