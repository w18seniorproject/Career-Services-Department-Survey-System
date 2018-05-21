<?php

    class Results{
        
        public static function GetResults($db){
            $conn = $db->getConnection('poll');

            $acctName = $_SESSION['userName'];
            $surName = $_SESSION['surName'];

            $questions = Questions::getQuestions($db);
            $secReqs = SecReqs::getReqs($db);
            $comments = Results::getComments($conn, $acctName, $surName);

            $sql = "SELECT `groupName`, `surResults`, `rLevel`, `time` FROM `results` WHERE `acctName`=? AND `surName`=?;";
            $stmt = $conn->prepare($sql);
            $stmt->execute(array($acctName, $surName));

            $rNum = $stmt->rowCount();

            if($rNum > 0){
                $resultsArr = array();

                while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                    extract($row);

                    $result = array(
                        "surName" => $surName,
                        "groupName" => $groupName,
                        "surResults" => $surResults,
                        "rLevel" => $rLevel,
                        "time" => $time
                    );
                    $resultsArr[] = $result;
                }
                $resultsJSON = json_encode($resultsArr);

                $toReturn = array($questions, $secReqs, $resultsJSON, $comments);
                echo json_encode($toReturn);
            }
            else{
                echo "THERE ARE NO RESULTS TO BE HAD";
            }
        }
        
        public static function getComments($conn, $acctName, $surName){
            $sql = "SELECT `comment` FROM `comments` WHERE `acctName`=? AND `surName`=?;";
            $stmt = $conn->prepare($sql);
            $stmt->execute(array($acctName, $surName));

            $rNum = $stmt->rowCount();

            if($rNum > 0){
                $commentsArray = array();

                while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                    $commentsArray[] = $row["comment"];
                }
                return json_encode($commentsArray);
            }
            else{
                return "THERE ARE NO COMMENTS";
            }
        }
    }