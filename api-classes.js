const BASE_URL = 'https://hack-or-snooze.herokuapp.com/';

class User {
  constructor(username, password, name) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.loginToken = "";
    this.favorites = [];
    this.ownStories = [];
  }

  static create(username, password, name, cb) {
    const createUserURL = BASE_URL + 'users';
    $.post(createUserURL, { data: { name, username, password, } }, function (res) {
      let u = new User(res.data.username, password, res.data.name);
      cb(u);
    });
  }

  login(func) {
    const authURL = BASE_URL + 'auth';
    let username = this.username;
    let password = this.password;
    console.log("this method exists!");
    $.post(authURL, { data: { username, password, } }, func);
  }

  //Let's retrieve the users data and update the instance
  retrieveDetails(cb) {
    const userURL = `${BASE_URL}users/${this.username}`;
    const authToken = this.loginToken;
    $.ajax({
      url: userURL,
      type: 'GET',
      success: (res) => {
        this.favorites = res.data.favorites;
        this.ownStories = res.data.stories;
        console.log(this);
        cb(res);
      },
      dataType: 'json',
      headers: { "Authorization": `Bearer ${authToken}`, },
    });
  }
}

//instantiate a new user - test
let lump14;
User.create('lump14', 'lumpy', 'lump14', function (u) {
  lump14 = u;
  console.log(JSON.stringify(lump14));
});

// test of user login - hoisted causes error? BEWARE!!
lump14.login(function (res) {
  console.log('login responded with:', res);
  lump14.loginToken = res.data.token;
});

lump14.retrieveDetails(function (response) {
  console.log(response);
});

class Story {
  constructor(author, title, url, username, storyId) {
    this.author = author;
    this.title = title;
    this.url = url;
    this.username = username;
    this.storyId = storyId;
  }
}

class StoryList {
  constructor(stories) {
    this.stories = stories;
    this.url = BASE_URL + 'stories';
  }

  static getStories(cb) {
    $.get((this.url, { skip: 0, limit: 10 }, cb));
  }
}

// var storyList;
// StoryList.getStories(function (res) {
//   storyList = res;
// });