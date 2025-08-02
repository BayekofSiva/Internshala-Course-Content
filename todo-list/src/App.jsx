import { useState } from "react";
import Header from "./components/header";
import ToDoList from "./components/ToDoList";
import Footer from './components/footer';
// import { ErrorBoundary } from 'react-error-boundary';

// function ErrorFallback({ error }) {
//   return (
//     <div>
//       <h2>Something went wrong</h2>
//       <p>{error.message}</p>
//     </div>
//   );
// }

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);  // Tracks which task is being edited
  const [editText, setEditText] = useState("");     // Stores the text during editing

  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTodo = { 
        id: Date.now(), 
        text: newTask, 
        completed: false 
      };
      console.log("Adding task:", newTodo); // Debug log
      setTodos([...todos, newTodo]);
      setNewTask("");
    }
  };

  // Enhanced delete with confirmation
  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTodos(todos.filter(task => task.id !== id));
    }
  };

  // Edit-related functions
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (editText.trim() !== "") {
      setTodos(todos.map(task => 
        task.id === id ? { ...task, text: editText } : task
      ));
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id, newText) => {
    setTodos(
      todos.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  return (
    <div className="App">
      <Header />
      <div className="add-todo">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ToDoList
          todos={todos}
          onDelete={deleteTask}
          onToggleComplete={toggleComplete}
          editingId={editingId}
          editText={editText}
          setEditText={setEditText}
          startEditing={startEditing}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
      />
      <Footer />
    </div>
  );
}

export default App;