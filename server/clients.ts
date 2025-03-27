import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import bcrypt from "bcrypt"
import { validationResult } from "express-validator";
import tokenModule from "../token/tokenModule";

const prisma = new PrismaClient()


const controllers = {

    postUser: async (req: Request, res: Response) => {

        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(HttpCode.NOT_FOUND).json({ error: error.array() })
        }

        try {
            const { name, password, email } = req.body

            const crypt = await bcrypt.hash(password, 10)

            const user = await prisma.clients.create({
                data: {
                    name,
                    password: crypt,
                    email
                }
            })
            res.json(user).status(HttpCode.CREATED)
        } catch (error) {
            console.error(error);

        }
    },
    Userlogin: async (req: Request, res: Response) => {

        const { email, password } = req.body;

        try {
            const employs = await prisma.clients.findUnique({
                where: {
                    email: email
                }
            });

            if (!employs) {
                return res.status(HttpCode.BAD_REQUEST).json({ msg: "L'utilisateur n'existe pas" });
            }

            const pass = await bcrypt.compare(password, employs.password);

            if (!pass) {
                return res.status(HttpCode.BAD_REQUEST).json({ msg: 'Vérifiez vos informations' });
            }

            // Masquer le mot de passe de l'utilisateur avant de renvoyer l'objet au client pour plus de sécurité
            employs.password = '';

            const AccessToken = tokenModule.createToken(employs);
            const refreshtoken = tokenModule.createRefreshtoken(employs);

            // res.cookie(`${employs.name}-cookie`, refreshtoken);

            res.cookie("cook_emp_xyz", refreshtoken,
                {
                    httpOnly: true,
                    secure: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000
                })

            res.header('Authorization', AccessToken)


            console.log(AccessToken)

            return res.status(HttpCode.OK).json({ msg: 'Votre token a été généré', accessToken: AccessToken });
        } catch (error) {
            console.error(error);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: 'Erreur interne du serveur' });
        }
    },
    LogoutUser: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            const user = await prisma.clients.findUnique({
                where: {
                    email
                }
            });

            if (!user) {
                return res.json({ msg: 'user not exist' }).status(HttpCode.BAD_REQUEST);
            }

            console.log('user deconnecter');
            return res.status(HttpCode.OK).json({ msg: 'User succesffully logout' });
        } catch (error) {
            console.error(error);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: 'Erreur interne du serveur' });
        }
    },
    getUser: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const status = await prisma.clients.findUnique({
                where: {
                    email
                },
                select: {
                    name: true,
                    email: true,

                }
            });

            if (!status) {
                return res.json({ msg: 'users no exist' });
            }
            res.json(status).status(HttpCode.OK);
        } catch (error) {
            console.error(error);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: 'Erreur interne du serveur' });
        }
    },
    updateUser: async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;

            

            const updateUser = await prisma.clients.update({
                where: {
                    email
                },
                data: {
                    name,
                    password

                }
            });

            return res.status(HttpCode.OK).json({ msg: 'User  updated' + updateUser });
        } catch (error) {
            console.error(error);
        }
    },
    deleteUser: async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const user = await prisma.clients.delete({
                where: {
                    email
                }
            })

           

            return res.json(`${user.name}: a ete supprimer`)
        } catch (error) {
            console.error(error)
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });
        }

    }


}

export default controllers