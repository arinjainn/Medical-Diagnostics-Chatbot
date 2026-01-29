import React, { useState, useEffect } from "react";
import axios from "axios";

interface Reminder {
  _id: string;
  title: string;
  datetime: string;
  description?: string;
}

const Reminder: React.FC = () => {
  const [title, setTitle] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await axios.get("/reminder/all", {
        withCredentials: true,
      });
      setReminders(response.data.reminders);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reminders.");
    }
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/reminder/create",
        { title, datetime, description },
        { withCredentials: true }
      );
      setReminders(response.data.reminders);
      setTitle("");
      setDatetime("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Failed to add reminder.");
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      const response = await axios.delete("reminder/delete", {
        data: { reminderId: id },
        withCredentials: true,
      });
      setReminders(response.data.reminders);
    } catch (err) {
      console.error(err);
      setError("Failed to delete reminder.");
    }
  };

  const cssStyles = `
  .reminders-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .reminders-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    list-style-type: none;
    padding: 0;
  }
  .reminder-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    margin: 10px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    color: black;
    background-color: #f9f9f9;
  }
  .reminder-item h3, .reminder-item p {
    margin: 5px 0;
  }
  .reminder-item button {
    margin-top: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: black;
    cursor: pointer;
  }
  .reminder-item button:hover {
    background-color: #0056b3;
  }

  h1 {
    text-align: center;
    color: yellowgreen;
    font-size: 3rem;
    margin-bottom: 20px;
    margin-top: 0px;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  form div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  input[type="text"],
  input[type="datetime-local"],
  textarea {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box; /* Ensures padding does not affect overall width */
  }

  textarea {
    resize: vertical; /* Allows vertical resizing */
  }

  button[type="submit"] {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button[type="submit"]:hover {
    background-color: #0056b3;
  }
`;

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <h1 >Reminders</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="remInput" onSubmit={handleAddReminder}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date and Time:</label>
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Add Reminder</button>
      </form>
      <div className="reminders-container">
        <h2>Your Reminders</h2>
        <ul className="reminders-list">
          {reminders.map((reminder) => (
            <li key={reminder._id} className="reminder-item">
              <h3>{reminder.title}</h3>
              <p>{new Date(reminder.datetime).toLocaleString()}</p>
              {reminder.description && <p>{reminder.description}</p>}
              <button onClick={() => handleDeleteReminder(reminder._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};



export default Reminder;
