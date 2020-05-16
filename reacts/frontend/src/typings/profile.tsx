// user 对象
export interface User {
    username: string;
    email: string;
    avatar: string;
    id: string;
}
// user/register api reponse
export interface RegisterData {
    success: boolean;
    data: User
}
// user/login api response
export interface LoginData {
    success: boolean;
    data: string
}

export enum LOGIN_TYPES {
    UN_VALIDATE="UN_VALIDATE",
    LOGINED="LOGINED",
    UNLOGINED="UNLOGINED"
}

export interface ProfileState {
    loginState: LOGIN_TYPES;
    user: User | null;
    error: string | null;
}

export interface LoginState {
    loginState: LOGIN_TYPES;
    user: User | null;
    error: string | null;
}

export interface RegisterPayload {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}