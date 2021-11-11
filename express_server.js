const express = require("express");

const cookieSession = require("cookie-session");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcryptjs');
const { findUser } = require('./helpers');

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['you-cant-guess', 'my-top-secret-keys-321']
}));

app.set("view engine", "ejs");

//HELPER FUNCTIONS

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


app.get('/urls', (req, res) => {
  if (!req.session.user_id || !users[req.session.user_id]) {
    res.redirect('/login');
    return;
  }
  const user = req.session.user_id;
  const templateVars = {urls: urlsForUser(user), 
    user: users[user], 
    user_id: users[user].id};
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  const userID = req.session.user_id;
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: userID};
  res.redirect(`/urls/${shortURL}`);
});


app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/register', (req, res) => {
  const templateVars = {user_id: req.session.user_id};
  res.render("register", templateVars);
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);

  if (!email || !password) {
    res.status(400).send('Error 400 - Invalid email or password');
  } else if (findUser(email, users)) {
    res.status(400).send('Error 400 - Email already registered');
  } else {
    let id = generateRandomString();
    users[id] = { id, email, password };
    req.session.user_id = id;
    res.redirect('/urls');
  }
});

app.get('/login', (req, res) => {
  const templateVars = { user_id: null };
  res.render('login', templateVars);
});
  
  
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userFound = findUser(email, users);
  
  if (!userFound && !bcrypt.compareSync(password, userFound.password)) {
    return res.status(403).send('Wrong email or password');
  }
  req.session.user_id = userFound.id;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/urls');
});

app.get('/urls/new', (req, res) => {
  const templateVars = {user_id: req.session.user_id};
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(400);
    res.send("Not Found");
  }
  const templateVars = { shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL, 
    user_id: req.session.user_id};
  res.render("urls_show", templateVars);
});

//deletes URL
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

//updates URL
app.post('/urls/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  }
  res.redirect(`/urls`);
});

app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.send("Short URL not found");
    res.status(400);
  } else {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});