// simple file for testing commands

var storyList;
StoryList.getStories(function(response) {
  storyList = response;
});

var user;
User.create(
  `testing${Math.floor(Math.random() * 10000)}`,
  `testing${Math.floor(Math.random() * 10000)}`,
  `testing${Math.floor(Math.random() * 10000)}`,
  function(newUser) {
    user = newUser; // this should be an object that contains the newly created user
    console.log(user);
  }
);

user.login(function(data) {
  console.log(data); // this should be an object that contains the user information along with the loginToken
});

var newStoryData = {
  title: "testing again",
  author: "A Rithm Instructor",
  url: "https://www.rithmschool.com"
};
storyList.addStory(user, newStoryData, function(response) {
  console.log(response); // this should be an array of all the stories including the new story
  console.log(user.stories); // this should be an array of the all the stories written by the user
});

var firstStory = storyList.stories[0];
storyList.removeStory(user, firstStory.storyId, function(response) {
  console.log(response); // this should contain an empty list of stories
});

var updatedData = {
  title: "NO MORE TESTING!",
  author: "A Rithm Instructor",
  url: "https://www.taco.com"
};

storyList.stories[0].update(user, updatedData, function(response) {
  console.log(response); // this should be the updated story instance!
});

user.retrieveDetails(function(response) {
  console.log(response); // this should be the user
});

var newStoryData = {
  title: "testing again",
  author: "A Rithm Instructor",
  url: "https://www.rithmschool.com"
};
storyList.addStory(user, newStoryData, function(response) {
  var firstStory = storyList.stories[0];
  var updatedData = {
    title: "NO MORE TESTING!",
    author: "A Rithm Instructor",
    url: "https://www.taco.com"
  };
  user.addFavorite(firstStory.storyId, function(response) {
    console.log(response); // this should include the added favorite!
  });
});

var firstStory = storyList.stories[0];
user.removeFavorite(firstStory.storyId, function(response) {
  console.log(response); // this should include the removed favorite!
});

var updatedData = { name: "Bobloblob" };
user.update(updatedData, function(response) {
  console.log(response); // this should be the updated user instance!
});

user.remove(function(response) {
  console.log(response); // this should be the updated story instance!
});
