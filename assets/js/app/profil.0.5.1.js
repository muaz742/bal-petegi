/* profil.js yapısı
daha fazla bilgi için ~\docs\profil.js.md
                           |BAŞLA|
                              |
                              v
                    |doküman yüklendiğinde|
                              |
                              v
            +-0----+oturum kontrolü yap+----1-+
            |                                 |
            v                                 v
|giriş yap ekrana yönlendir|        |kullanıcı verilerini çek|
            |                                 |
            |                                 v
            |                        |üst menü içeriği yükle|
            |                                 |
            |                                 v
            |                     |profil ekranı içeriği yükle|
            |                                 |
            |                                 v
            |                    |kaydet butonuna tıklandığında|
            |                                 |
            |                                 v
            |                     |profil bilgilerini güncelle|
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
            // profil ekranı içeriği yükle
            petek.ui.guncelleProfilBilgileri()
        } else {
            // giriş yap ekrana yönlendir
            window.location.href = "giris-yap.html";
        }
    })
    // kaydet butonuna tıklandığında
    $("#saveProfileBtn").click(function () {
        var name = $('#name').val()
        var surname = $('#surname').val()
        var city = $('#city').val()
        var grade = $('#grade').val()
        var birthdate = $('#birthdate').val()

        // profil bilgilerini güncelle
        petek.profil.kaydet(name,surname,city,grade,birthdate)

        alert("Bilgiler Güncellendi 👍")
    });
})