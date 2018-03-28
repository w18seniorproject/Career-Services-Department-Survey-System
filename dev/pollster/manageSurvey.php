<?php
    if(isset($_POST['resources'])){
        include_once("../config/pollsterDB.php");

        $database = new Database();
        $conn = $database->getConnection();

        session_start();
        $surName = $_SESSION['surName'];
        $surText = $_SESSION['surText'];
        $acctName = $_SESSION['acctName'];
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
            $results->execute(array($acctName, $surName, $i, $resources[$i]));
        }
        header("Location: pDashboard.html");
        die("Success");
    }
    
    session_start();
    $rLevel = $_SESSION['rLevel'];
    echo $rLevel;
?>