<?php
    // Contains all server functions for creating and editing surveys
    // Also includes server function for storing comments
    class Survey {        
        public static function createSurvey($db){
            $conn = $db->getConnection('poll');

            $sql = "SELECT * FROM `pins` WHERE `pin`=?";
            $stmt = $conn->prepare($sql);
            
            $pin = Pin::getUniquePin($stmt);

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
            $result->execute(array($pin, $_SESSION['surName'], $acctName, $_SESSION['surText'], 1, "General"));

            echo $pin;
        }
        
        public static function updateSurvey($db){
            $conn = $db->getConnection('poll');
            
            $postData = $_POST["dataArray"];
            
            $oldSur = "[" . date ('Y-m-d h:i:s') . "] " . $postData['title'];
            
            $sql = "UPDATE questions SET surName = '" . $oldSur . "' WHERE surName = '" . $postData['title'] . "' AND acctName = '" . $_SESSION['userName'] . "'";
            $result = $conn->prepare($sql);
            $result->execute();
            
            $sql = "UPDATE comments SET surName = '" . $oldSur . "' WHERE surName = '" . $postData['title'] . "' AND acctName = '" . $_SESSION['userName'] . "'";
            $result = $conn->prepare($sql);
            $result->execute();
            
            $sql = "UPDATE results SET surName = '" . $oldSur . "' WHERE surName = '" . $postData['title'] . "' AND acctName = '" . $_SESSION['userName'] . "'";
            $result = $conn->prepare($sql);
            $result->execute();
            
            $sql = "UPDATE pins SET surName = '" . $oldSur . "', live='0' WHERE surName = '" . $postData['title'] . "' AND acctName = '" . $_SESSION['userName'] . "'";
            $result = $conn->prepare($sql);
            $result->execute();
            
            $sql = "UPDATE secReqs SET surName = '" . $oldSur . "' WHERE surName = '" . $postData['title'] . "' AND acctName = '" . $_SESSION['userName'] . "'";
            $result = $conn->prepare($sql);
            $result->execute();
            
            Survey::createSurvey($db);
            
            $sql = "UPDATE secReqs, (SELECT * FROM secReqs WHERE surName = '". $oldSur ."' AND acctName = '" . $_SESSION['userName'] . "') AS old SET secReqs.resources = old.resources, secReqs.resourceMarkup = old.resourceMarkup WHERE secReqs.surName = '" . $postData['title'] . "' AND secReqs.acctName = '" . $_SESSION['userName'] . "' AND secReqs.rLevel = old.rLevel";
            $result = $conn->prepare($sql);
            $result->execute();
        }

        public static function sendComment($db){
            $conn = $db->getConnection('taker');

            $surName = $_SESSION['surName'];
            $acctName = $_SESSION['acctName'];
            $comment = $_POST['comment'];

            $sql = "INSERT INTO `comments` (`recNum`, `acctName`, `surName`, `comment`) VALUES (0, ?, ?, ?);";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName, $surName, $comment));

            $notifObject = "~`#" . json_encode(array('nType' => 'comment', 'surName' => $_SESSION['surName'], 'time' => time()), JSON_FORCE_OBJECT);

            $sql = "UPDATE `notifications` SET count=count+1, notifications=CONCAT(notifications, ?) WHERE acctName=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($notifObject, $acctName));

            echo "<h3 style='text-align: center'>Thank you for your comments.</h3>";
        }
        
        public static function sendSurvey($db){ 
            $questions = Questions::getQuestions($db);
            $secReqs = SecReqs::getReqs($db);
            $surText = Survey::getSurText($db);
            $survey = json_encode(array($questions, $secReqs, $surText));
            echo $survey;
        }

        private static function getSurText($db){
            $conn = $db->getConnection('taker');

            $surName = $_SESSION['surName'];
            $acctName = $_SESSION['acctName'];

            $sql = 'SELECT `surText` FROM `pins` WHERE `acctName`=? AND `surName`=?;';
            $result = $conn->prepare($sql);
            $result->execute(array($acctName, $surName));

            $row = $result->fetch(PDO::FETCH_ASSOC);
            
            return $row['surText'];
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
