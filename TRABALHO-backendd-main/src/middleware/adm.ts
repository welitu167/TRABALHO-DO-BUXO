import Auth from './auth.js';
import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

interface RequestAuth extends Request{
    usuarioId?: string
    tipo?: string
}

const adminAuth = (req: RequestAuth, res: Response, next: NextFunction) => {
  // auth middleware must run before this and set req.role.render
  const tipo = (req.tipo ?? '').toString().toUpperCase()
  if (tipo !== 'ADMIN') {
    return res.status(403).json({ message: 'Acesso apenas para administradores' });
  }
  next();
};

export { Auth, adminAuth };