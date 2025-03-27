import { Router } from "express";
import controllers from "../controlleurs/clients";
import validator from "../middlewares/validator";
import clientConnect from "../middlewares/connected";

const user = Router()

user.post('/signup',validator.userValidator,  controllers.postUser)
user.post('/login', controllers.Userlogin)
user.post('/logout', controllers.LogoutUser)
user.get('/profile',clientConnect.verifyAccessToken, clientConnect.verifyRefreshToken, controllers.getUser)
user.put('/profile',clientConnect.verifyAccessToken, clientConnect.verifyRefreshToken, controllers.updateUser)
user.delete('/profile',clientConnect.verifyAccessToken, clientConnect.verifyRefreshToken, controllers.deleteUser)

export default user