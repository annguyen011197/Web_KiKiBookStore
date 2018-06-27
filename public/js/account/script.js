function submitUpdate() {
  let firstName = $('#firstName').val();
  let secondName = $('#secondName').val();
  let address = $('#address').val();
  let phone_number = $('#phone_number').val();
  let birthday = getDate();
  let passwordNow = $("#current_password").val();
  let passwordNew = $("#password").val();
  let passwordNewRe = $("#confirmation").val();
  let data = {
    firstName: firstName,
    secondName: secondName,
    address: address,
    contactNumber: phone_number,
    birthday: birthday,
  }
  if($("#change_password").prop('checked') == true){
    data.passwordNow = passwordNow;
    data.passwordNewRe = passwordNewRe;
    data.passwordNew = passwordNew;
    if(passwordNow == passwordNew){
      alert("Mật khẩu mới và cũ không được giống nhau");
      return;
    }
    if(passwordNew != passwordNewRe){
      alert("Nhập lại mật khẩu sai!");
      return;
    }
  }
  $.ajax({
      type: "post",
      url: "/api/updateAccount",
      data,
      dataType: "json",
      success: (res) => {
          alert(res.message);
          if (res.code == 0) {
              location.reload()
          }
      }
  });
}

function setDate(){
  let date = $("#date-hide").text();
  let d = new Date(date);
  $('#day').val(d.getDate());
  $('#month').val(d.getMonth());
  $('#year').val(d.getFullYear());
}
setDate();

//var dataForm = new VarienForm('form-validate', true);
function setPasswordForm(arg) {
      if (arg) {
          $('.fieldset-password').show();
        

      } else {
          $('.fieldset-password').hide();
      }
  }

  function getDate(){
    let day = $('#day').val()
    let month = $('#month').val()
    let year = $('#year').val()
    return new Date(parseInt(year), parseInt(month), parseInt(day)); 
  }