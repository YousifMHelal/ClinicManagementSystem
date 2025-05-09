import dotenv from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'
import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

dotenv.config()

export const parseJsonwebtoken = (request, _, next) => {

    const jwt = request.cookies.jsonwebtoken
    if (jwt && jwt.length > 0) {
        const secret = process.env.JWT_SECRET ?? 'some secret instead'
        jsonwebtoken.verify(jwt, secret, (error, payload) => {
            if (error) return
            request.session = payload
        })
    }
    next()

}

export const authenticated = (request) => {

    return new Promise((resolve, reject) => {
        if (!(request.session?.username)) return reject(new Error('Token not found'))
        run('SELECT id FROM users WHERE username LIKE ?', [ request.session.username ]).then((users) => {
            if (users.length === 0) return reject(new Error('User not found'))
            resolve()
        })
    })

}

export const authenticatedPage = (request, response, next) => {

    authenticated(request).then(next).catch((error) => {
        logger.error(error.message)
        response.cookie('jsonwebtoken', '', { httpOnly: true })
        response.redirect(`/auth/login?back-to=${request.url}`)
    })

}

export const authenticatedApi = (request, response, next) => {

    authenticated(request).then(next).catch((error) => {
        logger.error(error.message)
        response.cookie('jsonwebtoken', '', { httpOnly: true })
        response.status(401).json({ success: false, message: 'Unauthorized user' })
    })

}