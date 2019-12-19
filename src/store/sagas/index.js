import { takeEvery, all, takeLatest } from "redux-saga/effects";
import {
  logoutSaga,
  checkAuthTimeoutSaga,
  authUserSaga,
  authCheckStateSaga
} from "./auth";
import { initIngredientSaga } from "./burgerBuilder";
import { purchaseBurgerSaga, fetchOrderSaga } from "./order";
import * as actionTypes from "../actions/actionTypes";
export function* watchAuth() {
  yield all([
    takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga),
    takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga),
    takeEvery(actionTypes.AUTH_USER, authUserSaga),
    takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga)
  ]);
}
export function* watchBurgerBuilder() {
  yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientSaga);
}
export function* watchOrder() {
  yield all([
    takeLatest(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga),
    takeEvery(actionTypes.FETCH_ORDERS, fetchOrderSaga)
  ]);
}
