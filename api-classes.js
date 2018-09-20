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

  //This will be used to create the user serverside, and then use the data
  //sent back from the server to create an instance of that user
  static create(username, password, name, cb) {
    const createUserURL = BASE_URL + 'users';
    $.post(createUserURL, { data: { name, username, password, } }, function (res) {
      let u = new User(res.data.username, password, res.data.name);
      cb(u);
    });
  }

  //will log the user in, and passes the user document from the server to a 
  //callback function
  login(func) {
    const authURL = BASE_URL + 'auth';
    let username = this.username;
    let password = this.password;
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
let lump29;
User.create('lump29', 'lumpy', 'lump29', function (u) {
  lump29 = u;
  console.log(JSON.stringify(lump29));

  // take these out later
  lump29.login(function (res) {
    console.log('login responded with:', res);
    lump29.loginToken = res.data.token;
  });
});

/*
// test of user login
lump29.login(function (res) {
  console.log('login responded with:', res);
  lump29.loginToken = res.data.token;
});

lump29.retrieveDetails(function (response) {
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
    this.url = `${BASE_URL}stories/`;
  }

  static getStories(cb) {
    const storyURL = `${BASE_URL}stories/`;
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

  removeStory(user, id, cb) {
    const storyURLFromId = `${this.url}${id}/`;
    $.ajax({
      url: storyURLFromId,
      type: 'DELETE',
      success: function (res) {
        cb(res);
      },
      headers: { "Authorization": `Bearer ${user.loginToken}`, },
    });
  }

}



// using the `user` and `storyList` variables from above:

/*
var storyList;
StoryList.getStories(function (res) {
  storyList = res;
});

let ourStories;
StoryList.getStories(function (s) {
  ourStories = s;
  console.log('yay! we got some stories');
  console.log(ourStories);
})

var newStoryData = {
  title: "How Waterslides Killed my Family",
  author: "Smokey The Bear",
  url: "https://www.WaterSlidesAreEvil.com",
  username: "lump29"
};



ourStories.addStory(lump29, newStoryData, function (response) {
  // should be array of all stories including new story
  console.log(response);
  // should be array of all stories written by user
  console.log(lump29.stories);
})

var firstStory = storyList.stories[0];

storyList.removeStory(user,
                      firstStory.storyId,
                      function (response) {
  console.log(response) // this will contain an empty list of stories
});

*/

