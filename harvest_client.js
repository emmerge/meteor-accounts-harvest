Harvest = {};

// Request Harvest credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Harvest.requestCredential = function (options, credentialRequestCompleteCallback) {
    // support both (options, callback) and (callback).
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({service: 'harvest'});
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(
            new ServiceConfiguration.ConfigError());
        return;
    }

    var scope = (options && options.requestPermissions) || [];
    var flatScope = _.map(scope, encodeURIComponent).join(',');

    var loginStyle = OAuth._loginStyle('harvest', config, options);

    var redirectUri = OAuth._redirectUri('harvest', config);

    var credentialToken = Random.id();
    var loginUrl =
        'https://api.harvestapp.com/oauth2/authorize' +
        '?client_id=' + config.clientId +
        '&redirect_uri=' + redirectUri +
        '&response_type=code' +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken);

    var height = 620;
    OAuth.launchLogin({
        loginService: 'harvest',
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken,
        popupOptions: {width: 900, height: height}
    });
};
