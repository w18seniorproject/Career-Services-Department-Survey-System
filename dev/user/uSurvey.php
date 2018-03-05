<?php
    include_once '../config/takerDB.php';
    include_once '../objects/question.php';

    session_start();

    //If this file has already been run, that means
    //that this request is from the ajax in uSurvey.js
    //So it will run the following and die.
    if(isset($_SESSION["questions"])){
        echo $_SESSION["questions"];
        die();
    }

    $db = new Database();
    $conn = $db->getConnection();
    $question = new Question($conn);

    $questionStatement = $question->getQuestions($_SESSION["surName"], $_SESSION["acctName"]);
    $qArray = array();
    $i = 'I';

    while($row = $questionStatement->fetch(PDO::FETCH_ASSOC)){
        $qArray[$i] = $row;
        $i = $i . 'I';
    }
    $_SESSION['questions'] = json_encode($qArray);
    $_SESSION['startTime'] = time();

    header("Location: uSurvey.html");