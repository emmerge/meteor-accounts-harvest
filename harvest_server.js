Harvest = {};

OAuth.registerService('harvest', 2, null, function(query) {

    var tokens = getTokens(query);
    var identity = getIdentity(tokens.accessToken);
    
    ret = {
        serviceData: {
            id: identity.user.id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: (+new Date) + (1000 * tokens.expiresIn),
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
                name: identity.user.first_name + " " + identity.user.last_name
            }
        }
    };

    return ret;
});

var getTokens = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: 'harvest'});
    if (!config)
        throw new ServiceConfiguration.ConfigError();

    var response;
    try {
        response = HTTP.post(
            "https://api.harvestapp.com/oauth2/token", {
                headers: {
                    Accept: 'application/json',
                },
                params: {
                    code: query.code,
                    client_id: config.clientId,
                    client_secret: config.secret,
                    redirect_uri: OAuth._redirectUri('harvest', config),
                    grant_type: 'authorization_code'
                }
            });
    } catch (err) {
        throw _.extend(new Error("Failed to complete OAuth handshake with Harvest. " + err.message),
                {response: err.response});
    }

    if (response.data.error) { // if the http response was a json object with an error attribute
        throw new Error("Failed to complete OAuth handshake with Harvest. " + response.data.error);
    } else {
        return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresIn: response.data.expires_in
        };
    }
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


Harvest.retrieveCredential = function(credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
