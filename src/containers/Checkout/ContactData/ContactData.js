import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from "../../../axios";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
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
      touch: false
    };
  }
};
export default class ContactData extends Component {
  state = {
    orderForm: {
      name: inputConfig("text", "Your Name", { required: true }),
      street: inputConfig("text", "Street", { required: true }),
      zipCode: inputConfig("text", "Zip Code", {
        required: true,
        minLength: 5
      }),
      country: inputConfig("text", "Country", { required: true }),
      deliveryMethod: inputConfig("select", "Delivery Method"),
      email: inputConfig("email", "email", { required: true })
    },
    loading: false,
    formIsValid: false
  };
  checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    return isValid;
  }
  orderHandler = e => {
    e.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData
    };
    axios
      .post("/orders.json", order)
      .then(response => {
        setTimeout(() => this.setState({ loading: false }), 3000);
        this.props.history.push("/");
      })
      .catch(error => this.setState({ loading: false }));
  };
  inputChangeHandler = (event, inputIdentifier) => {
    const updatedOrderForm = { ...this.state.orderForm };
    const updatedFormElement = { ...updatedOrderForm[inputIdentifier] };
    updatedFormElement.value = event.target.value;
    if (inputIdentifier !== "deliveryMethod") {
      updatedFormElement.valid = this.checkValidity(
        updatedFormElement.value,
        updatedFormElement.validation
      );
      updatedFormElement.touch = true;
    }
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };
  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => (
          <Input
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            key={formElement.id}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touch}
            change={event => this.inputChangeHandler(event, formElement.id)}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter Your Contact Data</h4>
        {form}
      </div>
    );
  }
}
