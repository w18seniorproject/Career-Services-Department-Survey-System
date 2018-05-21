<?php
    include_once '../config/takerDB.php';
    include_once '../objects/question.php';

    session_start();

    if(isset($_SESSION["questions"])){
        if(isset($_SESSION["surText"])){
            echo $_SESSION["surText"];
            unset($_SESSION['surText']);
            die();
        }
        else{
            echo $_SESSION["questions"];
            die();
        }
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