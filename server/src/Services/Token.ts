import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface UserToken {
    userId: number;
}

export function generateAccessToken(user: UserToken) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: "1m"})
}

export function generateRefreshToken(user: UserToken) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, {expiresIn: "2m"})
}

export function validateToken(req : any, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"]
    const token = authHeader?.split(' ')[1]

    if(token == null) {
        return res.status(400).send("Token not present")
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
        if(err) {
            return res.status(403).send("Invalid token")
        }
        req.user = user;
        next()
    })
}