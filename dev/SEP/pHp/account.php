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

            $sql = "SELECT `email`, `acctName` from `accounts` WHERE `acctName`=?;";
            $result = $conn->prepare($sql);
            $result->execute(array($acctName));

            $row = $result->fetch(PDO::FETCH_ASSOC);

            echo json_encode($row);
        }

        public static function SetAccountInfo($db){
            $conn = $db->getConnection("poll");

            $acctName = $_SESSION["userName"];
            $pass = $_POST["password"];
            $passConfirm = $_POST["password-confirm"];
            $email = $_POST["email"];

            if($pass != $passConfirm){
                header("Location: ./pollster/account.html?error=noMatch");
                die("passwords don't match");
            }

            if($email == "" && $pass == ""){
                exit();
            }

            if($email != ""){
                if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
                    header("Location: ./pollster/account.html?error=badEmail");
                    die("bad email");
                }
                //check for duplicate email
                $sql = "SELECT email FROM accounts WHERE acctName <> ?;";
                $result = $conn->prepare($sql);
                $result->execute(array($acctName));
                for($i = 0; $i < $result->rowCount(); $i++){
                    if($email == $result->fetchColumn(0)){
                        header("Location: ./pollster/account.html?error=emailTaken");
                        die("Email Already in Use");
                    }
                }
            }

            if($pass != ""){
                $hashedPass = password_hash($pass, PASSWORD_BCRYPT);
            }

            if($pass != "" && $email != ""){
                $sql = "UPDATE `accounts` SET `pass` = ? , `email` = ? WHERE `acctName` = ?;";

                $result = $conn->prepare($sql);
                $result->execute(array($hashedPass, $email, $acctName));

                header("Location: ./pollster/pDashboard.html?page=accountboth");
                exit();
            }

            elseif($pass != ""){
                $sql = "UPDATE `accounts` SET `pass` = ? WHERE `acctName` = ?;";

                $result = $conn->preapare($sql);
                $result->execute(array($hashedPass, $acctName));

                header("Location: ./pollster/pDashboard.html?page=accountpass");
                exit();
            }

            elseif($email != ""){
                $sql = "UPDATE `accounts` SET `email` = ? WHERE `acctName` = ?;";

                $result = $conn->prepare($sql);
                $result->execute(array($email, $acctName));

                header("Location: ./pollster/pDashboard.html?page=accountemail");
                exit();
            }
        }
    }