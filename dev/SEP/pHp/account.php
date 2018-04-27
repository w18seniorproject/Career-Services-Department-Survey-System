<?php
    class PollsterAccount{
        public static function GetProfilePic($db){
            $conn = $db->getConnection('poll');

            $acctName = $_SESSION['userName'];

            $sql = "SELECT `profpic` FROM `accounts` WHERE `acctName`=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName));

            $row = $result->fetch(PDO::FETCH_ASSOC);

            echo $row['profpic'];
        }

        public static function SetProfilePic($db){
            $conn = $db->getConnection('poll');

            $acctName = $_SESSION['userName'];

            $fileName = $acctName . ".jpg";

            $dir = "pollster/profilePics/";
            $data = base64_decode($_POST['profPic']);

            file_put_contents($dir . $fileName, $data);

            $toInsert = "profilePics/" . $fileName;

            $sql = "UPDATE `accounts` SET `profpic`=? WHERE `acctName`=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($toInsert, $acctName));

            echo $toInsert . "?time=" . time();
        }

        public static function GetAccountInfo($db){
            $conn = $db->getConnection("poll");

            $acctName = $_SESSION['userName'];

            $sql = "SELECT `email` from `accounts` WHERE `acctName`=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName));

            $row = $result->fetch(PDO::FETCH_ASSOC);

            echo $row['email'];
        }
    }
?>