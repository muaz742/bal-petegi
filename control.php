<?php

# ön yükleme komutları
require_once "vendor/autoload.php";

# model fonksiyonları yükle
require_once "model.php";

if (p('gonder')=='kayit'){
    $ePosta= p('e_posta');
    $adi= p('adi');
    $soyadi= p('soyadi');
    $dogumYili= p('dogum_yili');
    $sehir= p('sehir');
    $parola= p('parola');
    $parola = base64_encode($parola);
    /*print_r($ePosta);
    print_r($adi);
    print_r($soyadi);
    print_r($dogumYili);
    print_r($sehir);
    print_r($parola);
    exit();*/

    kayitEkle($ePosta,$adi,$soyadi,$dogumYili,$sehir,$parola);
    exit();
}

header("Location: https://".$_SERVER['HTTP_HOST']);