<?php
    include_once("../config/takerDB.php");

    $database = new Database();
    $conn = $database->getConnection();

    session_start();
    $surName = $_SESSION['surName'];
    $groupName = $_SESSION['groupName'];
    $startTime = $_SESSION['startTime'];
    $results = $_POST["results"];
    $rLevel = $_POST["rLevel"];
    $curTime = time();
    $time = $curTime - $startTime;

    $sql = "INSERT INTO `results` (`recNum`, `surName`, `groupName`, `surResults`, `rLevel`, `time`) VALUES (0, ?, ?, ?, ?, ?);";
    $result = $conn->prepare($sql);
    $result->execute(array($surName, $groupName, $results, $rLevel, $time));
    header("Location: thankyou.html?rLevel=$rLevel");
?>