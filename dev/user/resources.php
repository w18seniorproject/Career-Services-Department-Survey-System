<?php
    include_once("../config/takerDB.php");

    $database = new Database();
    $conn = $database->getConnection();

    session_start();
    $surName = $_SESSION['surName'];
    $acctName = $_SESSION['acctName'];
    $rLevel = $_POST['rLevel'];

    $sql = "SELECT `resources` FROM `resources` WHERE `acctName` = ? and `surName` = ? and `rLevel` = ?;";
    $result = $conn->prepare($sql);
    $result->execute(array($acctName, $surName, $rLevel));

    $row = $result->fetch(PDO::FETCH_ASSOC);

    echo $row['resources'];
?>