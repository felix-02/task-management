// Constants
const SET_AUTH = "SET_AUTH";

// Action Creators
export function setAuth(authData) {
  return {
    type: SET_AUTH,
    payload: authData,
  };
}

// Initial State
const initAuthState = {
  token: "",
  userId: "",
};

// Reducer
function authReducer(state = initAuthState, action) {
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

export default authReducer;
