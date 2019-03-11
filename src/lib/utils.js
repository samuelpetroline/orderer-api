module.exports = {
    btoa: function(value) {
        return Buffer.from(value).toString('base64');
    },

    atob: function(value) {
        return Buffer.from(value, 'base64').toString();
    }
}