import { put } from "redux-saga/effects";
import axios from "../../axios";
import * as actions from "../actions/index";
export function* initIngredientSaga(action) {
  const res = yield axios.get("ingredient.json");
  try {
    yield put(actions.setIngredients(res.data));
  } catch (error) {
    yield put(actions.fetchIngredientFailed());
  }
}
