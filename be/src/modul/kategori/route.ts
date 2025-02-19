import { Router, Request, Response } from 'express';
import KategoriController from './controller.js';
import { authMiddleware,authorizationMiddleware } from '../../middleware/authMiddleware.js';

const RouterKategori = Router();

RouterKategori.post('/add', authMiddleware,authorizationMiddleware("admin"),KategoriController.add);
RouterKategori.post('/edit/:id',authMiddleware,authorizationMiddleware("admin"), KategoriController.edit);
RouterKategori.get('/list',authMiddleware,authorizationMiddleware("admin"), KategoriController.list);


export default RouterKategori;
