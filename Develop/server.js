const express = require('express');
const path = require('path');
const jsonData = require('./db/db.json')
const fs = require('fs');
const uuid = require("./helpers/uuid")
const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => 
res.sendFile(path.join(__dirname, '/db/db.json')));

app.post('/api/notes', (req, res) => {
  // Let the client know that their POST request was received
  res.json(`${req.method} request received`);

  const { title, text } = req.body;

  if (title && text){
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile('./db/db.json', "utf8", (err, data) => {
      if(err) {
        console.error(err);
      } else {
        const parsedNote = JSON.parse(data);

        parsedNote.push(newNote);

        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNote, null, 4),
          (writeErr) =>
           writeErr
            ? console.error(writeErr)
            : console.info("Note added successfully")
        );
      }
    });

    res.json("Process Complete")

  } else {
    res.error('Error in posting note');
  }
});

app.delete("/api/notes/:id", (req, res) => {
   const requestedID = req.params.id;

   for( let i = 0; i < jsonData.length; i++){
    if (requestedID === jsonData[i].id) {

    }
   }
})

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Example apple listening at http://localhost:${PORT}`)
);