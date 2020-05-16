// kayıt işleminde kullanılacak olan js dosyası

$(document).ready(function () {

    $('#registerBtn').click(function () {
    
        
        
        var email = $('#email').val();
        var password = $('#password').val();

        firebase.auth().createUserWithEmailAndPassword(email,password)
            .then(function () {
                firebase.auth().signInWithEmailAndPassword(email,password)
                    .then(function () {
                        window.location.href = 'index.html'
                    })
            }).catch(function (error) {
             alert(error.message);
        })
    })


})