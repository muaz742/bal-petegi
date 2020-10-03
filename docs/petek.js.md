# petek.js
Bal Peteği sistem objesi kayıtları.

## petek.js yapısı

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

## sürüm notları
* 0.1.0. petek objesi oluşturuldu. hasılat ekrenı işlemleri eklendi.
* 0.2.0. bütün ekran işlemleri eklendi
* 0.2.1. kod bloğunun üst kısmına geliştirici notu eklendi.