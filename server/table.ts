import { PrismaClient } from "@prisma/client";
import { HttpCode } from "../core/constants";
import { Request, Response } from "express";


const prisma = new PrismaClient()

const controlleur = {
    getAllTable: async (req: Request, res: Response) => {
        try {
            const table = await prisma.tables.findMany({
                where: {
                    state: "free"
                }
            })
            if (table.length === 0) {
                return res.json({ msg: "il n'y-a de table disponible pour le moment" })
            }

            return res.json(`voici la liste des table disponible ${[table]}`).status(HttpCode.OK)

        } catch (error) {
            console.error(error)
        }
    },
    postTable: async (req: Request, res: Response) => {
        try {

            const { number, capacity } = req.body

            const Table = await prisma.tables.findFirst({
                where: {
                    number: number
                }
            })
            if (!Table) {
                const table = await prisma.tables.create({
                    data: {
                        number,
                        capacity
                    }
                })
                return res.json(table).status(HttpCode.CREATED)
            }

            res.json({ msg: "la table existe deja" }).status(HttpCode.BAD_REQUEST)
        } catch (error) {
            console.error(error);

        }
    },
    putTable: async (req: Request, res: Response) => {
        try {
            const { id } = req.params

            const { number, capacity, state } = req.body


            const table = await prisma.tables.findUnique({
                where: {
                    table_id: number(id)
                }
            })
            if (!table) {
                return res.status(HttpCode.NOT_FOUND).json({ msg: "la table n'existe pas" })
            }
            const update = await prisma.tables.update({
                where: {
                    table_id: number(id)
                },
                data: {
                    number,
                    capacity,
                    state
                }
            })

            res.status(HttpCode.OK).json(update)

        } catch (error) {
            console.error(error);

        }
    },
    deleteTable: async (req: Request, res: Response) => {
        const { id } = req.params

        const table = await prisma.tables.findUnique({
            where: {
                table_id: id
            }
        })
        if (!table) {
            return res.status(HttpCode.NOT_FOUND).json({ msg: "la table n'existe pas" })
        }
        await prisma.tables.delete({
            where: {
                table_id: id
            }
        })
        return res.status(HttpCode.OK).json({ msg: "la table a ete suprimer avec succes" })
    }
}

export default controlleur