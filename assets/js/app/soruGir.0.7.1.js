/* soruGir.js yapısı akış diyagramı
daha fazla bilgi için ~\docs\soruGir.js.md
                           |BAŞLA|
                              |
                              v
                    |doküman yüklendiğinde|
                              |
                              v
            +-0----+oturum kontrolü yap+-----1-+
            |                                  |
            v                                  v
|giriş yap ekrana yönlendir|        |kullanıcı verilerini çek|
            |                                  |
            |                                  v
            |                        |üst menü içeriği yükle|
            |                                  |
            |                                  v
            |                    |soru gir ekranı içeriği yükle|
            |                                 |
            +------------->DUR<---------------+
*/
// doküman yüklendiğinde çalış
$(document).ready(function () {
    // oturum kontolü yap
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // kullanıcı verilerini çek
            try {
                petek["veri"] = firebase.database().ref('/users/' + user.uid);
            } catch (e) {
                console.warn(e)
                petek['veri'] = {}
            }
            // üst menü içeriği yükle
            petek.navbar.hitap();
            petek.navbar.toplamSoru();
            // soru gir ekranı içeriği yükle
            petek.soruGir.soruSayisiGir();
            petek.soruGir.konuCalismaSuresiGir();
            petek.soruGir.denemeSinaviGir();
        } else {
            // giriş yap ekrana yönlendir
            window.location.href = "giris-yap.html";
        }
    })
})