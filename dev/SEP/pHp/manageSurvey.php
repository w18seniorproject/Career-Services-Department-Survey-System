<?php
    // Contains all server functions for managing surveys and groups, including:
    // Adding, removing, and changing groups
    // Adding, removing, and changing pins
    // Editing survey section resources
    // Making a survey live or not live
    // Deleting a survey
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

            $sql = "SELECT minScore, rLevel FROM secReqs WHERE surName=? AND acctName=?;";
            $stmt = $conn->prepare($sql);
            $stmt->execute(array($surName, $acctName));
            $minScores = array();
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $minScores[$row['rLevel']] = $row['minScore'];
            }
            
            $sql = "DELETE FROM `secReqs` WHERE `acctName`=? AND `surName`=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName, $surName));

            $length = count($resources);
            for($i=0; $i < $length; $i++){
                $sql = "INSERT INTO `secReqs` (`acctName`, `surName`, `rLevel`, `resources`, `minScore`, `resourceMarkup`) VALUES (?, ?, ?, ?, ?, ?);";
                $results = $conn->prepare($sql);
                $results->execute(array($acctName, $surName, $i+1, $resources[$i], $minScores[$i+1], $resourceMarkup[$i]));
            }
            header("Location: pollster/pDashboard.html");
            die("Success");
        }

        public static function GetResources($db){
            $conn = $db->getConnection('poll');

            $surName = $_POST['surName'];
            $acctName = $_SESSION['userName'];

            $sql = "SELECT `resourceMarkup` FROM secReqs WHERE `acctName`=? AND `surName`=?;";
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
            $_SESSION['surName'] = $surName;
            $acctName = $_SESSION['userName'];

            $sql = "SELECT `pin`, `groupName`, `live`, `surText` FROM `pins` WHERE `acctName`=? AND `surName`=?;";
            $results = $conn->prepare($sql);
            $results->execute(array($acctName, $surName));
            $pins = array();

            while($row = $results->fetch(PDO::FETCH_ASSOC)){
                $pins[] = $row;
                $_SESSION['surText'] = $row['surText'];
            }

            echo json_encode($pins);
        }

        public static function DeleteSurvey($db){
            $conn = $db->getConnection('poll');

            $surName = $_SESSION['surName'];
            $acctName = $_SESSION['userName'];

            $sql = "DELETE FROM `pins` WHERE `acctName`=? AND `surName`=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName, $surName));

            $sql = "DELETE FROM `questions` WHERE `acctName`=? AND `surName`=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName, $surName));

            $sql = "DELETE FROM `secReqs` WHERE `acctName`=? AND `surName`=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName, $surName));

            $sql = "DELETE FROM `results` WHERE `acctName`=? AND `surName`=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName, $surName));
        }

        public static function GetSectionNum(){
            $rLevel = $_SESSION['rLevel'];
            echo $rLevel;
        }

        public static function setLive($db){
            $conn = $db->getConnection("poll");

            $surName = $_POST['surName'];
            $acctName = $_SESSION['userName'];
            $live = $_POST['isLive'];

            $sql = "UPDATE `pins` SET live=? WHERE acctName=? AND surName=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($live, $acctName, $surName));
        }

        public static function setNewGroupPin($db){
            $conn = $db->getConnection("poll");
            $sql = "SELECT * FROM `pins` WHERE `pin`=?";
            $stmt = $conn->prepare($sql);

            if(isset($_POST['groupName'])){
                $groupName = $_POST['groupName'];
            }
            else{
                $groupName = "New Group";
            }
            $surName = $_SESSION['surName'];
            $surText = $_SESSION['surText'];
            $acctName = $_SESSION['userName'];
            $live = $_POST['live'];

            $newPin = Pin::getUniquePin($stmt);

            $sql = "SELECT * FROM `pins` WHERE `groupName`=? AND surName=?;";
            $stmt = $conn->prepare($sql);
            $stmt->execute(array($groupName, $surName));

            if($stmt->rowCount() > 0){
                $sql = "UPDATE pins SET pin=? WHERE groupName=? AND surName=?;";
                $stmt = $conn->prepare($sql);
                $stmt->execute(array($newPin, $groupName, $surName));
            }
            else{
                $sql = "INSERT INTO `pins` (`pin`, `surName`, `acctName`, `surText`, `groupName`, `live`) VALUES (?, ?, ?, ?, ?, ?);";
                $stmt = $conn->prepare($sql);
                $stmt->execute(array($newPin, $surName, $acctName, $surText, $groupName, $live));
            }
            echo $newPin;
        }
    }