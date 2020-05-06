<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function g($par)
{
    isset($_GET[$par]) ? $par = $_GET[$par] : $par = "0";
    return $par;
}

session_start();
require_once 'baglan.php';

if (g('durum') == 'basarili') {
    echo "
<p>
<iframe src=\"https://giphy.com/embed/S72oGXEktzs5wF2ftv\" width=\"480\" height=\"480\" frameBorder=\"0\" class=\"giphy-embed\" allowFullScreen></iframe><p><a href=\"https://giphy.com/gifs/trt-network-magnificent-helal-olsun-maallah-S72oGXEktzs5wF2ftv\"></a></p>
<a>Başarılı</a>
<br>
Geri dönmek için 
<a href='/index.php'>tıklayın</a>.
</p>     
     ";
    exit();
} elseif (g('durum') == 'hata') {
    echo "
<p>
<iframe src=\"https://giphy.com/embed/dASc6rD8EOXEQ\" width=\"480\" height=\"419\" frameBorder=\"0\" class=\"giphy-embed\" allowFullScreen></iframe><p><a href=\"https://giphy.com/gifs/justin-bieber-dancing-dASc6rD8EOXEQ\"></a></p>
Geri dönmek için 
<a href='/index.php'>tıklayın</a>.
</p>     
     ";
    exit();
}

include "gui.html";

?>