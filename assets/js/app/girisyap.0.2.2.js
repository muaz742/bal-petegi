// doküman yüklendiğinde
$(document).ready(function () {

    $('#loginBtn').click(function () {
        var email = $('#email').val();
        var password = $('#password').val();
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(function() {
                return firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(function () {
                        window.location.href = "index.html";
                    }).catch(function (error) {
                        alert(error.message);
                    });
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
            });
    })

    $('#registerBtn').click(function () {
        var email = $('#emailReg').val();
        var password = $('#passwordReg').val();
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function () {
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(function () {
                        window.location.href = 'index.html'
                    })
            }).catch(function (error) {
            alert(error.message);
        })
    })

})