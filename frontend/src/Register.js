import React, { Component } from "react";
import swal from "sweetalert"; // Importing sweetalert library for displaying alerts
import { Button, TextField, Link } from "@material-ui/core"; // Importing UI components from Material-UI library
import { withRouter } from "./utils"; // Importing withRouter HOC from custom utils
const axios = require("axios"); // Importing axios for making HTTP requests

// Register component for user registration
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  // Function to update state with input changes
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  // Function to handle registration process
  register = () => {
    axios
      .post("http://localhost:2000/register", {
        username: this.state.username,
        password: this.state.password,
      })
      .then((res) => {
        // Displaying success message using sweetalert
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });
        // Redirecting to home page after successful registration
        this.props.navigate("/");
      })
      .catch((err) => {
        // Displaying error message using sweetalert in case of registration failure
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
      });
  };

  
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
        {/* Right Section - Register Form */}
        <div className="login-box">
          <h2>Register</h2>
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
              disabled={
                this.state.username === "" ||
                this.state.password === ""
              }
              onClick={this.register}
            >
              Register
            </Button>
            <Link
              component="button"
              style={{ fontFamily: "inherit", fontSize: "inherit" }}
              onClick={() => {
                this.props.navigate("/");
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default withRouter(Register); // Exporting Register component with withRouter HOC 
