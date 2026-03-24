/**
 * Cashfree Web Checkout Helper
 *
 * Does a plain HTML form POST to Cashfree's checkout endpoint with just the
 * payment_session_id — the minimal payload confirmed to work via direct test.
 *
 * Called from Dart: js.context.callMethod('initCashfreeCheckout', [sessionId, mode])
 */
window.initCashfreeCheckout = function (paymentSessionId, mode) {
  // ── DEBUG: log exactly what Dart passed ──────────────────────────────────
  console.log('[CF Debug] initCashfreeCheckout called');
  console.log('[CF Debug] mode            :', mode);
  console.log('[CF Debug] sessionId type  :', typeof paymentSessionId);
  console.log('[CF Debug] sessionId value :', paymentSessionId);
  console.log('[CF Debug] sessionId length:', paymentSessionId ? String(paymentSessionId).length : 'N/A');

  try {
    // Guard: bail out immediately if session ID is missing
    if (!paymentSessionId || String(paymentSessionId).trim() === '') {
      var msg = 'payment_session_id is empty or null — cannot launch checkout';
      console.error('[CF Debug]', msg);
      return 'error:' + msg;
    }

    var sid = String(paymentSessionId).trim();

    var url = mode === 'sandbox'
      ? 'https://sandbox.cashfree.com/pg/view/sessions/checkout'
      : 'https://api.cashfree.com/pg/view/sessions/checkout';

    console.log('[CF Debug] Submitting form to:', url);
    console.log('[CF Debug] Using session_id :', sid.substring(0, 30) + '...');

    // Remove any stale form
    var old = document.getElementById('_cf_form');
    if (old) old.parentNode.removeChild(old);

    var form = document.createElement('form');
    form.id = '_cf_form';
    form.method = 'POST';
    form.action = url;
    form.style.display = 'none';

    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'payment_session_id';
    input.value = sid;
    form.appendChild(input);

    document.body.appendChild(form);
    console.log('[CF Debug] Form appended, submitting now...');
    form.submit();
    return 'ok';
  } catch (e) {
    console.error('[Briktra] Cashfree form submit error:', e);
    return 'error:' + (e && e.message ? e.message : String(e));
  }
};

 