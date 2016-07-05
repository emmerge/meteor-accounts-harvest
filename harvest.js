
Accounts.oauth.registerService('harvest');

if (Meteor.isClient) {
    Meteor.loginWithHarvest = function(options, callback) {
        // support a callback without options
        if (! callback && typeof options === "function") {
            callback = options;
            options = null;
        }

        var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
        Harvest.requestCredential(options, credentialRequestCompleteCallback);
    };

} else {
    Accounts.addAutopublishFields({
        // publish all fields including access token, which can legitimately
        // be used from the client (if transmitted over ssl or on
        // localhost). http://www.meetup.com/meetup_api/auth/#oauth2implicit
        forLoggedInUser: ['services.slack'],
        forOtherUsers: ['services.slack.id']
    });
}