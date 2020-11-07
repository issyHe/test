import {Request, Response, NextFunction} from 'express'
import  HttpException from '../exception/HttpException'
import { INTERNAL_SERVER_ERROR} from 'http-status-codes'
function errorMiddleware(error: HttpException, _req:Request, res:Response, _next:NextFunction){
    res.status(error.status || INTERNAL_SERVER_ERROR)
    .json({
        success: false,
        message: error.message,
        errors: error.errors
    });
}

export default errorMiddleware;