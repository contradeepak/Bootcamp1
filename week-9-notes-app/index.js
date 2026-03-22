const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// --- PLACE IT HERE ---
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy", 
    "default-src 'self'; connect-src 'self' http://localhost:3000 ws://localhost:3000;"
  );
  next();
});


const notes = []; // This is bad, eventually we will learn about databased, Nodejs, mongodb postgresql, mysql etc later.

const users = [{
    username: "deepak",
    password: "123123"
}]



// for signup

app.post("/signup", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(403).json({message: "User with this username already exists"})
    }
    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You have signed up"
    })
})


app.post("/signin", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    const userExists = users.find(user => user.username === username && user.password === password);


    if (!userExists) {
        res.status(403).json({
            message: "Incorrect credentials"
        })
        return;
    }

   // json web tokens

   const token = jwt.sign({
    uername: username
   }, "deepak123");
   res.json({
    token: token
   })


})





// POST - Create a note -- AUTHENTICATED Endpoint

app.post("/notes", function(req, res) {
    // check if they have sent the right header, extract who this user is from the header
   
    const token = req.headers.token;

    if (!token) {
        res.status(403).send({
            message: "You are not logged in"
        });
         return;
    }
   
   
   const decoded = jwt.verify(token, "harkirat123")
   const username = decoded.username;

   if (!username) {
    res.status(403).json({
        message: "malformed token"
    })
    return;
   }
   
   
   
    const note = req.body.note;
    notes.push({note, username});

    res.json({
        message: "Done!"
    })
})


// GET - get all my notes -- AUTHENTICATED ENDPOINT


app.get("/notes", function(req, res) {
     const token = req.headers.token;

    if (!token) {
        res.status(403).send({
            message: "You are not logged in"
        });
         return;
    }
   
   
   const decoded = jwt.verify(token, "harkirat123")
   const username = decoded.username;

   if (!username) {
    res.status(403).json({
        message: "malformed token"
    })
    return;
   }
    
   const userNotes = notes.filter(note => note.username === username);

    res.json({
        notes: userNotes
    })
})



app.get("/", function(req, res) {
    res.sendFile('D:/Bootcamp1/week-9-notes-app/frontend/index.html')
})

app.listen(3000, () => console.log("Server is running on PORT 3000"));