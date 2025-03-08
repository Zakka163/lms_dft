import { Response, Router, Request } from "express";
import KelasController  from "./controller.js";
import { authMiddleware, authorizationMiddleware } from "../../middleware/authMiddleware.js";

const RouterKelas = Router();
RouterKelas.get('/list', authMiddleware, authorizationMiddleware("admin"), KelasController.list);
RouterKelas.post('/add', authMiddleware, authorizationMiddleware("admin"), KelasController.add);
RouterKelas.get('/id/:id', authMiddleware, authorizationMiddleware("admin"), KelasController.getById);
RouterKelas.put('/edit/:id', authMiddleware, authorizationMiddleware("admin"), KelasController.update);
RouterKelas.delete('/delete/:id', authMiddleware, authorizationMiddleware("admin"), KelasController.delete);
export default RouterKelas;
