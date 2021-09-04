const initAuthState = {
  token: "",
  userId: "",
};

function authReducer(state = initAuthState, action) {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

export default authReducer;
