import React, {PropsWithChildren, FormEvent } from 'react'
import './index.less'
import {Form, Input, Icon, Button, message} from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import { connect } from 'react-redux'
import {ProfileState} from '@/typings/profile'
import {RootState} from '@/reducers';
import actions from '@/store/actions/profile'
import {RouteComponentProps, Link } from 'react-router-dom'
import {FormComponentProps } from 'antd/lib/form'
import Nav from '@/components/Nav'

let mapStateToProps = (state: RootState):ProfileState => state.profile;

type Props = PropsWithChildren<RouteComponentProps> & ReturnType<typeof mapStateToProps> & typeof actions & FormComponentProps;

function Register(props:Props){
    const {getFieldDecorator} = props.form;
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.form.validateFieldsAndScroll((errors: any, values) => {
            if(errors){
                message.error('表单提交信息不合法')
            } else {
                props.register(values);
            }
        });
    };
    return (
        <>
            <Nav history={props.history}>用户注册</Nav>
            <Form className="login-form" onSubmit={handleSubmit}>
                <FormItem>
                    {
                        getFieldDecorator('username',{
                            rules: [
                                {required: true, message: '用户名不能为空'}
                            ]
                        })(<Input placeholder="用户名" prefix={<Icon type="user" />} />)
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('password',{
                            rules: [
                                {required: true, message: '密码不能为空'}
                            ]
                        })(<Input placeholder="密码" prefix={<Icon type="lock" />} />)
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('confirmPassword',{
                            rules: [
                                {required: true, message: '确认密码不能为空'}
                            ]
                        })(<Input placeholder="确认密码" prefix={<Icon type="lock" />} />)
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('email',{
                            rules: [
                                {required: true, message: '邮箱不能为空'},
                                {pattern: /@/, message:'邮箱格式不正确'}
                            ]
                        })(<Input placeholder="邮箱" prefix={<Icon type="lock" />} />)
                    }
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="loging-form-button">注册</Button><Link to="/login" className="login-btn">登录</Link>
                </FormItem>
            </Form> 

        </>
    )
}

const WrappedRegister = Form.create({name: "表单注册"})(Register);




export default connect(mapStateToProps, actions)(WrappedRegister);