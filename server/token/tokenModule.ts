import jwt from 'jsonwebtoken';
import { envs } from '../core/config/env';

interface  Ipaylaod {
    client_id: string,
    name: string,
    password: string,
    email: string,
    // exp: number,
    role: string
    
}

const tokenModule = {
    createToken : (payload: Ipaylaod) => {
        return jwt.sign(payload, envs.token_key, {expiresIn: "1h"})
    },
    verifyAccessToken : (token: string): Ipaylaod | null => {
        try {
            return jwt.verify(token, envs.token_key) as Ipaylaod
        } catch (error) {
            console.error("Erreur de vérification du token d'accès:",error)
            return null
        }
    },

    //: null | { [key: string]: any } | string pour la getion des erreur typescript

    decodeAccessToken : (token: string): null | { [key: string]: any } | string => {
        return jwt.decode(token)
    },

    createRefreshtoken: (payload: Ipaylaod) => {
        return jwt.sign(payload, envs.refresh_token, {expiresIn: "30d"})
    },
    verifyRefreshToken : (token:string): Ipaylaod | null => {
        return jwt.verify(token, envs.refresh_token) as Ipaylaod
    },
    decodeAccessrefreshToken : (token: string): null | { [key: string]: any } | string => {
        return jwt.decode(token)
    },
    
}

export default tokenModule
