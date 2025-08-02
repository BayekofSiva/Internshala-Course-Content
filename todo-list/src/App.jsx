import { useState } from "react";
import Header from "./components/header";
import ToDoList from "./components/ToDoList";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((task) => task.id !== id));
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
          onEdit={(id) => {
            const newText = prompt("Edit task:", todos.find(t => t.id === id).text);
            if (newText !== null) editTask(id, newText);
          }}
      />
    </div>
  );
}

export default App;