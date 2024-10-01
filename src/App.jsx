import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskLink, setTaskLink] = useState("");
  const [subtaskLink, setSubtaskLink] = useState("");
  const [status, setStatus] = useState("");
  const [subtaskLinks, setSubtaskLinks] = useState([]);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  // Handle form submission
  const handleAddTask = (e) => {
    e.preventDefault();

    const newTask = {
      taskName,
      taskLink,
      subtaskLinks:
        subtaskLinks.length > 0 ? subtaskLinks : taskLink ? [taskLink] : [],
      status,
    };

    setTasks([...tasks, newTask]);

    // Reset form fields
    setTaskName("");
    setTaskLink("");
    setSubtaskLink("");
    setStatus("");
    setSubtaskLinks([]);
  };

  // Handle adding additional subtask links
  const handleAddSubtaskLink = () => {
    if (subtaskLink.trim() !== "") {
      setSubtaskLinks([...subtaskLinks, subtaskLink]);
      setSubtaskLink(""); // Clear input after adding
    }
  };

  // Handle copying task details with the correct format
  const handleCopyTask = () => {
    let taskText = `Today's Update:\n\n`;

    tasks.forEach((task, index) => {
      taskText += `${index + 1}. ${task.taskName}`;
      if (task.subtaskLinks.length > 0) {
        task.subtaskLinks.forEach((link) => {
          taskText += `\n   - ${link} = ${task.status}`;
        });
      } else {
        taskText += ` = ${task.status}`;
      }
      taskText += `\n`;
    });

    navigator.clipboard
      .writeText(taskText.trim())
      .then(() => alert("Copied Successfully!"))
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  // Toggle edit mode
  const handleEditTask = (index) => {
    setEditingTaskIndex(index);
  };

  // Handle saving edited task
  const handleSaveTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index
        ? {
            ...task,
            taskName,
            taskLink,
            subtaskLinks:
              subtaskLinks.length > 0
                ? subtaskLinks
                : taskLink
                ? [taskLink]
                : [],
            status,
          }
        : task
    );
    setTasks(updatedTasks);
    setEditingTaskIndex(null); // Exit edit mode
    setTaskName("");
    setTaskLink("");
    setSubtaskLink("");
    setStatus("");
    setSubtaskLinks([]);
  };

  return (
    <div className="app">
      <div className="main-app">
        <h1>Task Manager</h1>

        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
          <input
            type="url"
            placeholder="Main Task Link"
            value={taskLink}
            onChange={(e) => setTaskLink(e.target.value)}
          />
          <input
            type="url"
            placeholder="Subtask Link (Optional)"
            value={subtaskLink}
            onChange={(e) => setSubtaskLink(e.target.value)}
          />
          <button type="button" onClick={handleAddSubtaskLink}>
            Add Subtask Link
          </button>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="" disabled>
              Status
            </option>
            <option value="Done">Done</option>
            <option value="QA">QA</option>
            <option value="In Progress">In Progress</option>
          </select>
          <button type="submit">Add Task</button>
        </form>

        <div className="task-item">
          <h2>Today's Update:</h2>
          {tasks.length === 0 ? (
            <p>No tasks added yet.</p>
          ) : (
            <div>
              {tasks.map((task, index) => (
                <div key={index}>
                  {editingTaskIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={taskName}
                        placeholder={task.taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                      />
                      <input
                        type="url"
                        value={taskLink}
                        placeholder={task.taskLink || "Main Task Link"}
                        onChange={(e) => setTaskLink(e.target.value)}
                      />
                      {task.subtaskLinks.map((subtask, idx) => (
                        <input
                          key={idx}
                          type="url"
                          value={subtaskLink}
                          placeholder={subtask}
                          onChange={(e) => setSubtaskLink(e.target.value)}
                        />
                      ))}
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="Done">Done</option>
                        <option value="QA">QA</option>
                        <option value="In Progress">In Progress</option>
                      </select>
                      <button onClick={() => handleSaveTask(index)}>
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <p>
                        {index + 1}. {task.taskName}:
                      </p>
                      {task.subtaskLinks.length > 0
                        ? task.subtaskLinks.map((link, idx) => (
                            <p key={idx}>
                              {" "}
                              -{" "}
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link}
                              </a>{" "}
                              = {task.status}
                            </p>
                          ))
                        : `${task.taskName} = ${task.status}`}
                      <button onClick={() => handleEditTask(index)}>
                        Edit
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <button onClick={handleCopyTask}>Copy Today Update</button>
        </div>
      </div>
    </div>
  );
}

export default App;
