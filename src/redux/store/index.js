import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import authReducer from "../authReducer";
import toastReducer from "../toastReducer";
import todoReducer from "../todoReducer";

const rootReducer = combineReducers({
  task: todoReducer,
  toast: toastReducer,
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
