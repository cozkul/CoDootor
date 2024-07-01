const express = require('express');
const cors = require('cors')
const oa = require('./ollama_api.js');
const app = express();
const port = 5001;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/*
    API endpoint to POST the description of the function to the LLM
    and retrieve the generated code from the LLM
*/
app.post('/code', async (req, res) => {
  const desc = req.body.desc;

  if (desc == null || desc == "") return res.status(400).json({"error": "No description was provided."});

  if (oa.isMalicious(desc)) {
    return res.status(400).json({"error": "Malicious description included, modify your description."});
  }

  const resp = await oa.FetchResponse(desc);

  if (resp) {
    res.json(resp);
  } else {
    return res.status(400).json({"error": "Failed to generate code from Ollama"});
  }
})

/*
    API endpoint to submit generated code for scoring via
    running the unit tests against the code
*/
app.post('/grade', (req, res) => {
  var testResults;
  if (req.body) {
    testResults = oa.TestGeneratedCode(req.body);
  }
  
  if (testResults && testResults.length >= 1) {
    if (testResults[0].err) res.status(400).json(testResults);
    else res.json(testResults);
  } else {
    res.status(400).json({"error": "Failed to grade the provided code."})
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = { app };