import ToDoItem from "./ToDoItem";

const ToDoList = ({ todos, onDelete, onToggleComplete, editingId, editText, setEditText, startEditing, saveEdit, cancelEdit }) => {
        console.log("Current todos:", todos); // Debugging to check todos
        return (
        <ul className="todo-list">
        {todos.map((task) => (
                <ToDoItem
                        key={task.id}
                        task={task}
                        onDelete={onDelete}
                        onToggleComplete={onToggleComplete}
                        editingId={editingId}
                        editText={editText}
                        setEditText={setEditText}
                        startEditing={startEditing}
                        saveEdit={saveEdit}
                        cancelEdit={cancelEdit}
                />
        ))}
        </ul>
        );
};

export default ToDoList;