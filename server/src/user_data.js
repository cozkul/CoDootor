const fs = require('fs');
const path = require('path');

var users = [];

function getUsers() {
    return users;
}

/*
    Gets the data for the specified user from file
*/
function getUserDataFile(folder, userID) {
    if (!userID) return null;
    const baseUserPath = path.join(__dirname, '..', `/${folder}/`);

    try {
        const user = JSON.parse(fs.readFileSync(baseUserPath + userID + ".json"));
        return user;
    } catch (e) {
        return null;
    }
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
        if (files[i].includes(".json")) {
            const file = fs.readFileSync(baseUserPath + files[i]);
            users.push(JSON.parse(file));
        }
    }

    return users;
}

// Initialize new user data for user with given userID and nickname
function initializeUserDataFile(folder, userID, nickname) {
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
    Overwrites the current user data file with the new one, assuming it already exists.
    Otherwise, it will create a new file for the user.
*/
function updateUserDataFile(folder, user) {
    if (!folder || !user) return null;

    const baseUserPath = path.join(__dirname, '..', `/${folder}/`);
    try {
        fs.writeFileSync(baseUserPath + user.user_id + ".json", JSON.stringify(user));
    } catch (e) {
        return null;
    }

    return "success";
}

/*
    Finds the relevant question based on qid for a user and updates their score with
    the max of the curScore and newScore

    Returns the updated user object
*/
function updateQuestionScore(user, questionData) {
    if (!user || !questionData) return null;

    const qs = Object.keys(user.questions_solved);

    for (var i = 0; i < qs.length; i++) {
        // If the questionID already exists and they scored higher, then increase points and score
        // otherwise, if it exists, do nothing
        if ((qs[i] == questionData.qid)) { 
            if (questionData.score > user.questions_solved[qs[i]]) {
                user.num_points += questionData.score - user.questions_solved[qs[i]];
                user.questions_solved[qs[i]] = questionData.score
            }
            
            return user;
        }
    }

    // If it doesn't exist, then increase their points and question score
    user.questions_solved[questionData.qid] = questionData.score;
    user.num_points += questionData.score;
    return user;
}

/*
    Given the user's ID and the score data for a question (qid, score)
    update the user's score for that question in the database

    Assumes that the given question data (qid, score) are valid
*/
function updatedUserFileWithNewScore(folder, userID, questionData) {
    // If missing userID or questionData, then return null;
    if (!userID || !questionData) return null;

    // Find the user in the data folder
    const user = getUserDataFile(folder, userID);
    if (!user) return null;

    // Update the question score if user exists
    const updatedUser = updateQuestionScore(user, questionData);

    for (var i = 0; i < users.length; i++) {
        if (users[i].user_id == updatedUser.user_id) users[i] = updatedUser;
    }

    const res = updateUserDataFile(folder, updatedUser);

    if (res) return "success"
    else return null;
}

module.exports = {getUserDataFile, loadUserDataOnStart, initializeUserDataFile, updateUserDataFile, updateQuestionScore, updatedUserFileWithNewScore, getUsers};