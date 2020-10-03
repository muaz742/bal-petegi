/* giris.js yapısı
daha fazla bilgi için ~\docs\girisYap.js.md
                                |BAŞLA|
                                   |
                                   v
               +-----+doküman yüklendiğinde çalış|------+
               |                                        |
               v                                        v
giriş yap butonuna tıklandığında        kayıt ol butonuna tıklandığında
               |                                        |
               v                                        v
           oturum aç                                kayıt ol
               |                                        |
               +----------------->DUR<------------------+
*/
// doküman yüklendiğinde çalış
$(document).ready(function () {

    // giriş yap butonuna tıklandığında
    $('#loginBtn').click(function () {
        var email = $('#email').val();
        var password = $('#password').val();
        // oturum aç
        petek.girisYap.girisYap(email,password)
    })

    // kayıt ol butonuna tıklandığnda
    $('#registerBtn').click(function () {
        var email = $('#emailReg').val();
        var password = $('#passwordReg').val();
        // kayıt ol
        petek.girisYap.kayitOl(email,password)
    })
})