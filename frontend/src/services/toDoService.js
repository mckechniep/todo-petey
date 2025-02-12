import api from "./api.js";

/* getTodos uses a function called api.get (which we assume is 
defined elsewhere and handles making HTTP requests) to send a 
request to the server at the /todos endpoint. It includes the 
retrieved token in the request's Authorization header. */
export const getToDos = async () => {
  // retrieve stored jwt token
  const token = localStorage.getItem("token");
  const res = await api.get("/todos", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; //expecting the todos array from the backend
};
/* The server is expected to respond with a the user's todos array */

export const getToDoById = async (id) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const createToDo = async (todoData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated. Token is missing.");
  }
  try {
    const res = await api.post("/todos", todoData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // returns relevant ToDo data, not entire response object w/ metadata etc etc
    return res.data; // .data property specifically holds the parsed response body
  } catch (error) {
    console.error("Error creating ToDo", error);
    throw error; // lets the calling function decide how to handle the error, as it knows where the error occured
  }
};


// purpose is to send a request to the server to update to-do item with the new updatedToDo info provided
export const editToDo = async (id, updatedToDo) => { // takes 2 arguments, id of the todo item to update, and updatedToDo - an object containing the updated to-do data
    const token = localStorage.getItem("token");
    try {
        // api.put method sends request to endpoint with updatedToDo as the request
        const res = await api.put(`/todos/${id}`, updatedToDo, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating ToDo", error);
        throw error;
    }
};

