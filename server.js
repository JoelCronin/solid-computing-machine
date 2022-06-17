const express = require('express');
const path = require('path');
const jsonData = require('./db/db.json')
const fs = require('fs');
const uuid = require("./helpers/uuid")
const app = express();
const PORT = process.env.PORT || 3001

//Middleware used
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Takes user to the notes.html 
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//Will show user the notes in json format
app.get('/api/notes', (req, res) => 
res.sendFile(path.join(__dirname, '/db/db.json')));


//Allows users to post notes into the db.json file
app.post('/api/notes', (req, res) => {
  // Let the client know that their POST request was received
  res.json(`${req.method} request received`);

// deconstructs the req.body
  const { title, text } = req.body;

  //checks that note has both a title and text associated with it
  if (title && text){
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // First reads file to gether the data already stored in db.json
    fs.readFile('./db/db.json', "utf8", (err, data) => {
      if(err) {
        console.error(err);
      } else {
        const parsedNote = JSON.parse(data);
  
        // Then writes new note into the db.json file alongside existing data
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

  } else {
    res.error('Error in posting note');
  }
});

//Allows user to delete note by clicking on bin icon using the unique id paramter to get a handel on it
app.delete("/api/notes/:id", (req, res) => {

   const requestedID = req.params.id;

   fs.readFile("./db/db.json", "utf8", (err, data) =>{
    if (err){
      console.error(err)
    } else {
      const parseDelete = JSON.parse(data);
      //Iterates through the data to check which note has same id as the clicked on note
      for( let i = 0; i < parseDelete.length; i++){
        //When it finds the match it then deletes this entry using the arr.splice() method
        if (requestedID === parseDelete[i].id) {
         parseDelete.splice(i, 1)
        
          //Writes new data minus deleted entry back into db.json
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parseDelete, null, 4),
            (writeErr) =>
             writeErr
              ? console.error(writeErr)
              : console.info("Deleted")
          );
        } else {
          console.log('Cant delete')
        }
    
       }}
   })
   res.end()

   
})

//Wildcard entry that sends all requests to non-recognsied URI's to index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Listener for port 3001
app.listen(PORT, () =>
  console.log(`Example apple listening at http://localhost:${PORT}`)
);