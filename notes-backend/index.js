const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3001;
// const PORT = 3000;

app.use(express.static('dist'));
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());


let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;
  return String(maxId + 1);
}

// app.get("/", (req, res) => {
//   res.redirect("/api/notes")
// });

app.get("/api/notes", (req, res) => {
  res.json(notes)
})

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find(n => n.id === id);
  
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
})

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter(n => n.id !== id);
  res.status(204).end();
})

app.post("/api/notes", (req, res) => {
  const nextId = generateId();

  if (!req.body.content) {
    return res.status(400).json({ "error": "content missing" });
  }

  const note = {
    id: nextId,
    content: req.body.content,
    important: Boolean(req.body.important) || false,
  }

  notes = notes.concat(note);
  response.json(note);
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});