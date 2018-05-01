<?php

    class Results{
        
        public static function GetResults($db){
            $conn = $db->getConnection('taker');

            $acctName = $_SESSION['userName'];
            $surName = $_POST['surName'];

            $sql = "SELECT `groupName`, `surResults`, `rLevel`, `time` FROM `results` WHERE `acctName`=? AND `surName`=?;";
            $stmt = $conn->prepare($sql);
            $stmt->execute(array($acctName, $surName));

            $rNum = $stmt->rowCount();

            if($rNum > 0){
                $resultsArray = array();

                while($row = $result->fetch(PDO::FETCH_ASSOC)){
                    extract($row);

                    $result=array(
                        "groupName" => $groupName,
                        "surResults" => $surResults,
                        "rLevel" => $rLevel,
                        "time" => $time
                    );

                    $resultsArray[] = $result;
                }
                echo json_encode($resultsArray);
            }
            else{
                echo "THERE ARE NO RESULTS TO BE HAD";
            }
        }
        
    }