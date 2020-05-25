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

$(document).ready(function () {
    // giriş kontrolü yap
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            current_user = user.uid;
            // console.log(current_user);
            
            $("#logout").click(function () {
                firebase.auth().signOut()
                    .then(function () {
                        window.location.href = "giris-yap.html";
                    })
            })

            /*            $(".user-text").text(user.email);

                        $("#logout").click(function () {
                            firebase.auth().signOut()
                                .then(function () {
                                    window.location.href = "giris-yap.html";
                                })
                        })

                        $("#addQuestionBtn").click(function () {
                            var lesson = $('#lesson').val()
                            var questionCount = $('#questionCount').val()
                            alert("Soru Kaydı Eklendi 👍")
                            firebase.database().ref().child("users").child(current_user).child("records").push(
                                {
                                    lesson: lesson,
                                    count: questionCount,
                                    time: Date.now()
                                }
                            );

                            $("#questionCount").val('');

                        });


                        $("#saveProfileBtn").click(function () {
                            var name = $('#name').val()
                            var surname = $('#surname').val()
                            var city = $('#city').val()
                            var grade = $('#grade').val()
                            var birthdate = $('#birthdate').val()

                            firebase.database().ref().child("users").child(current_user).set(
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
                                $('#grade').val(snapshot.val().grade)
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
                        })*/


            var users = firebase.database().ref().child('users');
            users.on('value', function (snapshot) {
                var shot = snapshot.val()[current_user]['records'];
                var keys = Object.keys(shot);
                var sonuc = [];
                var sonucHaftalik = [];

                // console.log(keys.length);

                // geçen haftaya ait zaman değerini hesapla
                var gecenHafta = new Date();
                gecenHafta.setDate(gecenHafta.getDate() - 7)
                gecenHafta = gecenHafta.getTime();

                // soru kayıtlarını işle
                for (i = 0; i < keys.length; i++) {

                    // zaman kaydını al, tarihe dönüştür
                    var tarih = epochToDate(shot[keys[i]]['time']);

                    // ders kaydını al
                    var ders = shot[keys[i]]['lesson'];

                    // soru miktarını al
                    var miktar = shot[keys[i]]['count'];
                    Number(miktar);

                    // hafta içinde çözülen soru miktarını derslere göre topla
                    if (shot[keys[i]]['time']>gecenHafta){
                        console.log("control 0");
                        if (sonucHaftalik[ders]==null){
                            sonucHaftalik[ders] = Number(miktar);
                        }else {
                            sonucHaftalik[ders] = sonucHaftalik[ders] + Number(miktar);
                        }
                    }

                    // toplam çözülen soru miktarını günlere göre topla
                    if (sonuc[tarih]==null){
                        sonuc[tarih]=Number(miktar);
                    }else {
                        sonuc[tarih]=sonuc[tarih]+Number(miktar);
                    }

                }

                // toplanan haftalık verileri grafiğe yazdır
                var haftalikDersler = [];
                var haftalikSorular = [];
                for (var key in sonucHaftalik){
                    if (sonucHaftalik.hasOwnProperty(key)) {
                        haftalikDersler.push(key)
                        haftalikSorular.push(sonucHaftalik[key]);
                    }
                }
                haftalikGrafik(haftalikDersler,haftalikSorular);

                // toplanan günlük verileri grafiğe yazdır
                var tarihler = [];
                var soruSayilari = [];
                for (var key in sonuc) {
                    if (sonuc.hasOwnProperty(key)) {

                        // Printing Keys
                        tarihler.push(key)
                        soruSayilari.push(sonuc[key]);
                    }
                }
                gunlukGrafik(tarihler,soruSayilari);

                /*
                    shot.forEach(function (item) {


                        console.log(item.key);
                        console.log(item.key['time']);


                    });
                */

            });

        } else {
            // giriş yapılmamış ise giriş ekranına yönlendir
            window.location.href = "giris-yap.html";
            // console.log("oturum yok");
        }
    })


})


function epochToDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('.');
}

/* her tarihe ait soru sayısını çizgi grafikte gösterir */
function gunlukGrafik(tarihler, soruSayilari) {
    var ctx = document.getElementById('kisiGecmisi').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tarihler,
            datasets: [{
                label: 'Günlük Çözülen Toplam Soru',
                data: soruSayilari,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

/* her derse ait soru sayısını bar grafikte gösterir */
function haftalikGrafik(dersler, soruSayilari) {
    var ctx = document.getElementById('haftalikDers').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dersler,
            datasets: [{
                label: 'Haftalık Çözülen Soru',
                data: soruSayilari,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
