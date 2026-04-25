import { headerHTML } from "./headerView.html.js";
/**
 * Renders the editor header into the DOM.
 * No persistent state; reset/download buttons are wired by their respective
 * controllers (AppController for reset, PdfController for download).
 */
export class HeaderView {
    mount(target) {
        target.innerHTML = headerHTML();
    }
}
