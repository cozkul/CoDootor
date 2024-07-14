const expect = require('chai').expect;
const udata = require('../src/user_data.js');
const fs = require('fs');
const path = require('path');

const user0 = {"user_id": "1234567890", "nickname": "mikey"};
const user1 = {"user_id": "2345678901", "nickname": "davey"};

const clearFolder = () => {
    const fp = path.join(__dirname, "..", "/testDataFolder")
    try {
        fs.rmSync(fp, {recursive: true});
        fs.mkdirSync(fp);
        udata.loadUserDataOnStart("testDataFolder");
    } catch (e) {
    }
}

describe("Tests for user_data functions", function () {
    beforeEach(function () {
        clearFolder();
    })

    describe("Testing the loadUserDataOnStart function", function () {
        it('Testing an empty folder', function () {
            const users = udata.loadUserDataOnStart("testDataFolder");
            expect(users.length).to.equal(0);
        });

        it('Testing a non-empty folder', function () {
            udata.initializeUserData("testDataFolder", user0.user_id, user0.nickname);
            udata.initializeUserData("testDataFolder", user1.user_id, user1.nickname);
            const users = udata.loadUserDataOnStart("testDataFolder");
            expect(users.length).to.equal(2);
        });

        it('Testing a non-existent folder', function () {
            const users = udata.loadUserDataOnStart("nonExistentFolder");
            expect(users).to.equal(null);
        });

        it('Testing null or missing folder param', function () {
            const users = udata.loadUserDataOnStart();
            expect(users).to.equal(null);

            const users2 = udata.loadUserDataOnStart(null);
            expect(users2).to.equal(null);
        });
    })

    describe("Testing the initializeUserData function", function () {
        it('Initializing an existing user', function () {
            let res = udata.initializeUserData("testDataFolder", user0.user_id, user0.nickname);
            console.log(res);
            expect(udata.getUsers().length).to.equal(1);
            expect(res).to.equal("success");

            res = udata.initializeUserData("testDataFolder", user0.user_id, user0.nickname);
            expect(udata.getUsers().length).to.equal(1);
            expect(res).to.equal(null);
        });

        it('Initializing multiple users', function () {
            let res = udata.initializeUserData("testDataFolder", user0.user_id, user0.nickname);
            expect(udata.getUsers().length).to.equal(1);
            expect(res).to.equal("success");

            res = udata.initializeUserData("testDataFolder", user1.user_id, user1.nickname);
            expect(udata.getUsers().length).to.equal(2);
            expect(res).to.equal("success");
        });

        it('Initializing with null and invalid folder', function () {
            let res = udata.initializeUserData(null, user0.user_id, user0.nickname);
            expect(res).to.equal(null);
            expect(udata.getUsers().length).to.equal(0);

            res = udata.initializeUserData("nonExistentFolder", user0.user_id, user0.nickname);
            expect(res).to.equal(null);
            expect(udata.getUsers().length).to.equal(0);
        });

        it('Initializing with null/missing userid/nickname', function () {
            let res = udata.initializeUserData("testDataFolder", null, null);
            expect(res).to.equal(null);
            expect(udata.getUsers().length).to.equal(0);

            res = udata.initializeUserData("nonExistentFolder");
            expect(res).to.equal(null);
            expect(udata.getUsers().length).to.equal(0);
        });

        it('Initializing with all null/missing params', function () {
            let res = udata.initializeUserData(null, null, null);
            expect(res).to.equal(null);
            expect(udata.getUsers().length).to.equal(0);

            res = udata.initializeUserData();
            expect(res).to.equal(null);
            expect(udata.getUsers().length).to.equal(0);
        });
    })
});