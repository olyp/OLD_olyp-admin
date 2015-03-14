var INVOICE_COMPONENTS = (function () {
    "use strict";

    var div = React.DOM.div;
    var a = React.DOM.a;
    var h2 = React.DOM.h2;

    var ListInvoiceBatchesClass = React.createClass({
        gotoBatch: function (batch) {
            this.props.actions.invoiceActions.gotoInvoiceBatch(batch);
        },

        render: function () {
            var self = this;

            return div(
                null,
                a({className: "btn btn-default"}, "Create new batch"),
                div({className: "row", style: {fontWeight: "bold"}},
                   div({className: "col-xs-2"}, "Month"),
                   div({className: "col-xs-1"}, "Finalized")),
                this.props.invoiceBatches.map(function (batch) {
                    return div(
                        {key: "invoice-batch-" + batch.id, className: "row"},
                        div({className: "col-xs-2"}, batch.month),
                        div({className: "col-xs-1"}, batch.finalized.toString()),
                        div({className: "col-xs-2"},
                            a(
                                {
                                    className: "btn btn-default btn-xs",
                                    onClick: function () {
                                        self.gotoBatch(batch);
                                    }
                                },
                                "Show"
                            )));
                }));
        }
    });
    var ListInvoiceBatches = React.createFactory(ListInvoiceBatchesClass);

    var ShowInvoiceBatchClass = React.createClass({
        render: function () {
            return div(
                null,
                this.props.invoiceBatch.invoices.map(function (invoice) {
                    return div(
                        {key: "invoice-" + invoice.id},
                        h2(null, invoice.customer.name),
                        div({className: "row", style: {fontWeight: "bold"}},
                            div({className: "col-xs-1"}, "Code"),
                            div({className: "col-xs-1"}, "Tax"),
                            div({className: "col-xs-1"}, "Qty"),
                            div({className: "col-xs-1"}, "Unit price"),
                            div({className: "col-xs-2", style: {textAlign: "right"}}, "Sum"),
                            div({className: "col-xs-2", style: {textAlign: "right"}}, "Sum w/tax")),
                        invoice.lines.map(function (line) {
                            return div(
                                {key: "line-" + line.id, className: "row"},
                                div({className: "col-xs-1"}, line.product_code),
                                div({className: "col-xs-1"}, line.tax),
                                div({className: "col-xs-1"}, line.quantity),
                                div({className: "col-xs-1"}, line.unit_price),
                                div({className: "col-xs-2", style: {textAlign: "right"}}, line.sum_with_tax),
                                div({className: "col-xs-2", style: {textAlign: "right"}}, line.sum_without_tax))
                        }),
                        div({className: "row"},
                            div({className: "col-xs-1 col-xs-offset-3",
                                 style: {fontWeight: "bold", textAlign: "right"}},
                                "Total:"),
                            div({className: "col-xs-2", style: {textAlign: "right"}}, invoice.sum_with_tax),
                            div({className: "col-xs-2", style: {textAlign: "right"}}, invoice.sum_without_tax)));
                    ;
                }));
        }
    });
    var ShowInvoiceBatch = React.createFactory(ShowInvoiceBatchClass);

    return {
        ListInvoiceBatches: ListInvoiceBatches,
        ShowInvoiceBatch: ShowInvoiceBatch
    }
}());
