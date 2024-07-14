const fs = require('fs');
const path = require('path');

var users = [];

function getUsers() {
    return users;
}

// Reads all the user data files stored in folder and stores it in users
function loadUserDataOnStart(folder) {
    users = []
    const baseUserPath = path.join(__dirname, '..', `/${folder}/`);
    var files;

    try {
        files = fs.readdirSync(baseUserPath);
    } catch (e) {
        return null;
    }

    for (var i = 0; i < files.length; i++) {
        const file = fs.readFileSync(baseUserPath + files[i]);
        users.push(JSON.parse(file));
    }

    return users;
}

// Initialize new user data for user with given userID and nickname
function initializeUserData(folder, userID, nickname) {
    const baseUserPath = path.join(__dirname, '..', `/${folder}/`);
    var files;

    try {
        files = fs.readdirSync(baseUserPath);
    } catch (e) {
        return null;
    }

    if (!userID || !nickname) return null;

    // If user already exists in database, then return null
    if (files.includes(userID + ".json")) return null;

    // Otherwise, create a new file with default values except for userID and nickname
    const defaultUserInfo = {
        "user_id": `${userID}`,
        "nickname": `${nickname}`,
        "questions_solved": {},
        "num_points": 0
    }

    users.push(defaultUserInfo);
    const data = JSON.stringify(defaultUserInfo);
    fs.writeFileSync(baseUserPath + userID + ".json", data);

    return "success";
}

/*
    Given the user's ID and the score data for a question (questionID, score)
    update the user's score for that question in the database
*/
function updateQuestionDataForUser(userID, questionData) {

}

module.exports = {loadUserDataOnStart, initializeUserData, updateQuestionDataForUser, getUsers};