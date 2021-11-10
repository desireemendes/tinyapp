const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");


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

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {


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

    res.render("urls_show", templateVars);
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

