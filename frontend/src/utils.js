import { useNavigate } from "react-router-dom";
import React from "react";

// Higher-order component to provide withRouter functionality
export const withRouter = (Component) => {
  // Wrapper component to pass navigation functionality to the wrapped component
  const Wrapper = (props) => {
    // Accessing the navigate function from React Router DOM hooks
    const navigate = useNavigate();
    // Rendering the wrapped component with additional props, including the navigate function
    return <Component navigate={navigate} {...props} />;
  };
  // Returning the wrapper component
  return Wrapper;
};
