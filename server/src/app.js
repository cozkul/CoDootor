const express = require('express');
const oa = require('./ollama_api.js');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/*
    API endpoint to POST the description of the function to the LLM
    and retrieve the generated code from the LLM
*/
app.post('/code', (req, res) => {
  console.log(req.body);
  res.json({'llm_code': ''});
})

/*
    API endpoint to submit generated code for scoring via
    running the unit tests against the code
*/
app.post('/grade', (req, res) => {
  console.log(req.body);
  res.json([]);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = { app };