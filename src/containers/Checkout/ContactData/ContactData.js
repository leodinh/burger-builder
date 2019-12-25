import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from "../../../axios";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";
import { updateObject, checkValidity } from "../../../shared/utility";
const inputConfig = (typeText, text, validForm) => {
  if (typeText === "select") {
    return {
      elementType: "select",
      elementConfig: {
        options: [
          { value: "fastest", displayValue: "Fastest" },
          { value: "cheapest", displayValue: "Cheapest" }
        ]
      },
      value: "fastest",
      valid: true
    };
  } else {
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
  }
};
const ContactData = props => {
  const [orderForm, setOrderForm] = useState({
    name: inputConfig("text", "Your Name", { required: true }),
    street: inputConfig("text", "Street", { required: true }),
    zipCode: inputConfig("text", "Zip Code", {
      required: true,
      minLength: 5
    }),
    country: inputConfig("text", "Country", { required: true }),
    deliveryMethod: inputConfig("select", "Delivery Method"),
    email: inputConfig("email", "email", { required: true })
  });
  const [formIsValid, setFormIsValid] = useState(false);
  const orderHandler = e => {
    e.preventDefault();
    const formData = {};
    for (let formElementIdentifier in orderForm) {
      formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
    }
    const order = {
      ingredients: props.ingredients,
      price: props.totalPrice,
      orderData: formData,
      userId: props.userId
    };
    props.onOrderBurger(order, props.token);
  };
  const inputChangeHandler = (event, inputIdentifier) => {
    let updatedInfo;
    if (inputIdentifier !== "deliveryMethod") {
      updatedInfo = {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          orderForm[inputIdentifier].validation
        ),
        touched: true
      };
    } else {
      updatedInfo = {
        value: event.target.value
      };
    }
    const updatedFormElement = updateObject(
      orderForm[inputIdentifier],
      updatedInfo
    );
    const updatedOrderForm = updateObject(orderForm, {
      [inputIdentifier]: updatedFormElement
    });
    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    setOrderForm(updatedOrderForm);
    setFormIsValid(formIsValid);
  };
  const formElementsArray = [];
  for (let key in orderForm) {
    formElementsArray.push({
      id: key,
      config: orderForm[key]
    });
  }
  let form = (
    <form onSubmit={orderHandler}>
      {formElementsArray.map(formElement => (
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
      ))}
      <Button btnType="Success" disabled={!formIsValid}>
        ORDER
      </Button>
    </form>
  );
  if (props.loading) {
    form = <Spinner />;
  }
  return (
    <div className={classes.ContactData}>
      <h4>Enter Your Contact Data</h4>
      {form}
    </div>
  );
};
const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) =>
      dispatch(actions.purchaseBurger(orderData, token))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
