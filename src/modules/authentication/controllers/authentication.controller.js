import dotenv from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'
import * as logger from '../../../utils/console.logger.js'
import { run } from '../../../utils/database.utils.js'
import { notEmptyOrThrow } from '../../../utils/validation.utils.js'

dotenv.config()

export const login = (request, response) => {

    const { username, password } = request.body

    try {
        notEmptyOrThrow(username, 'Missing username')
        notEmptyOrThrow(password, 'Missing password')
    } catch (error) {
        logger.error(error.message)
        return response.status(400).json({ success: false, message: error.message })
    }

    run('SELECT id FROM users WHERE username = ? AND password = ?', [ username, password ]).then((users) => {
        if (users.length === 0) {
            return response.status(403).json({ success: false, message: 'Invalid username or password' })
        }

        const secret = process.env.JWT_SECRET ?? 'some secret instead'
        const expiresIn = process.env.JWT_EXPIRES_IN ?? '1Day'
        const algorithm = process.env.JWT_ALGORITHM ?? 'HS256'
        const payload = { username }
        const jwt = jsonwebtoken.sign(payload, secret, { algorithm, expiresIn })

        response.cookie('jsonwebtoken', jwt, { httpOnly: true })
        response.status(202).json({ success: true, message: 'User logged in successfully' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const logout = (_, response) => {

    response.cookie('jsonwebtoken', '', { httpOnly: true })
    response.status(202).json({ success: true, message: 'User logged out successfully' })

}

export const viewLoginPage = (request, response) => {

    if (request.session?.username) {
        return response.redirect('/')
    }
    response.render('../src/modules/authentication/views/login.view.ejs')

}