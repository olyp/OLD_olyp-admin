var HOURLY_BOOKING_COMPONENTS = (function () {
    var div = React.DOM.div;
    var h2 = React.DOM.h2;
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
                }));
        }
    });
    var HourlyBookingsOverview = React.createFactory(HourlyBookingsOverviewClass);

    return {
        HourlyBookingsOverview: HourlyBookingsOverview
    }
}());
