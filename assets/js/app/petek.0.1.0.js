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
                    guncelleAtif(snapshot.val().name, snapshot.val().surname)
                } catch (e) {
                    console.warn(e);
                }
            })
        },
        "toplamSoru": function () {
            petek.veri.on('value', function (snapshot) {
                try {
                    hesaplaToplamSoruAtif(snapshot.val()['records'])
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
                var sorularKeys= Object.keys(sorular)
                for(var i=0;i<sorularKeys.length;i++){
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
                gunlukGrafikDersli(gunlukDersler, gunlukSorular);
                // grafik altına tarih göster
                document.getElementById('todaySoru').innerText = epochToDate(petek.zaman.simdi);

            })

        },
        "son7GunlukSoruHasilati": function () {
            // petek ile veriler çekilecek
            petek.veri.on('value',function(snapshot){
                var sorular = snapshot.val()['records']
                var sorularKeys = Object.keys(sorular)

                // çekilen veriler işlenecek
                var sonucHaftalik = []
                for (i=0;i<sorularKeys.length;i++){
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
                haftalikGrafik(haftalikDersler, haftalikSorular);
            })
        },
        "son7GunlukToplamHasilat": function () {
            // petek ile veriler çekilecek
            petek.veri.on('value',function(snapshot){
                var sorular = snapshot.val()['records']
                var sorularKeys = Object.keys(sorular)

                var sonuc  = []
                for (i=0;i<sorularKeys.length;i++){
                    var tarih = epochToDate(sorular[sorularKeys[i]]['time']);
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
                    var result = epochToDate(gun);
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
                gunlukGrafik(tarihler, soruSayilari);
            })
        },
        "gunlukHasilatKonu": function () {
            petek.veri.on('value',function(snapshot){
                try{
                    var sorular = snapshot.val()['records']
                    var sureler = snapshot.val()['duration']
                }catch (e) {
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
                guncelleGunlukSoruSure(dersKonuSoruGunluk, sureSoruGunluk, sureKonuGunluk);
                // grafik altında tarih göster
                document.getElementById('todaySoruKonu').innerText = epochToDate(petek.zaman.simdi);
            })
        },
        "son7GunlukHasilat": function () {
            petek.veri.on('value',function(snapshot){
                try{
                    var sorular = snapshot.val()['records']
                    var sureler = snapshot.val()['duration']
                }catch (e) {
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

                guncelleHaftalikSoruSure(dersKonuSoruHaftalik, sureSoruHaftalik, sureKonuHaftalik);
            })
        },
        "son7GunlukPerformans": function () {
            petek.veri.on('value',function (snapshot){
                try{
                    var sorular = snapshot.val()['records']
                    var sureler = snapshot.val()['duration']
                }catch (e) {
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
                    var result = epochToDate(gun);
                    soruSonBirHafta[result] = 0;
                    i++;
                }

                // derslere ait süreleri topla
                for (key in sorular) {
                    if (sorular[key].time > petek.zaman.gecenHafta()) {
                        var tarih = epochToDate(sorular[key].time);
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
                    var result = epochToDate(gun);
                    konuSonBirHafta[result] = 0;
                    i++;
                }

                // konulara ait süreleri topla
                for (key in sureler) {
                    if (sureler[key].time > petek.zaman.gecenHafta()) {
                        var tarih = epochToDate(sureler[key].time)
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
                guncelleToplamSoruSure(tarihKonuSoruPerformans, sureSoruPerformans, sureKonuPerformans);
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
                    var tarih = epochToDate(sorular[sorularKeys[i]]['time'])
                    var saat = epochToTime(sorular[sorularKeys[i]]['time'])
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
                        "<button type=\"button\" rel=\"tooltip\" title=\"\" class=\"btn btn-danger btn-link btn-sm\" data-original-title=\"Sil\" onclick=\"soruSil('" + listeSorular[key].key + "')\"'>" +
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
                    var tarih = epochToDate(sureler[key]['time'])
                    var saat = epochToTime(sureler[key]['time'])
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
                        "<button type=\"button\" rel=\"tooltip\" title=\"\" class=\"btn btn-danger btn-link btn-sm\" data-original-title=\"Sil\" onclick=\"sureSil('" + listeSureler[key].key + "')\"'>" +
                        "<i class=\"material-icons\">close</i><div class=\"ripple-container\"></div></button>" +
                        "</td>\n" +
                        "</tr>");
                }
            })
        }
    },
    "f":{
        "soruSil":function (key){
            firebase.database().ref("users/" + current_user).child("records").child(key).remove();
        },
        "sureSil":function (key){
            firebase.database().ref("users/" + current_user).child("duration").child(key).remove();
        }
    }
}