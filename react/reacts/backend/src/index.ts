import express, {Express, Request, Response, NextFunction} from 'express';
import  HttpException from './exception/HttpException'
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan' // 日志
import helmet from 'helmet' // 安全过滤
//import multer from 'multer' // 上传文件
import 'dotenv/config'; // 读取.env文件，写入process.env
import path from 'path'
import errorMiddleware from './middleware/errorMiddleware'
//import { Slider } from './model'
import { Lesson } from './model'
import * as userController from './controller/user'
import * as sliderController from './controller/slider'
import * as lessonController from './controller/lesson'
import multer from 'multer';
// 指定上传文件的空间
const storage  = multer.diskStorage({
    destination: path.join(__dirname,'public', 'uploads'),
    filename(_res: Request, file: Express.Multer.File, callback) {
        // params: 1. error object, 2. 文件名 时间cuo.jpg
        callback(null, Date.now()+path.extname(file.originalname));
    }
});
const upload = multer({storage});
//const jsonParser = bodyParser.json();
const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (_req,res, _next)=>{
    res.json({
        success:true,
        data: 'Hello world'
    })
});

app.post('/user/register', userController.register);
app.post('/user/login', userController.login);
// 当服务端接收到文件上传请求时，处理单文件上传。字段名叫avatar , 为req增加file对象
app.post('/user/uploadAvatar', upload.single('avatar'), userController.uploadAvatar);
// 客户端把toekn传给服务器，服务器返回当前的用户，如果token过期了，则返回空
app.get('/user/validate',userController.validate );
app.get('/slider/list',sliderController.list );
app.get('/lesson/list',lessonController.list );
app.get('/lesson/:id',lessonController.getLesson );
app.use((_req:Request, _res:Response, next:NextFunction)=>{
    const err = new HttpException(404, "尚未为此路径配置路由！");
    next(err);
});

app.use(errorMiddleware);

(async function(){
    await mongoose.set('useNewUrlParser', true);
    await mongoose.set('useUnifiedTopology', true);
    await mongoose.connect('mongodb://localhost/issy');
    //await createInitialSliders();
    await createInitialLessons();
    const PORT = process.env.PORT || 8001;
    app.listen(PORT, ()=>{
        console.log("running on http://localhost:"+PORT);
    })
})();
/*
async function createInitialSliders(){
    const sliders = await Slider.find();
    if(sliders.length === 0){
        const sliders: any[] = [
            { url: 'http://demo.htmleaf.com/1906/201906270863/images/1.jpg' },
            { url: 'http://demo.htmleaf.com/1906/201906270863/images/2.jpg' },
            { url: 'http://demo.htmleaf.com/1906/201906270863/images/3.jpg' },
            { url: 'http://demo.htmleaf.com/1906/201906270863/images/4.jpg' },
            { url: 'http://demo.htmleaf.com/1906/201906270863/images/5.jpg' },
            { url: 'http://demo.htmleaf.com/1906/201906270863/images/6.jpg' }
    ];
       await Slider.create(sliders);
    }
}
*/

async function createInitialLessons(){
    const lesson = await Lesson.find(); 
    if(lesson.length === 0) {
        const lesson:any[] = [
            {
                order:1,
                title: 'React项目实践',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 900,
                category: 'react'
            },
            {
                order:2,
                title: 'React服务端渲染',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 300,
                category: 'react'
            },
            {
                order:3,
                title: 'React源码解析',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 500,
                category: 'react'
            },
            {
                order:4,
                title: 'vue项目实践',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 700.00,
                category: 'vue'
            },
            {
                order:5,
                title: 'vue源码解析',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 900.00,
                category: 'vue'
            },
            {
                order:6,
                title: 'Nodejs项目实践',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 800.00,
                category: 'nodejs'
            },
            {
                order:7,
                title: 'Nodejs核心模块',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 200.00,
                category: 'nodejs'
            },
            {
                order:8,
                title: 'Nodejs框架express精讲',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 600.00,
                category: 'nodejs'
            },

            ,
            {
                order:9,
                title: '新概念英文一',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 40.00,
                category: 'english'
            },
            {
                order:10,
                title: '新概念英文二',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 20.00,
                category: 'english'
            },
            {
                order:11,
                title: '新概念英文三',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 40.00,
                category: 'english'
            },
            {
                order:12,
                title: '新概念英文一练习1',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 80.00,
                category: 'english'
            },
            {
                order:13,
                title: '新概念英文一练习2',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 60.00,
                category: 'english'
            },
            {
                order:14,
                title: '新概念英文一练习3',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 10.00,
                category: 'english'
            },
            {
                order:15,
                title: '新概念英文一练习4',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 40.00,
                category: 'english'
            },
            {
                order:16,
                title: '新概念英文二练习1',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 20.00,
                category: 'english'
            },
            {
                order:17,
                title: '新概念英文二练习2',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 15.00,
                category: 'english'
            },
            {
                order:18,
                title: '新概念英文二练习3',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 20.00,
                category: 'english'
            },
            {
                order:19,
                title: '新概念英文二练习4',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 130.00,
                category: 'english'
            },
            {
                order:20,
                title: '新概念英文三练习1',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 110.00,
                category: 'english'
            },
            {
                order:21,
                title: '新概念英文三练习2',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 70.00,
                category: 'english'
            },
            {
                order:22,
                title: '新概念英文三练习3',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 90.00,
                category: 'english'
            },
            {
                order:23,
                title: '新概念英文三练习4',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 80.00,
                category: 'english'
            },
            {
                order:24,
                title: '新概念英文四练习1',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 30.00,
                category: 'english'
            },
            {
                order:25,
                title: '新概念英文四练习2',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 70.00,
                category: 'english'
            },
            {
                order:26,
                title: '新概念英文四练习3',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 60.00,
                category: 'english'
            },
            {
                order:27,
                title: '新概念英文四练习4',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 300.00,
                category: 'english'
            },
            {
                order:11,
                title: '新概念英文四',
                video: '',
                poster: 'http://localhost:8001/cat.jpg',
                url: 'http://localhost:8001/th.jpg',
                price: 100.00,
                category: 'english'
            }
        ];
        Lesson.create(lesson);
    } 
}