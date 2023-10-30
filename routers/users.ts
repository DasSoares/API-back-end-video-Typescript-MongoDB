import express from 'express';

import { isAuthenticated, isOwner } from '../middlewares';
import { deleteUser, getAllUsers, udpateUser } from '../controllers/users';


export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers)
    // A função abaixo, no caso seria deleteMyAccount
    // caso seja o mesmo usuário, pode apagar sua conta
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser)
    router.put('/users/:id', isAuthenticated, isOwner, udpateUser)
}
