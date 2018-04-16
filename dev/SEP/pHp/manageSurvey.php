<?php
    class ManageSurvey{
        public static function SetSurveyData($db){
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
            

            //TODO Fix minScore stuff. Just temporary filler for now
            $length = count($resources);
            for($i=0; $i < $length; $i++){
                $sql = "INSERT INTO `secreqs` (`acctName`, `surName`, `rLevel`, `resources`, `minScore`) VALUES (?, ?, ?, ?, ?);";
                $results = $conn->prepare($sql);
                $results->execute(array($acctName, $surName, $i+1, $resources[$i], 0));
            }
            header("Location: pDashboard.html?debug=$resourceJSON");
            die("Success");
        }

        public static function GetResources($db){
            $conn = $db->getConnection('poll');

            $surName = $_POST['surName'];
            $acctName = $_SESSION['acctName'];

            $sql = "SELECT `resources` FROM secreqs WHERE `acctName`=? AND `surName`=?;";
            $results = $conn->prepare($sql);
            $results->execute(array($acctName, $surName));
            $resources = array();

            while ($row = $results->fetch(PDO::FETCH_ASSOC)){	
                $resources[] = $row;
            } 

            echo json_encode($resources);
        }

        public static function GetSectionNum(){
            $rLevel = $_SESSION['rLevel'];
            echo $rLevel;
        }
    }
?>