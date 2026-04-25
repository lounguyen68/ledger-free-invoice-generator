import { logoBlockHTML } from "./logoBlock/logoBlock.html.js";
/**
 * Compose form: 6 collapsible drawers (sender, invoice, bank, for, items, footer).
 * Each drawer is a native <details>/<summary> for free keyboard a11y.
 */
export const composeFormHTML = () => `
  <form id="invoice-form" class="compose-form" autocomplete="off">
    <details class="drawer" data-drawer="sender" open>
      <summary class="drawer-summary">
        <span class="drawer-num">§01</span>
        <span class="drawer-label">Sender</span>
        <span class="drawer-meta" data-drawer-meta></span>
        <span class="drawer-glyph" aria-hidden="true">›</span>
      </summary>
      <div class="drawer-body">
        ${logoBlockHTML()}
        <label>Full Name<input type="text" name="senderName" placeholder="Full Name" /></label>
        <label>Address<input type="text" name="senderAddress" /></label>
        <label>City / Postal<input type="text" name="senderCity" /></label>
        <label>Phone<input type="text" name="senderPhone" /></label>
      </div>
    </details>

    <details class="drawer" data-drawer="invoice">
      <summary class="drawer-summary">
        <span class="drawer-num">§02</span>
        <span class="drawer-label">Invoice</span>
        <span class="drawer-meta" data-drawer-meta></span>
        <span class="drawer-glyph" aria-hidden="true">›</span>
      </summary>
      <div class="drawer-body">
        <label>Invoice №<input type="text" name="invoiceNumber" /></label>
        <label>Date<input type="text" name="invoiceDate" /></label>
      </div>
    </details>

    <details class="drawer" data-drawer="bank">
      <summary class="drawer-summary">
        <span class="drawer-num">§03</span>
        <span class="drawer-label">Bank</span>
        <span class="drawer-meta" data-drawer-meta></span>
        <span class="drawer-glyph" aria-hidden="true">›</span>
      </summary>
      <div class="drawer-body">
        <label>Name with Bank<input type="text" name="bankHolder" placeholder="Name with Bank" /></label>
        <label>SWIFT Code<input type="text" name="swift" /></label>
        <label>Bank Name<input type="text" name="bankName" /></label>
        <label>Country<input type="text" name="bankCountry" /></label>
        <label>Account number<input type="text" name="accountNumber" /></label>
        <label>Payee Address<input type="text" name="payeeAddress" /></label>
        <label>Bank Address<input type="text" name="bankAddress" /></label>
      </div>
    </details>

    <details class="drawer" data-drawer="for">
      <summary class="drawer-summary">
        <span class="drawer-num">§04</span>
        <span class="drawer-label">For</span>
        <span class="drawer-meta" data-drawer-meta></span>
        <span class="drawer-glyph" aria-hidden="true">›</span>
      </summary>
      <div class="drawer-body">
        <label>Subject<input type="text" name="forSubject" /></label>
      </div>
    </details>

    <details class="drawer" data-drawer="items">
      <summary class="drawer-summary">
        <span class="drawer-num">§05</span>
        <span class="drawer-label">Line items</span>
        <span class="drawer-meta" data-drawer-meta></span>
        <span class="drawer-glyph" aria-hidden="true">›</span>
      </summary>
      <div class="drawer-body">
        <div class="currency-row">
          <span class="currency-label">Currency</span>
          <div class="select-control">
            <select id="currency-select" name="currency"></select>
          </div>
        </div>
        <div class="items-head"><span>Description</span><span>Amount</span></div>
        <div id="items"></div>
        <button type="button" id="add-item" class="btn btn-line">
          <span class="btn-glyph">+</span>Add a line
        </button>
      </div>
    </details>

    <details class="drawer" data-drawer="footer">
      <summary class="drawer-summary">
        <span class="drawer-num">§06</span>
        <span class="drawer-label">Footer</span>
        <span class="drawer-meta" data-drawer-meta></span>
        <span class="drawer-glyph" aria-hidden="true">›</span>
      </summary>
      <div class="drawer-body">
        <label>Payment Details<textarea name="paymentDetails" rows="3" placeholder="Notes, references, instructions…"></textarea></label>
        <div class="row-2">
          <label>Prepared by<input type="text" name="preparedBy" /></label>
          <label>Prepared date<input type="text" name="preparedDate" /></label>
        </div>
        <div class="row-2">
          <label>Approved by<input type="text" name="approvedBy" /></label>
          <label>Approved date<input type="text" name="approvedDate" /></label>
        </div>
      </div>
    </details>

    <div class="drawer-rail">
      <button type="button" class="rail-btn" data-drawer-action="expand">Expand all</button>
      <span class="rail-sep">·</span>
      <button type="button" class="rail-btn" data-drawer-action="collapse">Collapse all</button>
    </div>
  </form>
`;
