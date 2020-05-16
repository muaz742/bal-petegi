$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyDcNJORpxWVaIFhTa23D3k6D49hu3v-dKM",
        authDomain: "bal-petegi-cf9c9.firebaseapp.com",
        databaseURL: "https://bal-petegi-cf9c9.firebaseio.com",
        projectId: "bal-petegi-cf9c9",
        storageBucket: "bal-petegi-cf9c9.appspot.com",
        messagingSenderId: "51545633996",
        appId: "1:51545633996:web:8020e1aa7c77dd69573e69",
        measurementId: "G-N08LMFPGDK"
    };
    
    firebase.initializeApp(config);

    $('#loginBtn').click(function () {
        var email = $('#email').val();
        var password = $('#password').val();

        firebase.auth().signInWithEmailAndPassword(email,password)
            .then(function () {
                window.location.href = "index.html";
            }).catch(function (error) {
            alert(error.message);
        })
    })

})