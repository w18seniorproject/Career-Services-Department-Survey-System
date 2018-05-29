<?php
    // Contains all server functions needed in the survey dashboard page, including:
    // Getting a list of surveys for display
    // Getting notification status
    class PollsterDashboard {
        public static function GetSurveys($db){

            $conn = $db->getConnection('poll');
            
            $acctName = $_SESSION['userName'];

            $sql = "SELECT surName, pin, surText, live FROM pins WHERE acctName=? ORDER BY surName;";
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

        public static function getNotificationCount($db){
            $conn = $db->getConnection('poll');

            $acctName = $_SESSION['userName'];

            $sql = "SELECT count FROM notifications WHERE acctName=?;";
            $stmt = $conn->prepare($sql);
            $stmt->execute(array($acctName));

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row["count"] > 0){
                echo "true";
                return;
            }
            echo "false";
            return;
        }

        public static function getNotifications($db){
            $conn = $db->getConnection('poll');

            $acctName = $_SESSION['userName'];

            $sql = "SELECT `notifications`, `count` FROM notifications WHERE acctName=?";
            $stmt = $conn->prepare($sql);
            $stmt->execute(array($acctName));

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $sql = "UPDATE `notifications` SET count=0;";
            $stmt = $conn->prepare($sql);
            $stmt->execute();

            echo json_encode($row);
            return;
        }
    }