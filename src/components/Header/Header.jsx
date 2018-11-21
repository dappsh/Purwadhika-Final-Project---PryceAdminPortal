import React, { Component } from "react";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import Cookies from 'js-cookie';

import dashboardRoutes from "routes/dashboard.jsx";

class Header extends Component {
  constructor(props) {
    super(props);
    this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
    this.state = {
      sidebarExists: false
    };
  }
  logout = () => {
    Cookies.remove('userAdmin');
    this.props.history.push('login');
  }
  mobileSidebarToggle(e) {
    if (this.state.sidebarExists === false) {
      this.setState({
        sidebarExists: true
      });
    }
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  }
  getBrand() {
    var name;
    dashboardRoutes.map((prop, key) => {
      if (prop.collapse) {
        prop.views.map((prop, key) => {
          if (prop.path === this.props.location.pathname) {
            name = prop.name;
          }
          return null;
        });
      } else {
        if (prop.redirect) {
          if (prop.path === this.props.location.pathname) {
            name = prop.name;
          }
        } else {
          if (prop.path === this.props.location.pathname) {
            name = prop.name;
          }
        }
      }
      return null;
    });
    return name;
  }
  render() {
    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <p>{this.getBrand()}</p>
          </Navbar.Brand>
          <Navbar.Toggle onClick={this.mobileSidebarToggle} />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem eventKey={3} onClick={()=> this.logout()}>
              Log out
          </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
