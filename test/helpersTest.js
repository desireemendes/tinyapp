const { assert } = require('chai');

const { findUser } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findUser', function() {
  it('should return a user with valid email', function() {
    const user = findUser("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
  });
  it('should return false if email does not exist', function () {
    const user = findUser("emaildoesnotexist@gmail.com", testUsers);
    const expectedOutput = false;
  })
});