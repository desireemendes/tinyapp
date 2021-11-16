const express = require("express");

const cookieSession = require("cookie-session");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcryptjs');
const { findUser, urlDatabase, users, urlsForUser, generateRandomString } = require('./helpers');

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['you-cant-guess', 'my-top-secret-keys-321']
}));

app.set("view engine", "ejs");

// If logged in, redirect to urls, otherwise redirect to login
app.get('/', (req, res) => {
  const loggedIn = req.session.user_id;
  loggedIn ? res.redirect('/urls') : res.redirect('/login');
});

app.get('/urls', (req, res) => {
  if (!req.session.user_id || !users[req.session.user_id]) {
    return res.status(400).send("Page not found. Please <a href='/login'> login to view this page</a>");
    // res.status(400).send('You must login to view this page')
    // res.redirect('/login')
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

//Registration functionality
app.get('/register', (req, res) => {
  const templateVars = {user_id: req.session.user_id};
  res.render("register", templateVars);
});

//Registration functionality and errors
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

//Login functionality
app.get('/login', (req, res) => {
  const templateVars = { user_id: null };
  res.render('login', templateVars);
});
  

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userFound = findUser(email, users);
  if (!userFound || (userFound && !bcrypt.compareSync(password, userFound.password))) {
    return res.status(403).send('Wrong email or password');
  }
  req.session.user_id = userFound.id;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/urls');
});

//****** */
app.get('/urls/new', (req, res) => {
  const templateVars = {user_id: req.session.user_id};
  if (!templateVars.user_id) {
    res.redirect('/login');
  } else {
    res.render('urls_new', templateVars);
  }
});

// Only logged in users can modify URLS
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

// Deletes URL
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

// Updates URL
app.post('/urls/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  }
  res.redirect(`/urls`);
});

app.get('/u/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
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