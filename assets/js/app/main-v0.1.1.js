try {
    anlikZamaniSoruGirKismindaGoster();
    anlikZamaniKonuCalismaSuresiGirKismindaGoster();
} catch (e) {
    console.error(e)
}

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
        if (user) {

            current_user = user.uid;

            $(".user-text").text(user.email);

            $("#logout").click(function () {
                firebase.auth().signOut()
                    .then(function () {
                        window.location.href = "giris-yap.html";
                    })
            })

            $("#addQuestionBtn").click(function () {
                var lesson = $('#lesson').val();
                // var unit = $('#unitSoru').val();
                var questionCount = $('#questionCount').val();
                var minuteSoru = $('#minutesSoru').val();
                var date = $('#dateSoru').val();
                var time = $('#timeSoru').val();
                var millisecond = document.getElementById('millisecondSoru').text;
                date = new Date(date + ' ' + time).getTime();
                date = date + Number(millisecond);
                alert("Soru Kaydı Eklendi 👍")
                firebase.database().ref().child("users").child(current_user).child("records").push(
                    {
                        lesson: lesson,
                        count: questionCount,
                        minutes: minuteSoru,
                        time: date
                        // unit: unit
                    }
                );

                $("#questionCount").val('');
                $('#minutesSoru').val('');
                anlikZamaniSoruGirKismindaGoster();
            });

            $("#addLessonDuration").click(function () {
                var subject = $('#unitKonu').val()
                var lessonDuration = $('#lessonDuration').val()
                var date = $('#dateKonu').val();
                var time = $('#timeKonu').val();
                var millisecond = document.getElementById('millisecondKonu').text;
                date = new Date(date + ' ' + time).getTime();
                date = date + Number(millisecond);
                firebase.database().ref().child("users").child(current_user).child("duration").push(
                    {
                        lesson: subject,
                        count: lessonDuration,
                        time: date
                    }
                );

                alert("Çalışma Süresi Eklendi 👍")

                $("#questionCount").val('');
                anlikZamaniKonuCalismaSuresiGirKismindaGoster();

            });


            $("#saveProfileBtn").click(function () {
                var name = $('#name').val()
                var surname = $('#surname').val()
                var city = $('#city').val()
                var grade = $('#grade').val()
                var birthdate = $('#birthdate').val()

                firebase.database().ref().child("users").child(current_user).update(
                    {
                        name: name,
                        surname: surname,
                        city: city,
                        grade: grade,
                        birthdate: birthdate
                    }
                );
                alert("Bilgiler Güncellendi 👍")
            });


            var userRef = firebase.database().ref().child("users/" + current_user);

            userRef.on("value", function (snapshot) {

                if (snapshot.val()) {
                    $('#name').val(snapshot.val().name)
                    $('#surname').val(snapshot.val().surname)
                    $('#city').val(snapshot.val().city)
                    try {
                        $('#grade').val(snapshot.val().grade)
                    } catch (e) {
                        console.error(e);
                    }
                    $('#birthdate').val(snapshot.val().birthdate)
                }

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


        } else {
            window.location.href = "giris-yap.html";
        }
    })


})