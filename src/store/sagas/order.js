import { put } from "redux-saga/effects";
import axios from "../../axios";
import * as actions from "../actions/index";
export function* purchaseBurgerSaga(action) {
  yield put(actions.purchaseBurgerStart());
  const response = yield axios.post(
    "/orders.json?auth=" + action.token,
    action.orderData
  );
  try {
    yield put(
      actions.purchaseBurgerSuccess(response.data.name, action.orderData)
    );
  } catch (error) {
    yield put(actions.purchaseBurgerFail(error));
  }
}
export function* fetchOrderSaga(action) {
  yield put(actions.fetchOrdersStart());
  const queryParams = `?auth=${action.token}&orderBy="userId"&equalTo="${action.userId}"`;
  const res = yield axios.get("/orders.json" + queryParams);
  try {
    const fetchedOrders = [];
    for (let key in res.data) {
      fetchedOrders.push({ ...res.data[key], id: key });
    }
    yield put(actions.fetchOrdersSuccess(fetchedOrders));
  } catch (error) {
    yield put(actions.fetchOrdersFail(error));
  }
}
