<?php
    class ManageSurvey{
        public static function SetSurveyData($db){
            $conn = $db->getConnection('poll');

            $surName = $_SESSION['surName'];
            $surText = $_SESSION['surText'];
            $acctName = $_SESSION['userName'];
            $resourceJSON = $_POST['resources'];
            $resourceMarkupJSON = $_POST['resourceMarkup'];
            $liveornot = $_POST['liveornot'];
            $pinJSON = $_POST['pins'];
            $groupJSON = $_POST['groups'];
            $resources = json_decode($resourceJSON, true);
            $resourceMarkup = json_decode($resourceMarkupJSON, true);
            $pins = json_decode($pinJSON, true);
            $groups = json_decode($groupJSON, true);

            $sql = "DELETE FROM `pins` WHERE `acctName`=? AND `surName`=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName, $surName));
            
            $length = count($pins);
            for($i = 0; $i < $length; $i++){
                $sql = "INSERT INTO `pins` (`pin`, `surName`, `acctName`, `surText`, `groupName`, `live`) VALUES (?, ?, ?, ?, ?, ?);";
                $results = $conn->prepare($sql);
                $results->execute(array($pins[$i], $surName, $acctName, $surText, $groups[$i], $liveornot));
            }
            
            $sql = "DELETE FROM `secreqs` WHERE `acctName`=? AND `surName`=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName, $surName));

            //TODO Fix minScore stuff. Just temporary filler for now
            $length = count($resources);
            for($i=0; $i < $length; $i++){
                $sql = "INSERT INTO `secreqs` (`acctName`, `surName`, `rLevel`, `resources`, `minScore`, `resourceMarkup`) VALUES (?, ?, ?, ?, ?, ?);";
                $results = $conn->prepare($sql);
                $results->execute(array($acctName, $surName, $i+1, $resources[$i], 0, $resourceMarkup[$i]));
            }
            header("Location: pollster/pDashboard.html?debug=$resourceJSON");
            die("Success");
        }

        public static function GetResources($db){
            $conn = $db->getConnection('poll');

            $surName = $_POST['surName'];
            $acctName = $_SESSION['userName'];

            $sql = "SELECT `resourceMarkup` FROM secreqs WHERE `acctName`=? AND `surName`=?;";
            $results = $conn->prepare($sql);
            $results->execute(array($acctName, $surName));
            $resources = array();

            while ($row = $results->fetch(PDO::FETCH_ASSOC)){	
                $resources[] = $row;
            } 

            echo json_encode($resources);
        }

        public static function GetPins($db){
            $conn = $db->getConnection('poll');

            $surName = $_POST['surName'];
            $surText = $_POST['surText'];
            $_SESSION['surText'] = $surText;
            $_SESSION['surName'] = $surName;
            $acctName = $_SESSION['userName'];

            $sql = "SELECT `pin`, `groupName` FROM `pins` WHERE `acctName`=? AND `surName`=?;";
            $results = $conn->prepare($sql);
            $results->execute(array($acctName, $surName));
            $pins = array();

            while($row = $results->fetch(PDO::FETCH_ASSOC)){
                $pins[] = $row;
            }

            echo json_encode($pins);
        }

        public static function GetSectionNum(){
            $rLevel = $_SESSION['rLevel'];
            echo $rLevel;
        }
    }
?>