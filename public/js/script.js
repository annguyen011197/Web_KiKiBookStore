var menuContentSource = $("#menu-template").html()
var menuContent = Handlebars.compile(menuContentSource)
var menu = $("#types")
var buttonShoppingCart = $("#shopping-cart-b")
console.log('Script.js')
loadCategory()
setCartSize()

function loadCategory() {
  $.ajax({
    type: "get",
    url: "/api/category",
    data: {
      offset: 1,
      limit: 3,
      type: 'name'
    },
    dataType: "json",
    success: function (response) {
      let data = {
        booktypes: response
      }
      menu.html(menuContent(data))
    }
  });
}

function loadListCategory() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "get",
      url: "/api/category",
      data: {
        offset: 1,
        limit: 30,
        type: 'name'
      },
      dataType: "json",
      success: function (response) {
        resolve(response)
      }
    })
  })
}


function showMenu() {
  if ($("#menuBook").hasClass('show')) {
    $("#menuBook").removeClass('show')
  } else {
    $("#menuBook").addClass('show')
  }
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(text) {
  return text.length > 6
}

function validateUsername(text) {
  var re = /^[a-zA-Z0-9]+$/
  return re.test(text)
}

jQuery(document).ready(function ($) {
  $("#search-button").click(function() {
    window.location.href = '/search?name=' + $(".form-control").val();
   }); 
  $(".form-control").on('keyup keypress', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) { 
      window.location.href = '/search?name=' + $(".form-control").val();
      e.preventDefault();
      return false;
    }
  });


  var $form_modal = $('.user-modal'),
    $form_login = $form_modal.find('#login'),
    $form_signup = $form_modal.find('#signup'),
    $form_forgot_password = $form_modal.find('#reset-password'),
    $form_modal_tab = $('.switcher'),
    $tab_login = $form_modal_tab.children('li').eq(0).children('a'),
    $tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
    $forgot_password_link = $form_login.find('.form-bottom-message a'),
    $back_to_login_link = $form_forgot_password.find('.form-bottom-message a'),
    $main_nav = $('.header-link');
  let $signin_button = $('#signin-button')
  let $signup_button = $('#signup-button')
  let $logout_button = $('#logout-button')

  $logout_button.on('click', (event) => {
    $.ajax({
      type: "GET",
      url: "/users/logout",
      success: () => {
        location.reload()
      }
    });
  })

  $signin_button.on('click', (event) => {
    if ($(event.target).is($main_nav)) {
      // on mobile open the submenu
      $(this).children('ul').toggleClass('is-visible');
    } else {
      // on mobile close submenu
      $main_nav.children('ul').removeClass('is-visible');
      //show modal layer
      $form_modal.addClass('is-visible');
      //show the selected form
      ($(event.target).is('.signup')) ? signup_selected(): login_selected();
    }
  })

  $signup_button.on('click', (event) => {
    if ($(event.target).is($main_nav)) {
      // on mobile open the submenu
      $(this).children('ul').toggleClass('is-visible');
    } else {
      // on mobile close submenu
      $main_nav.children('ul').removeClass('is-visible');
      //show modal layer
      $form_modal.addClass('is-visible');
      //show the selected form
      ($(event.target).is('.signup')) ? signup_selected(): login_selected();
    }
  })

  //open modal
  // $main_nav.on('click', function (event) {

  //   if ($(event.target).is($main_nav)) {
  //     // on mobile open the submenu
  //     $(this).children('ul').toggleClass('is-visible');
  //   } else {
  //     // on mobile close submenu
  //     $main_nav.children('ul').removeClass('is-visible');
  //     //show modal layer
  //     $form_modal.addClass('is-visible');
  //     //show the selected form
  //     ($(event.target).is('.signup')) ? signup_selected() : login_selected();
  //   }
  // });

  //close modal
  $('.user-modal').on('click', function (event) {
    if ($(event.target).is($form_modal) || $(event.target).is('.close-form')) {
      $form_modal.removeClass('is-visible');
    }
  });
  //close modal when clicking the esc keyboard button
  $(document).keyup(function (event) {
    if (event.which == '27') {
      $form_modal.removeClass('is-visible');
    }
  });

  //switch from a tab to another
  $form_modal_tab.on('click', function (event) {
    event.preventDefault();
    ($(event.target).is($tab_login)) ? login_selected(): signup_selected();
  });

  //hide or show password
  $('.hide-password').on('click', function () {
    var $this = $(this),
      $password_field = $this.prev('input');

    ('password' == $password_field.attr('type')) ? $password_field.attr('type', 'text'): $password_field.attr('type', 'password');
    ('Show' == $this.text()) ? $this.text('Hide'): $this.text('Show');
    //focus and move cursor to the end of input field
    $password_field.putCursorAtEnd();
  });

  //show forgot-password form 
  $forgot_password_link.on('click', function (event) {
    event.preventDefault();
    forgot_password_selected();
  });

  //back to login from the forgot-password form
  $back_to_login_link.on('click', function (event) {
    event.preventDefault();
    login_selected();
  });

  function login_selected() {
    $form_login.addClass('is-selected');
    $form_signup.removeClass('is-selected');
    $form_forgot_password.removeClass('is-selected');
    $tab_login.addClass('selected');
    $tab_signup.removeClass('selected');
  }

  function signup_selected() {
    $form_login.removeClass('is-selected');
    $form_signup.addClass('is-selected');
    $form_forgot_password.removeClass('is-selected');
    $tab_login.removeClass('selected');
    $tab_signup.addClass('selected');
  }

  function forgot_password_selected() {
    $form_login.removeClass('is-selected');
    $form_signup.removeClass('is-selected');
    $form_forgot_password.addClass('is-selected');
  }

  $form_forgot_password.find('input[type="submit"]').on('click', function (event) {
    event.preventDefault();
    let email = $form_forgot_password.find('input[id="reset-email"]').val()
    if(!email){
      alert("Email không được rỗng");
      return;
    }
    $.ajax({
      type: "post",
      url: "/api/reset",
      data: {
      email: email
      },
      dataType: "json",
      success: function (response) {
        alert("Mật khẩu đã được gửi tới email!");
      },
      error: (res) => {
        console.log(res)
        alert(res.responseJSON.message);
      }
    })

  });


  $form_login.find('input[type="submit"]').on('click', function (event) {
    event.preventDefault();
    // $form_login.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
    let email = $form_login.find('input[id="signin-email"]').val();
    let password = $form_login.find('input[id="signin-password"]').val();
    let remember = $form_login.find('input[id="remember-me"]:checked').length > 0
    console.log(remember)
    let validate = true
    if (!validateEmail(email)) {
      validate = false
      alert('Email Wrong')
      $form_login.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
    }
    if (validate) {
      $.ajax({
        type: "post",
        url: "/users/login",
        data: {
          email: email,
          password: password,
          remember: remember
        },
        dataType: "json",
        success: res => {
          alert(res.message);
          if (res.code == 0) {
            location.reload()
          }
        },
        error: (res) => {
          console.log(res)
          alert(res.responseJSON.message);
        }
      });
    }

  });

  $form_signup.find('input[type="submit"]').on('click', function (event) {
    event.preventDefault();
    let username = $form_signup.find('input[id="signup-username"]').val();
    let email = $form_signup.find('input[id="signup-email"]').val();
    let password = $form_signup.find('input[id="signup-password"]').val();

    let validate = true
    if (!validateEmail(email)) {
      validate = false
      alert('Email Wrong')
      $form_signup.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
    }

    if (!validatePassword(password)) {
      validate = false
      alert('password Wrong')
      $form_signup.find('input[type="password"]').toggleClass('has-error').next('span').toggleClass('is-visible');
    }

    if (!validateUsername(username)) {
      validate = false
      alert('username Wrong')
      $form_signup.find('input[type="text"]').toggleClass('has-error').next('span').toggleClass('is-visible');
    }

    if (validate) {
      $.ajax({
        type: "post",
        url: "/users/signup",
        data: {
          email: email,
          username: username,
          password: password
        },
        dataType: "json",
        success: (res) => {
          $.ajax({
            type: "post",
            url: "/api/verify",
            data: {
              email: email
            },
            dataType: "json",
            success: res => {
              console.log(res)
            }
          });
          alert(res.message);
          if (res.code == 0) {
            location.reload()
          }
        }
      });
    }
  });


  //IE9 placeholder fallback
  //credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
  if (!Modernizr.input.placeholder) {
    $('[placeholder]').focus(function () {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
      }
    }).blur(function () {
      var input = $(this);
      if (input.val() == '' || input.val() == input.attr('placeholder')) {
        input.val(input.attr('placeholder'));
      }
    }).blur();
    $('[placeholder]').parents('form').submit(function () {
      $(this).find('[placeholder]').each(function () {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
          input.val('');
        }
      })
    });
  }

});


//credits https://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function () {
  return this.each(function () {
    // If this function exists...
    if (this.setSelectionRange) {
      // ... then use it (Doesn't work in IE)
      // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
      var len = $(this).val().length * 2;
      this.setSelectionRange(len, len);
    } else {
      // ... otherwise replace the contents with itself
      // (Doesn't work in Google Chrome)
      $(this).val($(this).val());
    }
  });
};

function setCartSize(){
  let tempid = getCookie('tempID')
  let url = '/api/cartsize'
  if(tempid.length > 0){
    url = `${url}?id=${tempid}`
  }
  ajax({
    type:'get',
    url:url,
  }).then(res=>{
    $('#cart-size').html(res)
  })
}

buttonShoppingCart.on('click',event=>{
  console.log('Click')
  let tempid = getCookie('tempID')
  let url = 'checkout/cart'
  if(tempid.length > 0){
    url = `${url}?id=${tempid}`
  }
  location.href = url;
})