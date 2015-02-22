var STORE_UTILS = (function () {
    return {
        groupBy: function (listPromise, getKey) {
            return listPromise.then(function (list) {
                var result = {};
                list.forEach(function (item) {
                    var key = getKey(item);
                    result[key] = result[key] || [];
                    result[key].push(item);
                });

                return result;
            });
        },

        groupByUnique: function (listPromise, getKey) {
            return listPromise.then(function (list) {
                var result = {};
                list.forEach(function (item) {
                    result[getKey(item)] = item;
                });

                return result;
            });
        }
    }
}());
