/**
 * The invoice page template — fixed at 8.5×11 in.
 * Four logo slots (stacked, inline, right, centered) so InvoiceView can pick
 * the active layout without re-rendering structure.
 */
export const invoiceHTML = () => `
  <article id="invoice" class="invoice" aria-label="Invoice preview">
    <div class="invoice-top">
      <img class="sender-logo sender-logo--banner" data-bind-src="logo" alt="" hidden />
      <img class="sender-logo sender-logo--right" data-bind-src="logo" alt="" hidden />
      <div class="sender">
        <img class="sender-logo sender-logo--inline" data-bind-src="logo" alt="" hidden />
        <div class="sender-text">
          <img class="sender-logo sender-logo--stacked" data-bind-src="logo" alt="" hidden />
          <div class="sender-name" data-bind="senderName" data-placeholder="Full Name"></div>
          <div data-bind="senderAddress"></div>
          <div data-bind="senderCity"></div>
          <div class="phone-row">
            <span class="phone-label">Phone</span>
            <span data-bind="senderPhone"></span>
          </div>
        </div>
      </div>
      <div class="invoice-title">
        <h2>INVOICE</h2>
        <div class="invoice-meta">
          <div><span class="meta-label">INVOICE</span> #<span data-bind="invoiceNumber"></span></div>
          <div><span class="meta-label">DATE:</span> <span data-bind="invoiceDate"></span></div>
        </div>
      </div>
    </div>

    <div class="invoice-mid">
      <div class="from-box">
        <div class="box-label">FROM:</div>
        <div class="bank-holder" data-bind="bankHolder" data-placeholder="Name with Bank"></div>
        <div>SWIFT Code: <span data-bind="swift"></span></div>
        <div>Bank Name: <span data-bind="bankName"></span></div>
        <div>Country: <span data-bind="bankCountry"></span></div>
        <div>Account number: <span data-bind="accountNumber"></span></div>
        <div>Payee Address: <span data-bind="payeeAddress"></span></div>
        <div>Bank Address: <span data-bind="bankAddress"></span></div>
      </div>
      <div class="for-box">
        <div class="box-label">FOR:</div>
        <div data-bind="forSubject"></div>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th class="col-desc">DESCRIPTION</th>
          <th class="col-amount">AMOUNT</th>
        </tr>
      </thead>
      <tbody id="items-body"></tbody>
      <tfoot>
        <tr>
          <td class="total-label-cell">TOTAL</td>
          <td class="col-amount" id="total-cell">$0.00</td>
        </tr>
      </tfoot>
    </table>

    <div class="invoice-bottom">
      <div class="payment-box">
        <div class="box-label">Payment Details:</div>
        <div class="payment-text" data-bind="paymentDetails"></div>
      </div>
      <div class="signoff">
        <div class="sign-box">
          <div class="sign-label">Prepared by:</div>
          <div class="sign-value" data-bind="preparedBy"></div>
          <div class="sign-meta">Date: <span data-bind="preparedDate"></span></div>
        </div>
        <div class="sign-box">
          <div class="sign-label">Approved by:</div>
          <div class="sign-value" data-bind="approvedBy"></div>
          <div class="sign-meta">Date: <span data-bind="approvedDate"></span></div>
        </div>
      </div>
    </div>
  </article>
`;
