<?php
    include_once("../config/takerDB.php");

    $database = new Database();
    $conn = $database->getConnection();

    session_start();
    $surName = $_SESSION['surName'];
    $acctName = $_SESSION['acctName'];
    $comment = $_POST['comment'];

    $sql = "INSERT INTO `comments` (`recNum`, `acctName`, `surName`, `comment`) VALUES (0, ?, ?, ?);";
    $result = $conn->prepare($sql);
    $result->execute(array($acctName, $surName, $comment));

    echo "<h3 style='text-align: center'>Thank you for your thoughts</h3>";
    
?>