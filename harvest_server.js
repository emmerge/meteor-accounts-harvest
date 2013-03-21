(function () {
    Accounts.oauth.registerService('harvest', 2, function(query) {

        var accessToken = getAccessToken(query);
        var identity = getIdentity(accessToken);

        return {
            serviceData: {
                id: identity.id,
                accessToken: accessToken,
                email: identity.email,
                admin: identity.admin,
                timestamp_timers: identity.timestamp_timers,
                timezone: identity.timezone,
                company: {
                    "base-uri": identity.company.base-uri
                }
            },
            options: {
                profile: {
                    id: user.id,
                    name: identity.email
                }
            }
        };
    });

    var getAccessToken = function (query) {
        var config = Accounts.loginServiceConfiguration.findOne({service: 'harvest'});
        if (!config)
            throw new Accounts.ConfigError("Service not configured");

        var result = Meteor.http.post(
            "https://api.harvestapp.com/oauth2/token", {
                headers: {
                    Accept: 'application/json',
                    'content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    code: query.code,
                    client_id: config.clientId,
                    client_secret: config.secret,
                    redirect_uri: Meteor.absoluteUrl("_oauth/harvest?close"),
                    grant_type: 'authorization_code'
                }
            });
        if (result.error) // if the http response was an error
            throw result.error;
        if (result.data.error) // if the http response was a json object with an error attribute
            throw result.data;
        return result.data.access_token;
    };

    var getIdentity = function (accessToken) {
        var result = Meteor.http.get(
            "https://api.harvestapp.com/account/who_am_i",
            {params: {access_token: accessToken}});
        if (result.error)
            throw result.error;
        return result.data;
    };
}) ();