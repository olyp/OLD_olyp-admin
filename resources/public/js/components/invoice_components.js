var INVOICE_COMPONENTS = (function () {
    var div = React.DOM.div;

    var ListInvoiceBatchesClass = React.createClass({
        render: function () {
            return div(null, "Invoices!");
        }
    });
    var ListInvoiceBatches = React.createFactory(ListInvoiceBatchesClass);

    return {
        ListInvoiceBatches: ListInvoiceBatches
    }
}());
