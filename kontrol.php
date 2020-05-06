<?php
//Prepared by Yılmaz ALACA
require_once "baglan.php";

if (isset($_GET['gonder'])) {
    $kullanici = isset($_GET['kullanici_adi']) ? $_GET['kullanici_adi'] : NULL;
    $ad = isset($_GET['adi']) ? $_GET['adi'] : NULL;
    $soyad = isset($_GET['soyadi']) ? $_GET['soyadi'] : NULL;
    $mail = isset($_GET['e_posta']) ? $_GET['e_posta'] : NULL;
    $il = isset($_GET['il']) ? $_GET['il'] : NULL;
    $zaman = time();

    if (!$kullanici && !$ad && !$soyad && !$mail && !$il) {
        echo "Lütfen veri giriniz!";
    } elseif (!$kullanici) {
        echo "Kullanıcı adını giriniz!";
    } else if (!$ad) {
        echo "Ad giriniz!";
    } else if (!$soyad) {
        echo "Soyad giriniz!";
    } else if (!$mail) {
        echo "Mailinizi giriniz!";
    } else if (!$il) {
        echo "İlinizi giriniz!";
    } else if (!$zaman) {
        echo "Çözdüğünüz süreyi giriniz!";
    } else {
        echo "kontroller tamam";
        //exit();
        $sorgu = $db->prepare('INSERT INTO kisiler SET
        kullanici_adi=?,
        adi=?,
        soyadi=?,
        e_posta=?,
        il=?,
        zaman=?
        ');
        echo "";
        //ekleme
        $ekle = $sorgu->execute([
            $ad, $soyad, $kullanici, $mail, $il, $zaman
        ]);

        if ($ekle) {
            header('Location:index.php?durum=basarili');
        }
    }
}