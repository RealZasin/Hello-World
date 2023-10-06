//imports
const path = require("path");
const express = require("express");
const router = express.Router();
const app = express();
const cors = require("cors");


const {logger} = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");



const whitelist = ["http://localhost:3500", "http://localhost:127.0.0.1:5500"]
const corsOptions = {
    origin: (origin, callback) => 
    {
        if (whitelist.indexOf(origin) !== -1)
        {
            callback(null, true)
        } 
        else 
        {
            callback(new Error("You are not pure enough to access this site!"))
        }
    }, optionsSuccessStatus: 200
}

app.use(logger);
app.use(cors(corsOptions));


const PORT = process.env.PORT || 3500;

app.use(("/subdir"), require("./routes/subdir"));
app.use(("/"), require("./routes/root"))
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(("/employees"), require("./routes/api/employees"))

app.use(errorHandler)



app.get("*", (req, res) => 
    {
        res.status(404)
        if(req.accepts("html"))
        {
            sendFile(path.join(__dirname, "view", "404.html"))
        }
        else if(req.accepts("json"))
        {
            res.json({error: "404 json not found"})
        }
        else (req.accepts("text"))
        {
            res.type("txt").send("404 text not found")
        }

        sendFile(path.join(__dirname, "view", "404.html"))
    })



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
