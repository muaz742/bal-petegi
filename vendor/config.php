<?php

# php hata görünümü aktifleştir
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/*
# php hata görünümü pasifleştir
error_reporting(0);
*/

# veritabanı bağlantı bilgilerini tanımla
$vtSunucu = "";
$vtIsim = "";
$vtKullaniciIsim = "";
$vtKullaniciParola = "";