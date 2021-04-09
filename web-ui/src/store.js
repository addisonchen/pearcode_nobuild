// Heavily based on code from nat's scratch repo
import { createStore, combineReducers } from 'redux';

function save_session(s) {
  let session = Object.assign({}, s, {time: Date.now()});
  localStorage.setItem("session", JSON.stringify(session));
}

function delete_session() {
  localStorage.setItem("session", null);
}

function restore_session() {
  let session = localStorage.getItem("session");
  if (!session) {
    return null;
  }

  session = JSON.parse(session);

  if (session === null) {
    return null;
  }
  
  let age = Date.now() - session.time;
  let hours = 60 * 60 * 1000;
  if (age < 72 * hours) {
    return session;
  }
  else {
    return null;
  }
}

function session(state = restore_session(), action) {
  switch (action.type) {
    case 'session/set':
      save_session(action.data);
      return action.data;
    case 'session/clear':
      delete_session();
      return null;
    default:
      return state;
  }
}

function error(state = null, action) {
  switch (action.type) {
    case 'session/set':
      return null;
    case 'error/set':
      return action.data;
    default:
      return state;
  }
}

function root_reducer(state, action) {
  //console.log("root reducer", state, action);

  let redu = combineReducers(
    {session, error}
  );

  let state1 = redu(state, action);
  //console.log("state1", state1);

  return state1;
}

let store = createStore(root_reducer);
export default store;