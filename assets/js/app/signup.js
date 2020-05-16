// kayıt işleminde kullanılacak olan js dosyası

$(document).ready(function () {

    $('#registerBtn').click(function () {
    
        
        
        var email = $('#emailReg').val();
        var password = $('#passwordReg').val();
        var name = $('#name');
        var surname = $('#surname');
        var city = $('#city');
        var grade = $('#grade');
        var birthdate = $('#birthdate');

        alert(email)


        firebase.auth().createUserWithEmailAndPassword(email,password)
            .then(function () {
                firebase.auth().signInWithEmailAndPassword(email,password)
                    .then(function (user) {
                        firebase.database().ref().child("users").child(user.uid).child("todos").push(
                            {
                                description : 'merhaba',
                                completed   : false
                            }
                        );

                        window.location.href = 'index.html'
                    })
            }).catch(function (error) {
             alert(error.message);
        })
    })


})