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
let lump27;
User.create('lump27', 'lumpy', 'lump27', function (u) {
  lump27 = u;
  console.log(JSON.stringify(lump27));

  // take these later
  lump27.login(function (res) {
    console.log('login responded with:', res);
    lump27.loginToken = res.data.token;
  });
});

/*
// test of user login - hoisted causes error? BEWARE!!
lump27.login(function (res) {
  console.log('login responded with:', res);
  lump27.loginToken = res.data.token;
});

lump27.retrieveDetails(function (response) {
  console.log(response);
});
*/

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
    this.url = `${BASE_URL}stories`;
  }

  static getStories(cb) {
    const storyURL = `${BASE_URL}stories`;
    $.get(storyURL, { skip: 0, limit: 10 }, function (res) {
      let s = new StoryList(res.data);
      cb(s);
    });
  }

  addStory(user, dataObj, cb) {
    const storyURL = this.url;
    $.ajax({
      url: storyURL,
      type: 'POST',
      data: { data: dataObj },
      success: function (res) {
        cb(res);
      },
      dataType: 'json',
      headers: { "Authorization": `Bearer ${user.loginToken}`, },
    });
  }
}

// var storyList;
// StoryList.getStories(function (res) {
//   storyList = res;
// });

// using the `user` and `storyList` variables from above:

/*
let ourStories;
StoryList.getStories(function (s) {
  ourStories = s;
  console.log('yay! we got some stories');
  console.log(ourStories);
})

var newStoryData = {
  title: "The Most Amazing Story",
  author: "God",
  url: "https://www.LifeIsMeaningless.com",
  username: "lump27"
};



ourStories.addStory(lump27, newStoryData, function (response) {
  // should be array of all stories including new story
  console.log(response);
  // should be array of all stories written by user
  console.log(lump27.stories);
})

*/

