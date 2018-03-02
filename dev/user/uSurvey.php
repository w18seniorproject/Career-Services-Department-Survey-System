<?php
    include_once '../config/takerDB.php';
    include_once '../objects/question.php';

    $db = new Database();
    $conn = $db->getConnection();
    $question = new Question($conn);

    $questionStatement = $question->getQuestions('test', 'totallykvothe');

    $array = $questionStatement->fetch(PDO::FETCH_ASSOC);


    //This is just a test to make sure Questions object is working.
    echo $array['qNum'] . $array['qText'];