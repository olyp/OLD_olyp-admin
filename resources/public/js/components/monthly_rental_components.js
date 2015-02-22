var MONTHLY_RENTAL_COMPONENTS = (function () {

    var MonthlyRentalOverviewClass = React.createClass({
        render: function () {
            var monthlyRentalsByRoom = this.props.monthlyRentalsByRoom;
            var customersById = this.props.customersById;
            var totalMonthlyPrice = this.props.totalMonthlyPrice;

            return React.DOM.div(
                null,
                React.DOM.button({className: "btn btn-default"}, "Add monthly rental"),
                this.props.monthlyRentalRooms.map(function (room) {
                    var rentals = monthlyRentalsByRoom[room.id] || [];
                    return React.DOM.div(
                        {key: "room-" + room.id},
                        React.DOM.h2(null, room.name),
                        rentals.map(function (rental) {
                            return React.DOM.div(
                                {
                                    key: "rental-" + rental.id,
                                    className: "row"
                                },
                                React.DOM.div(
                                    {className: "col-xs-6"},
                                    customersById[rental.customer_id].name),
                                React.DOM.div(
                                    {className: "col-xs-4"},
                                    rental.monthly_price),
                                React.DOM.div(
                                    {className: "col-xs-2"},
                                    React.DOM.button({className: "btn btn-default btn-xs"}, "Edit")));
                        }),
                        React.DOM.hr());
                }),
                React.DOM.div(
                    {className: "row"},
                    React.DOM.div(
                        {className: "col-xs-1 col-xs-offset-5"},
                        React.DOM.p({className: "text-right"}, "Sum:")),
                    React.DOM.div(
                        {className: "col-xs-4", style: {fontWeight: "bold"}},
                        totalMonthlyPrice)));
        }
    });
    var MonthlyRentalOverview = React.createFactory(MonthlyRentalOverviewClass);

    return {
        MonthlyRentalOverview: MonthlyRentalOverview
    };
}());
