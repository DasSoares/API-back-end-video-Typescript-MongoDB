import express from 'express'
import { get, merge } from 'lodash'


import { getUserBySessionToken } from '../db/users'
import { COOKIE_NAME } from '../config'

/**
 *  É uma função voltada para que apenas o usuário logado tem permissão
 *
 *  Exemplo: É uma função que valida se é o mesmo usuário, e apenas o próprio usuário poderá excluir, alterar sua conta
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params
        const currentUserId = get(req, 'identity._id') as string

        if (!currentUserId || currentUserId.toString() !== id) {
            return res.sendStatus(403)
        }

        next()

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies[COOKIE_NAME]

        if (!sessionToken) {
            return res.sendStatus(403)
        }

        const existingUser = await getUserBySessionToken(sessionToken)

        if (!existingUser) {
            return res.sendStatus(403)
        }

        merge(req, {
            identity: existingUser
        })

        return next()

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}
