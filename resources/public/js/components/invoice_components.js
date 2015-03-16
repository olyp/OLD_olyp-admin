var INVOICE_COMPONENTS = (function () {
    "use strict";

    var div = React.DOM.div;
    var a = React.DOM.a;
    var span = React.DOM.span;
    var input = React.DOM.input;

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
            return digitsToStr(res, 2);
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

    function digitsToStr(digits, n) {
        var digitsStr = digits.toString();
        if (digitsStr.length == n) {
            return digitsStr;
        } else {
            var prefix = [];
            for (var i = 0 + digitsStr.length; i < n; i++) {
                prefix.push("0");
            }
            return prefix.join("") + digitsStr;
        }
    }

    function propOr(a, b, prop) {
        if (a.hasOwnProperty(prop)) {
            return a[prop];
        } else {
            return b[prop];
        }
    }

    var InvoiceLineFormRowClass = React.createClass({
        mixins: [React.addons.LinkedStateMixin],

        getInitialState: function () {
            return {
                tax: 0,
                quantity: 1
            };
        },

        onSaveButtonClicked: function () {
        },

        computeSum: function (unitPrice, tax, quantity) {
            var taxFactor = (tax / 100) || 0;
            var sum = unitPrice * quantity;
            if (isNaN(sum)) {
                this.setState({sum: 0, sumWithTax: 0});
            } else {
                this.setState({sum: sum, sumWithTax: sum + (sum * taxFactor)});
            }
        },

        clearSum: function () {
            this.setState({sum: "", sumWithTax: ""});
        },

        setPriceAttr: function (attr, stringValue) {
            var intValue = parseInt(stringValue, 10);
            if (isNaN(intValue)) {
                var newState = {};
                newState[attr] = stringValue;
                this.setState(newState);
                this.clearSum();
            } else {
                var newState = {};
                newState[attr] = intValue;
                this.setState(newState);
                this.computeSum(propOr(newState, this.state, "unitPrice"), propOr(newState, this.state, "tax"), propOr(newState, this.state, "quantity"));
            }
        },

        onUnitPriceChanged: function (e) {
            this.setPriceAttr("unitPrice", e.target.value);
        },

        onTaxChanged: function (e) {
            this.setPriceAttr("tax", e.target.value);
        },

        onQuantityChanged: function (e) {
            this.setPriceAttr("quantity", e.target.value);
        },

        render: function () {
            return div({className: "row", style: {marginTop: "2px", marginBottom: "2px"}},
                       div({className: "col-xs-2"},
                           div({className: "row"},
                               div({className: "col-xs-4"}, input({className: "table-form-control", valueLink: this.linkState("product_code")})),
                               div({className: "col-xs-4"}, input({className: "table-form-control", value: this.state.tax, onChange: this.onTaxChanged})),
                               div({className: "col-xs-4"}, input({className: "table-form-control", value: this.state.quantity, onChange: this.onQuantityChanged})))),
                       div({className: "col-xs-2", style: {textAlign: "right"}}, input({className: "table-form-control-right", value: this.state.unitPrice, onChange: this.onUnitPriceChanged})),
                       div({className: "col-xs-2", style: {textAlign: "right"}}, input({className: "table-form-control-right", value: this.state.sum, readOnly: true})),
                       div({className: "col-xs-2", style: {textAlign: "right"}}, input({className: "table-form-control-right", value: this.state.sumWithTax, readOnly: true})),
                       div({className: "col-xs-3"}, input({className: "table-form-control", valueLink: this.linkState("description")})),
                       div({className: "col-xs-1"}, a({className: "btn btn-default btn-sm", onClick: this.onSaveButtonClicked}, this.props.buttonTitle)))
        }
    });
    var InvoiceLineFormRow = React.createFactory(InvoiceLineFormRowClass);

    var ShowInvoiceBatchClass = React.createClass({
        onInvoiceLineEditClicked: function (line) {
        },

        onInvoiceLineDeleteClicked: function (line) {
        },

        addRow: function (formData) {
            console.log("ADD", formData);
        },

        render: function () {
            var self = this;

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
                                    div({className: "col-xs-2"}, "Duration"),
                                    div({className: "col-xs-6"}, "User")),
                                invoice.reservations.map(function (reservation) {
                                    var booking = reservation.booking;
                                    var from = moment(reservation.from).tz("Europe/Oslo");
                                    var to = moment(reservation.to).tz("Europe/Oslo");
                                    var durationInMinutes = to.diff(from, "minutes");
                                    var durationHours = Math.floor(durationInMinutes / 60);
                                    var durationMinutes = durationInMinutes % 60;

                                    return div(
                                        {key: "booking-" + booking.id, className: "row"},
                                        div({className: "col-xs-2"},
                                            from.format("DD.MM.YYYY, HH:mm")),
                                        div({className: "col-xs-2"},
                                            to.format("DD.MM.YYYY, HH:mm")),
                                        div({className: "col-xs-2"},
                                            durationHours + ":" + digitsToStr(durationMinutes, 2)),
                                        div({className: "col-xs-6"},
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
                                            div({className: "col-xs-3"}, line.description),
                                            div({className: "col-xs-1"},
                                                a({className: "btn btn-default btn-xs", onClick: function () { self.onInvoiceLineEditClicked(line) }}, span({className: "glyphicon glyphicon-pencil"})),
                                                " ",
                                                a({className: "btn btn-default btn-xs", onClick: function () { self.onInvoiceLineDeleteClicked(line) }}, span({className: "glyphicon glyphicon-trash"}))));
                                    })),
                                InvoiceLineFormRow({buttonTitle: "Add line", onSubmit: function (formData) { self.addRow(formData); }}),
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
