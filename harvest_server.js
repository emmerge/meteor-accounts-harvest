(function () {
    Accounts.oauth.registerService('harvest', 2, function(query) {

        var accessToken = getAccessToken(query);
        var identity = getIdentity(accessToken);

        return {
            serviceData: {
                id: identity.user.id,
                accessToken: accessToken,
                email: identity.user.email,
                admin: identity.user.admin,
                timestamp_timers: identity.user.timestamp_timers,
                timezone: identity.user.timezone,
                company: {
                    base_uri: identity.company.base_uri,
                    name: identity.company.name,
                    week_start_day: identity.company.week_start_day
                }
            },
            options: {
                profile: {
                    id: identity.user.id,
                    name: identity.user.email
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
            "https://api.harvestapp.com/account/who_am_i", {
                headers: {
                    Accept: 'application/json',
                },
                params: {
                    access_token: accessToken
                }
            });
        if (result.error)
            throw result.error;
        return result.data;
    };
}) ();
