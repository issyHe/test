import React, {PropsWithChildren} from 'react'
import './index.less'
import {Form, Input, Icon, Button, message} from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import { connect } from 'react-redux'
import {LoginState} from '@/typings/profile'
import {RootState} from '@/reducers';
import actions from '@/store/actions/profile'
import {RouteComponentProps, Link } from 'react-router-dom'
import {FormComponentProps} from 'antd/lib/form'
import Nav from '@/components/Nav'

let mapStateToProps = (state: RootState):LoginState => state.profile;

type Props = PropsWithChildren<RouteComponentProps> & ReturnType<typeof mapStateToProps> & typeof actions & FormComponentProps;

function Login(props:Props){
    const {getFieldDecorator} = props.form;
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.form.validateFieldsAndScroll(async (errors: any, values) => {
            if(errors){
                message.error('表单提交信息不合法')
            } else {
                props.login(values);
            }
        });
    };
    return (
        <>
            <Nav history={props.history}>用户登录</Nav>
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
                    <Button type="primary" htmlType="submit" className="loging-form-button">登录</Button><Link to="/register" className="login-btn">注册</Link>
                </FormItem>
            </Form> 

        </>
    )
}

const WrappedLogin = Form.create({name: "登录"})(Login);




export default connect(mapStateToProps, actions)(WrappedLogin);