import { Router, Request, Response } from 'express';
import { controllerlogin, controllerCallbackAuthGoogle, controllerLoginGoogle } from './controller.js';

const RouterAuth = Router();

RouterAuth.post('/login', controllerlogin);
RouterAuth.get('/google', controllerLoginGoogle);
RouterAuth.get('/google/callback', controllerCallbackAuthGoogle);


export default RouterAuth;
