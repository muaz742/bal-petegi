/**
 * her sayfa üzerinde çalışacak olan kodlar
 */

//  SSL Yönlendirmesi
if (document.location.protocol != "https:" && document.location.protocol != "file:") {
    document.location.href = "https://" + window.location.hostname + document.location.pathname;
}

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
firebase.analytics();

var current_user = "";

/**
 * Global Fonksiyonlar
 */

// ekran üstünde kullanıcı adı ve soyadını göster
function guncelleAtif(isim, soyisim) {
    var kisi = isim + " " + soyisim;
    var mesaj = 'Süper Arı ' + kisi;
    $('#ekranAtif').text(mesaj);
}

// kişinin çözdüğü toplam soru sayısını hesapla
function hesaplaToplamSoruAtif(obje){
    var toplam = 0;
    for (key in obje){
        toplam = toplam+Number(obje[key].count);
    }
    var mesaj = 'Toplam '+toplam+' soru çözdün'
    $('#erkanAtifSoruSayisi').text(mesaj);
}

// Sayfa Yüklenmesi Tamamlandığında
$(document).ready(function () {
// oturumu kapat butonuna tıklandığıdna
    $("#logout").click(function () {
        firebase.auth().signOut()
            .then(function () {
                window.location.href = "giris-yap.html";
            })
    })
})