import { User } from "../model/index";
import { Request, Response, NextFunction } from 'express';
import { validateRegisterInput } from '../utils/validator'
import HttpException from "../exception/HttpException";
import { UNPROCESSABLE_ENTITY, UNAUTHORIZED } from 'http-status-codes'
import { UserDocument } from "src/model/user";
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response, _next: NextFunction) => {

    let { username, password, confirmPassword, email } = req.body;
    try {
        let { valid, errors } = validateRegisterInput(username, password, confirmPassword, email);

        if (!valid) {
            throw new HttpException(UNPROCESSABLE_ENTITY, "用户提交数据不正确", errors);
        }
        let users: (UserDocument | null) = await User.findOne({ username });
        if (users) {
            throw new HttpException(UNPROCESSABLE_ENTITY, "用户名重复");
        }
        let user = new User({ username, password, confirmPassword, email });

        await user.save();

        res.json({
            success: true,
            data: user
        })
    } catch (e) {
        _next(e);
    }
}

export const login = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        let { username, password } = req.body;
        let user = await User.login(username, password);
        let token = user.getAccessToken();
        if (user) {
            res.json({
                success: true,
                data: token
            })
        } else {
            throw new HttpException(UNAUTHORIZED, '登录失败');
        }
    } catch (e) {
        _next(e);
    }
}


// 客户端会把token放在请求头
export const validate = async (req: Request, res: Response, _next: NextFunction) => {

    const authorization = req.headers.authorization;
    if (authorization) {
        const accsee_token = authorization.split(' ')[1];
        if (accsee_token) {
            try {
                const { id } = await jwt.verify(accsee_token, 'Issy') as { id: string }; // 密钥
                let user = await User.findById(id);
                if (user) {
                    res.json({
                        success: true,
                        data: user.toJSON()
                    })
                } else {
                    _next(new HttpException(UNAUTHORIZED, '用户未找到'))
                }
            } catch (e) {
                _next(new HttpException(UNAUTHORIZED, 'access token不合法'));
            }
        } else {
            _next(new HttpException(UNAUTHORIZED, 'author未提供'))
        }
    } else {
        _next(new HttpException(UNAUTHORIZED, 'author未提供'))
    }    
}

export const uploadAvatar = async (req: Request, res: Response, _next: NextFunction) => {
    let {userId} = req.body;
    try {
        let avatar = `${req.protocol}://${req.headers.host}/uploads/${req.file.filename}`;
        await User.updateOne({_id: userId}, {avatar});
        res.json({
            success: true,
            data: avatar
        })
    }catch(e) {
        _next(e);
    }
};

/**
 * 1.增加用户输入合法性校验
 * 2.增加异常处理
 * 3.密码加密
 * 4.生成jwt token
 */