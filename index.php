<?php

# ön yükleme komutları
require_once "vendor/autoload.php";

# http talebini ayikla
$talep = explode('/', $_SERVER['REQUEST_URI']);

# talebe göre işlem yap
switch ($talep[1]) {
    case "dev": # geliştirici alanı yolu
        include "infodev.html";
        break;
    case "giris-yap": # oturum giriş yolu
        include "vendor/giris-yap.php";
        break;
    case "soru-gir": # soru giriş yolu
        include "vendor/soru-gir.php";
        break;
    case "hasilat": # panel yolu
        include "vendor/hasilat.php";
        break;
    case "oturumu-kapat": # oturumu kapat yolu
        include "vendor/profil.php";
        break;
    default:
        include "public.html";
}