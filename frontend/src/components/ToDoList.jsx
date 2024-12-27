import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditToDoForm from "./EditToDoForm.jsx";
import { getToDos, editToDo } from "../services/toDoService.js";
import { useAuth } from "../services/AuthContext.jsx";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";


const ToDoList = ({ newToDo }) => {
  const [todos, setTodos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingToDo, setEditingToDo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!authLoading && user) {
        try {
          const data = await getToDos();
          setTodos(data);
          localStorage.setItem("todos", JSON.stringify(data));
          setLoading(false);
        } catch (err) {
          console.error("Error fetching todos:", err);
          setError("Failed to fetch todos. Please try again later.");
          setLoading(false);
        }
      }
    };
    fetchTodos();
  }, [authLoading, user]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (newToDo) {
      setTodos((prevTodos) => [...prevTodos, newToDo]);
    }
  }, [newToDo]);

  const filteredTodos =
  selectedCategory === "All"
    ? todos.filter((todo) => !todo.completed) // Show only incomplete ToDos in "All"
    : selectedCategory === "Completed"
    ? todos.filter((todo) => todo.completed) // Show only completed ToDos in "Completed"
    : todos.filter(
        (todo) =>
          !todo.completed && // Exclude completed ToDos from other categories
          (todo.category || "Uncategorized").toLowerCase() ===
            selectedCategory.toLowerCase()
      );


      const handleToggleCompleted = async (updatedToDo) => {
        try {
          // Use editToDo to update the backend
          const updatedFromBackend = await editToDo(updatedToDo._id, updatedToDo);
    
          // Update the local state with the response from the backend
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo._id === updatedFromBackend._id ? updatedFromBackend : todo
            )
          );
        } catch (error) {
          console.error("Failed to update ToDo:", error);
          alert("Could not update ToDo. Please try again.");
        }
      };
    

  const handleCancel = () => {
    setEditingToDo(null);
  };

  if (loading) return <p>Loading ToDos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        ToDo List
      </Typography>

      {editingToDo ? (
        <EditToDoForm
          todo={editingToDo}
          onUpdate={handleToggleCompleted}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <Typography variant="subtitle1">Filter by Category:</Typography>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
            sx={{ mb: 2, width: "200px" }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            {["A List", "B List", "C List", "Uncategorized"].map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={() => setSelectedCategory("All")} sx={{ mb: 2 }}>
            Clear Filter
          </Button>

          <List sx={{ width: "100%", maxWidth: 600, bgcolor: "background.paper" }}>
  {filteredTodos.map((todo) => (
    <ListItem
      key={todo._id}
      secondaryAction={
        <IconButton
          edge="end"
          onClick={() => setEditingToDo(todo)}
          disabled={editingToDo && editingToDo._id !== todo._id}
        >
          <EditIcon />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar>
          <AssignmentIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <div>
            <Link
              to={`/todos/${todo._id}`}
              style={{ textDecoration: "none" }}
            >
              {todo.title}
            </Link>
            <Typography variant="body2" sx={{ display: "inline", ml: 2 }}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {
                    const updatedToDo = {
                      ...todo,
                      completed: !todo.completed,
                    };
                    handleToggleCompleted(updatedToDo);
                  }}
                />
                Completed
              </label>
            </Typography>
          </div>
        }
        secondary={`Category: ${todo.category || "Uncategorized"}`}
      />
    </ListItem>
  ))}
</List>

        </>
      )}
    </div>
  );
};

export default ToDoList;





// const ToDoList = ({ newToDo }) => {
//   const [todos, setTodos] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [editingToDo, setEditingToDo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { user, loading: authLoading } = useAuth();

//   useEffect(() => {
//     const storedTodos = localStorage.getItem("todos");
//     if (storedTodos) {
//       setTodos(JSON.parse(storedTodos));
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchTodos = async () => {
//       if (!authLoading && user) {
//         try {
//           const data = await getToDos();
//           setTodos(data);
//           localStorage.setItem("todos", JSON.stringify(data));
//           setLoading(false);
//         } catch (err) {
//           console.error("Error fetching todos:", err);
//           setError("Failed to fetch todos. Please try again later.");
//           setLoading(false);
//         }
//       }
//     };
//     fetchTodos();
//   }, [authLoading, user]);

//   useEffect(() => {
//     localStorage.setItem("todos", JSON.stringify(todos));
//   }, [todos]);

//   useEffect(() => {
//     if (newToDo) {
//       setTodos((prevTodos) => [...prevTodos, newToDo]);
//     }
//   }, [newToDo]);

//   const filteredTodos =
//     selectedCategory === "All"
//       ? todos
//       : todos.filter(
//           (todo) =>
//             (todo.category || "Uncategorized").toLowerCase() ===
//             selectedCategory.toLowerCase()
//         );

//   const handleUpdate = (updatedToDo) => {
//     setTodos((prevTodos) =>
//       prevTodos.map((todo) =>
//         todo._id === updatedToDo._id ? updatedToDo : todo
//       )
//     );
//     setEditingToDo(null);
//   };

//   const handleCancel = () => {
//     setEditingToDo(null);
//   };

//   if (loading) return <p>Loading ToDos...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div>
//       <Typography variant="h4" gutterBottom>
//         ToDo List
//       </Typography>

//       {editingToDo ? (
//         <EditToDoForm
//           todo={editingToDo}
//           onUpdate={handleUpdate}
//           onCancel={handleCancel}
//         />
//       ) : (
//         <>
//           <Typography variant="subtitle1">Filter by Category:</Typography>
//           <Select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             displayEmpty
//             sx={{ mb: 2, width: "200px" }}
//           >
//             <MenuItem value="All">All</MenuItem>
//             {["A List", "B List", "C List", "Uncategorized"].map((category) => (
//               <MenuItem key={category} value={category}>
//                 {category}
//               </MenuItem>
//             ))}
//           </Select>
//           <Button onClick={() => setSelectedCategory("All")} sx={{ mb: 2 }}>
//             Clear Filter
//           </Button>

//           <List
//             sx={{ width: "100%", maxWidth: 600, bgcolor: "background.paper" }}
//           >
//             {filteredTodos.map((todo) => (
//               <ListItem
//                 key={todo._id}
//                 secondaryAction={
//                   <IconButton
//                     edge="end"
//                     onClick={() => setEditingToDo(todo)}
//                     disabled={editingToDo && editingToDo._id !== todo._id}
//                   >
//                     <EditIcon />
//                   </IconButton>
//                 }
//               >
//                 <ListItemAvatar>
//                   <Avatar>
//                     <AssignmentIcon />
//                   </Avatar>
//                 </ListItemAvatar>
//                 <ListItemText
//                   primary={
//                     <div>
//                       <Link
//                         to={`/todos/${todo._id}`}
//                         style={{ textDecoration: "none" }}
//                       >
//                         {todo.title}
//                       </Link>
//                       <Typography
//                         variant="body2"
//                         sx={{ display: "inline", ml: 2 }}
//                       >
//                         <label>
//                           <input
//                             type="checkbox"
//                             checked={todo.completed}
//                             onChange={() => {
//                               const updatedToDo = {
//                                 ...todo,
//                                 completed: !todo.completed,
//                               };
//                               handleUpdate(updatedToDo); // Update state with the toggled completion
//                             }}
//                           />
//                           Completed
//                         </label>
//                       </Typography>
//                     </div>
//                   }
//                   secondary={`Category: ${todo.category || "Uncategorized"}`}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </>
//       )}
//     </div>
//   );
// };

// export default ToDoList;
