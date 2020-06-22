// doküman yüklendiğinde
$(document).ready(function () {

    // kullanıcı giriş değişkliği yokla
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            current_user = user.uid;

            $("#addQuestionBtn").click(function () {
                var lesson = $('#lesson').val();
                var unit = unit = $('#unit').val();
                ;
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
                        time: date,
                        unit: unit
                    }
                );

                $("#questionCount").val('');
                $('#minutesSoru').val('');
                anlikZamaniSoruGirKismindaGoster();
            });

            $("#addLessonDuration").click(function () {
                var subject = $('#lessonKonu').val()
                var unit = $('#unitKonu').val()
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
                        time: date,
                        unit: unit
                    }
                );

                alert("Çalışma Süresi Eklendi 👍")

                $("#questionCount").val('');
                anlikZamaniKonuCalismaSuresiGirKismindaGoster();

            });

            $('#addPilotTest').click(function () {
                var sinavTipi = $('#tipDeneme').val()
                var dogru = $('#denemeDogru').val()
                var yanlis = $('#denemeYanlis').val()
                var bos = $('#denemeBos').val();
                var date = $('#dateDeneme').val();
                var time = $('#timeDeneme').val();
                var millisecond = document.getElementById('millisecondDeneme').text;
                date = new Date(date + ' ' + time).getTime();
                date = date + Number(millisecond);
                firebase.database().ref().child("users").child(current_user).child("test").push(
                    {
                        type: sinavTipi,
                        correct: dogru,
                        mistake: yanlis,
                        blank: bos,
                        time: date
                    }
                );

                alert("Deneme Sınavı Kaydı Eklendi 👍")

                $("#denemeDogru").val('');
                $("#denemeYanlis").val('');
                $("#denemeBos").val('');
                anlikZamaniDenemeKaydiGirKismindaGoster();
            });

            var userRef = firebase.database().ref().child("users/" + current_user);
            userRef.on("value", function (snapshot) {
                if (snapshot.val()) {
                    try{
                        guncelleAtif(snapshot.val().name, snapshot.val().surname)
                        hesaplaToplamSoruAtif(snapshot.val()['records'])
                    }catch (e) {
                        console.warn(e)
                    }

                    // kullanıcı sınıf bilgisini tanımla
                    var grade = snapshot.val().grade
                    grade = Number(grade);

                    // sınıfa göre soru sayısı kısmına ders yükle
                    if (grade < 9) {
                        // lise öncesi dersleri yükle
                        $('#lesson').text('');
                        $('#lesson').append('<option value="------">------</option>' +
                            '<option value="Türkçe">Türkçe</option>' +
                            '<option value="Matematik">Matematik</option>' +
                            '<option value="Fen Bilimleri">Fen Bilimleri</option>' +
                            '<option value="İnkılap Tarihi">İnkılap Tarihi</option>' +
                            '<option value="Din Kültürü">Din Kültürü</option>' +
                            '<option value="Yabancı Dil">Yabancı Dil</option>');
                        $('#lesson').removeAttr('disabled');
                    } else {
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
                            '<option value="Psikoloji">Psikoloji</option>' +
                            '<option value="Sosyoloji">Sosyoloji</option>' +
                            '<option value="Yabancı Dil">Yabancı Dil</option>');
                        $('#lesson').removeAttr('disabled');
                    }

                    // sınıfa göre çalışma süresi kısmına ders yükle
                    if (grade < 9) {
                        // lise öncesi dersleri yükle
                        $('#lessonKonu').text('');
                        $('#lessonKonu').append('<option value="------">------</option>' +
                            '<option value="Türkçe">Türkçe</option>' +
                            '<option value="Matematik">Matematik</option>' +
                            '<option value="Fen Bilimleri">Fen Bilimleri</option>' +
                            '<option value="İnkılap Tarihi">İnkılap Tarihi</option>' +
                            '<option value="Din Kültürü">Din Kültürü</option>' +
                            '<option value="Yabancı Dil">Yabancı Dil</option>');
                        $('#lessonKonu').removeAttr('disabled')
                    } else {
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
                            '<option value="Psikoloji">Psikoloji</option>' +
                            '<option value="Sosyoloji">Sosyoloji</option>' +
                            '<option value="Yabancı Dil">Yabancı Dil</option>');
                        $('#lessonKonu').removeAttr('disabled')
                    }

                    // sınıf bilgisi yok ise uyarı göster
                    if (isNaN(grade)) {
                        $('#lesson').text('');
                        $('#lesson').append('<option value="------">Sınıf Bilgisi Güncellenmeli ‼️</option>');
                        $('#lessonKonu').text('');
                        $('#lessonKonu').append('<option value="------">Sınıf Bilgisi Güncellenmeli ‼️</option>');
                    }
                }

                // derse göre soru sayısı kısmına konu yükle
                $('#lesson').on('change', function () {
                    if (grade < 9) {
                        // LGS sınav konuları yükle
                        switch ($(this).val()) {
                            case "Türkçe":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Sözcükte Anlam">Sözcükte Anlam</option>\n' +
                                    '<option value="Cümlede Anlam">Cümlede Anlam</option>\n' +
                                    '<option value="Deyimler ve Atasözleri">Deyimler ve Atasözleri</option>\n' +
                                    '<option value="Parçada Anlam">Parçada Anlam</option>\n' +
                                    '<option value="Ses Bilgisi">Ses Bilgisi</option>\n' +
                                    '<option value="Yazım Kuralları">Yazım Kuralları</option>\n' +
                                    '<option value="Noktalama İşaretleri">Noktalama İşaretleri</option>\n' +
                                    '<option value="Fiilimsi">Fiilimsi</option>\n' +
                                    '<option value="Cümlenin Ögeleri">Cümlenin Ögeleri</option>\n' +
                                    '<option value="Cümle Vurgusu">Cümle Vurgusu</option>\n' +
                                    '<option value="Fiillerde Çatı">Fiillerde Çatı</option>\n' +
                                    '<option value="Cümle Çeşitleri">Cümle Çeşitleri</option>\n' +
                                    '<option value="Anlatım Bozuklukları">Anlatım Bozuklukları</option>\n' +
                                    '<option value="Söz Sanatları">Söz Sanatları</option>\n' +
                                    '<option value="Yazı (Metin) Türleri">Yazı (Metin) Türleri</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Matematik":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Çarpanlar ve Katlar">Çarpanlar ve Katlar</option>\n' +
                                    '<option value="Üslü İfadeler">Üslü İfadeler</option>\n' +
                                    '<option value="Kareköklü İfadeler">Kareköklü İfadeler</option>\n' +
                                    '<option value="Veri Analizi">Veri Analizi</option>\n' +
                                    '<option value="Basit Olayların Olma Olasılığı">Basit Olayların Olma Olasılığı</option>\n' +
                                    '<option value="Cebirsel İfadeler ve Özdeşlikler">Cebirsel İfadeler ve Özdeşlikler</option>\n' +
                                    '<option value="Doğrusal Denklemler">Doğrusal Denklemler</option>\n' +
                                    '<option value="Eşitsizlikler">Eşitsizlikler</option>\n' +
                                    '<option value="Üçgenler">Üçgenler</option>\n' +
                                    '<option value="Eşlik Benzerlik">Eşlik Benzerlik</option>\n' +
                                    '<option value="Dönüşüm Geometrisi">Dönüşüm Geometrisi</option>\n' +
                                    '<option value="Geometrik Cisimler">Geometrik Cisimler</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Fen Bilimleri":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Mevsimler ve İklim">Mevsimler ve İklim</option>\n' +
                                    '<option value="DNA ve Genetik Kod">DNA ve Genetik Kod</option>\n' +
                                    '<option value="Basınç">Basınç</option>\n' +
                                    '<option value="Madde ve Endüstri">Madde ve Endüstri</option>\n' +
                                    '<option value="Basit Makineler">Basit Makineler</option>\n' +
                                    '<option value="Enerji Dönüşümleri ve Çevre Bilimi">Enerji Dönüşümleri ve Çevre Bilimi</option>\n' +
                                    '<option value="Elektrik Yükleri ve Elektrik Enerjisi">Elektrik Yükleri ve Elektrik Enerjisi</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "İnkılap Tarihi":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Bir Kahraman Doğuyor">Bir Kahraman Doğuyor</option>\n' +
                                    '<option value="Milli Uyanış: Bağımsızlık Yolunda Atılan Adımlar">Milli Uyanış: Bağımsızlık Yolunda Atılan Adımlar</option>\n' +
                                    '<option value="Milli Bir Destan: Ya İstiklal Ya Ölüm!">Milli Bir Destan: Ya İstiklal Ya Ölüm!</option>\n' +
                                    '<option value="Atatürkçülük ve Çağdağlaşan Türkiye">Atatürkçülük ve Çağdağlaşan Türkiye</option>\n' +
                                    '<option value="Demokratikleşme Çabaları">Demokratikleşme Çabaları</option>\n' +
                                    '<option value="Atatürk Dönemi Türk Dış Politikası">Atatürk Dönemi Türk Dış Politikası</option>\n' +
                                    '<option value="Atatürk\'ün Ölümü ve Sonrası">Atatürk\'ün Ölümü ve Sonrası</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Din Kültürü":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Kader İnancı">Kader İnancı</option>\n' +
                                    '<option value="Zekat ve Sadaka">Zekat ve Sadaka</option>\n' +
                                    '<option value="Din ve Hayat">Din ve Hayat</option>\n' +
                                    '<option value="Hz.Muhammed\'in Örnekliği">Hz.Muhammed\'in Örnekliği</option>\n' +
                                    '<option value="Kur\'an-ı Kerim ve Özellikleri">Kur\'an-ı Kerim ve Özellikleri</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Yabancı Dil":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Friendship">Friendship</option>\n' +
                                    '<option value="Teen Life">Teen Life</option>\n' +
                                    '<option value="In The Kitchen">In The Kitchen</option>\n' +
                                    '<option value="On The Phone ">On The Phone </option>\n' +
                                    '<option value="The Internet">The Internet</option>\n' +
                                    '<option value="Adventures">Adventures</option>\n' +
                                    '<option value="Tourism">Tourism</option>\n' +
                                    '<option value="Chores">Chores</option>\n' +
                                    '<option value="Science">Science</option>\n' +
                                    '<option value="Natural Forces">Natural Forces</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            default:
                                $('#unit').text(' ');
                                console.warn('Derse seçimine ait konu bulunamadı!')
                                break;
                        }
                    } else {
                        // TYT-AYT sınav konuları yükle
                        switch ($(this).val()) {
                            case "Matematik":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Sayılar">Sayılar</option>\n' +
                                    '<option value="Rasyonel ve Ondalık Sayılar">Rasyonel ve Ondalık Sayılar</option>\n' +
                                    '<option value="Bölme ve Bölünebilme, OBEB, OKEK">Bölme ve Bölünebilme, OBEB, OKEK</option>\n' +
                                    '<option value="Denklem Çözme, Eşitsizlikler ve Mutlak Değer">Denklem Çözme, Eşitsizlikler ve Mutlak Değer</option>\n' +
                                    '<option value="Üslü - Köklü İfadeler">Üslü - Köklü İfadeler</option>\n' +
                                    '<option value="Çarpanlara Ayırma ve Özdeşlikler">Çarpanlara Ayırma ve Özdeşlikler</option>\n' +
                                    '<option value="Oran – Orantı">Oran – Orantı</option>\n' +
                                    '<option value="Problemler">Problemler</option>\n' +
                                    '<option value="Kümeler">Kümeler</option>\n' +
                                    '<option value="Fonksiyonlar">Fonksiyonlar</option>\n' +
                                    '<option value="Permütasyon – Kombinasyon – Binom - Olasılık">Permütasyon – Kombinasyon – Binom - Olasılık</option>\n' +
                                    '<option value="Veri Analizi">Veri Analizi</option>\n' +
                                    '<option value="Polinomlar">Polinomlar</option>\n' +
                                    '<option value="İkinci Dereceden Denklemler">İkinci Dereceden Denklemler</option>\n' +
                                    '<option value="Karmaşık Sayılar">Karmaşık Sayılar</option>\n' +
                                    '<option value="Mantık">Mantık</option>\n' +
                                    '<option value="Parabol">Parabol</option>\n' +
                                    '<option value="Logaritma">Logaritma</option>\n' +
                                    '<option value="Trigonometri">Trigonometri</option>\n' +
                                    '<option value="Diziler ve Seriler">Diziler ve Seriler</option>\n' +
                                    '<option value="Limit ve Süreklilik">Limit ve Süreklilik</option>\n' +
                                    '<option value="Türev">Türev</option>\n' +
                                    '<option value="İntegral">İntegral</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Geometri":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Geometrik Kavramlar">Geometrik Kavramlar</option>\n' +
                                    '<option value="Açılar">Açılar</option>\n' +
                                    '<option value="Üçgenler">Üçgenler</option>\n' +
                                    '<option value="Çokgenler ve Dörtgenler">Çokgenler ve Dörtgenler</option>\n' +
                                    '<option value="Çember ve Daire">Çember ve Daire</option>\n' +
                                    '<option value="Noktanın ve Doğrunun Analitik İncelemesi">Noktanın ve Doğrunun Analitik İncelemesi</option>\n' +
                                    '<option value="Katı Cisimler">Katı Cisimler</option>\n' +
                                    '<option value="Trigonometri">Trigonometri</option>\n' +
                                    '<option value="Analitik Geometri">Analitik Geometri</option>\n' +
                                    '<option value="Çemberin Analitik İncelemesi">Çemberin Analitik İncelemesi</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Fizik":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Fizik Bilimi">Fizik Bilimi</option>\n' +
                                    '<option value="Madde ve Özellikleri">Madde ve Özellikleri</option>\n' +
                                    '<option value="Isı ve Sıcaklık">Isı ve Sıcaklık</option>\n' +
                                    '<option value="Basınç ve Kaldırma Kuvveti">Basınç ve Kaldırma Kuvveti</option>\n' +
                                    '<option value="Kuvvet ve Hareket">Kuvvet ve Hareket</option>\n' +
                                    '<option value="İş, Güç, Enerji">İş, Güç, Enerji</option>\n' +
                                    '<option value="Elektrostatik">Elektrostatik</option>\n' +
                                    '<option value="Elektrik ve Manyetizma">Elektrik ve Manyetizma</option>\n' +
                                    '<option value="Optik">Optik</option>\n' +
                                    '<option value="Dalgalar">Dalgalar</option>\n' +
                                    '<option value="Dalga Mekaniği">Dalga Mekaniği</option>\n' +
                                    '<option value="Modern Fizik">Modern Fizik</option>\n' +
                                    '<option value="Atom Fiziğine Giriş ve Radyoaktivite">Atom Fiziğine Giriş ve Radyoaktivite</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Kimya":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Kimya Bilimi">Kimya Bilimi</option>\n' +
                                    '<option value="Atomun Yapısı">Atomun Yapısı</option>\n' +
                                    '<option value="Periyodik Sistem">Periyodik Sistem</option>\n' +
                                    '<option value="Kimyasal Türler Arası Etkileşimler">Kimyasal Türler Arası Etkileşimler</option>\n' +
                                    '<option value="Kimyanın Temel Kanunları">Kimyanın Temel Kanunları</option>\n' +
                                    '<option value="Maddenin Halleri">Maddenin Halleri</option>\n' +
                                    '<option value="Asitler, Bazlar ve Tuzlar">Asitler, Bazlar ve Tuzlar</option>\n' +
                                    '<option value="Karışımlar">Karışımlar</option>\n' +
                                    '<option value="Modern Atom Teorisi">Modern Atom Teorisi</option>\n' +
                                    '<option value="Kimyasal Hesaplamalar">Kimyasal Hesaplamalar</option>\n' +
                                    '<option value="Gazlar">Gazlar</option>\n' +
                                    '<option value="Sıvı Çözeltiler">Sıvı Çözeltiler</option>\n' +
                                    '<option value="Kimya ve Enerji">Kimya ve Enerji</option>\n' +
                                    '<option value="Tepkimelerde Hız ve Denge">Tepkimelerde Hız ve Denge</option>\n' +
                                    '<option value="Kimya ve Elektrik">Kimya ve Elektrik</option>\n' +
                                    '<option value="Karbon Kimyasına Giriş">Karbon Kimyasına Giriş</option>\n' +
                                    '<option value="Organik Kimya">Organik Kimya</option>\n' +
                                    '<option value="Hayatımızda Kimya">Hayatımızda Kimya</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Biyoloji":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Biyoloji Bilimi">Biyoloji Bilimi</option>\n' +
                                    '<option value="Canlıların Ortak Özellikleri">Canlıların Ortak Özellikleri</option>\n' +
                                    '<option value="Canlıların Temel Bileşenleri">Canlıların Temel Bileşenleri</option>\n' +
                                    '<option value="Canlıların Çeşitliliği ve Sınıflandırılması">Canlıların Çeşitliliği ve Sınıflandırılması</option>\n' +
                                    '<option value="Hücre ve Yapısı">Hücre ve Yapısı</option>\n' +
                                    '<option value="Hücre Bölünmeleri ve Üreme Çeşitleri">Hücre Bölünmeleri ve Üreme Çeşitleri</option>\n' +
                                    '<option value="Kalıtım">Kalıtım</option>\n' +
                                    '<option value="Ekosistem Ekolojisi">Ekosistem Ekolojisi</option>\n' +
                                    '<option value="Sinir Sistemi">Sinir Sistemi</option>\n' +
                                    '<option value="Endokrin Sistemi">Endokrin Sistemi</option>\n' +
                                    '<option value="Duyu Organları">Duyu Organları</option>\n' +
                                    '<option value="Destek ve Hareket Sistemi">Destek ve Hareket Sistemi</option>\n' +
                                    '<option value="Sindirim Sistemi">Sindirim Sistemi</option>\n' +
                                    '<option value="Dolaşım Sistemi">Dolaşım Sistemi</option>\n' +
                                    '<option value="Vücudun Savunulması ve Bağışıklık">Vücudun Savunulması ve Bağışıklık</option>\n' +
                                    '<option value="Solunum Sistemi">Solunum Sistemi</option>\n' +
                                    '<option value="Boşaltım Sistemi">Boşaltım Sistemi</option>\n' +
                                    '<option value="Üreme Sistemi ve Embriyonik Gelişim">Üreme Sistemi ve Embriyonik Gelişim</option>\n' +
                                    '<option value="Genden Proteine">Genden Proteine</option>\n' +
                                    '<option value="Biyoteknoloji ve Gen Mühendisliği">Biyoteknoloji ve Gen Mühendisliği</option>\n' +
                                    '<option value="Solunum">Solunum</option>\n' +
                                    '<option value="Fotosentez - Kemosentez ">Fotosentez - Kemosentez </option>\n' +
                                    '<option value="Bitki Biyolojisi">Bitki Biyolojisi</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Türkçe":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Sözcük ve Söz Öbeklerinde Anlam">Sözcük ve Söz Öbeklerinde Anlam</option>\n' +
                                    '<option value="Cümlenin Anlamı ve Yorumu">Cümlenin Anlamı ve Yorumu</option>\n' +
                                    '<option value="Anlatım Bilgisi">Anlatım Bilgisi</option>\n' +
                                    '<option value="Paragraf Bilgisi">Paragraf Bilgisi</option>\n' +
                                    '<option value="Ses Bilgisi-Yazım-Noktalama">Ses Bilgisi-Yazım-Noktalama</option>\n' +
                                    '<option value="Sözcükte Yapı (Ad, Sıfat, Zamir, Fiil...)">Sözcükte Yapı (Ad, Sıfat, Zamir, Fiil...)</option>\n' +
                                    '<option value="Sözcük Türleri">Sözcük Türleri</option>\n' +
                                    '<option value="Cümlenin Ögeleri">Cümlenin Ögeleri</option>\n' +
                                    '<option value="Cümle Türleri">Cümle Türleri</option>\n' +
                                    '<option value="Anlatım Bozuklukları">Anlatım Bozuklukları</option>\n' +
                                    '<option value="İletişim, Dil ve Kültür – Dillerin sınıflandırılması">İletişim, Dil ve Kültür – Dillerin sınıflandırılması</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Edebiyat":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Güzel Sanatlar ve Edebiyat">Güzel Sanatlar ve Edebiyat</option>\n' +
                                    '<option value="Coşku ve Heyecan Dile Getiren Metinler (Şiir)">Coşku ve Heyecan Dile Getiren Metinler (Şiir)</option>\n' +
                                    '<option value="Olay Çevresinde Oluşan Edebi Metinler">Olay Çevresinde Oluşan Edebi Metinler</option>\n' +
                                    '<option value="Öğretici Metinler (Edebiyat 9. Sınıf)">Öğretici Metinler (Edebiyat 9. Sınıf)</option>\n' +
                                    '<option value="Tarih İçinde Türk Edebiyatı">Tarih İçinde Türk Edebiyatı</option>\n' +
                                    '<option value="Destan Dönemi Türk Edebiyatı">Destan Dönemi Türk Edebiyatı</option>\n' +
                                    '<option value="İslam Uygarlığı Çevresinde Gelişen Türk Edebiyatı">İslam Uygarlığı Çevresinde Gelişen Türk Edebiyatı</option>\n' +
                                    '<option value="Batı Tesirindeki Türk Edebiyatına Giriş (Yenileşme Dönemi Türk Edebiyatı)">Batı Tesirindeki Türk Edebiyatına Giriş (Yenileşme Dönemi Türk Edebiyatı)</option>\n' +
                                    '<option value="Tanzimat Dönemi Edebiyatı (1860-1896)">Tanzimat Dönemi Edebiyatı (1860-1896)</option>\n' +
                                    '<option value="Servet-i Fünun Edebiyatı (Edebiyat-ı Cedide) (1896-1901) ve Fecr-i Ati Topluluğu (1909-1912)">Servet-i Fünun Edebiyatı (Edebiyat-ı Cedide) (1896-1901) ve Fecr-i Ati Topluluğu (1909-1912)</option>\n' +
                                    '<option value="Milli Edebiyat Dönemi (1911-1923)">Milli Edebiyat Dönemi (1911-1923)</option>\n' +
                                    '<option value="Cumhuriyet Dönemi Türk Edebiyatı (1923-…)">Cumhuriyet Dönemi Türk Edebiyatı (1923-…)</option>\n' +
                                    '<option value="Cumhuriyet Döneminde Öğretici Metinler">Cumhuriyet Döneminde Öğretici Metinler</option>\n' +
                                    '<option value="Cumhuriyet Döneminde Coşku ve Heyecanı Dile Getiren Metinler (Şiir)">Cumhuriyet Döneminde Coşku ve Heyecanı Dile Getiren Metinler (Şiir)</option>\n' +
                                    '<option value="Cumhuriyet Döneminde Olay Çevresinde Oluşan Edebi Metinler">Cumhuriyet Döneminde Olay Çevresinde Oluşan Edebi Metinler</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Tarih":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Tarih Bilimine Giriş">Tarih Bilimine Giriş</option>\n' +
                                    '<option value="Uygarlığın Doğuşu ve İlk Uygarlıklar">Uygarlığın Doğuşu ve İlk Uygarlıklar</option>\n' +
                                    '<option value="İlk Türk Devletleri">İlk Türk Devletleri</option>\n' +
                                    '<option value="İslam Tarihi ve Uygarlığı">İslam Tarihi ve Uygarlığı</option>\n' +
                                    '<option value="Türk - İslam Devletleri">Türk - İslam Devletleri</option>\n' +
                                    '<option value="Ortaçağda Avrupa">Ortaçağda Avrupa</option>\n' +
                                    '<option value="Türkiye Tarihi">Türkiye Tarihi</option>\n' +
                                    '<option value="Beylikten Devlete (1300-1453)">Beylikten Devlete (1300-1453)</option>\n' +
                                    '<option value="Dünya Gücü: Osmanlı Devleti (1453-1600)">Dünya Gücü: Osmanlı Devleti (1453-1600)</option>\n' +
                                    '<option value="Osmanlı Kültür ve Uygarlığı">Osmanlı Kültür ve Uygarlığı</option>\n' +
                                    '<option value="Yeni Çağda Avrupa">Yeni Çağda Avrupa</option>\n' +
                                    '<option value="Arayış Yılları (17.yy)">Arayış Yılları (17.yy)</option>\n' +
                                    '<option value="Yüzyılda Diplomasi ve Değişim">Yüzyılda Diplomasi ve Değişim</option>\n' +
                                    '<option value="Yakın Çağ Avrupası">Yakın Çağ Avrupası</option>\n' +
                                    '<option value="En Uzun Yüzyıl (1800-1922)">En Uzun Yüzyıl (1800-1922)</option>\n' +
                                    '<option value="1881’den 1919’a Mustafa Kemal">1881’den 1919’a Mustafa Kemal</option>\n' +
                                    '<option value="Milli Mücadelenin Hazırlık Dönemi">Milli Mücadelenin Hazırlık Dönemi</option>\n' +
                                    '<option value="Kurtuluş Savaşında Cepheler">Kurtuluş Savaşında Cepheler</option>\n' +
                                    '<option value="Türk İnkılabı">Türk İnkılabı</option>\n' +
                                    '<option value="Atatürkçülük ve Atatürk İlkeleri">Atatürkçülük ve Atatürk İlkeleri</option>\n' +
                                    '<option value="Atatürk Dönemi Dış Politika">Atatürk Dönemi Dış Politika</option>\n' +
                                    '<option value="Atatürk’ün Ölümü">Atatürk’ün Ölümü</option>\n' +
                                    '<option value="Yüzyılın Başlarında Dünya">Yüzyılın Başlarında Dünya</option>\n' +
                                    '<option value="İkinci Dünya Savaşı">İkinci Dünya Savaşı</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Coğrafya":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Doğa ve İnsan">Doğa ve İnsan</option>\n' +
                                    '<option value="Coğrafi Konum">Coğrafi Konum</option>\n' +
                                    '<option value="Dünya’nın Şekli ve Hareketleri">Dünya’nın Şekli ve Hareketleri</option>\n' +
                                    '<option value="Haritalar">Haritalar</option>\n' +
                                    '<option value="Atmosfer ve İklim">Atmosfer ve İklim</option>\n' +
                                    '<option value="Yerin Yapısı ve İç Kuvvetler">Yerin Yapısı ve İç Kuvvetler</option>\n' +
                                    '<option value="Yeryüzünün Biçimlenmesi: Dış Kuvvetler">Yeryüzünün Biçimlenmesi: Dış Kuvvetler</option>\n' +
                                    '<option value="Nüfus ve Yerleşme">Nüfus ve Yerleşme</option>\n' +
                                    '<option value="Mekânsal Bir Sentez: Türkiye">Mekânsal Bir Sentez: Türkiye</option>\n' +
                                    '<option value="Bölgeler ve Ülkeler">Bölgeler ve Ülkeler</option>\n' +
                                    '<option value="Çevre ve Toplum">Çevre ve Toplum</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Felsefe":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Felsefenin Konusu ve Bilgi Türleri">Felsefenin Konusu ve Bilgi Türleri</option>\n' +
                                    '<option value="Bilgi Felsefesi">Bilgi Felsefesi</option>\n' +
                                    '<option value="Varlık Felsefesi">Varlık Felsefesi</option>\n' +
                                    '<option value="Ahlak Felsefesi">Ahlak Felsefesi</option>\n' +
                                    '<option value="Sanat Felsefesi">Sanat Felsefesi</option>\n' +
                                    '<option value="Din Felsefesi">Din Felsefesi</option>\n' +
                                    '<option value="Siyaset Felsefesi">Siyaset Felsefesi</option>\n' +
                                    '<option value="Bilim Felsefesi">Bilim Felsefesi</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Din Kültürü":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="İnsan ve Din">İnsan ve Din</option>\n' +
                                    '<option value="Allah İnancı">Allah İnancı</option>\n' +
                                    '<option value="Kur’an-ı Kerim">Kur’an-ı Kerim</option>\n' +
                                    '<option value="İslam Düşüncesi">İslam Düşüncesi</option>\n' +
                                    '<option value="İslam ve İbadetler">İslam ve İbadetler</option>\n' +
                                    '<option value="Hz. Muhammed’in Hayatı">Hz. Muhammed’in Hayatı</option>\n' +
                                    '<option value="Yaşayan Dinler ve Benzer Özellikleri">Yaşayan Dinler ve Benzer Özellikleri</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Psikoloji":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Psikoloji Bilimini Tanıyalım">Psikoloji Bilimini Tanıyalım</option>\n' +
                                    '<option value="Psikolojinin Temel Süreçleri">Psikolojinin Temel Süreçleri</option>\n' +
                                    '<option value="Öğrenme Bellek Düşünme">Öğrenme Bellek Düşünme</option>\n' +
                                    '<option value="Ruh Sağlığının Temelleri">Ruh Sağlığının Temelleri</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Sosyoloji":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Sosyolojiye Giriş">Sosyolojiye Giriş</option>\n' +
                                    '<option value="Birey ve Toplum">Birey ve Toplum</option>\n' +
                                    '<option value="Toplumsal Yapı">Toplumsal Yapı</option>\n' +
                                    '<option value="Toplumsal Değişme ve Gelişme">Toplumsal Değişme ve Gelişme</option>\n' +
                                    '<option value="Toplum ve Kültür">Toplum ve Kültür</option>\n' +
                                    '<option value="Toplumsal Kurumlar">Toplumsal Kurumlar</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            case "Yabancı Dil":
                                $('#unit').text(' ');
                                $('#unit').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Kelime Bilgisi">Kelime Bilgisi</option>\n' +
                                    '<option value="Dilbilgisi">Dilbilgisi</option>\n' +
                                    '<option value="Boşluk Doldurma">Boşluk Doldurma</option>\n' +
                                    '<option value="Cümleyi Tamamlama">Cümleyi Tamamlama</option>\n' +
                                    '<option value="Yabancı Dil / TR Cümlenin Karşılığını Bulma">Yabancı Dil / TR Cümlenin Karşılığını Bulma</option>\n' +
                                    '<option value="Paragraf">Paragraf</option>\n' +
                                    '<option value="Anlamca Yakın Cümleyi Bulma">Anlamca Yakın Cümleyi Bulma</option>\n' +
                                    '<option value="Paragrafta Anlam Bütünlüğünü Sağlayacak Cümleyi Bulma">Paragrafta Anlam Bütünlüğünü Sağlayacak Cümleyi Bulma</option>\n' +
                                    '<option value="Verilen Durumda Söylenecek İfadeli Bulma">Verilen Durumda Söylenecek İfadeli Bulma</option>\n' +
                                    '<option value="Diyalog Tamamlama">Diyalog Tamamlama</option>\n'+
                                    '<option value="Anlam Bütünlüğünü Bozan Cümleyi Bulma">Anlam Bütünlüğünü Bozan Cümleyi Bulma</option>');
                                $('#unit').removeAttr('disabled');
                                break;
                            default:
                                $('#unit').text(' ');
                                console.warn('Derse seçimine ait konu bulunamadı!')
                                break;
                        }
                    }
                })

                // derse göre çalışma süresi kısmına konu yükle
                $('#lessonKonu').on('change', function () {
                    if (grade < 9) {
                        // LGS sınav konuları yükle
                        switch ($(this).val()) {
                            case "Türkçe":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Sözcükte Anlam">Sözcükte Anlam</option>\n' +
                                    '<option value="Cümlede Anlam">Cümlede Anlam</option>\n' +
                                    '<option value="Deyimler ve Atasözleri">Deyimler ve Atasözleri</option>\n' +
                                    '<option value="Parçada Anlam">Parçada Anlam</option>\n' +
                                    '<option value="Ses Bilgisi">Ses Bilgisi</option>\n' +
                                    '<option value="Yazım Kuralları">Yazım Kuralları</option>\n' +
                                    '<option value="Noktalama İşaretleri">Noktalama İşaretleri</option>\n' +
                                    '<option value="Fiilimsi">Fiilimsi</option>\n' +
                                    '<option value="Cümlenin Ögeleri">Cümlenin Ögeleri</option>\n' +
                                    '<option value="Cümle Vurgusu">Cümle Vurgusu</option>\n' +
                                    '<option value="Fiillerde Çatı">Fiillerde Çatı</option>\n' +
                                    '<option value="Cümle Çeşitleri">Cümle Çeşitleri</option>\n' +
                                    '<option value="Anlatım Bozuklukları">Anlatım Bozuklukları</option>\n' +
                                    '<option value="Söz Sanatları">Söz Sanatları</option>\n' +
                                    '<option value="Yazı (Metin) Türleri">Yazı (Metin) Türleri</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Matematik":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Çarpanlar ve Katlar">Çarpanlar ve Katlar</option>\n' +
                                    '<option value="Üslü İfadeler">Üslü İfadeler</option>\n' +
                                    '<option value="Kareköklü İfadeler">Kareköklü İfadeler</option>\n' +
                                    '<option value="Veri Analizi">Veri Analizi</option>\n' +
                                    '<option value="Basit Olayların Olma Olasılığı">Basit Olayların Olma Olasılığı</option>\n' +
                                    '<option value="Cebirsel İfadeler ve Özdeşlikler">Cebirsel İfadeler ve Özdeşlikler</option>\n' +
                                    '<option value="Doğrusal Denklemler">Doğrusal Denklemler</option>\n' +
                                    '<option value="Eşitsizlikler">Eşitsizlikler</option>\n' +
                                    '<option value="Üçgenler">Üçgenler</option>\n' +
                                    '<option value="Eşlik Benzerlik">Eşlik Benzerlik</option>\n' +
                                    '<option value="Dönüşüm Geometrisi">Dönüşüm Geometrisi</option>\n' +
                                    '<option value="Geometrik Cisimler">Geometrik Cisimler</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Fen Bilimleri":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Mevsimler ve İklim">Mevsimler ve İklim</option>\n' +
                                    '<option value="DNA ve Genetik Kod">DNA ve Genetik Kod</option>\n' +
                                    '<option value="Basınç">Basınç</option>\n' +
                                    '<option value="Madde ve Endüstri">Madde ve Endüstri</option>\n' +
                                    '<option value="Basit Makineler">Basit Makineler</option>\n' +
                                    '<option value="Enerji Dönüşümleri ve Çevre Bilimi">Enerji Dönüşümleri ve Çevre Bilimi</option>\n' +
                                    '<option value="Elektrik Yükleri ve Elektrik Enerjisi">Elektrik Yükleri ve Elektrik Enerjisi</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "İnkılap Tarihi":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Bir Kahraman Doğuyor">Bir Kahraman Doğuyor</option>\n' +
                                    '<option value="Milli Uyanış: Bağımsızlık Yolunda Atılan Adımlar">Milli Uyanış: Bağımsızlık Yolunda Atılan Adımlar</option>\n' +
                                    '<option value="Milli Bir Destan: Ya İstiklal Ya Ölüm!">Milli Bir Destan: Ya İstiklal Ya Ölüm!</option>\n' +
                                    '<option value="Atatürkçülük ve Çağdağlaşan Türkiye">Atatürkçülük ve Çağdağlaşan Türkiye</option>\n' +
                                    '<option value="Demokratikleşme Çabaları">Demokratikleşme Çabaları</option>\n' +
                                    '<option value="Atatürk Dönemi Türk Dış Politikası">Atatürk Dönemi Türk Dış Politikası</option>\n' +
                                    '<option value="Atatürk\'ün Ölümü ve Sonrası">Atatürk\'ün Ölümü ve Sonrası</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Din Kültürü":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Kader İnancı">Kader İnancı</option>\n' +
                                    '<option value="Zekat ve Sadaka">Zekat ve Sadaka</option>\n' +
                                    '<option value="Din ve Hayat">Din ve Hayat</option>\n' +
                                    '<option value="Hz.Muhammed\'in Örnekliği">Hz.Muhammed\'in Örnekliği</option>\n' +
                                    '<option value="Kur\'an-ı Kerim ve Özellikleri">Kur\'an-ı Kerim ve Özellikleri</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Yabancı Dil":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Friendship">Friendship</option>\n' +
                                    '<option value="Teen Life">Teen Life</option>\n' +
                                    '<option value="In The Kitchen">In The Kitchen</option>\n' +
                                    '<option value="On The Phone ">On The Phone </option>\n' +
                                    '<option value="The Internet">The Internet</option>\n' +
                                    '<option value="Adventures">Adventures</option>\n' +
                                    '<option value="Tourism">Tourism</option>\n' +
                                    '<option value="Chores">Chores</option>\n' +
                                    '<option value="Science">Science</option>\n' +
                                    '<option value="Natural Forces">Natural Forces</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            default:
                                $('#unitKonu').text(' ');
                                console.warn('Derse seçimine ait konu bulunamadı!')
                                break;
                        }
                    } else {
                        // TYT-AYT sınav konuları yükle
                        switch ($(this).val()) {
                            case "Matematik":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Sayılar">Sayılar</option>\n' +
                                    '<option value="Rasyonel ve Ondalık Sayılar">Rasyonel ve Ondalık Sayılar</option>\n' +
                                    '<option value="Bölme ve Bölünebilme, OBEB, OKEK">Bölme ve Bölünebilme, OBEB, OKEK</option>\n' +
                                    '<option value="Denklem Çözme, Eşitsizlikler ve Mutlak Değer">Denklem Çözme, Eşitsizlikler ve Mutlak Değer</option>\n' +
                                    '<option value="Üslü - Köklü İfadeler">Üslü - Köklü İfadeler</option>\n' +
                                    '<option value="Çarpanlara Ayırma ve Özdeşlikler">Çarpanlara Ayırma ve Özdeşlikler</option>\n' +
                                    '<option value="Oran – Orantı">Oran – Orantı</option>\n' +
                                    '<option value="Problemler">Problemler</option>\n' +
                                    '<option value="Kümeler">Kümeler</option>\n' +
                                    '<option value="Fonksiyonlar">Fonksiyonlar</option>\n' +
                                    '<option value="Permütasyon – Kombinasyon – Binom - Olasılık">Permütasyon – Kombinasyon – Binom - Olasılık</option>\n' +
                                    '<option value="Veri Analizi">Veri Analizi</option>\n' +
                                    '<option value="Polinomlar">Polinomlar</option>\n' +
                                    '<option value="İkinci Dereceden Denklemler">İkinci Dereceden Denklemler</option>\n' +
                                    '<option value="Karmaşık Sayılar">Karmaşık Sayılar</option>\n' +
                                    '<option value="Mantık">Mantık</option>\n' +
                                    '<option value="Parabol">Parabol</option>\n' +
                                    '<option value="Logaritma">Logaritma</option>\n' +
                                    '<option value="Trigonometri">Trigonometri</option>\n' +
                                    '<option value="Diziler ve Seriler">Diziler ve Seriler</option>\n' +
                                    '<option value="Limit ve Süreklilik">Limit ve Süreklilik</option>\n' +
                                    '<option value="Türev">Türev</option>\n' +
                                    '<option value="İntegral">İntegral</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Geometri":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Geometrik Kavramlar">Geometrik Kavramlar</option>\n' +
                                    '<option value="Açılar">Açılar</option>\n' +
                                    '<option value="Üçgenler">Üçgenler</option>\n' +
                                    '<option value="Çokgenler ve Dörtgenler">Çokgenler ve Dörtgenler</option>\n' +
                                    '<option value="Çember ve Daire">Çember ve Daire</option>\n' +
                                    '<option value="Noktanın ve Doğrunun Analitik İncelemesi">Noktanın ve Doğrunun Analitik İncelemesi</option>\n' +
                                    '<option value="Katı Cisimler">Katı Cisimler</option>\n' +
                                    '<option value="Trigonometri">Trigonometri</option>\n' +
                                    '<option value="Analitik Geometri">Analitik Geometri</option>\n' +
                                    '<option value="Çemberin Analitik İncelemesi">Çemberin Analitik İncelemesi</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Fizik":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Fizik Bilimi">Fizik Bilimi</option>\n' +
                                    '<option value="Madde ve Özellikleri">Madde ve Özellikleri</option>\n' +
                                    '<option value="Isı ve Sıcaklık">Isı ve Sıcaklık</option>\n' +
                                    '<option value="Basınç ve Kaldırma Kuvveti">Basınç ve Kaldırma Kuvveti</option>\n' +
                                    '<option value="Kuvvet ve Hareket">Kuvvet ve Hareket</option>\n' +
                                    '<option value="İş, Güç, Enerji">İş, Güç, Enerji</option>\n' +
                                    '<option value="Elektrostatik">Elektrostatik</option>\n' +
                                    '<option value="Elektrik ve Manyetizma">Elektrik ve Manyetizma</option>\n' +
                                    '<option value="Optik">Optik</option>\n' +
                                    '<option value="Dalgalar">Dalgalar</option>\n' +
                                    '<option value="Dalga Mekaniği">Dalga Mekaniği</option>\n' +
                                    '<option value="Modern Fizik">Modern Fizik</option>\n' +
                                    '<option value="Atom Fiziğine Giriş ve Radyoaktivite">Atom Fiziğine Giriş ve Radyoaktivite</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Kimya":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Kimya Bilimi">Kimya Bilimi</option>\n' +
                                    '<option value="Atomun Yapısı">Atomun Yapısı</option>\n' +
                                    '<option value="Periyodik Sistem">Periyodik Sistem</option>\n' +
                                    '<option value="Kimyasal Türler Arası Etkileşimler">Kimyasal Türler Arası Etkileşimler</option>\n' +
                                    '<option value="Kimyanın Temel Kanunları">Kimyanın Temel Kanunları</option>\n' +
                                    '<option value="Maddenin Halleri">Maddenin Halleri</option>\n' +
                                    '<option value="Asitler, Bazlar ve Tuzlar">Asitler, Bazlar ve Tuzlar</option>\n' +
                                    '<option value="Karışımlar">Karışımlar</option>\n' +
                                    '<option value="Modern Atom Teorisi">Modern Atom Teorisi</option>\n' +
                                    '<option value="Kimyasal Hesaplamalar">Kimyasal Hesaplamalar</option>\n' +
                                    '<option value="Gazlar">Gazlar</option>\n' +
                                    '<option value="Sıvı Çözeltiler">Sıvı Çözeltiler</option>\n' +
                                    '<option value="Kimya ve Enerji">Kimya ve Enerji</option>\n' +
                                    '<option value="Tepkimelerde Hız ve Denge">Tepkimelerde Hız ve Denge</option>\n' +
                                    '<option value="Kimya ve Elektrik">Kimya ve Elektrik</option>\n' +
                                    '<option value="Karbon Kimyasına Giriş">Karbon Kimyasına Giriş</option>\n' +
                                    '<option value="Organik Kimya">Organik Kimya</option>\n' +
                                    '<option value="Hayatımızda Kimya">Hayatımızda Kimya</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Biyoloji":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Biyoloji Bilimi">Biyoloji Bilimi</option>\n' +
                                    '<option value="Canlıların Ortak Özellikleri">Canlıların Ortak Özellikleri</option>\n' +
                                    '<option value="Canlıların Temel Bileşenleri">Canlıların Temel Bileşenleri</option>\n' +
                                    '<option value="Canlıların Çeşitliliği ve Sınıflandırılması">Canlıların Çeşitliliği ve Sınıflandırılması</option>\n' +
                                    '<option value="Hücre ve Yapısı">Hücre ve Yapısı</option>\n' +
                                    '<option value="Hücre Bölünmeleri ve Üreme Çeşitleri">Hücre Bölünmeleri ve Üreme Çeşitleri</option>\n' +
                                    '<option value="Kalıtım">Kalıtım</option>\n' +
                                    '<option value="Ekosistem Ekolojisi">Ekosistem Ekolojisi</option>\n' +
                                    '<option value="Sinir Sistemi">Sinir Sistemi</option>\n' +
                                    '<option value="Endokrin Sistemi">Endokrin Sistemi</option>\n' +
                                    '<option value="Duyu Organları">Duyu Organları</option>\n' +
                                    '<option value="Destek ve Hareket Sistemi">Destek ve Hareket Sistemi</option>\n' +
                                    '<option value="Sindirim Sistemi">Sindirim Sistemi</option>\n' +
                                    '<option value="Dolaşım Sistemi">Dolaşım Sistemi</option>\n' +
                                    '<option value="Vücudun Savunulması ve Bağışıklık">Vücudun Savunulması ve Bağışıklık</option>\n' +
                                    '<option value="Solunum Sistemi">Solunum Sistemi</option>\n' +
                                    '<option value="Boşaltım Sistemi">Boşaltım Sistemi</option>\n' +
                                    '<option value="Üreme Sistemi ve Embriyonik Gelişim">Üreme Sistemi ve Embriyonik Gelişim</option>\n' +
                                    '<option value="Genden Proteine">Genden Proteine</option>\n' +
                                    '<option value="Biyoteknoloji ve Gen Mühendisliği">Biyoteknoloji ve Gen Mühendisliği</option>\n' +
                                    '<option value="Solunum">Solunum</option>\n' +
                                    '<option value="Fotosentez - Kemosentez ">Fotosentez - Kemosentez </option>\n' +
                                    '<option value="Bitki Biyolojisi">Bitki Biyolojisi</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Türkçe":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Sözcük ve Söz Öbeklerinde Anlam">Sözcük ve Söz Öbeklerinde Anlam</option>\n' +
                                    '<option value="Cümlenin Anlamı ve Yorumu">Cümlenin Anlamı ve Yorumu</option>\n' +
                                    '<option value="Anlatım Bilgisi">Anlatım Bilgisi</option>\n' +
                                    '<option value="Paragraf Bilgisi">Paragraf Bilgisi</option>\n' +
                                    '<option value="Ses Bilgisi-Yazım-Noktalama">Ses Bilgisi-Yazım-Noktalama</option>\n' +
                                    '<option value="Sözcükte Yapı (Ad, Sıfat, Zamir, Fiil...)">Sözcükte Yapı (Ad, Sıfat, Zamir, Fiil...)</option>\n' +
                                    '<option value="Sözcük Türleri">Sözcük Türleri</option>\n' +
                                    '<option value="Cümlenin Ögeleri">Cümlenin Ögeleri</option>\n' +
                                    '<option value="Cümle Türleri">Cümle Türleri</option>\n' +
                                    '<option value="Anlatım Bozuklukları">Anlatım Bozuklukları</option>\n' +
                                    '<option value="İletişim, Dil ve Kültür – Dillerin sınıflandırılması">İletişim, Dil ve Kültür – Dillerin sınıflandırılması</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Edebiyat":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Güzel Sanatlar ve Edebiyat">Güzel Sanatlar ve Edebiyat</option>\n' +
                                    '<option value="Coşku ve Heyecan Dile Getiren Metinler (Şiir)">Coşku ve Heyecan Dile Getiren Metinler (Şiir)</option>\n' +
                                    '<option value="Olay Çevresinde Oluşan Edebi Metinler">Olay Çevresinde Oluşan Edebi Metinler</option>\n' +
                                    '<option value="Öğretici Metinler (Edebiyat 9. Sınıf)">Öğretici Metinler (Edebiyat 9. Sınıf)</option>\n' +
                                    '<option value="Tarih İçinde Türk Edebiyatı">Tarih İçinde Türk Edebiyatı</option>\n' +
                                    '<option value="Destan Dönemi Türk Edebiyatı">Destan Dönemi Türk Edebiyatı</option>\n' +
                                    '<option value="İslam Uygarlığı Çevresinde Gelişen Türk Edebiyatı">İslam Uygarlığı Çevresinde Gelişen Türk Edebiyatı</option>\n' +
                                    '<option value="Batı Tesirindeki Türk Edebiyatına Giriş (Yenileşme Dönemi Türk Edebiyatı)">Batı Tesirindeki Türk Edebiyatına Giriş (Yenileşme Dönemi Türk Edebiyatı)</option>\n' +
                                    '<option value="Tanzimat Dönemi Edebiyatı (1860-1896)">Tanzimat Dönemi Edebiyatı (1860-1896)</option>\n' +
                                    '<option value="Servet-i Fünun Edebiyatı (Edebiyat-ı Cedide) (1896-1901) ve Fecr-i Ati Topluluğu (1909-1912)">Servet-i Fünun Edebiyatı (Edebiyat-ı Cedide) (1896-1901) ve Fecr-i Ati Topluluğu (1909-1912)</option>\n' +
                                    '<option value="Milli Edebiyat Dönemi (1911-1923)">Milli Edebiyat Dönemi (1911-1923)</option>\n' +
                                    '<option value="Cumhuriyet Dönemi Türk Edebiyatı (1923-…)">Cumhuriyet Dönemi Türk Edebiyatı (1923-…)</option>\n' +
                                    '<option value="Cumhuriyet Döneminde Öğretici Metinler">Cumhuriyet Döneminde Öğretici Metinler</option>\n' +
                                    '<option value="Cumhuriyet Döneminde Coşku ve Heyecanı Dile Getiren Metinler (Şiir)">Cumhuriyet Döneminde Coşku ve Heyecanı Dile Getiren Metinler (Şiir)</option>\n' +
                                    '<option value="Cumhuriyet Döneminde Olay Çevresinde Oluşan Edebi Metinler">Cumhuriyet Döneminde Olay Çevresinde Oluşan Edebi Metinler</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Tarih":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Tarih Bilimine Giriş">Tarih Bilimine Giriş</option>\n' +
                                    '<option value="Uygarlığın Doğuşu ve İlk Uygarlıklar">Uygarlığın Doğuşu ve İlk Uygarlıklar</option>\n' +
                                    '<option value="İlk Türk Devletleri">İlk Türk Devletleri</option>\n' +
                                    '<option value="İslam Tarihi ve Uygarlığı">İslam Tarihi ve Uygarlığı</option>\n' +
                                    '<option value="Türk - İslam Devletleri">Türk - İslam Devletleri</option>\n' +
                                    '<option value="Ortaçağda Avrupa">Ortaçağda Avrupa</option>\n' +
                                    '<option value="Türkiye Tarihi">Türkiye Tarihi</option>\n' +
                                    '<option value="Beylikten Devlete (1300-1453)">Beylikten Devlete (1300-1453)</option>\n' +
                                    '<option value="Dünya Gücü: Osmanlı Devleti (1453-1600)">Dünya Gücü: Osmanlı Devleti (1453-1600)</option>\n' +
                                    '<option value="Osmanlı Kültür ve Uygarlığı">Osmanlı Kültür ve Uygarlığı</option>\n' +
                                    '<option value="Yeni Çağda Avrupa">Yeni Çağda Avrupa</option>\n' +
                                    '<option value="Arayış Yılları (17.yy)">Arayış Yılları (17.yy)</option>\n' +
                                    '<option value="Yüzyılda Diplomasi ve Değişim">Yüzyılda Diplomasi ve Değişim</option>\n' +
                                    '<option value="Yakın Çağ Avrupası">Yakın Çağ Avrupası</option>\n' +
                                    '<option value="En Uzun Yüzyıl (1800-1922)">En Uzun Yüzyıl (1800-1922)</option>\n' +
                                    '<option value="1881’den 1919’a Mustafa Kemal">1881’den 1919’a Mustafa Kemal</option>\n' +
                                    '<option value="Milli Mücadelenin Hazırlık Dönemi">Milli Mücadelenin Hazırlık Dönemi</option>\n' +
                                    '<option value="Kurtuluş Savaşında Cepheler">Kurtuluş Savaşında Cepheler</option>\n' +
                                    '<option value="Türk İnkılabı">Türk İnkılabı</option>\n' +
                                    '<option value="Atatürkçülük ve Atatürk İlkeleri">Atatürkçülük ve Atatürk İlkeleri</option>\n' +
                                    '<option value="Atatürk Dönemi Dış Politika">Atatürk Dönemi Dış Politika</option>\n' +
                                    '<option value="Atatürk’ün Ölümü">Atatürk’ün Ölümü</option>\n' +
                                    '<option value="Yüzyılın Başlarında Dünya">Yüzyılın Başlarında Dünya</option>\n' +
                                    '<option value="İkinci Dünya Savaşı">İkinci Dünya Savaşı</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Coğrafya":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Doğa ve İnsan">Doğa ve İnsan</option>\n' +
                                    '<option value="Coğrafi Konum">Coğrafi Konum</option>\n' +
                                    '<option value="Dünya’nın Şekli ve Hareketleri">Dünya’nın Şekli ve Hareketleri</option>\n' +
                                    '<option value="Haritalar">Haritalar</option>\n' +
                                    '<option value="Atmosfer ve İklim">Atmosfer ve İklim</option>\n' +
                                    '<option value="Yerin Yapısı ve İç Kuvvetler">Yerin Yapısı ve İç Kuvvetler</option>\n' +
                                    '<option value="Yeryüzünün Biçimlenmesi: Dış Kuvvetler">Yeryüzünün Biçimlenmesi: Dış Kuvvetler</option>\n' +
                                    '<option value="Nüfus ve Yerleşme">Nüfus ve Yerleşme</option>\n' +
                                    '<option value="Mekânsal Bir Sentez: Türkiye">Mekânsal Bir Sentez: Türkiye</option>\n' +
                                    '<option value="Bölgeler ve Ülkeler">Bölgeler ve Ülkeler</option>\n' +
                                    '<option value="Çevre ve Toplum">Çevre ve Toplum</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Felsefe":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Felsefenin Konusu ve Bilgi Türleri">Felsefenin Konusu ve Bilgi Türleri</option>\n' +
                                    '<option value="Bilgi Felsefesi">Bilgi Felsefesi</option>\n' +
                                    '<option value="Varlık Felsefesi">Varlık Felsefesi</option>\n' +
                                    '<option value="Ahlak Felsefesi">Ahlak Felsefesi</option>\n' +
                                    '<option value="Sanat Felsefesi">Sanat Felsefesi</option>\n' +
                                    '<option value="Din Felsefesi">Din Felsefesi</option>\n' +
                                    '<option value="Siyaset Felsefesi">Siyaset Felsefesi</option>\n' +
                                    '<option value="Bilim Felsefesi">Bilim Felsefesi</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Din Kültürü":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="İnsan ve Din">İnsan ve Din</option>\n' +
                                    '<option value="Allah İnancı">Allah İnancı</option>\n' +
                                    '<option value="Kur’an-ı Kerim">Kur’an-ı Kerim</option>\n' +
                                    '<option value="İslam Düşüncesi">İslam Düşüncesi</option>\n' +
                                    '<option value="İslam ve İbadetler">İslam ve İbadetler</option>\n' +
                                    '<option value="Hz. Muhammed’in Hayatı">Hz. Muhammed’in Hayatı</option>\n' +
                                    '<option value="Yaşayan Dinler ve Benzer Özellikleri">Yaşayan Dinler ve Benzer Özellikleri</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Psikoloji":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Psikoloji Bilimini Tanıyalım">Psikoloji Bilimini Tanıyalım</option>\n' +
                                    '<option value="Psikolojinin Temel Süreçleri">Psikolojinin Temel Süreçleri</option>\n' +
                                    '<option value="Öğrenme Bellek Düşünme">Öğrenme Bellek Düşünme</option>\n' +
                                    '<option value="Ruh Sağlığının Temelleri">Ruh Sağlığının Temelleri</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Sosyoloji":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Sosyolojiye Giriş">Sosyolojiye Giriş</option>\n' +
                                    '<option value="Birey ve Toplum">Birey ve Toplum</option>\n' +
                                    '<option value="Toplumsal Yapı">Toplumsal Yapı</option>\n' +
                                    '<option value="Toplumsal Değişme ve Gelişme">Toplumsal Değişme ve Gelişme</option>\n' +
                                    '<option value="Toplum ve Kültür">Toplum ve Kültür</option>\n' +
                                    '<option value="Toplumsal Kurumlar">Toplumsal Kurumlar</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            case "Yabancı Dil":
                                $('#unitKonu').text(' ');
                                $('#unitKonu').append('<option value="------">------</option>\n' +
                                    '<option value="Genel">Genel</option>\n' +
                                    '<option value="Kelime Bilgisi">Kelime Bilgisi</option>\n' +
                                    '<option value="Dilbilgisi">Dilbilgisi</option>\n' +
                                    '<option value="Boşluk Doldurma">Boşluk Doldurma</option>\n' +
                                    '<option value="Cümleyi Tamamlama">Cümleyi Tamamlama</option>\n' +
                                    '<option value="Yabancı Dil / TR Cümlenin Karşılığını Bulma">Yabancı Dil / TR Cümlenin Karşılığını Bulma</option>\n' +
                                    '<option value="Paragraf">Paragraf</option>\n' +
                                    '<option value="Anlamca Yakın Cümleyi Bulma">Anlamca Yakın Cümleyi Bulma</option>\n' +
                                    '<option value="Paragrafta Anlam Bütünlüğünü Sağlayacak Cümleyi Bulma">Paragrafta Anlam Bütünlüğünü Sağlayacak Cümleyi Bulma</option>\n' +
                                    '<option value="Verilen Durumda Söylenecek İfadeli Bulma">Verilen Durumda Söylenecek İfadeli Bulma</option>\n' +
                                    '<option value="Diyalog Tamamlama">Diyalog Tamamlama</option>\n'+
                                    '<option value="Anlam Bütünlüğünü Bozan Cümleyi Bulma">Anlam Bütünlüğünü Bozan Cümleyi Bulma</option>');
                                $('#unitKonu').removeAttr('disabled');
                                break;
                            default:
                                $('#unitKonu').text(' ');
                                console.warn('Derse seçimine ait konu bulunamadı!')
                                break;
                        }
                    }
                })

                /* güncel net hesaplama kısmı
                $('#denemeDogru').on('change', function () {
                    console.log($(this).val())
                })
                 */

            })

            // konular girişini biçimlendir
            $('#unit').select2({
                placeholder: 'Lütfen Seçiniz',
                allowClear: true
            });
            $('#unitKonu').select2({
                placeholder: 'Lütfen Seçiniz',
                allowClear: true
            });


        } else {
            // giriş yapılmamış ise 'giriş yap' ekranına yönlendir
            window.location.href = "giris-yap.html";
        }
    })

    // giriş yapıldığında net bilgisini güncelle
    document.getElementById('denemeDogru').addEventListener("keyup", function (evt) {
        //console.log(this.value);
        netGuncelle();
    }, false);
    document.getElementById('denemeYanlis').addEventListener("keyup", function (evt) {
        //console.log(this.value);
        netGuncelle();
    }, false);
    document.getElementById('denemeBos').addEventListener("keyup", function (evt) {
        //console.log(this.value);
        netGuncelle();
    }, false);
    $('#tipDeneme').on('change', function () {
        netGuncelle();
    })

    // zaman bilgisini güncelle
    anlikZamaniSoruGirKismindaGoster();
    anlikZamaniKonuCalismaSuresiGirKismindaGoster();
    anlikZamaniDenemeKaydiGirKismindaGoster();
})




