import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import dashboardRoutes from "routes/dashboard.jsx";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.state = {
      _notificationSystem: null,
      loginPage: false
    };
    this.props.history.listen((location, action) => {
      console.log('coba ini', location)
      if (location && location.pathname === '/login') {
        console.log('masuk sini dong');
        this.state.loginPage = true
      } else {
        console.log('kok malah kesini dong');
        this.setState({
          loginPage: false
        })
      }

    });
  }
  handleNotificationClick(position) {
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className="pe-7s-gift" />,
      message: (
        <div>
          Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for
          every web developer.
        </div>
      ),
      level: level,
      position: position,
      autoDismiss: 15
    });
  }
  componentDidMount() {
    console.log('props history', this.props.history)
    if (this.props && this.props.history && this.props.history.location && this.props.history.location.pathname === '/login') {
      this.setState({
        loginPage: true
      })
    } else {
      this.setState({
        loginPage: false
      })
    }
  }
  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
  }
  render() {
    const { loginPage } = this.state;
    console.log('loginpage', loginPage);
    return (
      <div>
        <div className="wrapper">
          {!loginPage && <Sidebar {...this.props} />}
          <div id="main-panel" className={!loginPage ? 'main-panel' : ''}>
            {!loginPage && <Header {...this.props} />}
            <Switch>
              {dashboardRoutes.map((prop, key) => {
                if (prop.name === "Notifications")
                  return (
                    <Route
                      path={prop.path}
                      key={key}
                      render={routeProps => (
                        <prop.component
                          {...routeProps}
                          handleClick={this.handleNotificationClick}
                        />
                      )}
                    />
                  );
                if (prop.redirect)
                  return <Redirect from={prop.path} to={prop.to} key={key} />;
                return (
                  <Route path={prop.path} component={prop.component} key={key} />
                );
              })}
            </Switch>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
