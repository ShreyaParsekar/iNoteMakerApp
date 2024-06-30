const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

//Route1: get all the notes. login required
router.get('/fetchnotes', fetchuser, async(req, res) => {
   
    try {
        const notes = await Notes.find({ user: req.user.id })
   
    res.json(notes)
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
    
})

//Route3: add a new note using POST "/api/notes/addnotes". login required
router.post('/addnotes', fetchuser,[
    body('title').isLength({ min: 5 }).withMessage('Enter a valid title'),
    body('description').isLength({ min: 5 }).withMessage('Description must be atleast 5 characters'),
],async(req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {title,  description, tag} = req.body
       const notes = new Notes({
            title,
            description,
            tag,
            user: req.user.id  
        });
        await notes.save()
        console.log(notes)
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
   
})


//Route3: update the note. login required
router.put('/updatenote/:id', fetchuser, async(req, res) => {
   
    try {
        const {title,  description, tag} = req.body;
        const newnote ={};
            if(title){newnote.title = title};
            if(description){newnote.description = description};
            if(tag){newnote.tag = tag};
        
    //find note to be updated and update it
let note = await Notes.findById(req.params.id);
if(!note){ return res.status(404).send("Not found")}

if(note.user.toString() !== req.user.id){
return res.status(401).send("Not allowed")
}
note = await Notes.findByIdAndUpdate(req.params.id, {$set: newnote}, {new:true})
res.json({note})
    // const notes = await Notes.find({ user: req.user.id })
    // res.json(notes)
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
    
})

// Route3: update the note. login required
router.delete('/deletenote/:id', fetchuser, async(req, res) => {
   
    try {
        const {title,  description, tag} = req.body;
        const newnote ={};
            if(title){newnote.title = title};
            if(description){newnote.description = description};
            if(tag){newnote.tag = tag};
        
    //find note to be delete and delete it
let note = await Notes.findById(req.params.id);
if(!note){ return res.status(404).send("Not found")}
//allow deletion only if user owns this note
if(note.user.toString() !== req.user.id){
return res.status(401).send("Not allowed")
}
note = await Notes.findByIdAndDelete(req.params.id)
res.json("Note has been delete");
    // const notes = await Notes.find({ user: req.user.id })
    // res.json(notes)
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
    
})
module.exports = router