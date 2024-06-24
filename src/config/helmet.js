const helmet = require('helmet');

const helmetConfig = (app) => {
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    }));

    app.use(helmet.frameguard({ action: 'deny' }));

    app.use(helmet.noSniff());

    app.use(helmet.xssFilter());

    app.use(helmet.hsts({
        maxAge: 31536000, // 1 rok
        includeSubDomains: true,
        preload: true,
    }));

    app.use(helmet.hidePoweredBy());

    app.use(helmet.dnsPrefetchControl({ allow: false }));

    app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
};

module.exports = helmetConfig;
