
import { useState, useEffect } from "react";
import noteContext from "./notecontext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const initialNotes = [];

  const [notes, setNotes] = useState(initialNotes);

  const getAuthToken = () => {
    const maintoken = localStorage.getItem('token');
    console.log("Token from localStorage: ", maintoken);
    return maintoken;
  };

  const getAllNotes = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
    try {
      const response = await fetch(`${host}/api/notes/fetchnotes`, {
        method: "GET",
        headers: {
          "auth-token": token,
        },
      });
      const json = await response.json();
      console.log(json);
      if (response.ok) {
        setNotes(json);
      } else {
        console.error("Failed to fetch notes: ", json.error);
      }
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  const addNote = async (title, description, tag) => {
    const token = getAuthToken();
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
    try {
      const response = await fetch(`${host}/api/notes/addnotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ title, description, tag }),
      });
      const note = await response.json();
      if (response.ok) {
        setNotes(notes.concat(note));
      } else {
        console.error("Failed to add note: ", note.error);
      }
    } catch (error) {
      console.error("Error adding note: ", error);
    }
  };

  const deleteNote = async (id) => {
    const token = getAuthToken();
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      const json = await response.json();
      if (response.ok) {
        const newNotes = notes.filter((note) => note._id !== id);
        setNotes(newNotes);
      } else {
        console.error("Failed to delete note: ", json.error);
      }
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  };

  const updateNotes = async (id, title, description, tag) => {
    const token = getAuthToken();
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ title, description, tag }),
      });
      const json = await response.json();
      console.log(json);
      if (response.ok) {
        let newNotes = JSON.parse(JSON.stringify(notes));
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if (element._id === id) {
            element.title = title;
            element.description = description;
            element.tag = tag;
            break;
          }
        }
        setNotes(newNotes);
      } else {
        console.error("Failed to update note: ", json.error);
      }
    } catch (error) {
      console.error("Error updating note: ", error);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  return (
    <noteContext.Provider value={{ notes, setNotes, addNote, deleteNote, updateNotes, getAllNotes }}>
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
