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

            // kullanıcı kayıtlarını çek
            var users = firebase.database().ref().child('users').child(current_user);
            users.on('value', function (snapshot) {

                // kullanıcı isim ve soyismini ekranda göster
                guncelleAtif(snapshot.val().name, snapshot.val().surname)

                // soru kayıtlarını çek
                var shot = snapshot.val()['records'];
                try {
                    var keys = Object.keys(shot);
                } catch (e) {
                    console.warn(e);
                }
                // konu kayıtlarını çek
                var duration = snapshot.val()['duration'];

                // değişkenleri tanımla
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
                try {

                    // her kayıt için çalış
                    for (i = 0; i < keys.length; i++) {

                        // zaman kaydını al, tarihe dönüştür
                        var tarih = epochToDate(shot[keys[i]]['time']);
                        var tarihEpoch = shot[keys[i]]['time'];
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
                        if (shot[keys[i]]['time'] > gecenHafta) {
                            if (sonuc[tarih] == null) {
                                sonuc[tarih] = Number(miktar);
                            } else {
                                sonuc[tarih] = sonuc[tarih] + Number(miktar);
                            }
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
                } catch (e) {
                    console.warn(e);
                }

                // süre kayıtlarını işle
                try{
                    // her kayıt için çalış
                    for (key in duration) {

                        // ders kaydını al
                        var sureDers = duration[key]['lesson'];

                        // süre miktarını al
                        var sureMiktar = duration[key]['count'];

                        // zaman kaydını al, tarihe dönüştür
                        var sureTarih = epochToDate(duration[key]['time']);
                        var sureSaat = epochToTime(duration[key]['time']);

                        // gün içinde çalışılan süreleri derslere göre topla
                        if (geceYarisi < duration[key]['time']) {
                            if (sonucGunlukSureDersli[sureDers] == null) {
                                sonucGunlukSureDersli[sureDers] = Number(sureMiktar);
                            } else {
                                sonucGunlukSureDersli[sureDers] = sonucGunlukSureDersli[sureDers] + Number(sureMiktar);
                            }
                        }

                        // hafta içinde çalışılan süreyi derslere göre topla
                        if (gecenHafta < duration[key]['time']) {
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
                }catch (e) {
                    console.warn(e);
                }

                // çözülen soru kayıtlarını listele
                $('#sorular').text(" ");
                for (var key in listeGirilenSorular) {
                    $('#sorular').append("<tr>\n" +
                        "<td>" + listeGirilenSorular[key].tarih + "<br>" + listeGirilenSorular[key].saat + "</td>\n" +
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
                        "<td>" + listeGirilenSureler[key].tarih + "<br>" + listeGirilenSureler[key].saat + "</td>\n" +
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

                // son bir haftayı tanımla
                var sonBirHafta = {};
                var i = 0;
                var gun = new Date();
                gun.setDate(gun.getDate() - 7);
                while (i < 7) {
                    gun.setDate(gun.getDate() + 1);
                    var result = epochToDate(gun);
                    sonBirHafta[result] = 0;
                    i++;
                }

                // sonucu son hafta kaydı üzerine işle
                for (key in sonuc) {
                    if (sonuc.hasOwnProperty(key)) {
                        if (sonBirHafta.hasOwnProperty(key)) {
                            sonBirHafta[key] = sonuc[key];
                        }
                    }
                }

                // toplanan günlük verileri tarihe göre çizgi grafiğe yazdır
                var tarihler = [];
                var soruSayilari = [];
                for (var key in sonBirHafta) {
                    if (sonBirHafta.hasOwnProperty(key)) {
                        tarihler.push(key)
                        soruSayilari.push(sonBirHafta[key]);
                    }
                }

                gunlukGrafik(tarihler, soruSayilari);

                // toplanan günlük çalışma sürelerini derse göre bar grafiğe yazdır
                var gunlukDerslerKonu = [];
                var gunlukSurelerKonu = [];
                for (key in sonucGunlukSureDersli) {
                    if (sonucGunlukSureDersli.hasOwnProperty(key)) {
                        gunlukDerslerKonu.push(key)
                        gunlukSurelerKonu.push(sonucGunlukSureDersli[key]);
                    }
                }
                gunlukSureGrafikDersli(gunlukDerslerKonu, gunlukSurelerKonu);

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

                // toplanan günlük çalışma sürelerini tarihe göre çizgi grafiğe yazdır
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
                var dersler = ['Matematik', 'Fizik', 'Kimya', 'İngilizce', 'Biyoloji'];
                var tarihler = ['25.5.2020', '26.5.2020', '27.5.2020'];
                var sureler = [9, 4, 5, 2, 7];
                var sorular = [3, 7, 3, 8, 5];


                // konu-soru sürelerini grafiklere yazdır
                var derslerGunlukSoruSure = [];
                var sorularGunlukSoruSure = [];
                var surelerGunlukSoruSure = [];

                guncelleGunlukSoruSure(dersler, sorular, sureler);
                guncelleHaftalikSoruSure(dersler, sorular, sureler);
                guncelleToplamSoruSure(tarihler, sorular, sureler);


                /* günlü grafikler altına tarih göster */
                var d = new Date().getTime();
                document.getElementById('todaySoru').innerText = epochToDate(d);
                document.getElementById('todayKonu').innerText = epochToDate(d);
            });
        } else {
            // giriş yapılmamış ise giriş ekranına yönlendir
            window.location.href = "giris-yap.html";
        }
    });
});

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
                label: 'Çözülen Toplam Soru',
                data: soruSayilari,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(40, 160, 58, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgb(40, 160, 58, 1)'
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
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(64, 255, 96, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(64, 255, 96, 1)'
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
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(64, 255, 96, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(64, 255, 96, 1)'
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
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(64, 255, 96, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(64, 255, 96, 1)'
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
        data: {
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
                borderColor: [
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
            }, {
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
                borderColor: [
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
        data: {
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
                borderColor: [
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
            }, {
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
                borderColor: [
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
                borderWidth: 1,
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
                    id: 'y-axis-1', ticks: {
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

// ekran üstünde kullanıcı adı ve soyadını göster
function guncelleAtif(isim, soyisim) {
    var kisi = isim + " " + soyisim;
    var mesaj = 'Süper Arı ' + kisi;
    $('#ekranAtif').text(mesaj);
}