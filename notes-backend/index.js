const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require('dotenv').config();
const Note = require('./models/notes');
// const mongoose = require('mongoose')


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('dist'));
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

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


// ROUTES
app.get("/api/notes", (req, res) => {
  Note.find({})
      .then(notes => res.json(notes));
})

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
      .then(note => {
        if (note) {
          res.json(note)
        } else {
          res.status(404).end()
        }
      })
      .catch(error => next(error))
})

app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdandDelete(req.params.id)
      .then(() => res.status(204).end())
      .catch(error => next(error));
})

app.post("/api/notes", (req, res) => {
  const body = req.body;
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = Note({
    content: body.content,
    important: body.important || false,
  });

  note.save()
      .then(savedNote => res.json(savedNote));
})

app.put("/api/notes/:id", (req, res, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
      .then()
      .catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});