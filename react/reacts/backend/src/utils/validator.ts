import validator from 'validator'
import { UserDocument } from '../model/user'

export interface RegisterInput extends Partial<UserDocument> {
    confirmPassoword?: string;
}
export interface RegisterInputValidateResult {
    errors: RegisterInput,
    valid: boolean
}
//交验注册用户合法性
export const validateRegisterInput = (username:string,password:string,confirmPassoword:string, email:string) : RegisterInputValidateResult=> {
    let errors: RegisterInput = {};
    if(username === undefined || username.length === 0){
        errors.username = '用户名不能为空';
    }
    if(password === undefined || password.length === 0){
        errors.password = '密码不能为空';
    }
    if(confirmPassoword === undefined || confirmPassoword.length === 0){
        errors.confirmPassoword = '确认密码不能为空';
    }
    if(password !== confirmPassoword) {
        errors.confirmPassoword = '密码和确认密码不相等';
    }
    if(email === undefined || email.length === 0){
        errors.email = '邮箱不能为空';
    }
    if(!validator.isEmail(email)){
        errors.email = '邮箱格式不正确';
    }
    return {valid:Object.keys(errors).length === 0 ? true:false, errors};
};