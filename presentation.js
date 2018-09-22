$(document).ready(function () {
  let userInstance; // User instance
  var storyList; // StoryList instance

  // if user object is in local storage,
  // then change to logged in display state
  if (localStorage.getItem('currentUser')) {
    let userData = JSON.parse(localStorage.getItem('currentUser'));
    // User already logged in, so let's build a proper user instance
    userInstance = new User(userData.username, userData.password, userData.name);
    userInstance.loginToken = userData.loginToken;
    userInstance.retrieveDetails((res) => {
      setDisplayToLoggedIn();
    });
  }

  /* 
   * UTILITY & DISPLAY FUNCTION DECLARATIONS
  */

  function setDisplayToLoggedIn() {
    // hide login and sign-up navbar buttons 
    $('#show-login').hide();
    $('#show-signup').hide();

    // show logout button...  but show() defaults to inline display
    // set display to inline-block
    $('#logout').show().css('display', 'inline-block');

    // Populate username next to "logout" - when clicked will show profile section
    // modify dom first so username div has username for inner text
    $('#show-profile').text(userInstance.username);
    $('#show-profile').show().css('display', 'inline-block')

    // Populate profile fields
    $('#profile-name').text(userInstance.name);
    $('#profile-username').text(userInstance.username);

    //show submit and favorites button after login
    $('#show-favorites').show().css('display', 'inline-block');
    $('#show-submit').show().css('display', 'inline-block');

    // enable favorite stars
    enableStars();

    // toggle all favorited stories' stars according to local favorites list
    toggleFavoritedStars(userInstance.favorites);

    // TODO: ADD USERNAME TO LEFT OF 'LOGOUT'
    // WHEN CLICKED, GOES TO PROFILE PAGE

  }

  function toggleProfile() {
    $('#news').toggle();
    $('#profile').toggle();
  }

  function setDisplayToLoggedOut() {
    $('#show-login').show();
    $('#show-signup').show();
    $('#show-favorites').hide();
    $('#show-submit').hide();
    $('#logout').hide();
    $('#show-profile').hide();
  }

  // appendStory takes story object and selector of where to append 
  // stories to
  function appendStory(story, sel) {
    let title = story.title;
    let url = new URL(story.url);
    let urlSmall = url.hostname.replace('www.', '');
    let storyId = story.storyId;
    $(sel).append(`
      <li class="my-1" id="${storyId}">
        <i class="far fa-star"></i>
        ${title}
        <a href="#"><small>(${urlSmall})</small></a>
      </li>
    `);
  }

  function submitStory() {
    // get title, and url from submit form
    let title = $(".form-control").eq(0).val();
    let url = new URL($(".form-control").eq(1).val());
    let hostname = url.hostname;

    let storyData = {
      title,
      url: url.href,
      author: userInstance.name,
      username: userInstance.username,
    }

    // send create request to server
    storyList.addStory(userInstance, storyData, function (res) {
      clearForms();
      $("#submit-form").slideUp(650);
      // Refresh the news feed
      displayStories();
    });
    //Form entry is first injected into ordered list


    // submit story to server

    // in callback from server, issue refresh of news feed
  }

  // clears list items from news feed section
  function clearNewsFeed() {
    $('#news ol').empty();
  }

  // TODO: WRITE A FUNC THAT ADDS A FAVORITE TO SERVER
  // ADD TO FAVORITE LIST WHEN A STAR IS CLICKED
  function addFavorite() {

  }

  function displayStories() {
    StoryList.getStories(function (response) {
      storyList = response;
      clearNewsFeed();
      for (let story of storyList.stories) {
        appendStory(story, '#news ol');
      }
    });
  }

  // Toggle stars in dom based on users favorites list
  // parameter expects an array of favorite POJOs
  function toggleFavoritedStars(favorites) {
    // grab id's of all the favorites for this user
    for (let favorite of favorites) {
      let storyId = favorite.storyId;
      toggleStar(storyId);
    }
  }

  function toggleStar(id) {
    $(`#${id} i`).toggleClass('far fas');
  }

  function isEmpty(sel) {
    return ($(sel).attr('class') === 'far fa-star');
  }


  // Set click handler to all stars
  function enableStars() {
    // set a click handler on each star
    $("#news").on("click", ".far, .fas", function () {
      let retrieveAndToggle = () => {
        userInstance.retrieveDetails(() => {
          toggleStar(storyId);
        });
      }

      let storyId = $(this).parent().attr('id');

      // add favorite just clicked to server
      // when server responds, retreive details from server
      // when server responds to retreiveDetails, modify DOM
      if (isEmpty(this)) userInstance.addFavorite(storyId, retrieveAndToggle);
      else userInstance.removeFavorite(storyId, retrieveAndToggle);
    });
  }


  // TODO: FUNCTION THAT CHECKS USERS FAVORITES
  // AND TURNS THOSE STARS TO SOLID
  function updateFavorites() {

  }

  function clearForms() {

    $.each($('.form-control'), (i) => {
      $('.form-control').eq(i).val('');
    });
  }



  /* 
   * START OF FUNCTION CALLS
  */

  displayStories();

  // Navbar click handlers

  // DISPLAY LOGIN FORM ON CLICK (NAVBAR)
  // Toggle slide the login form on click
  $('#show-login').on('click', function () {
    if ($('#signup-form').css('display') !== 'none') {
      $('#signup-form').slideUp(400);
      $('#login-form').delay(600).slideToggle(400);
    } else {
      $('#login-form').slideToggle(400);
    }
  });

  // DISPLAY SIGNUP FORM ON CLICK (NAVBAR)
  // Toggle slide the login form on click
  $('#show-signup').on('click', function () {
    if ($('#login-form').css('display') !== 'none') {
      $('#login-form').slideUp(400);
      $('#signup-form').delay(600).slideToggle(400);
    } else {
      $('#signup-form').slideToggle(400);
    }
  });

  // LOGOUT USER ON CLICK (NAVBAR)
  $('#logout').on('click', function () {
    console.log('Logged out');
    // empty user instance and remove from local storage
    userInstance = {};
    localStorage.removeItem('currentUser');
    // revert DOM to show login button and
    // hide favorites and submit button
    setDisplayToLoggedOut();
  })

  // SHOW SUBMIT NEW STORY ON CLICK (NAVBAR)
  // Toggle slide the submit form on click
  $("#show-submit").on("click", function () {
    $("#submit-form").slideToggle(400);
  });

  // SHOW FAVORITES ON CLICK (NAVBAR)
  // favorites button filters down to only solid stars

  $("#show-favorites").on("click", function () {
    $(".far").parent().toggle();
  });


  // Form button click handlers

  // LOGIN FORM SUBMIT ON CLICK (FORM)
  // Log in user when login button is clicked
  $('#login-form button').on('click', function () {
    // get the username and password from the form
    const username = $('.form-control').eq(2).val();
    const password = $('.form-control').eq(3).val();

    User.login(username, password, function (res) {
      userInstance = res;
      localStorage.setItem("currentUser", JSON.stringify(userInstance));
      console.log('Running login callback');
      $("#login-form").slideUp(650);

      setDisplayToLoggedIn();

      clearForms();
    });

    // call the user.login function
  });

  // SIGN UP FORM SUBMIT ON CLICK (FORM)
  // Sign up user when sign up button is clicked
  $('#signup-form button').on('click', function () {
    // get the username and password from the form
    const name = $('.form-control').eq(4).val();
    const username = $('.form-control').eq(5).val();
    const password = $('.form-control').eq(6).val();

    // Create a user
    User.create(username, password, name, function (userObj) {
      userInstance = userObj;
      console.log(userInstance);
      $("#signup-form").slideUp(650);
      clearForms();
      alert('Account created! You may login now');

    });



  });



  // APPEND STORY TO DOM ON CLICK (FORM)
  // submit button click handler
  // TODO: CHANGE THIS TO RUN SUBMIT STORY FUNCTION
  $("#submit-form button").on("click", function () {
    submitStory();
  });

  // FILTER BY HOSTNAME ON CLICK
  //if hostname is clicked, filter to only news from those sites
  $("#news").on("click", "small", function (evt) {
    let currentHost = $(evt.target).text();
    $("#news ol li")
      .filter(function (i, e) {
        return ($(e)
          .children("a")
          .children("small")
          .text() !== currentHost);
      }).toggle();
  })

  /*
   * TODO: USER PROFILE SECTION
   * 1. FAVORITE STORIES SAVE TO PRIFLE
   * 2. FROM PROFILE, CAN SEE USERNAME & NAME
   * 3. CAN VIEW STORIES USER HAS POSTED
   * 4. CAN REMOVE STORIES I'VE POSTED FROM LIST IN PROFILE
   * 5. CAN REMOVE INDIVIDUAL FAVORITES FROM LIST OF FAVORITES
   *    IN MY PROFILE
  */

  // TOGGLE PROFILIE SECTION ON CLICK
  $('#show-profile').on('click', function () {
    toggleProfile();
  })

  // WHEN SUBMISSIONS CLICKED, POPULATE SUBMISSIONS SECTION BELOW
  $('#submission-link').on('click', function () {
    $('#user-submissions').toggle();
    for (let story of userInstance.ownStories) {
      appendStory(story, '#user-submissions ol');
    }
  })
});