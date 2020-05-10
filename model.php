<?php

# ön yükleme komutları
require_once "vendor/autoload.php";

# kullanıcı kaydı ekleme fonksiyonu
function kayitEkle($ePosta, $adi, $soyadi, $dogumYili, $sehir, $parola)
{
    global $db;
    $sorgu = $db->prepare('INSERT INTO `kisiler` 
                                    (
                                    `e_posta`, 
                                    `adi`, 
                                    `soyadi`, 
                                    `dogum_yili`, 
                                    `sehir`, 
                                    `parola`, 
                                    `zaman`
                                    ) 
                                    VALUES 
                                    (?, ?, ?, ?, ?, ?, ?)
        ');
    $zaman = time();
    try {
        $calistir = $sorgu->execute([
            $ePosta,
            $adi,
            $soyadi,
            $dogumYili,
            $sehir,
            $parola,
            $zaman
        ]);
        ($calistir)?header("Location: /index?durum=basarili"):null;
    } catch (PDOException $e) {
        die($e->getMessage());
    }
}

//header("Location: https://".$_SERVER['HTTP_HOST']);