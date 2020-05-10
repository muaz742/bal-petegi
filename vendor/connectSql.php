<?php

require_once "config.php";

# veritabanı bağlantısı kur
try {
    $db = new PDO("mysql:host=$vtSunucu;dbname=$vtIsim;charset=utf8", "$vtKullaniciIsim", "$vtKullaniciParola");
} catch (PDOException $e) {
    print $e->getMessage();
}