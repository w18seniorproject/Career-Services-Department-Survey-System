<?php

$token = $_GET['token'];
if(preg_match('/^[0-9A-Fa-f]$/', $token)){

    if($_POST["newPassword"] === $POST["confirmPassword"]){

    }
    else{
        echo "Passwords do not match.";
    }
}
?>