Package.describe({
    summary: "Login service for Harvest",
    version: "0.0.2",
    git: "git@github.com:emmerge/meteor-accounts-harvest.git",
    name: "emmerge:accounts-harvest",
    documentation: 'README.md'
});

Package.on_use(function(api) {
    api.versionsFrom("METEOR@0.9.0");
    api.export("Harvest", ['client', 'server']);

    api.use('accounts-base', ['client', 'server']);
    api.imply('accounts-base', ['client', 'server']);
    api.use('accounts-oauth', ['client', 'server']);

    api.use('oauth', ['client', 'server']);
    api.use('oauth2', ['client', 'server']);
    api.use('http', ['server']);
    api.use('underscore', 'server');
    api.use('templating', 'client');
    api.use('random', 'client');
    api.use('service-configuration', ['client', 'server']);


    api.add_files('harvest_server.js', 'server');

    api.add_files(
        ['harvest_login_button.css', 'harvest_client.js', 'harvest_configure.html', 'harvest_configure.js'],
        'client');
    api.add_files('harvest.js');
});