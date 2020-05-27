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
            });

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


            var users = firebase.database().ref().child('users').child(current_user);
            users.on('value', function (snapshot) {
                var shot = snapshot.val()['records'];
                var keys = Object.keys(shot);
                var duration = snapshot.val()['duration'];
                var sonuc = [];
                var sonucHaftalik = [];
                var sonucGunluk = [];
                var listeGirilenSorular = {};
                var sonucGunlukSureDersli = [];
                var sonucHaftalikDersli = [];
                var sonucDersli = [];
                var listeGirilenSureler = {}

                // console.log(keys.length);


                // şimdiki zamana ait değeri hesapla
                var simdi = new Date();

                // geçen haftaya ait zaman değerini hesapla
                var gecenHafta = new Date();
                gecenHafta.setDate(simdi.getDate() - 7)
                gecenHafta = gecenHafta.getTime();

                // son gün dönümüne ait zaman değerini hesapla
                var geceYarisi = new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate());
                geceYarisi = geceYarisi.getTime();

                // soru kayıtlarını işle
                for (i = 0; i < keys.length; i++) {

                    // zaman kaydını al, tarihe dönüştür
                    var tarih = epochToDate(shot[keys[i]]['time']);
                    var saat = epochToTime(shot[keys[i]]['time']);

                    // ders kaydını al
                    var ders = shot[keys[i]]['lesson'];

                    // soru miktarını al
                    var miktar = shot[keys[i]]['count'];
                    Number(miktar);

                    // gün içinde çözülen soru miktarını derslere göre topla
                    if (shot[keys[i]]['time'] > geceYarisi) {
                        if (sonucGunluk[ders] == null) {
                            sonucGunluk[ders] = Number(miktar);
                        } else {
                            sonucGunluk[ders] = sonucGunluk[ders] + Number(miktar);
                        }
                    }

                    // hafta içinde çözülen soru miktarını derslere göre topla
                    if (shot[keys[i]]['time'] > gecenHafta) {
                        if (sonucHaftalik[ders] == null) {
                            sonucHaftalik[ders] = Number(miktar);
                        } else {
                            sonucHaftalik[ders] = sonucHaftalik[ders] + Number(miktar);
                        }
                    }

                    // toplam çözülen soru miktarını günlere göre topla
                    if (sonuc[tarih] == null) {
                        sonuc[tarih] = Number(miktar);
                    } else {
                        sonuc[tarih] = sonuc[tarih] + Number(miktar);
                    }

                    // girilen soru kayıtlarını topla
                    listeGirilenSorular[shot[keys[i]]['time']] = {
                        "tarih": tarih,
                        "saat": saat,
                        "ders": ders,
                        "miktar": miktar,
                        "key": keys[i]
                    }
                }

                // süre kayıtlarını işle
                for (key in duration){

                    var sureDers = duration[key]['lesson'];
                    var sureMiktar = duration[key]['count'];
                    var sureTarih = epochToDate(duration[key]['time']);
                    var sureSaat = epochToTime(duration[key]['time']);

                    // gün içinde çalışılan süreleri derslere göre topla
                    if (geceYarisi<duration[key]['time']){
                        if(sonucGunlukSureDersli[sureDers]==null){
                            sonucGunlukSureDersli[sureDers] = Number(sureMiktar);
                        }else {
                            sonucGunlukSureDersli[sureDers] = sonucGunlukSureDersli[sureDers] + Number(sureMiktar);
                        }
                    }

                    // hafta içinde çalışılan süreyi derslere göre topla
                    if (gecenHafta<duration[key]['time']) {
                        if (sonucHaftalikDersli[sureDers] == null) {
                            sonucHaftalikDersli[sureDers] = Number(sureMiktar);
                        } else {
                            sonucHaftalikDersli[sureDers] = sonucHaftalikDersli[sureDers] + Number(sureMiktar);
                        }
                    }
                    // toplam çalışılan süreyi günlere göre topla
                    if (sonucDersli[sureTarih] == null) {
                        sonucDersli[sureTarih] = Number(sureMiktar);
                    } else {
                        sonucDersli[sureTarih] = sonucDersli[sureTarih] + Number(sureMiktar);
                    }

                    // girilen soru kayıtlarını topla
                    listeGirilenSureler[duration[key]['time']] = {
                        "tarih": sureTarih,
                        "saat": sureSaat,
                        "ders": sureDers,
                        "miktar": sureMiktar,
                        "key": key
                    }
                }

                // çözülen soru kayıtlarını listele
                $('#sorular').text(" ");
                for (var key in listeGirilenSorular) {
                    $('#sorular').append("<tr>\n" +
                        "<td>" + listeGirilenSorular[key].tarih + "<br>"+listeGirilenSorular[key].saat+"</td>\n" +
                        "<td>" + listeGirilenSorular[key].ders + "</td>\n" +
                        "<td>" + listeGirilenSorular[key].miktar + "</td>\n" +
                        "<td>" +
                        "<button type=\"button\" rel=\"tooltip\" title=\"\" class=\"btn btn-danger btn-link btn-sm\" data-original-title=\"Sil\" onclick=\"soruSil('" + listeGirilenSorular[key].key + "')\"'>" +
                        "<i class=\"material-icons\">close</i><div class=\"ripple-container\"></div></button>" +
                        "</td>\n" +
                        "</tr>");
                }

                // çalışma süresi kayıtlarını listele
                $('#sureler').text(" ");
                for (var key in listeGirilenSureler) {
                    $('#sureler').append("<tr>\n" +
                        "<td>" + listeGirilenSureler[key].tarih + "<br>"+listeGirilenSureler[key].saat+"</td>\n" +
                        "<td>" + listeGirilenSureler[key].ders + "</td>\n" +
                        "<td>" + listeGirilenSureler[key].miktar + "</td>\n" +
                        "<td>" +
                        "<button type=\"button\" rel=\"tooltip\" title=\"\" class=\"btn btn-danger btn-link btn-sm\" data-original-title=\"Sil\" onclick=\"sureSil('" + listeGirilenSureler[key].key + "')\"'>" +
                        "<i class=\"material-icons\">close</i><div class=\"ripple-container\"></div></button>" +
                        "</td>\n" +
                        "</tr>");
                }

                // toplanan günlük verileri derse göre bar grafiğe yazdır
                var gunlukDersler = [];
                var gunlukSorular = [];
                for (var key in sonucGunluk) {
                    if (sonucGunluk.hasOwnProperty(key)) {
                        gunlukDersler.push(key)
                        gunlukSorular.push(sonucGunluk[key]);
                    }
                }
                gunlukGrafikDersli(gunlukDersler, gunlukSorular);

                // toplanan haftalık verileri derse göre bar grafiğe yazdır
                var haftalikDersler = [];
                var haftalikSorular = [];
                for (var key in sonucHaftalik) {
                    if (sonucHaftalik.hasOwnProperty(key)) {
                        haftalikDersler.push(key)
                        haftalikSorular.push(sonucHaftalik[key]);
                    }
                }
                haftalikGrafik(haftalikDersler, haftalikSorular);

                // toplanan günlük verileri tarihe göre çizgi grafiğe yazdır
                var tarihler = [];
                var soruSayilari = [];
                for (var key in sonuc) {
                    if (sonuc.hasOwnProperty(key)) {
                        // Printing Keys
                        tarihler.push(key)
                        soruSayilari.push(sonuc[key]);
                    }
                }
                gunlukGrafik(tarihler, soruSayilari);

                // toplanan günlük çalışma sürelerini derse göre bar grafiğe yazdır
                var gunlukDerslerKonu = [];
                var gunlukSurelerKonu = [];
                for (key in sonucGunlukSureDersli){
                    if (sonucGunlukSureDersli.hasOwnProperty(key)) {
                        gunlukDerslerKonu.push(key)
                        gunlukSurelerKonu.push(sonucGunlukSureDersli[key]);
                    }
                }
                gunlukSureGrafikDersli(gunlukDerslerKonu,gunlukSurelerKonu);

                // toplanan haftalık çalışma sürelerini derse göre bar grafiğe yazdır
                var haftalikDerslerKonu = [];
                var haftalikSorularKonu = [];
                for (var key in sonucHaftalikDersli) {
                    if (sonucHaftalikDersli.hasOwnProperty(key)) {
                        haftalikDerslerKonu.push(key)
                        haftalikSorularKonu.push(sonucHaftalikDersli[key]);
                    }
                }
                haftalikSureGrafik(haftalikDerslerKonu, haftalikSorularKonu);

                // toplanan günlük çalışma sürelerini tarihe göre grafiğe yazdır
                var tarihlerKonu = [];
                var soruSayilariKonu = [];
                for (var key in sonucDersli) {
                    if (sonucDersli.hasOwnProperty(key)) {
                        // Printing Keys
                        tarihlerKonu.push(key)
                        soruSayilariKonu.push(sonucDersli[key]);
                    }
                }
                gunlukSureGrafik(tarihlerKonu, soruSayilariKonu);

                // TEMP örnek veriler
                var dersler = ['Matematik', 'Fizik', 'Kimya', 'İngilizce','Biyoloji'];
                var sureler = [9,4,5,2,7];
                var sorular = [3,7,3,8,5];


                var derslerGunlukSoruSure =[];
                var sorularGunlukSoruSure = [];
                var surelerGunlukSoruSure = [];

                guncelleGunlukSoruSure(dersler,sorular, sureler);
                guncelleHaftalikSoruSure(dersler,sorular,sureler);
                guncelleToplamSoruSure(dersler,sorular,sureler);
            });
        } else {
            // giriş yapılmamış ise giriş ekranına yönlendir
            window.location.href = "giris-yap.html";
            // console.log("oturum yok");
        }
    })


})

