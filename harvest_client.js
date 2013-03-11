(function () {
    Meteor.loginWithHarvest = function (options, callback) {
        if (!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }

        var config = Accounts.loginServiceConfiguration.findOne({
            service: 'harvest'
        });
        if (!config) {
            callback && callback(new Accounts.ConfigError("Service not configured"));
            return;
        }

        var state = Meteor.uuid();

        var loginUrl =
            'https://api.harvestapp.com/oauth2/authorize' +
                '?client_id=' + config.clientId +
                '&redirect_uri=' + Meteor.absoluteUrl('_oauth/harvest?close=close') +
                '&response_type=code'+
                '&state=' + state;
        ;

        Accounts.oauth.initiateLogin(state, loginUrl, callback);
    };

})();