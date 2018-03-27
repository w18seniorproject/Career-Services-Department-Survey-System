<?php
    include_once("../config/pollsterDB.php");

    $database = new Database();

    $conn = $database->getConnection();

    $surText = $_POST["surText"];

    $pin = random_int(1000, 9999);

    $postData = $_POST["dataArray"];

    $sections = explode("\$~\$", $postData);

    $surTitle = $sections[0];
    session_start();
    $acctName = $_SESSION['acctName'];
    array_splice($sections, 0, 0);
    $secNum = 0;

    foreach($sections as $section){
        $questions = explode("~\$~", $section);
        $secTitle = array_shift($questions);
        $qNum = 0;
        foreach($questions as $question){
            $qNum++;
            $choices = explode("#~#", $question);
            $qText = array_shift($choices);
            if($choices[0][0] == "m"){
                $choice = explode("~#~", $choices[0]);
                $type = array_shift($choice);
                $ans = "";
                $cTexts = "";
                $weight = 1;
                foreach($choice as $part){
                    $cText = substr($part, 0, -4);
                    $selected = substr($part, -1);
                    if($selected == 't'){
                        $ans = $cText;
                        $weight = 2;
                    }
                    $cTexts .= $cText."~$#";
                }
                $cTexts = substr($cTexts, 0, -3);
                choiceAddToDB($conn, $surTitle, $qNum, $type, $qText, $cTexts, $ans, $weight, $secNum, $secTitle, $acctName);
            }
            else if($choices[0][0] == "c"){
                $choice = explode("~#~", $choices[0]);
                $type = array_shift($choice);
                $ans = "";
                $cTexts = "";
                $weight = 1;
                foreach($choice as $part){
                    $cText = substr($part, 0, -4);
                    $selected = substr($part, -1);
                    if($selected == 't'){
                        $ans .= $cText."~$#";
                        $weight = 2;
                    }
                    $cTexts .= $cText."~$#";
                }
                $cTexts = substr($cTexts, 0, -3);
                choiceAddToDB($conn, $surTitle, $qNum, $type, $qText, $cTexts, $ans, $weight, $secNum, $secTitle, $acctName);
            }
            else if($choices[0][0] == "t"){
                $type = "tf";
                $ans = substr($choices[0], 3);
                $weight = 2;
                if($ans == "none"){
                    $weight = 1;
                }
                otherAddToDB($conn, $surTitle, $qNum, $type, $qText, $ans, $weight, $secNum, $secTitle, $acctName);
            }
            else if($choices[0][0] == "s"){
                $type = "s";
                $ans = substr($choices[0], 2);
                $weight = 2;
                if($ans == "none"){
                    $weight = 1;
                }
                otherAddToDB($conn, $surTitle, $qNum, $type, $qText, $ans, $weight, $secNum, $secTitle, $acctName);
            }
        }
        $secNum++;
    }

    $sql = "INSERT INTO `pins` (`pin`, `surName`, `acctName`, `surText`) VALUES (?, ?, ?, ?);";
    $result = $conn->prepare($sql);
    $result->execute(array($pin, $surTitle, $acctName, $surText));

    //TODO add redirect here to AfterLanding Page
    echo "Your pin is ".$pin;

    function otherAddToDB($conn, $surName, $qNum, $qType, $qText, $qAns, $qWeight, $rLevel, $rName, $acctName){
        $sql = "INSERT INTO `questions` (`surName`, `qNum`, `qType`, `qText`, `qAns`, `qWeight`, `rLevel`, `rName`, `acctName`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
        $result = $conn->prepare($sql);
        $result->execute(array($surName, $qNum, $qType, $qText, $qAns, $qWeight, $rLevel, $rName, $acctName));
    }

    function choiceAddToDB($conn, $surName, $qNum, $qType, $qText, $qChoices, $qAns, $qWeight, $rLevel, $rName, $acctName){
        $sql = "INSERT INTO `questions` (`surName`, `qNum`, `qType`, `qText`, `qChoices`, `qAns`, `qWeight`, `rLevel`, `rName`, `acctName`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        $result = $conn->prepare($sql);
        $result->execute(array($surName, $qNum, $qType, $qText, $qChoices, $qAns, $qWeight, $rLevel, $rName, $acctName));
    }
?>
