// username, password | USERS table
// organization | ORGANIZATIONS table
// boards | BOARDS table
// issues | ISSUES table

const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware")


let USERS_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUES_ID = 1;

const USERS = [];

const ORGANIZATIONS = [];

const BOARDS = [];


const ISSUES = [];


const app = express();
app.use(express.json());


// We are making a CRUD operation, here are the C operations, I mean CREATE operations


app.post("/signup", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(u => u.username === username);
    if (userExists) {
        res.status(411).json({
            message: "User with this username already exists"
        })
        return;
    }

    USERS.push({
        username,
        password,
        id: USERS_ID++
    })

    res.json({
        message: "You have signed up successfully"
    })

})

app.post("/signin", (req,res) => {

   const username = req.body.username;
   const password = req.body.password;

   const userExists = USERS.find(u => u.username === username && u.password === password);
   if (!userExists) {
    res.status(403).json({
        message: "Incorrect credentials"
    })
   }

   const token = jwt.sign({
       userId: userExists.id
   }, "attlasionsupersecret123123password");
   // create a jwt for the user
   
   res.json({
    token
   })
})

// AUTHENTICATED ROUTE - MIDDLEWARE

app.post("/organization", authMiddleware, (req, res) => {
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc3NDA3NTAzMH0.rF_hRlJGA1jam3e2e0tnrZGBSkPfBBzvgTALuZ_M_fU
    const userId = req.userId;
    ORGANIZATIONS.push({
        id: ORGANIZATION_ID++,
        title: req.body.title,
        description: req.body.description,
        admin: userId,
        members: []
    })

    res.json({
        message: "Org created",
        id: ORGANIZATION_ID - 1
    })

})

app.post("/add-member-to-organization", authMiddleware, (req, res) => {
     const userId = req.userId;
     const organizationId = req.body.organizationId;
     const memberUserUsername = req.body.memberUserUsername;

     const organization = ORGANIZATIONS.find(org => org.id === organizationId);

     if (!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return
     }
     console.log(USERS)
     const memberUser = USERS.find(u => u.username === memberUserUsername);

     if (!memberUser) {
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return
     }

     organization.members.push(memberUser.id);

     res.json({
        message: "New member added!"
     })

     
})

app.post("/board", (req, res) => {

})

app.post("/issue", (req, res) => {

})

// READ backend.trello.com/boards?organizationId=2

// GET endpoints
app.get("/organization", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = parseInt(req.query.organizationId);

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if (!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return
    }

    res.json({
        organization: {
            ...organization,
            members: organization.members.map(memberId => {
                const user = USERS.find(user => user.id === memberId);
                return {
                    id: user.id,
                    username: user.username
                }
            })
        }
    })
})

app.get("/issues", (req, res) => {

})

app.get("/members", (req, res) => {

})


// UPDATE

app.put("/issues", (req, res) => {

})


// DELETE

app.delete("/members", authMiddleware, (req, res) => {

    const userId = req.userId;
     const organizationId = req.body.organizationId;
     const memberUserUsername = req.body.memberUserUsername;

     const organization = ORGANIZATIONS.find(org => org.id === organizationId);

     if (!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return
     }
     
     const memberUser = USERS.find(u => u.username === memberUserUsername);

     if (!memberUser) {
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return
     }

     organization.members = organization.members.filter(id => id !== memberUser.id);

     // FIX 3: Filtering by ID (Correcting the logic)
   // organization.members = organization.members.filter(id => id !== memberUser.id);

     res.json({
        message: "Member removed successfully."
     })




})

app.listen(3001);