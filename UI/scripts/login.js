var loginUrl = domainURL + "api/login";

$(document).ready(function () {
    $('#loginForm').submit(()=>{
        var email = $('#email').val();
        var password = $('#password').val();

        if(email.trim() == "") {$('#emailError').show(); return false;} else $('#emailError').hide();
        if(password.trim() == "") {$('#passwordError').show();  return false;} else $('#passwordError').hide();

        const data = {
            email: email,
            password: password
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        };

        fetch(loginUrl, requestOptions)
            .then(response => {
                if(!response.ok){
                    if(response.status == 400){
                        $('#loginError').text(response);
                        $('#loginError').show();
                    }else{
                        alert("Invalid Credentials!")
                        throw new Error("User Login failed!");
                    }
                }
                return response.json();
            })
            .then((data)=>{
                $('#loginError').hide();
                alert(data.message);
                window.location.href = '/api/dashboard';
                return false;
            })
            .catch(error =>{
                console.log(error);
            });
        return false;
    });
});