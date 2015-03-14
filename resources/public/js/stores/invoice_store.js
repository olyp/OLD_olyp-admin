var INVOICE_STORE = (function () {
    function createInvoiceStore(http) {
        return {
            getInvoiceBatches: function () {
                return http("GET", "/central_api_proxy/invoice_batches");
            },

            getInvoiceBatch: function (batchId) {
                return http("GET", "/central_api_proxy/invoice_batches/" + batchId);
            }
        }
    }

    return {
        create: createInvoiceStore
    }
}());
