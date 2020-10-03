/* index.js yapısı akış diyagramı
daha fazla bilgi için ~\docs\index.js.md
                           |BAŞLA|
                              |
                              v
                    |doküman yüklendiğinde|
                              |
                              v
               +-0--+oturum kontrolü yap+--1-+
               |                             |
               v                             v
|giriş yap ekrana yönlendir|        |kullanıcı verilerini çek|
          |                                  |
          |                                  v
          |                        |üst menü içeriği yükle|
          |                                 |
          |                                 v
          +-------------->DUR<--------------+
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
            //üst menü içeriği yükle
            petek.navbar.hitap()
            petek.navbar.toplamSoru()

        } else {
            // giriş yapılmamış ise 'giriş yap' ekranına yönlendir
            window.location.href = "giris-yap.html";
        }
    })
})