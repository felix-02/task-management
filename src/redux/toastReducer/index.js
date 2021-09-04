// Constants
const SHOW_TOAST = "SHOW_TOAST";
const HIDE_TOAST = "HIDE_TOAST";

// Action Creators
export function showToast(toastData) {
  return {
    type: SHOW_TOAST,
    payload: toastData,
  };
}

export function hideToast(toastData) {
  return {
    type: HIDE_TOAST,
    payload: toastData,
  };
}

// Initial State
const initToastState = {
  message: "",
  background: "",
  visible: false,
};

// Reducer
function toastReducer(state = initToastState, action) {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        message: action.payload.message ,
        background: action.payload?.background || "green",
        visible: true,
      };
    case HIDE_TOAST:
      return {
        message: "",
        background: "",
        visible: false,
      };
    default:
      return state;
  }
}

export default toastReducer;
