// Constants
const ADD_TASK = "ADD_TASK";
const EDIT_TASK = "EDIT_TASK";
const DELETE_TASK = "DELETE_TASK";
const SET_TASKS = "SET_TASKS";

// Action Creators
export function addTask(task) {
  return {
    type: ADD_TASK,
    payload: task,
  };
}
export function editTask(task) {
  return {
    type: EDIT_TASK,
    payload: task,
  };
}
export function deleteTask(task) {
  return {
    type: DELETE_TASK,
    payload: task,
  };
}
export function setTask(task) {
  return {
    type: SET_TASKS,
    payload: task,
  };
}

// Initial State
const initState = [];

// Reducer
function taskReducer(state = initState, action) {
  switch (action.type) {
    case ADD_TASK:
      return [...state, action.payload];
    case EDIT_TASK:
      if (Boolean(action.payload.is_completed)) {
        return state.filter((x) => x.id !== action.payload.id);
      } else {
        return state.map((x) =>
          x.id === action.payload.id ? action.payload : x
        );
      }
    case DELETE_TASK:
      return state.filter((itm) => itm.id !== action.payload);
    case SET_TASKS:
      return action.payload;
    default:
      return state;
  }
}

export default taskReducer;
