<?php
    class PollsterDashboard {
        public static function GetSurveys($db){

            $conn = $db->getConnection('poll');
            
            $acctName = $_SESSION['userName'];

            $sql = "SELECT surName, pin, surText, live FROM pins WHERE acctName= ? ORDER BY surName;";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName));

            if($result->rowCount() > 0){
                $surveyArr = array();
                $prevSurName = "";
                while($row = $result->fetch(PDO::FETCH_ASSOC)){
                    extract($row);
                    if($surName != $prevSurName){
                        $survey = array(
                            "surName" => $surName,
                            "pin" => $pin,
                            "surText" => $surText,
                            "live" => $live
                        );
                        $surveyArr[] = $survey;
                        $prevSurName = $surName;
                    }
                }
                echo json_encode($surveyArr);
            }
            else{
                echo "NONE";
            }
        }

        public static function GetSurveyQuestions($db){
            $conn = $db->getConnection('poll');
            
            $acctName = $_SESSION['userName'];


        }





    }