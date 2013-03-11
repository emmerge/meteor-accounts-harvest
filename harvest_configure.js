Template.configureLoginServiceDialogForHarvest.siteUrl = function () {
    return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForHarvest.fields = function () {
    return [
        {property: 'clientId', label: 'Client ID'},
        {property: 'secret', label: 'Client Secret'}
    ];
};