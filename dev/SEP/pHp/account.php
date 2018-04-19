<?php
    class PollsterAccount{
        public static function GetProfilePic($db){
            $conn = $db->getConnection('poll');

            $acctName = $_SESSION['userName'];

            $sql = "SELECT `profpic` FROM `accounts` WHERE `acctName`=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName));

            $row = $result->fetch(PDO::FETCH_ASSOC);

            header("Content-type: image/jpeg");
            echo $row['profpic'];
        }
    }
?>