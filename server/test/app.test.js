// const expect = require('chai').expect;
// const fs = require('fs').expect;

// const getCodeEndpoint = "localhost:3000/code";
// const getGradeEndpoint = "localhost:3000/grade";

// const expectedCode = fs.readFileSync('../generated_code/two_sum.js');

// describe('Testing the POST endpoint for /grade', function () {
//     it('Providing a regular description', async () => {
//         const resp = await fetch(getCodeEndpoint, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: "{\"desc\": \"Takes in two numbers and returns the sum of the two numbers\"}"
//         }).then(resp => {
//             return resp.json();
//         }).then(data => {
//             expect(data).to.equal(expectedCode);
//         })
//     });
// });