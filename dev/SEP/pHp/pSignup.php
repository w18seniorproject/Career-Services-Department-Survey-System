<?php
    class PollsterSignup {
        public static function signup($db){
            $conn = $db->getConnection('poll');

            $username = $_POST["username"];
            $pass = $_POST["password"];
            $passConfirm = $_POST["password-confirm"];
            $email = $_POST["email"];

            if($pass != $passConfirm){
                header("Location: ./pollster/pSignup.html?error=noMatch");
                die("Passwords Don't Match");
            }

            if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
                header("Location: ./pollster/pSignup.html?error=badEmail");
                die("Bad Email");
            }

            //check for duplicate email
            $sql = "SELECT email FROM accounts WHERE active = '1';";
            $result = $conn->prepare($sql);
            $result->execute();
            for($i = 0; $i < $result->rowCount(); $i++){
                if($email == $result->fetchColumn(0)){
                    header("Location: ./pollster/pSignup.html?error=emailTaken");
                    die("Email Address Already in Use");
                }
            }

            //check for duplicate username
            $sql = "SELECT acctName FROM accounts WHERE active = '1';";
            $result = $conn->prepare($sql);
            $result->execute();
            for($i = 0; $i < $result->rowCount(); $i++){
                if($username == $result->fetchColumn(0)){
                    header("Location: ./pollster/pSignup.html?error=usernameTaken");
                    die("Username Already in Use");
                }
            }

            //check for profane usernames or emails TODO

            $hashedPass = password_hash($pass, PASSWORD_BCRYPT);

            $ppLocation = '../graphics/profpicgeneric.jpg';

            $sql = "INSERT INTO `accounts` (`pass`, `email`, `acctName`, `profpic`) VALUES (?, ?, ?, ?);";
            $result = $conn->prepare($sql);
            $result->execute(array($hashedPass, $email, $username, $ppLocation));

        //-------vvv----account activation via email----vvv----------------------------------

             //Create random token. Using bin2hex so that it can be used in a query string.
        $bytes = bin2hex(random_bytes(10));

        //Hash the token
        $tokenHash = hash("sha256", $bytes, false);

        //Set the expiration time to 30 minutes from now
        $expiration = date("Y-m-d H:i:s", strtotime("+ 30 minutes"));

        //Set linkUsed to false
        $linkUsed = false;

        //Save account and tokenHash info to token table
        $sql = "INSERT INTO tokens (acctName, tokenHash, tokenUsed, expiration) VALUES (?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $tokenHash);
        $stmt->bindParam(3, $linkUsed);
        $stmt->bindParam(4, $expiration);

        $stmt->execute();


        //CHANGE TO CORRECT EXTERNAL LINK
        $msg = "Please click on the link to activate your account:\n\n http://localhost:10080/Career-Services-Department-Survey-System/dev/SEP/pollster/pActivate.html?";

        //$msg = "Please click on the link to activate your account:\n\n" . $_SERVER['SERVER_PROTOCOL'] . $_SERVER['SERVER_NAME'] . "/Career-Services-Department-Survey-System/dev/SEP/pollster/pActivate.html?";


        $msg .= "token=". $bytes . "\n\nDo not reply to this email.";     
   
        //"from" param is not a valid email address.
        if(!mail( $email, "USS Account Activation", $msg, "From: webslave@notarealdomain.com" )){
            echo "System failed to send activation email. Please try again.";
            header("Location: ../pollster/pSignup.html?error=badEmail");
            die("mail function failure");
        }else{
            header("Location: ./pollster/pSignup.html?error=noError");
                    die();
            //echo "<h2>Please check your email inbox for a link to activate your account.</h2>";
        }
//-----------------------------------------------
        }
    }