function soruSil(key) {
    firebase.database().ref("users/" + current_user).child("records").child(key).remove();
}

function sureSil(key) {
    firebase.database().ref("users/" + current_user).child("duration").child(key).remove();
}

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

function epochToTime(date) {
    var d = new Date(date),
        hours = '' + d.getHours(),
        minutes = '' + d.getMinutes(),
        seconds = d.getSeconds();

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return [hours, minutes, seconds].join(':');
}

/* her tarihe ait soru sayısını çizgi grafikte gösterir */
function gunlukGrafik(tarihler, soruSayilari) {
    var ctx = document.getElementById('kisiGecmisi').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tarihler,
            datasets: [{
                label: 'Çözülen Toplam Sorular',
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
                label: 'Son 7 Günde Çözülen Soru',
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

var d = new Date().getTime();
document.getElementById('todaySoru').innerText = epochToDate(d);
document.getElementById('todayKonu').innerText = epochToDate(d);


/* her derse ait soru sayısını bar grafikte gösterir */
function gunlukGrafikDersli(dersler, soruSayilari) {
    var ctx = document.getElementById('gunlukDers').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dersler,
            datasets: [{
                label: 'Bugün Çözülen Soru',
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

/* her tarihe ait çalışma süresini çizgi grafikte gösterir */
function gunlukSureGrafik(tarihler, sureler) {
    var ctx = document.getElementById('kisiGecmisiSure').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tarihler,
            datasets: [{
                label: 'Toplam Çalışılan Süre',
                data: sureler,
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

/* her derse ait çalışma süresini haftalık bar grafikte gösterir */
function haftalikSureGrafik(dersler, sureler) {
    var ctx = document.getElementById('haftalikDersSure').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dersler,
            datasets: [{
                label: 'Haftalık Çalışılan Süre',
                data: sureler,
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

/* her derse ait çalışma süresini günlük bar grafikte gösterir */
function gunlukSureGrafikDersli(dersler, sureler) {
    var ctx = document.getElementById('gunlukDersSure').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dersler,
            datasets: [{
                label: 'Bugün Çalışılan Süre',
                data: sureler,
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

/* her derse ait soru ve çalışma süresini günlük bar grafikte gösterir */
function guncelleGunlukSoruSure(dersler, sorular, sureler) {
    var ctx = document.getElementById('gunlukSoruSure').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data:{
            labels: dersler,
            datasets: [{
                label: 'Konu Çalışma Süresi',
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor:[
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)'

                ],
                borderWidth: 1,
                data: sureler
            },{
                label: 'Soru Çözme Süresi',
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor:[
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1,
                data: sorular
            }]

        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
}

/* her derse ait soru ve çalışma süresini haftalık bar grafikte gösterir */
function guncelleHaftalikSoruSure(dersler, sorular, sureler) {
    var ctx = document.getElementById('haftalikSoruSure').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data:{
            labels: dersler,
            datasets: [{
                label: 'Konu Çalışma Süresi',
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor:[
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)'

                ],
                borderWidth: 1,
                data: sureler
            },{
                label: 'Soru Çözme Süresi',
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor:[
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1,
                data: sorular
            }]

        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
}

/* her tarihe ait soru ve çalışma süresini çizgi grafikte gösterir */
function guncelleToplamSoruSure(dersler, sorular, sureler) {
    var ctx = document.getElementById('toplamSoruSure').getContext('2d');
    var myLine = new Chart.Line(ctx, {
        data: {
            labels: dersler,
            datasets: [{
                label: 'Konu Çalışma Süresi',
                borderColor: [
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth:1,
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)'
                ],
                fill: true,
                data: sureler,
                yAxisID: 'y-axis-1',
            }, {
                label: 'Soru Çözme Süresi',
                borderColor: [
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)'
                ],
                fill: true,
                data: sorular,
                yAxisID: 'y-axis-2'
            }]
        },
        options: {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            scales: {
                yAxes: [{
                    type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',ticks: {
                        beginAtZero: true
                    }
                }, {
                    type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: 'right',
                    id: 'y-axis-2',
                    ticks: {
                        beginAtZero: true
                    },

                    // grid line settings
                    gridLines: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                }],
            }
        }
    });
}