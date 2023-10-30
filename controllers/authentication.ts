import express from 'express'

import { createUser, getUserByEmail } from '../db/users'
import { random, authentication } from '../helpers'
import { config, COOKIE_NAME } from '../config'


export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password ) {
            return res.sendStatus(400)
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')

        if (!user) {
            return res.sendStatus(400)
        }

        const expectedHash = authentication(user.authentication.salt, password)

        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403)
        }

        const salt = random()
        user.authentication.sessionToken = authentication(salt, user._id.toString())

        await user.save()

        res.cookie(COOKIE_NAME, user.authentication.sessionToken, { domain: config.url, path: '/' })

        return res.status(200).json(user).end()

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

// Registra um novo usuário
export const register = async (req: express.Request, res: express.Response) => {
    
    try {
        const { email, password, username } = req.body

        if (!email || !password || !username) {
            return res.sendStatus(400)
        }

        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return res.status(400).json(
                {message: "Usuário já existente na base de dados"}
            )
        }

        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            }
        })

        return res.status(200).json(user).end()
    } catch(error) {
        console.log(error)
        return res.sendStatus(400)
    }

}