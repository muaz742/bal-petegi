/* petek.js yapısı
daha fazla bilgi için ~\docs\petek.js.md
- petek
    - zaman
        - simdi
        - gecenHafta()
        - geceYarisi()
    - navbar
        - hitap()
        - toplamSoru()
    - hasilat
        - gunlukHasilatSoru()
        - son7GunlukSoruHasilati()
        - son7GunlukToplamHasilat()
        - gunlukHasilatKonu()
        - son7GunlukHasilat()
        - son7GunlukPerformans()
        - eklenenSorular()
        - eklenenSureler()
    - soruGir
        - soruSayisiGir()
        - konuCalismaSuresiGir()
        - denemeSinaviGir()
    - profil
        - kaydet()
    - girisYap
        - girisYap()
        - kayitOl()
    - f
        - soruSil()
        - sureSil()
        - epochToDate()
        - epochToTime()
        - oturumuKapat()
        - soruKaydiEkle()
        - konuKaydiEkle()
        - denemeKaydiEkle()
        - netGuncelle()
        - netHesapla()
    - ui
        - gunlukGrafik()
        - haftalikGrafik()
        - gunlukGrafikDersli()
        - guncelleGunlukSoruSure()
        - guncelleHaftalikSoruSure()
        - guncelleToplamSoruSure()
        - guncelleAtif()
        - hesaplaToplamSoruAtif()
        - guncelleProfilBilgileri()
        - anlikZamaniSoruGirKismindaGoster()
        - anlikZamaniKonuCalismaSuresiGirKismindaGoster()
        - anlikZamaniDenemeKaydiGirKismindaGoster()
*/
var petek = {
    "zaman": {
        "simdi": new Date(),
        "gecenHafta": function () {
            var gecenHafta = new Date();
            gecenHafta.setDate(petek.zaman.simdi.getDate() - 7)
            return gecenHafta.getTime();
        },
        "geceYarisi": function () {
            var simdi = petek.zaman.simdi;
            var geceYarisi = new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate());
            return geceYarisi.getTime();
        }
    },
    "navbar": {
        "hitap": function () {
            petek.veri.on('value', function (snapshot) {
                try {
                    petek.ui.guncelleAtif(snapshot.val().name, snapshot.val().surname)
                } catch (e) {
                    console.warn(e);
                }
            })
        },
        "toplamSoru": function () {
            petek.veri.on('value', function (snapshot) {
                try {
                    petek.ui.hesaplaToplamSoruAtif(snapshot.val()['records'])
                } catch (e) {
                    console.warn(e)
                }
            })
        }
    },
    "hasilat": {
        "gunlukHasilatSoru": function () {
            // petek.veri ile veriler çekilecek
            petek.veri.on('value', function (snapshot) {
                var sorular = snapshot.val()['records']

                // çekilen veriler işlenecek
                var sorularGunluk = []
                var sorularKeys = Object.keys(sorular)
                for (var i = 0; i < sorularKeys.length; i++) {
                    //console.log(sorular[sorularKeys[i]]['time']);
                    if (sorular[sorularKeys[i]]['time'] > petek.zaman.geceYarisi()) {
                        if (sorularGunluk[sorular[sorularKeys[i]]['lesson']] == null) {
                            sorularGunluk[sorular[sorularKeys[i]]['lesson']] = Number(sorular[sorularKeys[i]]['count']);
                        } else {
                            sorularGunluk[sorular[sorularKeys[i]]['lesson']] = sorularGunluk[sorular[sorularKeys[i]]['lesson']] + Number(sorular[sorularKeys[i]]['count']);
                        }
                    }
                }

                // toplanan günlük verileri derse göre bar grafiğe yazdır
                var gunlukDersler = [];
                var gunlukSorular = [];

                for (var key in sorularGunluk) {
                    if (sorularGunluk.hasOwnProperty(key)) {
                        gunlukDersler.push(key)
                        gunlukSorular.push(sorularGunluk[key]);
                    }
                }

                // arayüz güncellenecek
                petek.ui.gunlukGrafikDersli(gunlukDersler, gunlukSorular);
                // grafik altına tarih göster
                document.getElementById('todaySoru').innerText = petek.f.epochToDate(petek.zaman.simdi);

            })

        },
        "son7GunlukSoruHasilati": function () {
            // petek ile veriler çekilecek
            petek.veri.on('value', function (snapshot) {
                var sorular = snapshot.val()['records']
                var sorularKeys = Object.keys(sorular)

                // çekilen veriler işlenecek
                var sonucHaftalik = []
                for (i = 0; i < sorularKeys.length; i++) {
                    // hafta içinde çözülen soru miktarını derslere göre topla
                    if (sorular[sorularKeys[i]]['time'] > petek.zaman.gecenHafta()) {
                        if (sonucHaftalik[sorular[sorularKeys[i]]['lesson']] == null) {
                            sonucHaftalik[sorular[sorularKeys[i]]['lesson']] = Number(sorular[sorularKeys[i]]['count']);
                        } else {
                            sonucHaftalik[sorular[sorularKeys[i]]['lesson']] = sonucHaftalik[sorular[sorularKeys[i]]['lesson']] + Number(sorular[sorularKeys[i]]['count']);
                        }
                    }
                }

                // toplanan haftalık verileri derse göre bar grafiğe yazdır
                var haftalikDersler = [];
                var haftalikSorular = [];
                for (var key in sonucHaftalik) {
                    if (sonucHaftalik.hasOwnProperty(key)) {
                        haftalikDersler.push(key)
                        haftalikSorular.push(sonucHaftalik[key]);
                    }
                }
                petek.ui.haftalikGrafik(haftalikDersler, haftalikSorular);
            })
        },
        "son7GunlukToplamHasilat": function () {
            // petek ile veriler çekilecek
            petek.veri.on('value', function (snapshot) {
                var sorular = snapshot.val()['records']
                var sorularKeys = Object.keys(sorular)

                var sonuc = []
                for (i = 0; i < sorularKeys.length; i++) {
                    var tarih = petek.f.epochToDate(sorular[sorularKeys[i]]['time']);
                    // toplam çözülen soru miktarını günlere göre topla
                    if (sorular[sorularKeys[i]]['time'] > petek.zaman.gecenHafta()) {
                        if (sonuc[tarih] == null) {
                            sonuc[tarih] = Number(sorular[sorularKeys[i]]['count']);
                        } else {
                            sonuc[tarih] = sonuc[tarih] + Number(sorular[sorularKeys[i]]['count']);
                        }
                    }
                }

                // son bir haftayı tanımla
                var sonBirHafta = {};
                var i = 0;
                var gun = new Date();
                gun.setDate(gun.getDate() - 7);
                while (i < 7) {
                    gun.setDate(gun.getDate() + 1);
                    var result = petek.f.epochToDate(gun);
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
                petek.ui.gunlukGrafik(tarihler, soruSayilari);
            })
        },
        "gunlukHasilatKonu": function () {
            petek.veri.on('value', function (snapshot) {
                try {
                    var sorular = snapshot.val()['records']
                    var sureler = snapshot.val()['duration']
                } catch (e) {
                    console.warn(e)
                    var sorular = {}
                    var sureler = {}
                }

                // sınıfa göre dersler şablonu oluştur
                var sablonHasilatGunluk = {}
                if (snapshot.val().grade < 9) {
                    sablonHasilatGunluk = {
                        0: {
                            "ders": "Türkçe",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        1: {
                            "ders": "Matematik",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        2: {
                            "ders": "Fen Bilimleri",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        3: {
                            "ders": "İnkılap Tarihi",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        4: {
                            "ders": "Din Kültürü",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        5: {
                            "ders": "Yabancı Dil",
                            "sureSoru": 0,
                            "sureKonu": 0
                        }
                    }
                } else {
                    sablonHasilatGunluk = {
                        0: {
                            "ders": "Matematik",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        1: {
                            "ders": "Geometri",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        3: {
                            "ders": "Fizik",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        4: {
                            "ders": "Kimya",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        5: {
                            "ders": "Biyoloji",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        6: {
                            "ders": "Türkçe",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        7: {
                            "ders": "Edebiyat",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        8: {
                            "ders": "Tarih",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        9: {
                            "ders": "Coğrafya",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        10: {
                            "ders": "Din Kültürü",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        11: {
                            "ders": "Felsefe",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        12: {
                            "ders": "Yabancı Dil",
                            "sureSoru": 0,
                            "sureKonu": 0
                        }
                    }
                }
                // derse göre son bir hafta içindeki soru sürelerini topla
                for (key in sorular) {
                    if (sorular[key].time > petek.zaman.geceYarisi()) {
                        for (keyx in sablonHasilatGunluk) {
                            if (sablonHasilatGunluk[keyx].ders == sorular[key].lesson) {
                                sablonHasilatGunluk[keyx].sureSoru = sablonHasilatGunluk[keyx].sureSoru + Number(sorular[key].minutes)
                            }
                        }
                    }
                }
                // derse göre son bir hafta içindeki konu sürelerini topla
                for (key in sureler) {
                    if (sureler[key].time > petek.zaman.geceYarisi()) {
                        for (keyx in sablonHasilatGunluk) {
                            if (sablonHasilatGunluk[keyx].ders == sureler[key].lesson) {
                                sablonHasilatGunluk[keyx].sureKonu = sablonHasilatGunluk[keyx].sureKonu + Number(sureler[key].count)
                            }
                        }
                    }
                }
                // konu-soru sürelerini günlük grafikte derse göre göster
                var dersKonuSoruGunluk = []
                var sureSoruGunluk = []
                var sureKonuGunluk = []
                for (key in sablonHasilatGunluk) {
                    dersKonuSoruGunluk.push(sablonHasilatGunluk[key].ders)
                    sureSoruGunluk.push(sablonHasilatGunluk[key].sureSoru)
                    sureKonuGunluk.push(sablonHasilatGunluk[key].sureKonu)
                }
                // grafik güncelle
                petek.ui.guncelleGunlukSoruSure(dersKonuSoruGunluk, sureSoruGunluk, sureKonuGunluk);
                // grafik altında tarih göster
                document.getElementById('todaySoruKonu').innerText = petek.f.epochToDate(petek.zaman.simdi);
            })
        },
        "son7GunlukHasilat": function () {
            petek.veri.on('value', function (snapshot) {
                try {
                    var sorular = snapshot.val()['records']
                    var sureler = snapshot.val()['duration']
                } catch (e) {
                    console.warn(e)
                    var sorular = {}
                    var sureler = {}
                }

                // sınıfa göre dersler şablonu oluştur
                var sablonHasilatHaftalik = {}
                if (snapshot.val().grade < 9) {
                    sablonHasilatHaftalik = {
                        0: {
                            "ders": "Türkçe",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        1: {
                            "ders": "Matematik",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        2: {
                            "ders": "Fen Bilimleri",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        3: {
                            "ders": "İnkılap Tarihi",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        4: {
                            "ders": "Din Kültürü",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        5: {
                            "ders": "Yabancı Dil",
                            "sureSoru": 0,
                            "sureKonu": 0
                        }
                    }
                } else {
                    sablonHasilatHaftalik = {
                        0: {
                            "ders": "Matematik",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        1: {
                            "ders": "Geometri",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        3: {
                            "ders": "Fizik",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        4: {
                            "ders": "Kimya",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        5: {
                            "ders": "Biyoloji",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        6: {
                            "ders": "Türkçe",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        7: {
                            "ders": "Edebiyat",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        8: {
                            "ders": "Tarih",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        9: {
                            "ders": "Coğrafya",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        10: {
                            "ders": "Din Kültürü",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        11: {
                            "ders": "Felsefe",
                            "sureSoru": 0,
                            "sureKonu": 0
                        },
                        12: {
                            "ders": "Yabancı Dil",
                            "sureSoru": 0,
                            "sureKonu": 0
                        }
                    }
                }
                // derse göre son bir hafta içindeki soru sürelerini topla
                for (key in sorular) {
                    if (sorular[key].time > petek.zaman.gecenHafta()) {
                        for (keyx in sablonHasilatHaftalik) {
                            if (sablonHasilatHaftalik[keyx].ders == sorular[key].lesson) {
                                sablonHasilatHaftalik[keyx].sureSoru = sablonHasilatHaftalik[keyx].sureSoru + Number(sorular[key].minutes)
                            }
                        }
                    }
                }
                // derse göre son bir hafta içindeki konu sürelerini topla
                for (key in sureler) {
                    if (sureler[key].time > petek.zaman.gecenHafta()) {
                        for (keyx in sablonHasilatHaftalik) {
                            if (sablonHasilatHaftalik[keyx].ders == sureler[key].lesson) {
                                sablonHasilatHaftalik[keyx].sureKonu = sablonHasilatHaftalik[keyx].sureKonu + Number(sureler[key].count)
                            }
                        }
                    }
                }
                // konu-soru sürelerini günlük grafikte derse göre göster
                var dersKonuSoruHaftalik = []
                var sureSoruHaftalik = []
                var sureKonuHaftalik = []
                for (key in sablonHasilatHaftalik) {
                    dersKonuSoruHaftalik.push(sablonHasilatHaftalik[key].ders)
                    sureSoruHaftalik.push(sablonHasilatHaftalik[key].sureSoru)
                    sureKonuHaftalik.push(sablonHasilatHaftalik[key].sureKonu)
                }

                petek.ui.guncelleHaftalikSoruSure(dersKonuSoruHaftalik, sureSoruHaftalik, sureKonuHaftalik);
            })
        },
        "son7GunlukPerformans": function () {
            petek.veri.on('value', function (snapshot) {
                try {
                    var sorular = snapshot.val()['records']
                    var sureler = snapshot.val()['duration']
                } catch (e) {
                    console.warn(e)
                    var sorular = {}
                    var sureler = {}
                }

                // son 7 gün şablonu oluştur
                var soruSonBirHafta = {};
                var i = 0;
                var gun = new Date();
                gun.setDate(gun.getDate() - 7);
                while (i < 7) {
                    gun.setDate(gun.getDate() + 1);
                    var result = petek.f.epochToDate(gun);
                    soruSonBirHafta[result] = 0;
                    i++;
                }

                // derslere ait süreleri topla
                for (key in sorular) {
                    if (sorular[key].time > petek.zaman.gecenHafta()) {
                        var tarih = petek.f.epochToDate(sorular[key].time);
                        soruSonBirHafta[tarih] = soruSonBirHafta[tarih] + Number(sorular[key].minutes)
                    }
                }

                // son 7 gün şablonu oluştur
                var konuSonBirHafta = {};
                var i = 0;
                var gun = new Date();
                gun.setDate(gun.getDate() - 7);
                while (i < 7) {
                    gun.setDate(gun.getDate() + 1);
                    var result = petek.f.epochToDate(gun);
                    konuSonBirHafta[result] = 0;
                    i++;
                }

                // konulara ait süreleri topla
                for (key in sureler) {
                    if (sureler[key].time > petek.zaman.gecenHafta()) {
                        var tarih = petek.f.epochToDate(sureler[key].time)
                        konuSonBirHafta[tarih] = konuSonBirHafta[tarih] + Number(sureler[key].count);
                    }
                }

                // konu-soru sürelerini performans grafiğinde göster
                var tarihKonuSoruPerformans = []
                var sureSoruPerformans = []
                var sureKonuPerformans = []
                for (key in konuSonBirHafta) {
                    tarihKonuSoruPerformans.push(key)
                    sureSoruPerformans.push(soruSonBirHafta[key])
                    sureKonuPerformans.push(konuSonBirHafta[key])
                }
                petek.ui.guncelleToplamSoruSure(tarihKonuSoruPerformans, sureSoruPerformans, sureKonuPerformans);
            })
        },
        "eklenenSorular": function () {
            petek.veri.on('value', function (snapshot) {
                // soru kayıtlarını çek
                try {
                    var sorular = snapshot.val()['records']
                    var sorularKeys = Object.keys(sorular)
                } catch (e) {
                    console.warn(e)
                    var sorular = {}
                    var sorularKeys = {}
                }

                // kayıtları işle
                var listeSorular = {}
                for (i = 0; i < sorularKeys.length; i++) {
                    var tarih = petek.f.epochToDate(sorular[sorularKeys[i]]['time'])
                    var saat = petek.f.epochToTime(sorular[sorularKeys[i]]['time'])
                    var ders = sorular[sorularKeys[i]]['lesson']
                    var miktar = sorular[sorularKeys[i]]['count']
                    listeSorular[sorular[sorularKeys[i]]['time']] = {
                        "tarih": tarih,
                        "saat": saat,
                        "ders": ders,
                        "miktar": miktar,
                        "key": sorularKeys[i]
                    }
                }

                // listeyi temizle
                $('#sorular').text(" ");

                // işlenen kayıtları liste üzerinde görüntüle
                for (var key in listeSorular) {
                    $('#sorular').append("<tr>\n" +
                        "<td>" + listeSorular[key].tarih + "<br>" + listeSorular[key].saat + "</td>\n" +
                        "<td>" + listeSorular[key].ders + "</td>\n" +
                        "<td>" + listeSorular[key].miktar + "</td>\n" +
                        "<td>" +
                        "<button type=\"button\" rel=\"tooltip\" title=\"\" class=\"btn btn-danger btn-link btn-sm\" data-original-title=\"Sil\" onclick=\"petek.f.soruSil('" + listeSorular[key].key + "')\"'>" +
                        "<i class=\"material-icons\">close</i><div class=\"ripple-container\"></div></button>" +
                        "</td>\n" +
                        "</tr>");
                }
            })
        },
        "eklenenSureler": function () {
            petek.veri.on('value', function (snapshot) {
                // süre kayıtlarını çek
                try {
                    var sureler = snapshot.val()['duration']
                } catch (e) {
                    console.warn(e)
                    var suraler = {}
                }

                // kayıtları işle
                var listeSureler = {}
                for (key in sureler) {
                    var tarih = petek.f.epochToDate(sureler[key]['time'])
                    var saat = petek.f.epochToTime(sureler[key]['time'])
                    var ders = sureler[key]['lesson']
                    var miktar = sureler[key]['count']
                    listeSureler[sureler[key]['time']] = {
                        "tarih": tarih,
                        "saat": saat,
                        "ders": ders,
                        "miktar": miktar,
                        "key": key
                    }
                }

                // listeyi temizle
                $('#sureler').text(" ");

                // işlenen kayıtları liste üzerinde görüntüle
                for (var key in listeSureler) {
                    $('#sureler').append("<tr>\n" +
                        "<td>" + listeSureler[key].tarih + "<br>" + listeSureler[key].saat + "</td>\n" +
                        "<td>" + listeSureler[key].ders + "</td>\n" +
                        "<td>" + listeSureler[key].miktar + "</td>\n" +
                        "<td>" +
                        "<button type=\"button\" rel=\"tooltip\" title=\"\" class=\"btn btn-danger btn-link btn-sm\" data-original-title=\"Sil\" onclick=\"petek.f.sureSil('" + listeSureler[key].key + "')\"'>" +
                        "<i class=\"material-icons\">close</i><div class=\"ripple-container\"></div></button>" +
                        "</td>\n" +
                        "</tr>");
                }
            })
        }
    },
    "soruGir": {
        "soruSayisiGir": function () {
            petek.veri.on('value', function (snapshot) {
                try {
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
                    // sınıf bilgisi yok ise uyarı göster
                    if (isNaN(grade)) {
                        $('#lesson').text('');
                        $('#lesson').append('<option value="------">Sınıf Bilgisi Güncellenmeli ‼️</option>');
                        $('#lessonKonu').text('');
                        $('#lessonKonu').append('<option value="------">Sınıf Bilgisi Güncellenmeli ‼️</option>');
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
                                        '<option value="Diyalog Tamamlama">Diyalog Tamamlama</option>\n' +
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
                    // konular girişini biçimlendir
                    $('#unit').select2({
                        placeholder: 'Lütfen Seçiniz',
                        allowClear: true
                    });

                } catch (e) {
                    console.warn(e);
                }
            })
            // zaman bilgisini güncelle
            petek.ui.anlikZamaniSoruGirKismindaGoster();
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
                petek.f.soruKaydiEkle(lesson,questionCount,minuteSoru,date,unit)
                $("#questionCount").val('');
                $('#minutesSoru').val('');
                petek.ui.anlikZamaniSoruGirKismindaGoster();
            });
        },
        "konuCalismaSuresiGir": function () {
            petek.veri.on('value', function (snapshot) {
                try {
                    // kullanıcı sınıf bilgisini tanımla
                    var grade = snapshot.val().grade
                    grade = Number(grade);
                    // sınıf bilgisi yok ise uyarı göster
                    if (isNaN(grade)) {
                        $('#lesson').text('');
                        $('#lesson').append('<option value="------">Sınıf Bilgisi Güncellenmeli ‼️</option>');
                        $('#lessonKonu').text('');
                        $('#lessonKonu').append('<option value="------">Sınıf Bilgisi Güncellenmeli ‼️</option>');
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
                                        '<option value="Diyalog Tamamlama">Diyalog Tamamlama</option>\n' +
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
                    // konular girişini biçimlendir
                    $('#unitKonu').select2({
                        placeholder: 'Lütfen Seçiniz',
                        allowClear: true
                    });
                } catch (e) {
                    console.warn(e)
                }
            })
            // zaman bilgisini güncelle
            petek.ui.anlikZamaniKonuCalismaSuresiGirKismindaGoster();
            $("#addLessonDuration").click(function () {
                var subject = $('#lessonKonu').val()
                var unit = $('#unitKonu').val()
                var lessonDuration = $('#lessonDuration').val()
                var date = $('#dateKonu').val();
                var time = $('#timeKonu').val();
                var millisecond = document.getElementById('millisecondKonu').text;
                date = new Date(date + ' ' + time).getTime();
                date = date + Number(millisecond);
                petek.f.konuKaydiEkle(subject,lessonDuration,date,unit)
                alert("Çalışma Süresi Eklendi 👍")
                $("#questionCount").val('');
                petek.ui.anlikZamaniKonuCalismaSuresiGirKismindaGoster();
            });
        },
        "denemeSinaviGir": function () {
            console.log('denemeSinaviGir çalıştı')
            // zaman bilgisini güncelle
            petek.ui.anlikZamaniDenemeKaydiGirKismindaGoster();
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
                petek.f.denemeKaydiEkle(sinavTipi,dogru,yanlis,bos,date)
                alert("Deneme Sınavı Kaydı Eklendi 👍")
                $("#denemeDogru").val('');
                $("#denemeYanlis").val('');
                $("#denemeBos").val('');
                petek.ui.anlikZamaniDenemeKaydiGirKismindaGoster();
            });
            // giriş yapıldığında net bilgisini güncelle
            document.getElementById('denemeDogru').addEventListener("keyup", function (evt) {
                //console.log(this.value);
                petek.f.netGuncelle();
            }, false);
            document.getElementById('denemeYanlis').addEventListener("keyup", function (evt) {
                //console.log(this.value);
                petek.f.netGuncelle();
            }, false);
            document.getElementById('denemeBos').addEventListener("keyup", function (evt) {
                //console.log(this.value);
                petek.f.netGuncelle();
            }, false);
            $('#tipDeneme').on('change', function () {
                petek.f.netGuncelle();
            })
        }
    },
    "profil": {
        "kaydet": function (name, surname, city, grade, birthdate) {
            firebase.database().ref().child("users").child(petek.veri.key).update({
                name: name,
                surname: surname,
                city: city,
                grade: grade,
                birthdate: birthdate
            });
        }
    },
    "girisYap": {
        "girisYap": function (email, password) {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
                .then(function () {
                    return firebase.auth().signInWithEmailAndPassword(email, password)
                        .then(function () {
                            window.location.href = "index.html";
                        }).catch(function (error) {
                            alert(error.message);
                        });
                })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode)
                    console.log(errorMessage)
                });
        },
        "kayitOl": function (email, password) {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function () {
                    firebase.auth().signInWithEmailAndPassword(email, password)
                        .then(function () {
                            window.location.href = 'index.html'
                        })
                }).catch(function (error) {
                alert(error.message);
            })
        }
    },
    "f": {
        "soruSil": function (key) {
            firebase.database().ref("users/" + petek.veri.key).child("records").child(key).remove();
        },
        "sureSil": function (key) {
            firebase.database().ref("users/" + petek.veri.key).child("duration").child(key).remove();
        },
        "epochToDate": function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [day, month, year].join('.');
        },
        "epochToTime": function (date) {
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
        },
        "oturumuKapat": function () {
            firebase.auth().signOut()
                .then(function () {
                    window.location.href = "giris-yap.html";
                })
        },
        "soruKaydiEkle": function (lesson, questionCount, minuteSoru, date, unit) {
            firebase.database().ref().child("users").child(petek.veri.key).child("records").push(
                {
                    lesson: lesson,
                    count: questionCount,
                    minutes: minuteSoru,
                    time: date,
                    unit: unit
                }
            );
        },
        "konuKaydiEkle": function (subject, lessonDuration, date, unit) {
            firebase.database().ref().child("users").child(petek.veri.key).child("duration").push(
                {
                    lesson: subject,
                    count: lessonDuration,
                    time: date,
                    unit: unit
                }
            );
        },
        "denemeKaydiEkle": function (sinavTipi, dogru, yanlis, bos, date) {
            firebase.database().ref().child("users").child(petek.veri.key).child("test").push(
                {
                    type: sinavTipi,
                    correct: dogru,
                    mistake: yanlis,
                    blank: bos,
                    time: date
                }
            );
        },
        "netGuncelle": function () {
            // deneme sınavı gir kısmı net ifadesi güncelleme fonksiyonu
            var sinavTipi = $('#tipDeneme').val();
            var dogru = $('#denemeDogru').val();
            var yanlis = $('#denemeYanlis').val();
            //console.log("tip: " + sinavTipi)
            //console.log("doğru: " + dogru)
            //console.log("yanlış: " + yanlis)
            var net = petek.f.netHesapla(Number(sinavTipi), Number(dogru), Number(yanlis));
            //console.log("net: " + net);
            $('#denemeNet').text("Net: " + net);
        },
        "netHesapla": function (sinavTipi, dogru, yanlis) {
            // net hesaplama fonksiyonu
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
    },
    "ui": {
        "gunlukGrafik": function (tarihler, soruSayilari) {
            /* her tarihe ait soru sayısını çizgi grafikte gösterir */
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
        },
        "haftalikGrafik": function (dersler, soruSayilari) {
            /* her derse ait soru sayısını bar grafikte gösterir */
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
        },
        "gunlukGrafikDersli": function (dersler, soruSayilari) {
            /* her derse ait soru sayısını bar grafikte gösterir */
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
        },
        "guncelleGunlukSoruSure": function (dersler, sorular, sureler) {
            /* her derse ait soru ve çalışma süresini günlük bar grafikte gösterir */
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
                            ticks: {
                                beginAtZero: true
                            },
                            stacked: true,
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            stacked: true
                        }]
                    }
                }
            });
        },
        "guncelleHaftalikSoruSure": function (dersler, sorular, sureler) {
            /* her derse ait soru ve çalışma süresini haftalık bar grafikte gösterir */
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
                            ticks: {
                                beginAtZero: true
                            },
                            stacked: true,
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            stacked: true
                        }]
                    }
                }
            });
        },
        "guncelleToplamSoruSure": function (dersler, sorular, sureler) {
            /* her tarihe ait soru ve çalışma süresini çizgi grafikte gösterir */
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
                            id: 'y-axis-1',
                            ticks: {
                                beginAtZero: true
                            }
                        },
                            {
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
        },
        "guncelleAtif": function (isim, soyisim) {
            // ekran üstünde kullanıcı adı ve soyadını göster
            var kisi = isim + " " + soyisim;
            var mesaj = 'Süper Arı ' + kisi;
            $('#ekranAtif').text(mesaj);
        },
        "hesaplaToplamSoruAtif": function (obje) {
            // kişinin çözdüğü toplam soru sayısını hesapla
            var toplam = 0;
            for (key in obje) {
                toplam = toplam + Number(obje[key].count);
            }
            var mesaj = 'Toplam ' + toplam + ' soru çözdün'
            $('#erkanAtifSoruSayisi').text(mesaj);
        },
        "guncelleProfilBilgileri": function () {
            // kişi bilgileribi profil bilgileri kısmında göster
            petek.veri.on('value', function (snapshot) {
                // form elementlerini güncelle
                $('#name').val(snapshot.val().name)
                $('#surname').val(snapshot.val().surname)
                $('#city').val(snapshot.val().city)
                try {
                    $('#grade').val(snapshot.val().grade)
                } catch (e) {
                    console.error(e);
                }
                $('#birthdate').val(snapshot.val().birthdate)
            })
        },
        "anlikZamaniSoruGirKismindaGoster": function () {
            /** anlık zamanı soru gir kısmında gösterir
             *  muaz wrote with support by dilruba - 20200527-005746
             *  diyagram: https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgRyhiYcWfbGEpLS0-QVxuICBBW2FubMSxayB6YW1hbiBkZcSfZXJpIG9sdcWfdHVyXSAtLT4gQih0YXJpaGkgdGFuxLFtbGEpXG4gIEIgLS0-IEModGFyaWhpIHNvcnUgZ2lyIGvEsXNtxLFuZGEgZ8O2csO8bnTDvGxlKVxuICBDLS0-RChzYWF0aSB0YW7EsW1sYSlcbiAgRC0tPkUoc2FhdGkgc29ydSBnaXIga8Sxc23EsW5kYSBnw7Zyw7xudMO8bGUpXG4gIEUtLT5GKG1pbGlzYW5peWV5aSBnaXpsaSBlbGVtZW50ZSB0YW7EsW1sYSlcbiAgRi0tPkgoYml0aXIpIiwibWVybWFpZCI6eyJ0aGVtZSI6ImZvcmVzdCJ9fQ
             */
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
        },
        "anlikZamaniKonuCalismaSuresiGirKismindaGoster": function () {
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
        },
        "anlikZamaniDenemeKaydiGirKismindaGoster": function () {
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
    }
}