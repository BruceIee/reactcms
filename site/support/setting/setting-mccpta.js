exports.setting = {

    // web app
    app_name: 'MCCPTA',
    website: 'http://mccpta.leapon.com',

    // http/https mode
    http_mode: true,
    http_port: 8106,

    // database
    database: {
        type: 'mongo',
        host: 'localhost',
        port: 27017,
        name: 'reactcms_mccpta'
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
        homepage: 'mccpta',
        header: 'mccpta_header',
        footer: 'mccpta_footer'
    },
    
    // invite code
    invite: {
        code: 'mccpta_site'
    }

};
