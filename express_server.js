const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
}
//HELPER FUNCTIONS
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
};

const findUser = function (email, users) {
  for (let userID in users) {
    const user = users[userID];
    if(email === user.email) {
      return user
    }
  }
  return false;
}

app.get("/", (req, res) => {
  res.send("Hello!");
  // res.redirect(`/urls/`)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  // const templateVars = { urls: urlDatabase,
  //   username: req.cookies["username"]};
  const templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"] }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // const templateVars = { urls: urlDatabase,
  //   username: req.cookies["username"]};
  const templateVars = { urls: urlDatabase, user_id: req.cookies["user.id"]}
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  // urlDatabase[shortURL] = {longURL: req.body.longURL};
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = urlDatabase[req.params.shortURL].longURL;
  // if (urlDatabase[req.params.shortURL] === undefined) {
  //   res.send("Short URL not found");
  //   res.status(400);
  // } else {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
  // }
});

app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(400);
    res.send("Page not found");
  } else {
    // const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    //   username: req.cookies["username"] };
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_id: req.cookies.users_id }
    res.render("urls_show", templateVars);
  }
});

app.get('/login', (req, res) => {
  const templateVars = { user_id: null };
  res.render('login', templateVars);
})

// app.post('/login', (req, res) => {
//   const username = req.body.username;
//   res.cookie('username', username);
//   res.redirect(`/urls`);
// });

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.passowrd;
  const userFound = findUser(email, users);

  if (!userFound && (password, userFound.password)) {
    return res.status(403).send('Wrong email or password');
  } 
  // res.cookie.user_id = userFound.id;
  res.cookie('user_id', userFound.id)
  res.redirect('/urls');
})

app.post('/logout', (req, res) => {
  // const username = req.body.username;
  // res.clearCookie('username', username);
  // res.redirect(`/urls`);
  // res.cookie.user_id = null;
  res.clearCookie('user_id')
  res.redirect(`/urls`);
});

app.get('/register', (req, res) => {
  // const templateVars = {username: res.cookie.username};
  //double check the cookie
  const templateVars = { user_id: req.cookies.user_id}
  console.log("templateVars:", templateVars);
  res.render("register", templateVars);
});

app.post('/register', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  if (!email || !password) {
    res.status(400).send('Error 400 - Invalid email or password.');
  } else if (findUser(email, users)){
    res.status(400).send('Error 400 - Email already registered');
  } else {
    let id = generateRandomString();
    users[id] = { id, email, password };
    // res.cookie.user_id = id;
    res.cookie('user_id', id);
    res.redirect('/urls');
  }
});


app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

//update URL's
app.post('/urls/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    urlDatabase[req.params.shortURL] = req.body.longURL;
  }
  res.redirect(`/urls`);
});