/**
 * Soru & Konu Gir Fonksiyonları
 */

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

function anlikZamaniDenemeKaydiGirKismindaGoster() {
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
    document.getElementById("dateDeneme").value = [year, month, day].join('-');

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
    document.getElementById('timeDeneme').value = [hours, minutes, seconds].join(':');

    // milisaniyeyi gizli elemente tanımla
    document.getElementById('millisecondDeneme').innerText = millisecond;
}

// net hesaplama fonksiyonu
function netHesapla(sinavTipi, dogru, yanlis) {
    var net;
    switch (sinavTipi) {
        case 1: // TYT Sınavı
            net = dogru - (yanlis / 4);
            break;
        case 2: // AYT Sınavı
            net = dogru - (yanlis / 4);
            break;
        case 3: // LGS Sınavı
            net = dogru - (yanlis / 3);
            break;
        case 4: // BRANŞ Sınavı
            net = dogru - (yanlis / 4);
            break;
        default:
            net = 0;
    }
    net = net.toFixed(2);
    return net;
}

// deneme sınavı gir kısmı net ifadesi güncelleme fonksiyonu
function netGuncelle() {
    var sinavTipi = $('#tipDeneme').val();
    var dogru = $('#denemeDogru').val();
    var yanlis = $('#denemeYanlis').val();
    //console.log("tip: " + sinavTipi)
    //console.log("doğru: " + dogru)
    //console.log("yanlış: " + yanlis)
    var net = netHesapla(Number(sinavTipi), Number(dogru), Number(yanlis));
    //console.log("net: " + net);
    $('#denemeNet').text("Net: " + net);
}