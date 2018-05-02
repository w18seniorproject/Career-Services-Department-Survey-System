<?php

    class Results{
        
        public static function GetResults($db){
            $conn = $db->getConnection('taker');

            $acctName = $_SESSION['userName'];
            $surName = $_POST['surName'];

            $sql = "SELECT `groupName`, `surResults`, `rLevel`, `time` FROM `results` WHERE `acctName`=? AND `surName`=?;";
            $resultsSTMT = $conn->prepare($sql);
            $resultsSTMT->execute(array($acctName, $surName));

            $sql = "SELECT `qNum`, `qType`, `qText`, `qChoices`, `qAns`, `qWeight`, `rLevel` AS `qrLevel`, `rName` AS `qrName` FROM `questions` WHERE `acctName`=? AND `surName`=?;";
            $questionsSTMT = $conn->prepare($sql);
            $questionsSTMT->execute(array($acctName, $surName));



            $rNum = $resultsSTMT->rowCount();

            if($rNum > 0){
                $returnArr = array();
                while($rRow = $resultsSTMT->fetch(PDO::FETCH_ASSOC)){
                    extract($rRow);

                    $qResults = parseResults($surResults);

                    $result = array(
                        "groupName" => $groupName,
                        "rName" => $rName,
                        "rLevel" =>$rLevel,
                        "time" => $time,
                        "qPoints" => $qPoints,
                        "surResults" => $surResultsJSON
                    );
                    $returnArr[] = $result;
                }
                $rRow = $resultsSTMT->fetch(PDO::FETCH_ASSOC);



            }

            
            else{
                echo "THERE ARE NO RESULTS TO BE HAD";
            }
        }

        private static function parseResults($surResults){
            
        }
        
    }