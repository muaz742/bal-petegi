<?php

# ön yükleme komutları
require_once "vendor/autoload.php";

# http talebini ayikla
$talep = explode('/', $_SERVER['REQUEST_URI']);

# talebe göre işlem yap
switch ($talep[1]) {
    case "dev": # geliştirici alanı
        include "infodev.html";
        break;
    case "giris": # giriş ekranı
        include "vendor/giris.php";
        break;
    case "kayit": # kayıt ekranı
        include "vendor/kayit.php";
        break;
    case "panel": # panel ekranları
        if (isset($talep[2])) {
            if ($talep[2] == 'polenEkle') # polen ekleme ekranı
                include "vendor/polenEkle.php";
        } else {
            include "vendor/panel.php"; # giriş paneli
        }
        break;
    case "profil": # profil ekranı
        include "vendor/profil.php";
        break;
    default:
        include "public.html";
}