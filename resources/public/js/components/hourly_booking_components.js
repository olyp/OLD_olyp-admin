var HOURLY_BOOKING_COMPONENTS = (function () {
    var div = React.DOM.div;
    var h2 = React.DOM.h2;
    var BOOKING_DATE_FORMAT = "DD.MM.YYYY, HH:mm";

    // moment().tz("Europe/Oslo").isoWeekday(1)

    var HourlyBookingsOverviewClass = React.createClass({
        render: function () {
            return div(
                null,
                h2(null, "Recently deleted"),
                div({className: "row", style: {fontWeight: "bold"}},
                    div({className: "col-xs-4"}, "Bruker"),
                    div({className: "col-xs-1"}, "Fakturert?"),
                    div({className: "col-xs-2"}, "Fra?"),
                    div({className: "col-xs-2"}, "Til?")),
                this.props.recentlyDeletedHourlyBookings.map(function (booking) {
                    return div(
                        {key: "booking-" + booking.id, className: "row"},
                        div({className: "col-xs-2"}, booking.booking.user.name),
                        div({className: "col-xs-2"}, booking.booking.user.email),
                        div({className: "col-xs-1"}, booking.booking.is_invoiced + ""),
                        div({className: "col-xs-2"}, moment(booking.from).format(BOOKING_DATE_FORMAT)),
                        div({className: "col-xs-2"}, moment(booking.to).format(BOOKING_DATE_FORMAT)))
                }));
        }
    });
    var HourlyBookingsOverview = React.createFactory(HourlyBookingsOverviewClass);

    return {
        HourlyBookingsOverview: HourlyBookingsOverview
    }
}());
