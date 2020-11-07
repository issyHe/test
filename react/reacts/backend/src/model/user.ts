import mongoose, { Schema, Model, Document, HookNextFunction } from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
export interface UserDocument extends Document {
    username: string;
    password: string;
    avatar: string;
    email:string;
    getAccessToken:()=>any,
    _doc: UserDocument
};
// 模型
const UserSchema: Schema<UserDocument> = new Schema({
    username: {
        type: String,
        required:[true,'用户名不能为空'],
        minlength:[6, '最小长度不能小于6位'],
        maxlength:[8,'最大长度不能大于12位']
    },
    password: String,
    avatar: String,
    email: {
        type: String,
        trim: true,
        validate: {
            validator: validator.isEmail
        }
    }
},{
    timestamps: true,
    toJSON : {
        transform: function(_doc: any, result: any){
            result.id= result._id;
            delete result._id;
            delete result.__v;
            delete result.password;
            delete result.createdAt;
            delete result.updatedAt;
            return result;
        }
    }
}
);
// 每次保存之前执行的操作
UserSchema.pre<UserDocument>('save', async  function (next: HookNextFunction){
    if(!this.isModified('password')){
        return next();
    }
    try {
        this.password = await bcryptjs.hash(this.password, 10);
        next();
    }catch(e){
        next(e);
    }
});
// 给模型扩展方法
UserSchema.static('login', async function(this: any, username: string, password: string):
    Promise<UserDocument | null>
{
    let user: (UserDocument | null) = await this.model('User').findOne({username});
    if(user){
        const matched = await bcryptjs.compare(password, user.password);
        if(matched){
            return user;
        } else {
            return null
        }
    } else {
         return null
    }
});

// 给User模型的实例扩展这个方法
UserSchema.methods.getAccessToken  = function(this: UserDocument): string {
    let payload = { id: this._id }
    // 客户端保存，服务端不保存
    return jwt.sign(payload, process.env.JWT_SECRET_KEY || 'Issy', {
        expiresIn : '1h'
    });

}
interface UserModel<T extends Document> extends Model<T> {
    login: (username:string, password:string)=>UserDocument
}
export const User:UserModel<UserDocument> = mongoose.model<UserDocument,UserModel<UserDocument>>('User', UserSchema);