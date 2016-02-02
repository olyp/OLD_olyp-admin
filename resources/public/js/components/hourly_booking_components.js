var HOURLY_BOOKING_COMPONENTS = (function () {
    var div = React.DOM.div;
    var h2 = React.DOM.h2;
    var label = React.DOM.label;
    var input = React.DOM.input;
    var BOOKING_DATE_FORMAT = "DD.MM.YYYY, HH:mm";

    // moment().tz("Europe/Oslo").isoWeekday(1)

    function pluralized(n, one, many) {
        if (n === 1) {
            return n + " " + one;
        } else {
            return n + " " + many;
        }
    }

    function formatDiff(millis) {
        if (millis < 60000) {
            return pluralized(Math.round(millis / 1000), "second", "seconds");
        }

        if (millis < 86400000) {
            return pluralized(Math.round(millis / 1000 / 24), "hour", "hours");
        }

        return pluralized(Math.round(millis / 1000 / 24 / 60 / 60), "day", "days");
    }

    var HourlyBookingsOverviewClass = React.createClass({
        gotoUnbatched: function () {
            this.props.actions.hourlyBookingActions.gotoUnbatched();
        },

        gotoCreateBatch: function () {
            this.props.actions.hourlyBookingActions.gotoCreateBatch();
        },

        gotoManageBatch: function (hourlyBookingBatch) {
            this.props.actions.hourlyBookingActions.gotoManageBatch(hourlyBookingBatch.id);
        },

        render: function () {
            return div(
                null,
                h2(null, "Recently deleted"),
                div({className: "row", style: {fontWeight: "bold"}},
                    div({className: "col-xs-2"}, "User"),
                    div({className: "col-xs-2"}, "From"),
                    div({className: "col-xs-2"}, "To"),
                    div({className: "col-xs-2"}, "Created"),
                    div({className: "col-xs-1"}, "Deleted diff.")),
                this.props.recentlyDeletedHourlyBookings.map(function (recentlyDeletedBooking) {
                    var booking = recentlyDeletedBooking.reservation;
                    var deletedAt = moment(recentlyDeletedBooking.deleted_at);
                    var createdAt = moment(recentlyDeletedBooking.created_at);

                    return div(
                        {key: "booking-" + booking.id, className: "row"},
                        div({className: "col-xs-2"}, booking.booking.user.name),
                        div({className: "col-xs-2"}, moment(booking.from).format(BOOKING_DATE_FORMAT)),
                        div({className: "col-xs-2"}, moment(booking.to).format(BOOKING_DATE_FORMAT)),
                        div({className: "col-xs-2"}, createdAt.format(BOOKING_DATE_FORMAT)),
                        div({className: "col-xs-1", title: deletedAt.format(BOOKING_DATE_FORMAT)}, formatDiff(deletedAt.valueOf() - createdAt.valueOf())))
                }),
                h2(null, "Batches"),
                React.DOM.a({className: "btn btn-default", onClick: this.gotoUnbatched}, "View unbatched"),
                " ",
                React.DOM.a({className: "btn btn-default", onClick: this.gotoCreateBatch}, "Create batch"),
                React.DOM.p(),
                this.props.hourlyBookingBatches.map(function (hourlyBookingBatch) {
                    return React.DOM.div(
                        {key: "hourly-booking-batch-" + hourlyBookingBatch.id, className: "row"},
                        React.DOM.div({className: "col-xs-1"}, hourlyBookingBatch.month),
                        React.DOM.div({className: "col-xs-11"}, React.DOM.a({className: "btn btn-default btn-xs", onClick: function () { this.gotoManageBatch(hourlyBookingBatch); }.bind(this)}, "Manage")));
                }.bind(this)));
        }
    });
    var HourlyBookingsOverview = React.createFactory(HourlyBookingsOverviewClass);

    var HourlyBookingsUnbatchedClass = React.createClass({
        getInitialState: function () {
            return {
                selectedBatchId: this.props.hourlyBookingBatches[0].id,
                selectedHourlyBookings: {}
            }
        },

        onBatchSelectChanged: function (e) {
            this.setState({selectedBatchId: e.target.value});
        },

        addSelectedToBatch: function () {
            this.props.actions.hourlyBookingActions.addHourlyBookingsToBatch(this.state.selectedBatchId, Object.keys(this.state.selectedHourlyBookings));
        },

        toggleHourlyBooking: function (checked, hourlyBooking) {
            var newSelectedHourlyBookings = JSON.parse(JSON.stringify(this.state.selectedHourlyBookings));
            if (checked) {
                newSelectedHourlyBookings[hourlyBooking.id] = true;
            } else {
                delete newSelectedHourlyBookings[hourlyBooking.id];
            }
            this.setState({selectedHourlyBookings: newSelectedHourlyBookings});
        },

        render: function () {
            return div(
                null,
                React.DOM.select(
                    {onChange: this.onBatchSelectChanged, value: this.state.selectedBatchId},
                    this.props.hourlyBookingBatches.map(function (hourlyBookingBatch) {
                        return React.DOM.option({key: "hourly-booking-batch-" + hourlyBookingBatch.id, value: hourlyBookingBatch.id}, hourlyBookingBatch.month)
                    })),
                React.DOM.a({className: "btn btn-default btn-xs", onClick: this.addSelectedToBatch}, "Add to batch"),
                div({className: "row"},
                    div({className: "col-xs-1"}),
                    div({className: "col-xs-2", style: {fontWeight: "bold"}}, "User"),
                    div({className: "col-xs-2", style: {fontWeight: "bold"}}, "From"),
                    div({className: "col-xs-2", style: {fontWeight: "bold"}}, "To"),
                    div({className: "col-xs-4", style: {fontWeight: "bold"}}, "Comment")),
                this.props.unbatchedBookings.map(function (hourlyBooking, i) {
                    return div(
                        {key: "unbatched-booking-" + hourlyBooking.id, className: "row", style: {backgroundColor: i % 2 === 0 ? "#eee" : "#fff"}},
                        div({className: "col-xs-1"},
                            React.DOM.input({
                                type: "checkbox",
                                onChange: function (e) { this.toggleHourlyBooking(e.target.checked, hourlyBooking) }.bind(this),
                                value: hourlyBooking.id in this.state.selectedHourlyBookings})),
                        div({className: "col-xs-2"}, hourlyBooking.booking.user.name),
                        div({className: "col-xs-2"}, moment(hourlyBooking.from).format(BOOKING_DATE_FORMAT)),
                        div({className: "col-xs-2"}, moment(hourlyBooking.to).format(BOOKING_DATE_FORMAT)),
                        div({className: "col-xs-4"}, "-"));
                }.bind(this)));
        }
    });

    var HourlyBookingsBatchNewClass = React.createClass({
        mixins: [React.addons.LinkedStateMixin],

        getInitialState: function () {
            var now = moment();
            return {
                year: now.format("YYYY"),
                month: now.format("MM")
            }
        },

        onSubmit: function (e) {
            e.preventDefault();
            this.props.actions.hourlyBookingActions.createBatch(this.state.year, this.state.month);
        },

        render: function () {
            return React.DOM.form(
                {onSubmit: this.onSubmit, className: "form-inline"},
                div({className: "form-group"},
                    label(null, "Year"),
                    " ",
                    input({type: "text", className: "form-control", valueLink: this.linkState("year")})),
                " ",
                div({className: "form-group"},
                    label(null, "Month"),
                    " ",
                    input({type: "text", className: "form-control", valueLink: this.linkState("month")})),
                " ",
                React.DOM.button({className: "btn btn-default"}, "Create batch"));
        }
    });

    var HourlyBookingsBatchShowClass = React.createClass({
        getInitialState: function () {
            return {
                selectedHourlyBookings: {}
            }
        },

        toggleHourlyBooking: function (checked, hourlyBooking) {
            var newSelectedHourlyBookings = JSON.parse(JSON.stringify(this.state.selectedHourlyBookings));
            if (checked) {
                newSelectedHourlyBookings[hourlyBooking.id] = true;
            } else {
                delete newSelectedHourlyBookings[hourlyBooking.id];
            }
            this.setState({selectedHourlyBookings: newSelectedHourlyBookings});
        },

        onUnbatchHourlyBookingsClicked: function () {
            console.log(this.props.hourlyBookingBatch.reservation_batch);
            this.props.actions.hourlyBookingActions.unbatchHourlyBookings(this.props.hourlyBookingBatch.reservation_batch.id, Object.keys(this.state.selectedHourlyBookings));
        },

        render: function () {
            return div(
                null,
                React.DOM.p(null, "Batch " + this.props.hourlyBookingBatch.reservation_batch.month),
                React.DOM.div(
                    {className: "row"},
                    React.DOM.div({className: "col-xs-1"}, React.DOM.a({className: "btn btn-default btn-xs", onClick: this.onUnbatchHourlyBookingsClicked, disabled: Object.keys(this.state.selectedHourlyBookings).length === 0}, "Unbatch checked hourly bookings"))
                ),
                this.props.hourlyBookingBatch.customers.map(function (it) {
                    var customer = it.customer;
                    var hourlyBookings = it.reservations;
                    var line = it.line;

                    return React.DOM.div(
                        {key: "customer-" + customer.id},
                        React.DOM.h2({style: {marginTop: 50}}, customer.name),
                        div({className: "row"},
                            div({className: "col-xs-1"}),
                            div({className: "col-xs-2", style: {fontWeight: "bold"}}, "User"),
                            div({className: "col-xs-2", style: {fontWeight: "bold"}}, "From"),
                            div({className: "col-xs-2", style: {fontWeight: "bold"}}, "To"),
                            div({className: "col-xs-4", style: {fontWeight: "bold"}}, "Comment")),
                        hourlyBookings.map(function (hourlyBooking) {
                            return React.DOM.div(
                                {key: "hourly-booking-" + hourlyBooking.id, className: "row"},
                                div({className: "col-xs-1"},
                                    React.DOM.input(
                                        {
                                            type: "checkbox",
                                            onChange: function (e) { this.toggleHourlyBooking(e.target.checked, hourlyBooking) }.bind(this),
                                            value: hourlyBooking.id in this.state.selectedHourlyBookings
                                        }
                                    )),
                                div({className: "col-xs-2"}, hourlyBooking.booking.user.name),
                                div({className: "col-xs-2"}, moment(hourlyBooking.from).format(BOOKING_DATE_FORMAT)),
                                div({className: "col-xs-2"}, moment(hourlyBooking.to).format(BOOKING_DATE_FORMAT)),
                                div({className: "col-xs-4"}, "-"))
                        }.bind(this)),
                        React.DOM.p(null, React.DOM.span({style: {fontWeight: "bold"}}, "Free hours"), ": " + customer.room_booking_free_hours),
                        React.DOM.div(
                            {className: "row", style: {fontWeight: "bold"}},
                            React.DOM.div({className: "col-xs-1"}),
                            React.DOM.div({className: "col-xs-1"}, "Hours"),
                            React.DOM.div({className: "col-xs-1"}, "Sum"),
                            React.DOM.div({className: "col-xs-1"}, "Sum (w/tax)"),
                            React.DOM.div({className: "col-xs-1"}, "Tax")),
                        React.DOM.div(
                            {className: "row"},
                            React.DOM.div({className: "col-xs-1", style: {fontWeight: "bold"}}, "Total"),
                            React.DOM.div({className: "col-xs-1", style: {backgroundColor: "#FDFA76"}}, line.total_hours),
                            React.DOM.div({className: "col-xs-1", style: {backgroundColor: "#FDFA76"}}, line.base_sum_without_tax),
                            React.DOM.div({className: "col-xs-1", style: {backgroundColor: "#FDFA76"}}, line.base_sum_with_tax),
                            React.DOM.div({className: "col-xs-1", style: {backgroundColor: "#FDFA76"}}, line.tax)),
                        React.DOM.div(
                            {className: "row"},
                            React.DOM.div({className: "col-xs-1", style: {fontWeight: "bold"}}, "Billable"),
                            React.DOM.div({className: "col-xs-1", style: {backgroundColor: "#FDFA76"}}, Math.max(0, line.total_hours - customer.room_booking_free_hours)),
                            React.DOM.div({className: "col-xs-1", style: {backgroundColor: "#FDFA76"}}, line.sum_without_tax),
                            React.DOM.div({className: "col-xs-1", style: {backgroundColor: "#FDFA76"}}, line.sum_with_tax),
                            React.DOM.div({className: "col-xs-1", style: {backgroundColor: "#FDFA76"}}, line.tax)));
                }.bind(this)));
        }
    });

    return {
        HourlyBookingsOverview: HourlyBookingsOverview,
        HourlyBookingsUnbatched: React.createFactory(HourlyBookingsUnbatchedClass),
        HourlyBookingsBatchNew: React.createFactory(HourlyBookingsBatchNewClass),
        HourlyBookingsBatchShow: React.createFactory(HourlyBookingsBatchShowClass)
    }
}());
