import express from 'express';

import { deleteUserById, getUsers, getuserById } from '../db/users';
import { isArguments } from 'lodash';


export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers()

        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteUserById(id)

        return res.json(deletedUser)

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const udpateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params
        const { username, email_address } = req.body

        if(!username || !email_address) {
            return res.sendStatus(400)
        }

        const user = await getuserById(id)
        
        user.username = username ? username : user.username
        user.email = email_address ? email_address : user.email
        user.save()

        return res.status(200).json(user).end()

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}
