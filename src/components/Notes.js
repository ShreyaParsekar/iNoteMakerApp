
import React, { useContext, useEffect, useRef, useState} from 'react'
import noteContext from "../context/notes/notecontext"
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from "react-router-dom";
const Notes = (props) => {
  let navigate= useNavigate();
 const context = useContext(noteContext);                                                                          
 const {notes, getAllNotes, updateNotes }  = context; 

 useEffect(() => {
  if(localStorage.getItem('token')){
    getAllNotes()
  }
  else{
    navigate("/login")
  }
 }, []);
 const ref = useRef(null);
 const refClose = useRef(null);
 const [note, setNote] = useState({id: "", title: "", description: "", tag: "default"});

 const updateNote = (currentNote) =>{
  ref.current.click();
     
      setNote({title: currentNote.title, id : currentNote._id, description: currentNote.description, tag:currentNote.tag})
     
    }
 const addNoteOnClick = (e) => {
  console.log("updating...", note)
  refClose.current.click();
  updateNotes(note.id,note.title, note.description, note.tag)
  props.showalert("Updated successfully", "success")
  e.preventDefault()
  
  setNote({title: "", description: "", tag: "default"})
   }
    
   const onChange = (e) => {
     setNote({...note, [e.target.name]: e.target.value})
   }
 
  return (
    <>
    <AddNote showalert={props.showalert}/>

    
<button ref={ref} type="button" className="btn btn-primary d-none" data-toggle="modal" data-target="#exampleModal">
  Launch demo modal
</button>


<div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"  aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
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
  
</form>

      </div>
      <div className="modal-footer">
        <button ref={refClose} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        <button disabled={note.title.length<5 || note.description.length<5} type="button" onClick={addNoteOnClick} className="btn btn-primary">Update Note</button>
      </div>
    </div>
  </div>
</div>


    <div className="row my-3">
      <h2>Your Notes</h2>
      <div className="container mx-2">
      {notes.length===0 && 'No notes to display'}</div>
{ Array.isArray(notes) && notes.map((note)=>{
  return <NoteItem key={note._id} showalert={props.showalert} updateNote={updateNote} note={note}/>
})}
    </div>
    </>
  )
} 
export default Notes
