var INVOICE_ACTIONS = (function () {
    return {
        create: function (router) {
            return {
                gotoInvoiceBatch: function (batch) {
                    router.transitionTo("invoiceBatchShow", {invoiceBatchId: batch.id});
                }
            }
        }
    }
}());
