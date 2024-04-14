var registerUrl = domainURL + "api/register";

$(document).ready(()=>{
    $('#myForm').submit((e)=>{
        var firstName = $('#firstName').val();
        var lastName = $('#lastName').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var reEnteredPassword = $('#reEnteredPassword').val();
    
        if(firstName.trim() == "") {$('#firstNameError').show(); return false;} else $('#firstNameError').hide();
        if(lastName.trim() == "") {$('#lastNameError').show();  return false;} else $('#lastNameError').hide();
        if(email.trim() == "") {$('#emailError').show();  return false;} else $('#emailError').hide();
        if(password.trim() == "") {$('#passwordError').show();  return false;} else $('#passwordError').hide();
        if(password.trim() != reEnteredPassword.trim()) {$('#reEnterPasswordError').show(); return false;} else $('#reEnterPasswordError').hide();
        
        const data = {
            'firstName': firstName,
            'lastName': lastName,
            'email': email,
            'password': password
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch(registerUrl,requestOptions)
            .then(response => {
                console.log(response);
                if(!response.ok){
                    response.json().then(msg => alert(msg.message));
                    throw new Error("User registration failed!");
                }
                return response.json();
            })
            .then(data => {
                console.log('Success');
                alert("User Registration Success");
                window.location.replace('/pages/login.html');
                return false;
            })
            .catch(error =>{
                console.log(error);
            });
        return false;
    });
});
