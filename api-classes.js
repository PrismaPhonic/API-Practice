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
        // !! Q: SHOULD WE MOVE THESE TO THE CALLBACK? !!
        this.favorites = res.data.favorites;
        this.ownStories = res.data.stories;
        console.log(this);
        cb(res);
      },
      dataType: 'json',
      headers: { "Authorization": `Bearer ${authToken}`, },
    });
  }

  /* 
   *  Build out addFavorite here
   *  Inputs: Story ID and callback function
   *          - NOTE: NEEDS AUTH TOKEN
   *  Results: data.favorites -> this is an array of story objects
   *  
   *  Should invoke .retrieveDetails and update users .favorites
   * 
  */
  addFavorite(storyId, cb) {
    const addFavoriteURL = `${BASE_URL}/users/${this.username}/favorites/${storyId}`;
    // SHOULD WE BE SETTING authToken LIKE THIS
    // to avoid using this.loginToken inside of the ajax call?
    const authToken = this.loginToken;
    $.ajax({
      url: addFavoriteURL,
      method: 'POST',
      headers: { "Authorization": `Bearer ${this.loginToken}`, },
      success: (res) => {
        console.log("Request successful.");
        cb(res);
      }
    })
  }

}

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

  // Get a list of the 10 most recent stories and store them in an instance
  // of Storylist
  static getStories(cb) {
    const storyURL = `${BASE_URL}stories/`;
    $.get(storyURL, { skip: 0, limit: 10 }, (res) => {
      let s = new StoryList(res.data);
      cb(s);
    });
  }

  // Add a story.  Takes a user object (instance of class User), an object
  // of data about the story and a callback function
  addStory(user, dataObj, cb) {
    const storyURL = this.url;
    $.ajax({
      url: storyURL,
      type: 'POST',
      data: { data: dataObj },
      success: (res) => {
        cb(res);
      },
      dataType: 'json',
      headers: { "Authorization": `Bearer ${user.loginToken}`, },
    });
  }

  // Takes user object, story id and callback - issues a delete request
  // NOTE: CAN ONLY DELETE STORIES USER HAS MADE THEMSELVES
  removeStory(user, id, cb) {
    const storyURLFromId = `${this.url}${id}/`;
    $.ajax({
      url: storyURLFromId,
      type: 'DELETE',
      success: (res) => {
        cb(res);
      },
      headers: { "Authorization": `Bearer ${user.loginToken}`, },
    });
  }

}


let lump34;
User.create('lump34', 'lumpy', 'lump34', function (u) {
  lump34 = u;
  console.log(JSON.stringify(lump34));

  // take these out later
  lump34.login(function (res) {
    console.log('login responded with:', res);
    lump34.loginToken = res.data.token;
  });
});

// using the `user` and `storyList` variables from above:

/*
//TESTS BELOW, COPY PASTE BECAUSE ASYNCHRONOUS

//instantiate a new user - test


/*
// test of user login
lump34.login(function (res) {
  console.log('login responded with:', res);
  lump34.loginToken = res.data.token;
});

lump34.retrieveDetails(function (response) {
  console.log(response);
});
*/

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
  username: "lump34"
};



ourStories.addStory(lump34, newStoryData, function (response) {
  // should be array of all stories including new story
  console.log(response);
  // should be array of all stories written by user
  console.log(lump34.stories);
})

var firstStory = storyList.stories[0];

storyList.removeStory(user,
  firstStory.storyId,
  function (response) {
    console.log(response) // this will contain an empty list of stories
  });

var firstStory = storyList.stories[0];
lump34.addFavorite(firstStory.storyId, function (response) {
  console.log(response) // this should include the added favorite!
});

*/

