import React, { Component } from "react";
import swal from "sweetalert"; // Importing sweetalert library for displaying alerts
import { Button, TextField, Link } from "@material-ui/core"; // Importing UI components from Material-UI library
import { withRouter } from "./utils"; // Importing withRouter HOC from custom utils
const axios = require("axios"); // Importing axios for making HTTP requests
const bcrypt = require("bcryptjs"); // Importing bcryptjs for password hashing
var salt = bcrypt.genSaltSync(10); // Generating salt for password hashing

// Login component for user login
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  // Function to update state with input changes
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  // Function to handle login process
  login = () => {
    // Hashing password before sending to server
    const pwd = bcrypt.hashSync(this.state.password, salt);
    console.log(pwd)
    axios.post('http://localhost:2000/login', {
      username: this.state.username,
      password: pwd,
    }).then((res) => {
      // Storing token and user id in local storage after successful login
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.id);
      // Redirecting to dashboard after successful login
      this.props.navigate("/dashboard");
    }).catch((err) => {
      // Displaying error message using sweetalert in case of login failure
      if (err.response && err.response.data && err.response.data.errorMessage) {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error"
        });
      }
    });
  }


  render() {
    return (
      <div>
        <div className="left-section">
          {/* Content for the left section */}
          <div>
          <h1>Welcome to Book Manager</h1>
            <p>A simple book management application</p>
          </div>
        </div>

        <div className="right-section">
          {/* Right Section - Login Form */}
          <div className="login-box">
            <h2>Login</h2>
            <div className="input-container">
              <label htmlFor="username">Username</label>
              <TextField
                id="username"
                type="text"
                autoComplete="off"
                name="username"
                value={this.state.username}
                onChange={this.onChange}
                required
              />
            </div>
            <div className="input-container">
              <label htmlFor="password">Password</label>
              <TextField
                id="password"
                type="password"
                autoComplete="off"
                name="password"
                value={this.state.password}
                onChange={this.onChange}
                required
              />
            </div>
            <div className="button-container">
              <Button
                className="button-container"
                variant="contained"
                color="primary"
                size="small"
                disabled={this.state.username === '' || this.state.password === ''}
                onClick={this.login}
              >
                Login
              </Button>
              <Link
                component="button"
                style={{ fontFamily: "inherit", fontSize: "inherit" }}
                onClick={() => {
                  this.props.navigate("/register");
                }}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login); // Exporting Login component with withRouter HOC
