Package.describe({
    summary: "Login service for Harvest"
});

Package.on_use(function(api) {
    api.use('accounts-base', ['client', 'server']);
    api.use('accounts-oauth2-helper', ['client', 'server']);
    api.use('http', ['client', 'server']);
    api.use('templating', 'client');

    api.add_files(
        ['harvest_login_button.css', 'harvest_configure.html', 'harvest_configure.js'],
        'client');
    api.add_files('harvest_common.js', ['client', 'server']);
    api.add_files('harvest_server.js', 'server');
    api.add_files('harvest_client.js', 'client');
});