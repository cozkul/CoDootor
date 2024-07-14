const express = require('express');
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const { auth } = require('express-oauth2-jwt-bearer');
const oa = require('./ollama_api.js');
const app = express();
const port = 5001;
const udata = require('./user_data.js');

require('dotenv').config();

// should be set on .env
const jwtCheck = auth({
  audience: process.env.YOUR_API_IDENTIFIER,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

app.use(express.json());
app.use(cors());
app.use(jwtCheck);

app.get('/', (req, res) => {
  res.send("Hello world.");
})

/*
  Endpoint to view the tests that were generated
*/
app.use('/tests', express.static(path.resolve(__dirname, "..", "mochawesome-report"), options={index: "mochawesome.html"}));

/*
  API endpoint to GET proper questions as user wants
*/
app.get('/question/:id', jwtCheck, (req, res) => {
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
app.post('/code', jwtCheck, async (req, res) => {
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
app.post('/grade', jwtCheck, async (req, res) => {
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

app.post('/saveProgress', jwtCheck, (req, res) => {
  const userId = req.auth.payload.sub;
  const { problemId, score, progress } = req.body;
  const userData = { problemId, score, progress };

  const userFilePath = path.join(__dirname, 'user_data', `${userId}.json`);
  const userDirectory = path.dirname(userFilePath);

  if (!fs.existsSync(userDirectory)) {
    //console.log('why not');
    fs.mkdirSync(userDirectory, { recursive: true });
  }

  fs.writeFile(userFilePath, JSON.stringify(userData, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send({ error: 'Failed to save user data' });
    }
    res.status(200).send({ message: 'User data saved successfully' });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


/*
  API endpoint for retrieving list of questions for homepage
*/
app.get('/question_list', jwtCheck, (req, res) => {
  try {
    const question_list = fs.readFileSync('./question_list.json', 'utf-8');
    const return_questions = JSON.parse(question_list)
    res.json(question_list);
  } catch(e) {
    res.status(400).send({"error": "Failed to retrieve questions"})
  }
})

module.exports = { app };


/*
  API endpoint for retrieving test cases for answering page
*/
app.get('/unit_tests/:id', jwtCheck, (req, res) => {
  const testId = req.params.id;
  const testPath = `../unit_tests/q${testId}_tests.js`;
  try {
    dummy_fn = function() {};
    const descs = require(testPath);
    const result = descs.run_tests(dummy_fn);
    res.send(result);
  } catch (e) {
    res.status(400).send({"error": "Failed to retrieve test cases."});
  } 
});