/* global.js yapısı
daha fazla bilgi için ~\docs\global.js.md
             |BAŞLA
                |
                v
      |SSL Yönlendirmesi yap|
               |
               v
      |firebase ön tanımı yap|
                |
                v
    |firebase bağlantısı başlat|
                |
                v
  |doküman yüklendiğinde çalıştır|
                |
                v
|oturumu kapat butonuna tıklandığında|
                |
                v
          |oturumu kapat|
                |
                v
              |DUR|
*/



//  SSL yönlendirmesi yap
if (document.location.protocol != "https:" && document.location.protocol != "file:") {
    document.location.href = "https://" + window.location.hostname + document.location.pathname;
}

// firebase ön tanımı yap
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

// doküman yüklendiğinde çalıştır
$(document).ready(function () {
// oturumu kapat butonuna tıklandığıdna
    $("#logout").click(function () {
        // oturumu kapat
        petek.f.oturumuKapat()
    })
})