import React, { Component, PropsWithChildren, useEffect, useState, useImperativeHandle } from 'react'
import {RouteComponentProps } from 'react-router-dom'
import {connect, useSelector} from 'react-redux'
import { ProfileState, LOGIN_TYPES } from '@/typings/profile'
import {RootState} from '@/reducers'
import mapDispatchToProps from '@/store/actions/profile'
import Nav from '@/components/Nav'
import { Descriptions, Button, Alert, message, Upload, Icon } from 'antd'
import { RcFile, UploadChangeParam } from 'antd/lib/upload'
import './index.less';
const mapStateToProps = (state: RootState): ProfileState=>{
    return state.profile;
};

type Props = PropsWithChildren<RouteComponentProps>&ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
function Profile(props:Props){
    let [uploading, setUploading] = useState(false);
    useEffect(()=>{
        props.validate() //.payload.catch((error:any)=>message.error(error.message));
    },[])
    let content;
    
    if(props.loginState === LOGIN_TYPES.UN_VALIDATE) {
        content= null;
    } else if(props.loginState === LOGIN_TYPES.LOGINED) {
        const uploadButton = (
            <div>
                <Icon type={uploading ? 'loding' : 'plus'} />
                <div className="ant-upload-text">上传</div>
            </div>
        );

        const handleChange = (info: UploadChangeParam)=>{
            if(info.file.status === 'uploading') {
                setUploading(true);
            } else if (info.file.status === 'done') {
                let { success, data } = info.file.response;
                if(success){
                    setUploading(false);
                    props.setAvatar(data);
                } else {
                    message.error('上传头像失败');
                }
            }
        };
        content = (
            <div className="user-info">
                <Descriptions title="当前用户">
        <Descriptions.Item label="用户名">{props.user.username}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{props.user.email}</Descriptions.Item>
        <Descriptions.Item label="头像">
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="http://localhost:8001/user/uploadAvatar"
                beforeUpload={beforeUpload}
                data={{userId: props.user.id}}
                onChange={handleChange}
        >{props.user.avatar ? <img src={props.user.avatar} /> : uploadButton}</Upload>
        </Descriptions.Item>
                </Descriptions>
                <Button type="danger" onClick={()=>props.logout()}>退出</Button>
            </div>
        );
    } else {
        content = (
            <>
                <Alert type="warning" message="未登录" description="你没有登录"></Alert>
                <div className="user-auth-btn">
                    <Button type="dashed" onClick={()=>props.history.push('/login')}>登录</Button>
                    <Button type="dashed" onClick={()=>props.history.push('/register')}>注册</Button>
                </div>
            </>
        );
    }
    return (
        <section className="profile-page">
            <Nav history={props.history}>个人中心</Nav>
            {content}
        </section>
    )
}

function beforeUpload(file: RcFile){
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if(!isJpgOrPng){
        message.error("只能上传JPG/PNG文件");
    }
    
    const isLessThan2M = file.size / 1024 < 100;
    if(!isLessThan2M){
         message.error('图片要小于2M');
    }

    return isJpgOrPng && isLessThan2M;
}



export default connect(mapStateToProps, mapDispatchToProps)(Profile);