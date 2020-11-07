
class HttpException extends Error {
    // public 等于是 this.status = status的简写
    constructor(public status: number, public message: string, public errors: any = {}) {
        super(message);
    }
}

export default HttpException;