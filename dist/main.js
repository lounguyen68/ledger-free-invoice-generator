/* App bootstrap — only runs on the editor page (where the host shell exists). */
import { AppController } from "./controllers/appController.js";
/* The shell hosts (#app-header-host, #tab-rail-host, #preview-host) are now
   what identifies app.html — `#invoice` no longer exists in static HTML
   because InvoiceView mounts it dynamically. */
if (document.getElementById("app-header-host")) {
    new AppController().start();
}
