import React from "react";
import {
    Form,
    Icon,
    Input,
    Button,
    Checkbox,
    Divider,
    Modal
} from "antd";
import { Link } from "react-router";
// import "./Login.less";
// import LoginImg from "./Login.png";
import axios from "axios";
// import LoginForm from '../../components/LoginForm/LoginForm';
import { preURL } from "../../axios/config";
import { hashHistory } from "react-router";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
const FormItem = Form.Item;

class Login extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        user: "",
        userType: 1,
        vcodeSrc: "",
        vcodeText: "",
        vcodeVerificationText: ""
    };

    componentWillMount() {
        const { cookies } = this.props;

        if (cookies.get("user")) {
            let userObj = cookies.get("user");
            if (userObj.roleId === 1) {
                this.setState({
                    user: cookies.get("front_user_temp"),
                    userType: 1
                });
                hashHistory.push("/app/recite");
            }
        }
    }


    handleSubmit = e => {
        e.preventDefault();
        this
            .props
            .form
            .validateFields((err, values) => {
                if (!err) {
                    console.log("Received values of form: ", values);

                    axios({
                        method: "post",
                        url: preURL + "/user/login",
                        dataType: "json",
                        data: {
                            roleName: 'roleName',
                            email: 'email',
                            password: 'password'
                        },
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8"
                        }
                    }).then(response => {
                        console.log("login response:", response);
                        if (response.data.code === "200") {
                            //   const {router} = this.props;
                            //   let {data} = response;
                            const { cookies } = this.props;

                            cookies.set("front_user_temp", {
                                userName: response.data.data.userName,
                                roleId: response.data.data.roleId
                            }, {
                                    path: "/",
                                    maxAge: 24 * 3600
                                });
                            hashHistory.push("/app/recite");
                        } else if (response.data.code === "6014") {
                            Modal.error({ title: "登录失败", content: "图片验证码过期！" });
                        } else if (response.data.code === "6007") {
                            Modal.error({ title: "登录失败", content: "图片验证码错误！" });
                        } else if (response.data.code === "1011") {
                            Modal.error({ title: "登录失败", content: "没有对应账号！" });
                        } else if (response.data.code === "1013") {
                            Modal.error({ title: "登录失败", content: "账户或密码错误，请重新填写！" });
                        } else if (response.data.code === "6002") {
                            Modal.error({ title: "登录失败", content: "邮箱账号未激活！" });
                        } else {
                            Modal.error({ title: "登录失败", content: "系统错误" });
                        }
                    }).catch(error => {
                        console.log("login error:", error);
                    });
                }
            });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        // console.log("state:",this.state);
        return (
            <div className="login_all_container">
                <div className="login_img_container" />
                <Form key="student_form" onSubmit={this.handleSubmit} className="login-form">
                    <FormItem className="login_form_title">
                        <h2>登录</h2>
                        <Divider />
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator("user", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入用户名!"
                                }
                            ]
                        })(
                            <Input
                                size="large"
                                prefix={< Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
                                placeholder="用户名" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator("password", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入密码!"
                                }
                            ]
                        })(
                            <Input
                                size="large"
                                prefix={< Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                                type="password"
                                placeholder="密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        <div className="suff_container">
                            <div className="suff_item">
                                {getFieldDecorator("remember", {
                                    valuePropName: "checked",
                                    initialValue: true
                                })(
                                    <Checkbox>记住我</Checkbox>
                                )}
                            </div>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                          </Button>
                            <Link
                                onClick={() => {
                                    hashHistory.push("/userservice/signup");
                                }}>
                                注册
                          </Link>
                        </div>
                    </FormItem>
                </Form>

            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(Login);

export default withCookies(WrappedNormalLoginForm);
// export default WrappedNormalLoginForm; 