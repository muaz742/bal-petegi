<?php

# GET yoklama fonksiyonu
function g($par)
{
    isset($_GET[$par]) ? $par = $_GET[$par] : $par = "0";
    return $par;
}

# POST yoklama fonksiyonu
function p($par)
{
    isset($_POST[$par]) ? $par = htmlspecialchars(addslashes(trim($_POST[$par]))) : $par = 0;
    return $par;
}