<?php

    class Results{
        
        public static function GetResults($db){
            $conn = $db->getConnection('taker');

            $acctName = $_SESSION['userName'];
            $surName = $_POST['surName'];

            $questions = Questions::getQuestions($db);
            $secReqs = SecReqs::getReqs($db);

            $sql = "SELECT `groupName`, `surResults`, `rLevel`, `time` FROM `results` WHERE `acctName`=? AND `surName`=?;";
            $stmt = $conn->prepare($sql);
            $stmt->execute(array($acctName, $surName));

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

                $toReturn = array($questions, $secReqs, $resultsJSON);
                return json_encode($toReturn);
            }
            else{
                return "THERE ARE NO RESULTS TO BE HAD";
            }
            
            

        }

        private static function parseResults($surResults){
            
        }
        
    }