// doküman yüklendiğinde
$(document).ready(function () {

    // kullanıcı giriş değişkliği yokla
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            current_user = user.uid;


            $("#logout").click(function () {
                firebase.auth().signOut()
                    .then(function () {
                        window.location.href = "giris-yap.html";
                    })
            })

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
                    // kullanıcı isim ve soyismini ekranda göster
                    $('#birthdate').val(snapshot.val().birthdate)
                    guncelleAtif(snapshot.val().name, snapshot.val().surname)
                }
            })
        } else {
            // giriş yapılmamış ise 'giriş yap' ekranına yönlendir
            window.location.href = "giris-yap.html";
        }
    })


})

// oturumu kapat butonuna tıklandığıdna
$("#logout").click(function () {
    firebase.auth().signOut()
        .then(function () {
            window.location.href = "giris-yap.html";
        })
})

// ekran üstünde kullanıcı adı ve soyadını göster
function guncelleAtif(isim, soyisim) {
    var kisi = isim + " " + soyisim;
    var mesaj = 'Süper Arı ' + kisi;
    $('#ekranAtif').text(mesaj);
}