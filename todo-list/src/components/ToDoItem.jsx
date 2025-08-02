const ToDoItem = ({ 
  task, 
  onDelete, 
  onToggleComplete, 
  editingId, 
  editText, 
  setEditText, 
  startEditing, 
  saveEdit, 
  cancelEdit 
}) => {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
      />

      {/* Conditional rendering for edit/view mode */}
      {editingId === task.id ? (
        <div className="edit-mode">
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <button onClick={() => saveEdit(task.id)}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
        </div>
      ) : (
        <div className="view-mode">
          <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            {task.text}
          </span>
          <button onClick={() => startEditing(task.id, task.text)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default ToDoItem;