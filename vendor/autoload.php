<?php

# SSL yönlendirmesi yap
if ($_SERVER['SERVER_PORT'] != 443) {
    echo "bağlantı iyileştiriliyor";
    $target = "https://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
    header("Refresh:2; url=".$target);
    exit();
}

# oturum kaydı başlat
session_start();

# ayarlamaları tanımla
require_once "config.php";

# SQL bağlantısı yap
require_once "connectSql.php";

# genel fonksiyonları yükle
require_once "functions.php";