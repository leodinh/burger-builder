import React, { useState, useEffect } from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.module.css";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Spinner from "../../components/UI/Spinner/Spinner";
import * as actions from "../../store/actions/index";
import { updateObject, checkValidity } from "../../shared/utility";
const inputConfig = (typeText, text, validForm) => {
  return {
    elementType: "input",
    elementConfig: {
      type: typeText,
      placeholder: text
    },
    value: "",
    validation: validForm,
    valid: false,
    touched: false
  };
};
const Auth = props => {
  const [controls, setControl] = useState({
    email: inputConfig("email", "Mail Address", {
      required: true,
      isEmail: true
    }),
    password: inputConfig("password", "Password", {
      required: true,
      minLength: 7
    })
  });
  const [isSignUp, setIsSignUp] = useState(true);
  const { onSetAuthRedirectPath, buildingBurger, authRedirectPath } = props;
  const inputChangeHandler = (event, controlName) => {
    const updatedControls = updateObject(controls, {
      [controlName]: updateObject(controls[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          controls[controlName].validation
        ),
        touched: true
      })
    });
    setControl(updatedControls);
  };
  const switchAuthModeHandler = () => {
    setIsSignUp(!isSignUp);
  };
  const submitHandler = event => {
    event.preventDefault();
    props.onAuth(controls.email.value, controls.password.value, isSignUp);
  };
  useEffect(() => {
    if (!buildingBurger && authRedirectPath) {
      onSetAuthRedirectPath("/");
    } else {
      onSetAuthRedirectPath("/checkout");
    }
  }, [authRedirectPath, buildingBurger, onSetAuthRedirectPath]);
  const formElementsArray = [];
  for (let key in controls) {
    formElementsArray.push({
      id: key,
      config: controls[key]
    });
  }
  let form = formElementsArray.map(formElement => (
    <Input
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      key={formElement.id}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      change={event => inputChangeHandler(event, formElement.id)}
    />
  ));
  if (props.loading) {
    form = <Spinner />;
  }
  let errorMessage = null;
  if (props.error) {
    errorMessage = <p>{props.error.message}</p>;
  }
  return (
    <div className={classes.Auth}>
      {props.isAuth && <Redirect to={props.authRedirectPath} />}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        <Button btnType="Success">Submit</Button>
      </form>
      <Button btnType="Danger" clicked={switchAuthModeHandler}>
        Switch to {isSignUp ? "SIGN IN" : "SIGN UP"}
      </Button>
    </div>
  );
};
const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuth: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
