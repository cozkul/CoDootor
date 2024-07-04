const express = require('express');
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const oa = require('./ollama_api.js');
const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/*
  Desc for question retrieve endpoint
*/
app.get('/question/:id', (req, res) => {
  const questionId = req.params.id;
  const questionPath = `./questions/q${questionId}.js`;
  try {
    const data = fs.readFileSync(questionPath, "utf8");
    res.json(data);
  } catch (e) {
    res.status(400).send({"error": "Failed to retrieve the question."});
  } 
});

/*
    API endpoint to POST the description of the function to the LLM
    and retrieve the generated code from the LLM

    Make sure to use Content-Type: application/json as a header in your request
*/
app.post('/code', async (req, res) => {
  const desc = req.body.desc;
  
  if (desc == null || desc == "") return res.status(400).json({"error": "No description was provided."});
  
  if (oa.isMalicious(desc)) {
    return res.status(400).json({"error": "Malicious description included, modify your description."});
  }
  
  const resp = await oa.FetchResponse(desc);

  if (resp) {
    return res.status(200).json(resp);
  } else {
    return res.status(400).json({"error": "Failed to generate code from Ollama"});
  }
})

/*
    API endpoint to submit generated code for scoring via
    running the unit tests against the code

    Test manually using:
    curl -d "{\"desc\": \"Takes in two numbers and returns the sum of both of them\", \"id\": 1}" \
    --header "Content-Type: application/json" localhost:5001/grade
*/
app.post('/grade', async (req, res) => {
  const desc = req.body.desc;
  const id = req.body.id;
  
  // If any of the required parameters are missing send a 400 response
  if (desc == null || desc == "") return res.status(400).json({"error": "No description was provided."});
  if (id == null || id == "") return res.status(400).json({"error": "No question ID was provided."});
  
  // If description is malicious, then send 400 response
  if (oa.isMalicious(desc)) {
    return res.status(400).json({"error": "Malicious description included, modify your description."});
  }
  
  // Get the LLM code as an object based on the given description
  var resp = await oa.FetchResponse(desc);

  // If valid response, then append the question ID and submit for grading
  if (resp) resp.id = id;
  else return res.status(400).json({"error": "Failed to generate code from Ollama"});

  var testResults = oa.TestGeneratedCode(resp);
  resp.results = testResults;
  
  if (testResults && testResults.length >= 1) {
    if (testResults[0].err) res.status(400).json(resp);
    else res.json(resp);
  } else {
    resp.error = "Failed to grade the provided code.";
    res.status(400).json(resp);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = { app };