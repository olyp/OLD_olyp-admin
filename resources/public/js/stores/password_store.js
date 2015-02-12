var PASSWORD_STORE = (function () {
    var PASSWORD_CHARS = "abcdefghjkmnpqrstuvwxyz23456789";
    var PASSWORD_SIZE = 10;

    function passwordStoreFactory() {
        return {
            generateRandomPassword: function () {
                var res = [];

                if (window.crypto && window.Uint32Array) {
                    var array = new Uint32Array(PASSWORD_SIZE)
                    window.crypto.getRandomValues(array);
                    for (var i = 0; i < array.length; i++) {
                        res.push(PASSWORD_CHARS[array[i] % PASSWORD_CHARS.length]);
                    }
                } else {
                    for (var i = 0; i < PASSWORD_SIZE; i++) {
                        res.push(PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)]);
                    }
                }

                return res.join("");
            }
        }
    }

    return {
        create: passwordStoreFactory
    }
}());
