import { Router, Request, Response } from 'express';
import subKategoriController from './controller.js';
import { authMiddleware,authorizationMiddleware } from '../../middleware/authMiddleware.js';

const RouterSubKategori = Router();

RouterSubKategori.post('/add', authMiddleware,authorizationMiddleware("admin"),subKategoriController.add);
RouterSubKategori.post('/edit/:id',authMiddleware,authorizationMiddleware("admin"), subKategoriController.edit);
RouterSubKategori.get('/list',authMiddleware,authorizationMiddleware("admin"), subKategoriController.list);
RouterSubKategori.post('/edit/:id',authMiddleware,authorizationMiddleware("admin"), subKategoriController.edit);

export default RouterSubKategori;
