import ToDoItem from "./ToDoItem";

const ToDoList = ({ todos, onDelete, onToggleComplete, onEdit }) => {
  return (
    <ul className="todo-list">
      {todos.map((task) => (
        <ToDoItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
};

export default ToDoList;