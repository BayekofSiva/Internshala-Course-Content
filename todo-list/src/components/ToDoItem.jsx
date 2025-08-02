const ToDoItem = ({ task, onDelete, onToggleComplete, onEdit }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)} 
      />
      <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
        {task.text}
      </span>
      <button onClick={() => onEdit(task.id)}>Edit</button> {/* Uses prop */}
      <button onClick={() => onDelete(task.id)}>Delete</button> {/* Uses prop */}
    </li>
  );
};

export default ToDoItem;