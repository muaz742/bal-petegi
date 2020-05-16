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

    var current_user = "";

    firebase.auth().onAuthStateChanged(function (user) {
        if(user){

            current_user = user.uid;

            $(".user-text").text(user.email);

            $("#logout").click(function () {
                firebase.auth().signOut()
                    .then(function () {
                        window.location.href = "login.html";
                    })
            })


            $(".sendToFireBase").click(function () {
                var description = $('#description').val()
                firebase.database().ref().child("users").child(current_user).child("todos").push(
                    {
                        description : description,
                        completed   : false
                    }
                );

                $("#description").val('');

            })


            var todoRef = firebase.database().ref().child("users/" + current_user).child("todos");

            todoRef.on("value", function (snapshot) {

                var $parent = $(".todoList").children("tbody");

                $parent.html('');

                snapshot.forEach(function(item){


                    var completed = item.val().completed == true ? "checked" : "";


                    var description_elem = "<td>" + item.val().description + "</td>"
                    var completed_elem = "<td class='text-center'><input data-key='"+ item.key +"' type='checkbox' class='switchery-plugin' " + completed +"></td>"
                    var removeBtn_elem = "<td class='text-center'><button data-key='"+ item.key +"' class='btn btn-danger btn-block removeBtn'>Sil</button></td>"

                    $parent.append("<tr>" + description_elem + completed_elem + removeBtn_elem + "</tr>")

                })

                $(".switchery-plugin").each(function () {
                    new Switchery(this);
                })

            })


            $("body").on("click", ".removeBtn", function () {
                var $key = $(this).data("key");

                firebase.database().ref("users/" + current_user).child("todos").child($key).remove();

            })

            $("body").on("change", ".switchery-plugin", function () {
                var $completed = $(this).prop("checked");

                var $key = $(this).data("key");

                firebase.database().ref("users/" + current_user).child("todos").child($key).child("completed").set($completed);
            })


            }
        else{
            window.location.href = "giris-yap.html";
        }
    })


})