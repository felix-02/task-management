import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import authReducer from "../authReducer";
import toastReducer from "../toastReducer";
import taskReducer from "../taskReducer";

const rootReducer = combineReducers({
  task: taskReducer,
  toast: toastReducer,
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
