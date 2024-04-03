const express = require('express')
const app = express()
const port = 3001

const model = require('./backend/server')

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/', (req, res) => {
  model.getCourses()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})


app.get('/test', (req, res) => {
  model.getCourses().then((courses) => {
    res.send(`This is the server endpoint! ` + courses[0][1])
  });
  // res.send(`This is the server endpoint! `+courses)
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});
