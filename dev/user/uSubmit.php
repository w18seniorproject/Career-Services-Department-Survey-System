<?php
    include_once("../config/takerDB.php");

    $database = new Database();
    $conn = $database->getConnection();

    session_start();
    $surName = $_SESSION['surName'];
    $groupName = $_SESSION['groupName'];
    $results = $_POST["results"];
    $rLevel = $_POST["rLevel"];

    $sql = "INSERT INTO `results` (`recNum`, `surName`, `groupName`, `surResults`, `rLevel`) VALUES (0, ?, ?, ?, ?);";
    $result = $conn->prepare($sql);
    $result->execute(array($surName, $groupName, $results, $rLevel));
    header("Location: thankyou.html?rLevel=$rLevel");
?>