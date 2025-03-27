import {
    NextFunction,
    Request,
    Response,
  } from 'express';
import { clients, PrismaClient } from "@prisma/client";
import { HttpCode } from '../core/constants/index';
import clientConnect from './connected';

const prisma = new PrismaClient()



const roleUsers  = {

    verifyUserAdmin : async (req: Request, res:Response, next: NextFunction) =>  {
try {
    clientConnect

      if (!clients || clients.role !== "admin") {
        return res.status(HttpCode.FORBIDDEN).json({ msg: "Accès refusé. Rôle admin requis" });
      }

      next(); // Passer au middleware suivant
    } catch (error) {
      console.error(error);
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });
    }
    },

verifyUserSuper_admin :  async (req: Request, res:Response, next: NextFunction) => {

    try {
        await prisma.clients.findMany({
            where: {
                role : "super_admin"
            }
        })
        next()
        return res.status(HttpCode.OK)

        
    } catch (error) {
        console.error(error);
        
        
    }
}


}

export default roleUsers