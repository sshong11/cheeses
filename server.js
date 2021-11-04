require("dotenv").config()
const {PORT = 4000, MONGODB_URL} = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors") // cors headers
const morgan = require("morgan") // logging

mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disonnected to Mongo"))
.on("error", (error) => console.log(error))

/////////////////////////////////////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheese = mongoose.model("Cheese", CheeseSchema)
/////////////////////////////////////////////////////////

app.use(cors()) // prevent cors errors
app.use(morgan("dev")) // logging
app.use(express.json()) // parse json bodies

/////////////////////////////////////////////////////////
// ROUTES //

// home
app.get("/", (req, res) => {
    res.send("Cheeses")
})

// index
app.get("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.find({}))
    } catch (error) {
        res.status(400).json({error})
    }
})

// create
app.post("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.create(req.body))
    } catch (error) {
        res.status(400).json({error})
    }
})

// update
app.put("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json({error})
    }
})

// destroy
app.delete("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json({error})
    }
})

/////////////////////////////////////////////////////////
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})