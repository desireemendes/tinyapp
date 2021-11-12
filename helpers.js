// Checks to see if user exists in database
const findUser = function(email, users) {
  for (let userID in users) {
    const user = users[userID];
    if(email === user.email) {
      return user;
    }
  }
  return false;
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "user3RandomID": {
    id: "des",
    email: "des@example.com",
    password: "password"
  }
};

// Generates a random 6 character string
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
};


const urlsForUser = function(id) {
  let result = {};
  for (const [key, value] of Object.entries(urlDatabase)) {
    if (id === value.userID) {
      result[key] = value.longURL;
    }
  }
  return result;
};

module.exports = { findUser, urlDatabase, users, urlsForUser, generateRandomString };