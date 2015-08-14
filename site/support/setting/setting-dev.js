exports.setting = {

    // web app
    app_name: 'ReactCMS',
    website: 'http://localhost',
    access_check: false,
    access_code: 'password',

    // http/https mode
    http_mode: true,
    http_port: 8700,
    https_mode: false,
    https_port: 8443,
    https_key: '',
    https_certificate: '',
    https_root_certificate: '',
    https_intermediate_certificate: '',
    http_to_https: false,  // redirect http to https

    // database
    database: {
        type: 'mongo',
        host: 'localhost',
        port: 27017,
        name: 'reactcms'
    },
    
    // email setting
    email: {
        service: 'gmail',
        username: 'test@example.com',
        password: 'test',
        sender: 'test@example.com'
    },
    
    // site setting
    site: {
        name: 'default_site',
        header: 'default_header',
        footer: 'default_footer'
    },
    
    // invite code
    invite: {
        code: 'react_cms'
    }

};
