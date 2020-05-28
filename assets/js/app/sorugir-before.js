// firebase ön tanımları
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

// firebase bağlantısı başlat
firebase.initializeApp(config);

var current_user = "";


// doküman yüklendiğinde
$(document).ready(function () {

    // kullanıcı giriş değişkliği yokla
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            current_user = user.uid;

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

            var userRef = firebase.database().ref().child("users/" + current_user);
            userRef.on("value", function (snapshot) {
                if (snapshot.val()) {
                    guncelleAtif(snapshot.val().name, snapshot.val().surname)

                    // kullanıcı sınıf bilgisini tanımla
                    var grade = snapshot.val().grade
                    grade = Number(grade);

                    // sınıfa göre soru sayısı kısmına ders yükle
                    if (grade<9){
                        // lise öncesi dersleri yükle
                        $('#lesson').text('');
                        $('#lesson').append('<option value="------">------</option>' +
                            '<option value="Türkçe">Türkçe</option>' +
                            '<option value="Matematik">Matematik</option>' +
                            '<option value="Fen Bilimleri">Fen Bilimleri</option>' +
                            '<option value="İnkılap Tarihi">İnkılap Tarihi</option>' +
                            '<option value="Din Kültürü">Din Kültürü</option>' +
                            '<option value="Yabancı Dil">Yabancı Dil</option>');
                    }else {
                        // lise dersleri yükle
                        $('#lesson').text('');
                        $('#lesson').append('<option value="------">------</option>' +
                            '<option value="Matematik">Matematik</option>' +
                            '<option value="Geometri">Geometri</option>' +
                            '<option value="Fizik">Fizik</option>' +
                            '<option value="Kimya">Kimya</option>' +
                            '<option value="Biyoloji">Biyoloji</option>' +
                            '<option value="Türkçe">Türkçe</option>' +
                            '<option value="Edebiyat">Edebiyat</option>' +
                            '<option value="Tarih">Tarih</option>' +
                            '<option value="Coğrafya">Coğrafya</option>' +
                            '<option value="Din Kültürü">Din Kültürü</option>' +
                            '<option value="Felsefe">Felsefe</option>' +
                            '<option value="Yabancı Dil">Yabancı Dil</option>');
                    }

                    // sınıfa göre çalışma süresi kısmına ders yükle
                    if (grade<9){
                        // lise öncesi dersleri yükle
                        $('#lessonKonu').text('');
                        $('#lessonKonu').append('<option value="------">------</option>' +
                            '<option value="Türkçe">Türkçe</option>' +
                            '<option value="Matematik">Matematik</option>' +
                            '<option value="Fen Bilimleri">Fen Bilimleri</option>' +
                            '<option value="İnkılap Tarihi">İnkılap Tarihi</option>' +
                            '<option value="Din Kültürü">Din Kültürü</option>' +
                            '<option value="Yabancı Dil">Yabancı Dil</option>');
                    }else {
                        // lise dersleri yükle
                        $('#lessonKonu').text('');
                        $('#lessonKonu').append('<option value="------">------</option>' +
                            '<option value="Matematik">Matematik</option>' +
                            '<option value="Geometri">Geometri</option>' +
                            '<option value="Fizik">Fizik</option>' +
                            '<option value="Kimya">Kimya</option>' +
                            '<option value="Biyoloji">Biyoloji</option>' +
                            '<option value="Türkçe">Türkçe</option>' +
                            '<option value="Edebiyat">Edebiyat</option>' +
                            '<option value="Tarih">Tarih</option>' +
                            '<option value="Coğrafya">Coğrafya</option>' +
                            '<option value="Din Kültürü">Din Kültürü</option>' +
                            '<option value="Felsefe">Felsefe</option>' +
                            '<option value="Yabancı Dil">Yabancı Dil</option>');
                    }

                    switch (grade) {
                        case 8:
                            // dersleri güncelle
                            // konuları güncelle
                            console.log('yaşıyoruuuummmm')
                            $('#unit').text(' ');
                            $('#unit').append('<option value="0">naber</option>\n' +
                                '<option value="1">nasılsın</option>\n' +
                                '<option value="2">iyimisin</option>\n' +
                                '<option value="3">çokiyisin</option>');
                            break;
                    }
                }
            })

            // konular girişini biçimlendir
            /*
            $('#unit').select2({
                placeholder: 'Lütfen Seçiniz',
                allowClear: true
            });
            $('#unitKonu').select2({
                placeholder: 'Lütfen Seçiniz',
                allowClear: true
            });
            */

        } else {
            // giriş yapılmamış ise 'giriş yap' ekranına yönlendir
            window.location.href = "giris-yap.html";
        }
    })

    // zaman bilgisini güncelle
    anlikZamaniSoruGirKismindaGoster();
    anlikZamaniKonuCalismaSuresiGirKismindaGoster();
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

