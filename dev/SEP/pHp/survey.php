<?php
    class Survey {        
        public static function createSurvey($db){
            $conn = $db->getConnection('poll');

            $surText = $_POST["surText"];

            $pin = random_int(1000, 9999);

            $postData = $_POST["dataArray"];

            $sections = explode("\$~\$", $postData);

            $surTitle = $sections[0];
            session_start();
            $acctName = $_SESSION['userName'];
            $_SESSION['surName'] = $surTitle;
            $_SESSION['surText'] = $surText;
            array_splice($sections, 0, 0);
            $secNum = 0;
            $qNum = 0;

            foreach($sections as $section){
                $questions = explode("~\$~", $section);
                $secTitle = array_shift($questions);
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
                        Survey::choiceAddToDB($conn, $surTitle, $qNum, $type, $qText, $cTexts, $ans, $weight, $secNum, $secTitle, $acctName);
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
                        Survey::choiceAddToDB($conn, $surTitle, $qNum, $type, $qText, $cTexts, $ans, $weight, $secNum, $secTitle, $acctName);
                    }
                    else if($choices[0][0] == "t"){
                        $type = "tf";
                        $ans = substr($choices[0], 3);
                        $weight = 2;
                        if($ans == "none"){
                            $weight = 1;
                        }
                        Survey::otherAddToDB($conn, $surTitle, $qNum, $type, $qText, $ans, $weight, $secNum, $secTitle, $acctName);
                    }
                    else if($choices[0][0] == "s"){
                        $type = "s";
                        $ans = substr($choices[0], 2);
                        $weight = 2;
                        if($ans == "none"){
                            $weight = 1;
                        }
                        Survey::otherAddToDB($conn, $surTitle, $qNum, $type, $qText, $ans, $weight, $secNum, $secTitle, $acctName);
                    }
                }
                $secNum++;
            }

            $_SESSION['rLevel'] = $secNum;

            $sql = "INSERT INTO `pins` (`pin`, `surName`, `acctName`, `surText`) VALUES (?, ?, ?, ?);";
            $result = $conn->prepare($sql);
            $result->execute(array($pin, $surTitle, $acctName, $surText));

            header("Location: ./pollster/manageSurvey.html?pin=$pin");
        }
        
        public static function sendSurvey($db){ 
            $questions = Questions::getQuestions($db);
            $secReqs = SecReqs::getReqs($db);
            $survey = json_encode(array($questions, $secReqs));
            echo $survey;
        }
        
        public static function SetGroupsAndResources($db){ 
            $conn = $db->getConnection('poll');

            $surName = $_SESSION['surName'];
            $surText = $_SESSION['surText'];
            $acctName = $_SESSION['userName'];
            $resourceJSON = $_POST['resources'];
            $pinJSON = $_POST['pins'];
            $groupJSON = $_POST['groups'];
            $resources = json_decode($resourceJSON, true);
            $pins = json_decode($pinJSON, true);
            $groups = json_decode($groupJSON, true);

            $length = count($pins);
            for($i = 0; $i < $length; $i++){
                $sql = "INSERT INTO `pins` (`pin`, `surName`, `acctName`, `surText`, `groupName`) VALUES (?, ?, ?, ?, ?);";
                $results = $conn->prepare($sql);
                $results->execute(array($pins[$i], $surName, $acctName, $surText, $groups[$i]));
            }

            $length = count($resources);
            for($i=0; $i < $length; $i++){
                $sql = "INSERT INTO `resources` (`acctName`, `surName`, `rLevel`, `resources`) VALUES (?, ?, ?, ?);";
                $results = $conn->prepare($sql);
                $results->execute(array($acctName, $surName, $i+1, $resources[$i]));
            }
            header("Location: ./pollster/pDashboard.html?debug=$resourceJSON");
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
    }
