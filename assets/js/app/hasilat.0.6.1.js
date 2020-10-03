/* hasilat.js yapısı akış diyagramı
daha fazla bilgi için ~\docs\hasilat.js.md
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
            |                    |hasılat ekranı içeriği yükle|
            |                                 |
            +------------->DUR<---------------+
*/
// doküman yüklendiğinde çalış
$(document).ready(function () {
    // oturum kontrolü yap
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
            // hasılat ekranı içeriği yükle
            petek.hasilat.gunlukHasilatSoru();
            petek.hasilat.son7GunlukSoruHasilati();
            petek.hasilat.son7GunlukToplamHasilat();
            petek.hasilat.gunlukHasilatKonu();
            petek.hasilat.son7GunlukHasilat();
            petek.hasilat.son7GunlukPerformans();
            petek.hasilat.eklenenSorular();
            petek.hasilat.eklenenSureler();
        } else {
            // giriş yap ekrana yönlendir
            window.location.href = "giris-yap.html";
        }
    });
});