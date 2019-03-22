const path = require('path')
const express = require('express')
const expressEjsExtend = require('express-ejs-extend')
const session = require('express-session')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('@root/config/index')

// midleware
const {
    webNotFound,
    checkApiVersion
} = require('@root/app/middleware')

// routes
const {
    apiRoute
} = require('@root/routes/index')

module.exports = (app, io) => {
    app.use(cors(config.CORS))

    // View engine
    app.set('view engine', 'ejs')
    app.engine('ejs', expressEjsExtend)
    app.set('views',
        path.resolve(config.PATH.ROOT, 'app/views')
    )

    // Static
    app.use('/public', express.static(path.resolve(config.PATH.ROOT, 'public')))
    app.use('/uploads', express.static(path.resolve(config.PATH.ROOT, 'storage/uploads')))

    // Config for session
    app.set('trust proxy', 1) // trust first proxy
    app.use(session(config.SESSION))

    // config for body paser
    app.use(bodyParser.json({ limit: '10mb', extended: true }))
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

    // modify response

    // local variables

    app.use('/api/:api_version', checkApiVersion, apiRoute)

    app.use(webNotFound)

    return app
}