/** anlık zamanı soru gir kısmında gösterir
 *  muaz wrote with support by dilruba - 20200527-005746
 *  diyagram: https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgRyhiYcWfbGEpLS0-QVxuICBBW2FubMSxayB6YW1hbiBkZcSfZXJpIG9sdcWfdHVyXSAtLT4gQih0YXJpaGkgdGFuxLFtbGEpXG4gIEIgLS0-IEModGFyaWhpIHNvcnUgZ2lyIGvEsXNtxLFuZGEgZ8O2csO8bnTDvGxlKVxuICBDLS0-RChzYWF0aSB0YW7EsW1sYSlcbiAgRC0tPkUoc2FhdGkgc29ydSBnaXIga8Sxc23EsW5kYSBnw7Zyw7xudMO8bGUpXG4gIEUtLT5GKG1pbGlzYW5peWV5aSBnaXpsaSBlbGVtZW50ZSB0YW7EsW1sYSlcbiAgRi0tPkgoYml0aXIpIiwibWVybWFpZCI6eyJ0aGVtZSI6ImZvcmVzdCJ9fQ
 */
function anlikZamaniSoruGirKismindaGoster() {
    // anlık zaman değeri oluştur
    var d = new Date();

    // tarihi tanımla
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = '' + d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    // tarihi soru gir kısmında görüntüle
    document.getElementById("dateSoru").value = [year, month, day].join('-');

    // saati tanımla
    hours = '' + d.getHours();
    minutes = '' + d.getMinutes();
    seconds = '' + d.getSeconds();
    millisecond = '' + d.getMilliseconds();

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    switch (millisecond.length) {
        case 1:
            millisecond = '00' + millisecond;
            break;
        case 2:
            millisecond = '0' + millisecond;
            break;
    }

    // saati soru gir kısmında görüntüle
    document.getElementById('timeSoru').value = [hours, minutes, seconds].join(':');

    // milisaniyeyi gizli elemente tanımla
    document.getElementById('millisecondSoru').innerText = millisecond;
}

function anlikZamaniKonuCalismaSuresiGirKismindaGoster() {
    // anlık zaman değeri oluştur
    var d = new Date();

    // tarihi tanımla
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = '' + d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    // tarihi soru gir kısmında görüntüle
    document.getElementById("dateKonu").value = [year, month, day].join('-');

    // saati tanımla
    hours = '' + d.getHours();
    minutes = '' + d.getMinutes();
    seconds = '' + d.getSeconds();
    millisecond = '' + d.getMilliseconds();

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    switch (millisecond.length) {
        case 1:
            millisecond = '00' + millisecond;
            break;
        case 2:
            millisecond = '0' + millisecond;
            break;
    }

    // saati soru gir kısmında görüntüle
    document.getElementById('timeKonu').value = [hours, minutes, seconds].join(':');

    // milisaniyeyi gizli elemente tanımla
    document.getElementById('millisecondKonu').innerText = millisecond;
}