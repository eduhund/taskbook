import { configureStore } from "redux";

const GET_TASK = "GET_TASK";

function getTask(value) {
  return {
    type: GET_TASK,
    value: value,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case GET_TASK:
      return { value: action.value };
    default:
      return state;
  }
}

const store = configureStore(reducer);

export default store;
