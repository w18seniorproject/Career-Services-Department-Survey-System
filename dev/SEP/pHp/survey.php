<?php
    class Survey {        
        public static function createSurvey($db){
            $conn = $db->getConnection('poll');

            //TO-DO: Check if pin is taken after generation
            $pin = random_int(1000, 9999);

            $postData = $_POST["dataArray"];

            $acctName = $_SESSION['userName'];
            $_SESSION['surName'] = $postData['title'];
            $_SESSION['surText'] =  $_POST["surText"];

            foreach($postData['sections'] as $section){  
                foreach($section['questions'] as $question){
                    if($question['type'] == "mc" || $question['type'] == "chk"){
                        Survey::choiceAddToDB($conn, $_SESSION['surName'], $question['num'], $question['type'], $question['text'], $question['answers'], $question['qAns'], $question['weight'], $section['secNum'], $section['secName'], $acctName);
                    }else{
                        Survey::otherAddToDB($conn, $_SESSION['surName'], $question['num'], $question['type'], $question['text'], $question['qAns'], $question['weight'], $section['secNum'], $section['secName'], $acctName);
                    }      
                }
                Survey::secAddToDB($conn, $acctName, $_SESSION['surName'], $section['secNum'], $section['minScore']);
                $secNum = $section['secNum'];
            }

            $_SESSION['rLevel'] = $secNum + 1;

            $sql = "INSERT INTO `pins` (`pin`, `surName`, `acctName`, `surText`, `live`, `groupName`) VALUES (?, ?, ?, ?, ?, ?);";
            $result = $conn->prepare($sql);
            $result->execute(array($pin, $_SESSION['surName'], $acctName, $_SESSION['surText'], 0, "General"));

            echo $pin;
        }

        public static function sendComment($db){
            $conn = $db->getConnection('taker');

            $surName = $_SESSION['surName'];
            $acctName = $_SESSION['acctName'];
            $comment = $_POST['comment'];

            $sql = "INSERT INTO `comments` (`recNum`, `acctName`, `surName`, `comment`) VALUES (0, ?, ?, ?);";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName, $surName, $comment));

            echo "<h3 style='text-align: center'>Thank you for your thoughts</h3>";
        }
        
        public static function sendSurvey($db){ 
            $questions = Questions::getQuestions($db);
            $secReqs = SecReqs::getReqs($db);
            $survey = json_encode(array($questions, $secReqs));
            echo $survey;
        }
               
        private static function otherAddToDB($conn, $surName, $qNum, $qType, $qText, $qAns, $qWeight, $rLevel, $rName, $acctName){
            $sql = "INSERT INTO `questions` (`surName`, `qNum`, `qType`, `qText`, `qAns`, `qWeight`, `rLevel`, `rName`, `acctName`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
            $result = $conn->prepare($sql);
            $result->execute(array($surName, $qNum, $qType, $qText, $qAns, $qWeight, $rLevel, $rName, $acctName));
        }

        private static function choiceAddToDB($conn, $surName, $qNum, $qType, $qText, $qChoices, $qAns, $qWeight, $rLevel, $rName, $acctName){
            $sql = "INSERT INTO `questions` (`surName`, `qNum`, `qType`, `qText`, `qChoices`, `qAns`, `qWeight`, `rLevel`, `rName`, `acctName`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
            $result = $conn->prepare($sql);
            $result->execute(array($surName, $qNum, $qType, $qText, $qChoices, $qAns, $qWeight, $rLevel, $rName, $acctName));
        }
        
        private static function secAddToDB($conn, $acctName, $surName, $rLevel, $minScore){
            $sql = "INSERT INTO `secReqs` (`acctName`, `surName`, `rLevel`, `minScore`) VALUES (?, ?, ?, ?);";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName, $surName, $rLevel, $minScore));
        }
    }
