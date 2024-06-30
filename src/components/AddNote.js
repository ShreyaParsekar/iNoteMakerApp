import React, { useContext, useState } from 'react'
import noteContext from "../context/notes/notecontext"

const AddNote = (props) => {
    const context = useContext(noteContext);                                                                          
 const {addNote} = context;
 const [note, setNote] = useState({title: "", description: "", tag: "default"});

 const addNoteOnClick = (e) => {
e.preventDefault()
addNote(note.title, note.description, note.tag);
setNote({title: "", description: "", tag: "default"})
props.showalert("Added note successfully", "success")
 }
  
 const onChange = (e) => {
   setNote({...note, [e.target.name]: e.target.value})
 }
  return (
    <div>
       <div className="container my-5">
      <h2>Add your Notes here</h2>
      <form>
  <div className="mb-3">
    <label htmlFor="title" className="form-label">Title</label>
    <input type="text" className="form-control" id="title" value={note.title} name='title' onChange={onChange}/>
    
  </div>
  <div className="mb-3">
    <label htmlFor="description" className="form-label">Description</label>
    <input type="text" className="form-control" name='description' value={note.description} onChange={onChange}/>
  </div>
  <div className="mb-3">
    <label htmlFor="tag" className="form-label">Tag</label>
    <input type="text" className="form-control" name='tag' value={note.tag} onChange={onChange}/>
  </div>
  
  <button type="submit" disabled={note.title.length<5 || note.description.length<5} className="btn btn-primary" onClick={addNoteOnClick}>Submit</button>
</form>

    </div>
    </div>
  )
}

export default AddNote
