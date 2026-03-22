const express = require ('express');
const jwt = require ('jsonwebtoken');


const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors()); 


const notes = []; 
const users = [{
    username: "harkirat",
    password: "123123"
}];


// POST - Create a note -- AUTHENTICATED ENDPOINT
app.post("/notes", function(req, res) {

    const username = req.username;
    const note = req.body.note;
    notes.push({note, username});

    res.json({
        message: "Done!"
    })
})

// GET - get all my notes -- AUTHENTICATED ENDPOINT
app.get("/notes", function(req, res) {
    const username = req.username;
    const userNotes = notes.filter(note => note.username === username);

    res.json({
        notes: userNotes
    })
})

app.get("/", function(req, res) {
    res.sendFile("D:/Bootcamp1/notesappself/frontend/index.html")
})


app.listen(3000, () => {console.log('Server is running on http://localhost:3000')});
