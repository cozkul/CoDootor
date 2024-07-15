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
// const jwtCheck = auth({
//   audience: process.env.YOUR_API_IDENTIFIER,
//   issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//   tokenSigningAlg: 'RS256'
// });

app.use(express.json());
app.use(cors());
// app.use(jwtCheck);

app.get('/', (req, res) => {
  res.send("Hello world.");
})

/*
  API endpoints for user data
*/
app.get('/user/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  if (!user_id || user_id == "" || isNaN(user_id)) return res.status(400).send({"error": "Invalid user id was provided"})

  const user = udata.getUserDataFile("data", user_id);
  if (!user) return res.status(400).send({"error": "User with the specified user ID was not found."});
  else return res.status(200).json(user);
})

app.post('/user', (req, res) => {
  const user_id = req.body.user_id;
  const nickname = req.body.nickname;

  if (!user_id || user_id == "") return res.status(400).send({"error": "Invalid user id was provided"})
  if (!nickname || nickname == "") return res.status(400).send({"error": "Invalid nickname was provided"})
  
  const result = udata.initializeUserDataFile("data", user_id, nickname);
  const user = udata.getUserDataFile("data", user_id);
  if (result == "success") return res.status(200).json(user);
  else return res.status(400).send("There was an error initializing the user in the database.");
})

app.get('/users', (req, res) => {
  // you can call udata.getUsers() function to retrieve all the users in the database
  // if you want to be sure you get all the users, you can also call udata.loadUserDataOnStart("data"); before
  // you call udata.getUsers() which returns a list of all the current users in the database
  res.status(500).send("Endpoint not implemented yet.");
})

/*
  API endpoint to GET proper questions as user wants
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
  const user_id = req.body.user_id;
  
  // If any of the required parameters are missing send a 400 response
  if (desc == null || desc == "") return res.status(400).json({"error": "No description was provided."});
  if (id == null || id == "") return res.status(400).json({"error": "No question ID was provided."});
  if (user_id == null || user_id == "") return res.status(400).json({"error": "No user ID was provided."});
  
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
  resp.score = oa.getTotalScore(testResults);

  const questionData = {
    "qid": id.toString(),
    "score": resp.score
  }

  // Update the user's score for this question
  // We don't use a separate endpoint because it is more secure to only update
  // when the user has their question graded
  udata.updatedUserFileWithNewScore("data", user_id, questionData);
  
  if (testResults && testResults.length >= 1) {
    if (testResults[0].err) res.status(400).json(resp);
    else res.status(200).json(resp);
  } else {
    resp.error = "Failed to grade the provided code.";
    res.status(400).json(resp);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  udata.loadUserDataOnStart("data");
})


/*
  API endpoint for retrieving list of questions for homepage
*/
app.get('/question_list', (req, res) => {
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
app.get('/unit_tests/:id', (req, res) => {
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

/*
  Endpoint to view the tests that were generated
*/
app.use('/tests', express.static(path.resolve(__dirname, "..", "mochawesome-report"), options={index: "mochawesome.html"}));