const express = require('express');
const oa = require('./ollama_api.js');
const app = express();
const port = 5001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/*
    API endpoint to POST the description of the function to the LLM
    and retrieve the generated code from the LLM
*/
app.post('/code', async (req, res) => {
  //console.log(req.body);
  //res.json({'llm_code': ''});
  const desc = req.body.desc;

  if (oa.isMalicious(desc)) {
    return res.status(400).json({"error": "Malicious description included, modify your description."});
  }

  const resp = await oa.FetchResponse({'llm_code': ''});

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
  console.log(req.body);
  res.json([]);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = { app };