const express = require('express')
const app = express()
const port = parseInt(process.argv[2]) || 3000;

app.get('/', async (req, res) => {
  const hrstart = process.hrtime();
  console.log('Processing incoming request!');

  let { name, timeout } = req.query;
  name = name || "John Doe";

  if (timeout) {
    console.log(`- Need to wait ${timeout}ms`);
    await delay(timeout);
  }

  console.log(`- DONE`);

  const hrend = process.hrtime(hrstart);

  return res.send(`Welcome back, <strong>${name}</strong><br /><br />-- Page timeout: ${timeout}ms<br />-- Page loaded in: ${hrend[0]}s ${hrend[1] / 1000000}ms`);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const delay = async (timeout = 1000) => {
  return new Promise((resolve, reject) => setTimeout(resolve, timeout));
}