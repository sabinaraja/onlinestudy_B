$(function() {
  //GLOBAL VARIABLES
  var totalLink = 'https%3A%2F%2Fssd.az1.qualtrics.com%2Fjfe%2Fform%2FSV_4OOLU8LqHUHjZb0';
  var globalUsername = "";
  var globalAvatar = "";
  var globalDescription = "";
  var countlike = 0;
  var countDislike = 0;
  var conditions = {
    // Condition 1 settings
    1: { likes: [10000,20000,35000,45000,60000,78000,80000,100000,132000], dislikes: [] }, 
     // Condition 2 settings
    2: { likes: [10000,35000,80000,100000,132000,150000], dislikes: [] },
     // Condition 3 settings
    3: { likes: [10000], dislikes: [11111] }, 
     // Condition 4 settings
    4: { likes: [], dislikes: [10000,35000,80000,100000,132000,150000] }  
  };
  var assignedConditionNumber = 2; // Set to always use condition 2
  
  function set_settings() {
    window.settings = [];
    settings.numberofavatars = 32;
    settings.tasklength = 180000;
    window.others.posts[1].likes = [12000,14000,15000,35000,80000];
    window.others.posts[1].Dislikes = [12000,14000,15000,35000,80000];
    settings.likes_by = ['Ky', 'Arjen', 'AncaD', 'Nick', 'Heather', 'Jane', 'Georgeee', 'John',  'Mary', 'Lauren', 'Sarah'];
    settings.Dislikes_by = [ 'Lauren', 'Arjen', 'Jane',  'Ky', 'AncaD', 'Nick', 'Heather', 'Georgeee', 'John', 'Mary', 'Sarah'];
    window.query_string =null;
  }
  
  // -------------------
  // Above were the basic parameters you can adjust using the instructions.
  // The remaining code is also annotated, but we do not recommend changing it, unless you are comfortable with web programming.
  // -------------------

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Generate a random integer between 1 and 4 (inclusive)
  const randomNumber = getRandomInt(1, 4);
  console.log(randomNumber);

  //**Intro**
  // Instructions regarding the task//
  function init_intro() {
  	$('#intro').show();
  	$('#submit_intro').on('click',function() {
			$('#intro').hide();
  		init_name();
  	});
  }

  //**Username**
  //Only alphanumeric usernames//
  function init_name() { 
    const nameContainer = $('#name'); 
    const usernameInput = $('#username'); 
    const submitButton = $('#submit_username'); 
    nameContainer.show(); 
    submitButton.on('click', () => { 
        let error = 0; 
        let errormsg = ''; 
        const uname = usernameInput.val().trim(); 
        if (!uname) { 
            error = 1; 
            errormsg = 'Please enter text'; 
        } else if (not_alphanumeric(uname)) { 
            error = 1; 
            errormsg = 'Please only letters (and no spaces)'; 
        } else if (uname.length > 12) { // Check if length is over 10 
            error = 1; 
            errormsg = 'Username cannot exceed 10 characters'; 
        } 
        if (error === 0) { 
            nameContainer.hide(); 
            window.username = uname; 
            globalUsername = uname; 
            totalLink += "username=" + globalUsername; 
            init_avatar(); 
        } else { 
            alertify.log(errormsg, 'error'); 
        } 
    }); 
}



  // **Slide:** **Avatar**
  // Avatar slide in which the participant is asked to select an avatar

  function init_avatar() {
  	$('#avatar').show();

    var avatars = window.settings.numberofavatars;
  	for(var i=0; i<avatars; i++)
  	{
  		$('.avatars').append('<img id="avatar_' + i+ '" src="avatars/avatar_' + i + '.png" class="avatar" />');
  	}

        // Calculate width of each avatar based on 7 avatars per row
        var avatarWidth = $('.avatars').width() / 10;

        // Set width and height for each avatar while maintaining aspect ratio
        $('.avatar').css({
            'width': avatarWidth + 'px',
            'height': 'auto' // Auto height to maintain aspect ratio
        });
    
        $('.avatar').on('click', function() {
            $('.avatar').removeClass('selected');
            $(this).addClass('selected');
        });

  	$('.avatar').on('click', function() {
  		$('.avatar').removeClass('selected');
  		$(this).addClass('selected');
  	});

    	$('#submit_avatar').on('click',function() {
    		if($('.selected').length == 1) {
          $('#avatar').hide();
          window.avatar = $('.selected').attr('id');
          globalAvatar = $('.selected').attr('id');
          totalLink += "&avatar=" + globalAvatar;
          window.avatarexport = /avatar_([^\s]+)/.exec(window.avatar)[1];
    			init_text();
    		} else {
    			alertify.log("Please select an avatar","error");
    		}
    	});
  }


  // **Slide:** **Description**
  function init_text() {
    $('#text').show();
  
    $("#description").keyup(function () {
      var inputText = $(this).val();
      if (inputText.length > 400) {
        $(this).val(inputText.substr(0, 400));
      }
  
      var remainingChars = Math.max(0, 400 - inputText.length);
      $("#count").text("Characters left: " + remainingChars);
  
      // Clear previous error messages
      $('#error_message').text("");
    });
  
    $('#submit_text').on('click', function () {
      var error = 0;
      var errormsg = "";
  
      if ($('#description').val() == "") {
        error = 1;
        errormsg = 'Please enter text';
      } else if ($('#description').val().length < 200) {
        error = 1;
        errormsg = 'Please write a bit more (at least 200 characters)';
      } else if ($('#description').val().length > 400) {
        error = 1;
        errormsg = 'Please enter 400 characters or less';
      }
  
      if (error == 0) {
        $('#text').hide();
        window.description = $('#description').val();
        globalDescription = $('#description').val();
        totalLink += "&description=" + globalDescription
        init_fb_intro();
      } else {
        // Display the error message
        alertify.log("Please Enter More Characters","error");
      }
    });
  }


  // **Slide:** **Instructions**
  function init_fb_intro() {
  	$('#fb_intro').show();
  	$('#submit_fb_intro').on('click',function() {
			$('#fb_intro').hide();
 			init_fb_login();
  	});
  }


  // **Slide:** **Login** **Screen**
  // Participant can continue after 8000ms = 8s
  function init_fb_login() {
  	$('#fb_login').show();

  	setTimeout(function() {
  		$('#msg_all_done').show();
  		$("#loader").hide();
  	}, 8000);

  	$('#submit_fb_login').on('click',function() {
			$('#fb_login').hide();
  		init_task();
  	});
  }

  // Disables the like buttons and notifies the user that the time is up.
  function DeactivateLike() {
	  setTimeout(function() { 
      $('.btn-like').attr("disabled", true);
      alertify.log("Time is up").maximize();
    }, 3000);
  }

  // Disables the dislike buttons and notifies the user that the time is up.
  function DeactivateDisLike(){
    setTimeout(function() {   
      $('.btn-Dislike').attr("disabled", true);
    }, 3000);
  }

  //**Task**
  function init_task() {
    $('#task').show();
    shortcut.add("Backspace",function() {});

    // Disables the like/dislike buttons once the time is up and notifies the usr.
    jQuery("#countdown").countDown({
      startNumber: window.settings.tasklength/1000, // in seconds
      callBack: function(me) {
        console.log('over');
        $('#timer').text('00:00');
        DeactivateLike();
        DeactivateDisLike();
        totalLink += "&likes=" + countlike;
        totalLink += "&dislikes=" + countDislike;
        const timerLength = 5000; 
        setTimeout(() => {
          window.location.href = totalLink;
        }, timerLength);
      }
    });

    users = {
      "posts" : [
      {
        "avatar": 'avatars/' + window.avatar + '.png',
        "username": window.username,
        "text": window.description,
        "likes": window.settings.condition_likes,
        "Dislikes":  window.settings.condition_Dislikes,
        "usernames": window.settings.likes_by
      }
      ]
    };

    // Add user box to slide
    var tpl = $('#usertmp').html(),html = Mustache.to_html(tpl, users);
    $("#task").append(html);

    // Add other boxes to slide
    var tpl = $('#otherstmp').html(),html = Mustache.to_html(tpl, others);
    $("#task").append(html);

    // Randomize order of other players boxes
    function reorder() {
      var grp = $("#others").children();
      var cnt = grp.length;
      var temp, x;
      for (var i = 0; i < cnt; i++) {
        temp = grp[i];
        x = Math.floor(Math.random() * cnt);
        grp[i] = grp[x];
        grp[x] = temp;
      }
      $(grp).remove();
      $("#others").append($(grp));
    }
    reorder();

    function LikeDisLike(condition) {
      var likes = condition.likes;
      var dislikes = condition.dislikes;
    
      $('.userslikes').each(function() {
        var that = $(this);
        var usernames = $(this).data('usernames').split(",");
        var likeCount = 0;
        var dislikeCount = 0;
    
        var usedUsernames = []; // Array to keep track of used usernames
        usernames = usernames.sort(() => Math.random() - 0.5);
    
        for (var i = 0; i < likes.length; i++) {
          var time = likes[i];
          var username;
    
          // Find an unused username
          var unusedIndex = usernames.findIndex(function(name) {
            return !usedUsernames.includes(name);
          });
    
          if (unusedIndex !== -1) {
            username = usernames[unusedIndex];
            usedUsernames.push(username); // Add the used username to the array
          } else {
            // No more unused usernames, skip this like event
            continue;
          }
    
          themsg = username + " liked your post";
          setTimeout(function(themsg) {
            that.text(parseInt(that.text()) + 1);
            alertify.success(themsg);
          }, time, themsg);
        }
    
        for (var i = 0; i < dislikes.length; i++) {
          var time = dislikes[i];
          var username;
    
          // Find an unused username
          var unusedIndex = usernames.findIndex(function(name) {
            return !usedUsernames.includes(name);
          });
    
          if (unusedIndex !== -1) {
            username = usernames[unusedIndex];
            usedUsernames.push(username); // Add the used username to the array
          } else {
            // No more unused usernames, skip this dislike event
            continue;
          }
    
          themsg = username + " disliked your post";
          setTimeout(function(themsg) {
            $('.usersDislikes').each(function() {
              $(this).text(parseInt($(this).text()) + 1);
              alertify.error(themsg);
            });
          }, time, themsg);
        }
      });
    }
    
    // Call the function for a specific condition
    LikeDisLike(conditions[assignedConditionNumber]);

    // When others receive likes
    $('.otherslikes').each(function() {
      var that = $(this);
      var times = $(this).data('likes').split(",");
      for(var i=0; i<times.length; i++) {
        if(times[i] ==  9999999) {
          setTimeout(function () {
            that.text(parseInt(that.text()) + 0);
          }, times[i]);
        }
        else {
          times[i] = +times[i];
          setTimeout(function () {
            that.text(parseInt(that.text()) + 1);
          }, times[i]);
        }
      }
    });

      // When others receive Dislikes
    $('.othersDislikes').each(function() {
      var that = $(this);
      var times = $(this).data('likes').split(",");

      for(var i=0; i<times.length; i++) {
        if(times[i]== 12000 || times[i] == 35000 ||  times[i] ==  13333 || times[i] == 20000 || times[i] == 25000 || times[i] == 40000 || times[i] ==  9999999 || times[i] ==  9000 || times[i] ==  40000 || times[i] ==  38000 || times[i] ==  1000 || times[i] == 55248 || times[i] == 68791 || times[i] == 76542 || times[i] == 87654) {
          setTimeout(function () {
            that.text(parseInt(that.text()) + 0);
          }, times[i]);
        }
        else {
          times[i] = +times[i] +2000;
          setTimeout(function () {
            that.text(parseInt(that.text()) + 1);
          }, times[i]);
        }
      }
    });

// Initialize like buttons
$('.btn-like').on('click', function() {
  if (!$(this).prop('disabled') && !$(this).parent().parent().find('.btn-Dislike').prop('disabled')) {
      $(this).prev().text(parseInt($(this).prev().text()) + 1);
      countlike++;
      $(this).attr("disabled", true);
      $(this).parent().parent().find('.btn-like').attr("disabled", true);
      $(this).parent().parent().find('.btn-Dislike').attr("disabled", true);
  }
});

// Initialize Dislike buttons
$('.btn-Dislike').on('click', function() {
  if (!$(this).prop('disabled') && !$(this).parent().parent().find('.btn-like').prop('disabled')) {
      $(this).prev().text(parseInt($(this).prev().text()) + 1);
      countDislike++;
      $(this).attr("disabled", true);
      $(this).parent().parent().find('.btn-Dislike').attr("disabled", true);
      $(this).parent().parent().find('.btn-like').attr("disabled", true);
  }
});

    // Initalize Masonry plugin
    // For display of user and other players boxes in columns without gaps
    $('#task').masonry({
      itemSelector : '.entry',
      columnWidth : 10
    });

    // Redirect, default after 180000ms = 180s = 3min, disabled 'Continue' button with redirect link
    setTimeout(function() {
      $(window).unbind('beforeunload');
      $('#timer').text('00:00');
    },window.settings.tasklength); // timing for task
  }

  // Function to check letters and numbers
  // via http://www.w3resource.com/javascript/form/letters-numbers-field.php
  function not_alphanumeric(inputtxt) {
    var letterNumber = /^[0-9a-zA-Z]+$/;
    if(inputtxt.match(letterNumber)) {
        return false;
      } else {
        return true;
      }
  }

  // Function to add extra zeros infront of numbers (used for the countdown)
  // via http://stackoverflow.com/a/6466243
  function pad (str, max) {
      return str.length < max ? pad("0" + str, max) : str;
  }

  // Simple Countdown
  // via http://davidwalsh.name/jquery-countdown-plugin
  jQuery.fn.countDown = function(settings,to) {
    settings = jQuery.extend({
      startFontSize: "12px",
      endFontSize: "12px",
      duration: 1000,
      startNumber: 10,
      endNumber: 0,
      callBack: function() { }
    }, settings);
    return this.each(function() {
      if(!to && to != settings.endNumber) { to = settings.startNumber; }
      jQuery(this).children('.secs').text(to);
      jQuery(this).animate({
        fontSize: settings.endFontSize
      }, settings.duration, "", function() {
        if(to > settings.endNumber + 1) {
          jQuery(this).children('.secs').text(to - 1);
          jQuery(this).countDown(settings, to - 1);
          var minutes = Math.floor(to / 60);
          var seconds = to - minutes * 60;
          jQuery(this).children('.cntr').text(pad(minutes.toString(),2) + ':' + pad(seconds.toString(),2));
        }
        else {
          settings.callBack(this);
        }
      });
    });
  };

  // Prevent that participants accidentally exit the experiment by disabling F5 and backspace keys
  shortcut.add("f5",function() {});
  $(window).bind('beforeunload', function() {
    return 'Are you sure you want to quit the experiment completely?';
  });

  // Set Settings
  set_settings();

  // Start with the intro slide
  init_intro();
});
