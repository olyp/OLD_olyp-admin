var INVOICE_COMPONENTS = (function () {
    "use strict";

    var div = React.DOM.div;
    var a = React.DOM.a;
    var span = React.DOM.span;

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

    function roundFraction(fractionStr) {
        var fraction = parseFloat("0." + fractionStr, 10);
        var res = fraction.toString();
        if (res.length === 1) {
            return "0" + res;
        } else {
            return res;
        }
    }

    function displayCurrency(currencyStr) {
        var parts = currencyStr.split(".")
        var whole = parts[0];
        var fraction = parts[1];
        return span({title: currencyStr}, whole + "." + roundFraction(fraction, 2))
    }

    var ShowInvoiceBatchClass = React.createClass({
        render: function () {
            return div(
                null,
                a({className: "btn btn-default btn-lg", style: {}}, span({className: "glyphicon glyphicon-lock"}), " Unlocked"),
                this.props.invoiceBatch.invoices.map(function (invoice) {
                    return div(
                        {key: "invoice-" + invoice.id, style: {marginBottom: "5em"}},
                        React.DOM.h3(null, invoice.customer.name),
                        div({className: "row"},
                            div({className: "col-xs-2", style: {fontWeight: "bold"}},
                               "Hourly bookings"),
                            div({className: "col-xs-10"},
                                div({className: "row", style: {fontWeight: "bold"}},
                                    div({className: "col-xs-2"}, "From"),
                                    div({className: "col-xs-2"}, "To"),
                                    div({className: "col-xs-8"}, "User")),
                                invoice.reservations.map(function (reservation) {
                                    var booking = reservation.booking;
                                    var from = moment(reservation.from).tz("Europe/Oslo");
                                    var to = moment(reservation.to).tz("Europe/Oslo");

                                    return div(
                                        {key: "booking-" + booking.id, className: "row"},
                                        div({className: "col-xs-2"},
                                            from.format("DD.MM.YYYY, HH:mm")),
                                        div({className: "col-xs-2"},
                                            to.format("DD.MM.YYYY, HH:mm")),
                                        div({className: "col-xs-8"},
                                            booking.user.name));
                                }))),
                        div({className: "row", style: {marginTop: "2em"}},
                           div({className: "col-xs-2", style: {fontWeight: "bold"}},
                              "Invoice"),
                            div({className: "col-xs-10"},
                                div({className: "row", style: {fontWeight: "bold"}},
                                    div({className: "col-xs-2"},
                                        div({className: "row"},
                                            div({className: "col-xs-4"}, "Code"),
                                            div({className: "col-xs-4"}, "Tax"),
                                            div({className: "col-xs-4"}, "Qty"))),
                                    div({className: "col-xs-2", style: {textAlign: "right"}}, "Unit price"),
                                    div({className: "col-xs-2", style: {textAlign: "right"}}, "Sum"),
                                    div({className: "col-xs-2", style: {textAlign: "right"}}, "Sum w/tax"),
                                    div({className: "col-xs-4"}, "Description")),
                                div({className: "zebra-rows"},
                                    invoice.lines.map(function (line) {
                                        return div(
                                            {key: "line-" + line.id, className: "row"},
                                            div({className: "col-xs-2"},
                                                div({className: "row"},
                                                    div({className: "col-xs-4"}, line.product_code),
                                                    div({className: "col-xs-4"}, line.tax),
                                                    div({className: "col-xs-4"}, line.quantity))),
                                            div({className: "col-xs-2", style: {textAlign: "right"}}, displayCurrency(line.unit_price)),
                                            div({className: "col-xs-2", style: {textAlign: "right"}}, displayCurrency(line.sum_with_tax)),
                                            div({className: "col-xs-2", style: {textAlign: "right"}}, displayCurrency(line.sum_without_tax)),
                                            div({className: "col-xs-4"}, line.description));
                                    })),
                                div({className: "row", style: {backgroundColor: "#FDFA76"}},
                                    div({className: "col-xs-1 col-xs-offset-3",
                                         style: {fontWeight: "bold", textAlign: "right"}},
                                        "Total:"),
                                    div({className: "col-xs-2", style: {textAlign: "right"}}, displayCurrency(invoice.sum_with_tax)),
                                    div({className: "col-xs-2", style: {textAlign: "right"}}, displayCurrency(invoice.sum_without_tax))))));
                }));
        }
    });
    var ShowInvoiceBatch = React.createFactory(ShowInvoiceBatchClass);

    return {
        ListInvoiceBatches: ListInvoiceBatches,
        ShowInvoiceBatch: ShowInvoiceBatch
    }
}());
