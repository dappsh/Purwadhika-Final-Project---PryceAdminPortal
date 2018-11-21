import React from 'react';
import { Grid } from 'react-bootstrap';

import NotificationSystem from 'react-notification-system';
import { style } from "variables/Variables.jsx";
import "./login.css";
import Cookies from 'js-cookie';
import logo from '../../assets/img/logo.png';
import { apiHost } from './../../config';


class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            login: false,
            _notificationSystem: null,
        };
        this.login = this.login.bind(this)
    }
    showNotification = (color, msg) => {
        this.setState({ _notificationSystem: this.refs.notificationSystem });
        var _notificationSystem = this.refs.notificationSystem;
        var level;
        switch (color) {
            case 1:
                level = 'success';
                break;
            case 2:
                level = 'warning';
                break;
            case 3:
                level = 'error';
                break;
            case 4:
                level = 'info';
                break;
            default:
                break;
        }
        _notificationSystem.addNotification({
            title: (<span data-notify="icon" className="pe-7s-gift"></span>),
            message: (
                <div>
                    {msg}
                </div>
            ),
            level: level,
            position: "tr",
            autoDismiss: 2,
        });
    }

    componentDidMount() {
        if (this.state.login) {
            this.props.history.push('/dashboard');
        }
        this.userChecking();
    }

    userChecking = () => {
        const getCookies = Cookies.get('userAdmin'); // => { name: 'value' }
        console.log('getCookies login', getCookies)
        if (getCookies) {
            this.props.history.push('/product');
        }
    }

    login = (e) => {
        e.preventDefault();
        const url = `${apiHost}/adminlogin`;
        const { username, password } = this.state;
        if (username === '') {
            this.showNotification(3, "Username tidak boleh kosong")
        } else if (password === '') {
            this.showNotification(3, "Password tidak boleh kosong")
        } else {
            const data = {
                admUsername: username,
                admPassword: password
            };
            fetch(url, {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then((response) => {
                    console.log('success add Product', response);
                    Cookies.set('userAdmin', response[0].admName, { expires: 1 });
                    this.props.history.push('/product');
                })
                .catch(error => console.error('Error:', error))
            // this.props.history.push('/dashboard');
        }

    }


    // Login(e) {
    //     e.preventDefault();
    //     const showNotification = (color, msg) => {
    //         this.showNotification(color, msg)
    //     }
    //     var self = this
    //     axios.request({
    //         url: `${process.env.REACT_APP_API_HOST}/api/cms/login`,
    //         headers: { 'X-App-ID': 'cms' },
    //         method: 'post',
    //         data: {
    //             "username": this.state.username,
    //             "password": this.state.password,
    //             "hospital_id": `${process.env.REACT_APP_HOSPITAL_ID}`
    //         }
    //     })
    //         .then(function (response) {               
    //             Cookies.set('_token', response.data.token, { path: '/'});
    //             self.props.handleAuth(true);
    //         })
    //         .catch(function (error) {
    //             console.log("err: ", error && error.response && error.response.data && error.response.data.error)
    //             showNotification(3, "Username atau password salah")
    //             Cookies.remove('_token', { path: '/'});
    //             self.props.handleAuth(false);
    //         });
    // }

    render() {
        return (
            <div className="content">
                <div className="bg-login"></div>
                <NotificationSystem ref="notificationSystem" style={style} />
                <Grid fluid>
                    <div className="pryce-header">
                        <img src={logo} alt="logo" style={{ height: '100px' }} />
                        <br /><br />
                        <p>Login to start your session</p>
                        <div className="login">
                            <form onSubmit={this.login}>
                                <input type="text" autoComplete="off" placeholder="username" onChange={(e) => { this.setState({ username: e.target.value }) }} name="user" /><br />
                                <input type="password" placeholder="password" onChange={(e) => { this.setState({ password: e.target.value }) }} name="password" /><br />
                                <input type="submit" value="Login" />
                            </form>
                        </div>
                    </div>

                </Grid>
            </div>
        )
    }
}

export default Login;