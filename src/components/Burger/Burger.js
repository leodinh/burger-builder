import React from "react";
import styles from "./Burger.module.css";
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
const burger = props => {
  let transformedIngradients = Object.keys(props.ingredients)
    .map(igKey => {
      return [...Array(props.ingredients[igKey])].map((value, i) => {
        return <BurgerIngredient key={igKey + i} type={igKey} />;
      });
    })
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);
  if (transformedIngradients.length === 0) {
    transformedIngradients = <p>Please start adding ingredients</p>;
  }
  console.log(styles.Burger);
  console.log(transformedIngradients);
  return (
    <SimpleBar style={{ maxHeight: 600 }} autoHide="false">
      <div className={styles.Burger}>
        <BurgerIngredient type="bread-top" />
        {transformedIngradients}
        <BurgerIngredient type="bread-bottom" />
      </div>
    </SimpleBar>
  );
};
export default burger;
