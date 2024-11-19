import noteService from "./services/notes"
import { useState, useEffect } from 'react'
import Note from "./components/Note"

const Notification = ({ message }) => {
  if (!message) return null

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("a new note ...")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
  }, [])

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const addNote = (e) => {
    e.preventDefault()
    
    const noteObj = {
      content: newNote,
      important: Math.random() > 0.5,
      id: String(notes.length + 1)
    }

    noteService
      .create(noteObj)
      .then(addedNote => {
        setNotes(notes.concat(addedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (e) => {
    setNewNote(e.target.value)
  }

  const toggleImportance = (id) => {
    const note = notes.find(note => note.id === id)
    const changedNote = { ...note, important: !note.important}

    noteService
         .update(id, changedNote)
         .then(updatedNote => {
          let updatedNotes = notes.map(note => {
            if (note.id === id) return updatedNote
            else return note
          })

          setNotes(updatedNotes)
         })
         .catch(() => {
            setErrorMessage(`Note '${note.content}' was already removed from server`)
            setTimeout(() => setErrorMessage(null), 5000)
            setNotes(notes.filter(n => n.id !== id))
        })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} 
                toggleImportance={() => toggleImportance(note.id)}/>
        )}
      </ul>
      <form onSubmit={addNote}>
          <input value={newNote}
                 onChange={handleNoteChange}/>
          <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App