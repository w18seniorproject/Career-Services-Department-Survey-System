<?php
    include_once("../config/pollsterDB.php");

    $database = new Database();

    $conn = $database->getConnection();

    $postData = $_POST["dataArray"];

    $sections = explode("\$~\$", $postData);

    $surTitle = $sections[0];

    $toReturn = "";

    foreach($sections as $i){
        $toReturn .= $i."</br>";
    }

    echo $toReturn;

?>
