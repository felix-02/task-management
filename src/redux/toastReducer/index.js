const initToastState = {
  message: "",
  background: "",
  visible: false,
};

function toastReducer(state = initToastState, action) {
  switch (action.type) {
    case "SHOW_TOAST":
      return {
        message: action.payload.message,
        background: action.payload?.background || "green",
        visible: true,
      };
    case "HIDE_TOAST":
      return {
        message: "",
        background: "",
        visible: false,
      };
    default:
      return state;
  }
}

export default toastReducer