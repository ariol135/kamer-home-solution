import controlleur from "../controlleurs/table";
import { Router } from "express";
import roleUsers from "../middlewares/roles";
import clientConnect from "../middlewares/connected";

const routeTable = Router()


routeTable.get('/',clientConnect.verifyAccessToken, controlleur.getAllTable)
routeTable.post("/",clientConnect.verifyAccessToken, clientConnect.verifyUserAdmin, controlleur.postTable)
routeTable.put("/:id",clientConnect.verifyAccessToken, clientConnect.verifyUserAdmin, controlleur.putTable)
routeTable.delete("/:id",clientConnect.verifyAccessToken, clientConnect.verifyUserAdmin, controlleur.deleteTable)



export default routeTable