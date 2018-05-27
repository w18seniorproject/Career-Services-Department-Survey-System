<?php
//Checks new user information: valid email address, matching password entries, email (primary key) address already in database, username already in database.
//If duplicate account info is "inactive", the inactive account is deleted and the new account info entered in its place.
//Account info is inserted in db if not duplicate, email link is sent to new user's email address
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
            die("Invalid Email Address Entered");
        }

        //check for duplicate username 
        $sql = "SELECT active FROM accounts WHERE acctName = ?;";
        $result = $conn->prepare($sql);
        $result->execute(array($username));

        if($result->rowCount() > 0){ // if there is a duplicate account
        
            $isActive = $result->fetchColumn(0);

            //If account is active
            if($isActive != 0){               
                header("Location: ./pollster/pSignup.html?error=usernameTaken");
                die("Username Already Taken");              
            }
            else{   //If account is inactive, remove it from the database, so that the new account can be created in its place.
                $sql = "DELETE FROM accounts WHERE acctName = ?;";
                $del = $conn->prepare($sql);
                $del->execute(array($username));

                if(!$del){
                    echo "Internal error. Inactive account with matching username was not deleted from accounts table.";
                    die();
                }

                $sql = "DELETE FROM notifications WHERE acctName = ?;";
                $del = $conn->prepare($sql);
                $del->execute(array($username));

                if(!$del){
                    echo "Internal error. Inactive account with matching username was not deleted from notifications table.";
                    die();
                }
            }
        }
        
        $hashedPass = password_hash($pass, PASSWORD_BCRYPT);

        $ppLocation = '../graphics/profpicgeneric.jpg';

        $sql = "INSERT INTO `accounts` (`pass`, `email`, `acctName`, `profpic`) VALUES (?, ?, ?, ?);";
        $result = $conn->prepare($sql);
        $result->execute(array($hashedPass, $email, $username, $ppLocation));

        $sql = "INSERT INTO `notifications` (`acctName`, `count`, `notifications`) VALUES (?, 0, '');";
        $result = $conn->prepare($sql);
        $result->execute(array($username));

        //-------vvv----account activation via email----vvv----------------------------------

             //Create random token. Using bin2hex so that it can be used in a query string.
        $bytes = bin2hex(random_bytes(10));

        //Hash the token
        $tokenHash = hash("sha256", $bytes, false);

        //Set the expiration time to 30 minutes from now
        $expiration = date("Y-m-d H:i:s", strtotime("+ 30 minutes"));

        //Set linkUsed to false
        $linkUsed = 0;

        //Save account and tokenHash info to token table
        $sql = "INSERT INTO tokens (acctName, tokenHash, tokenUsed, expiration) VALUES (?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $tokenHash);
        $stmt->bindParam(3, $linkUsed);
        $stmt->bindParam(4, $expiration);

        $stmt->execute();

        //CHANGE TO CORRECT EXTERNAL LINK (COMMENTED OUT) WHEN THIS GOES TO THE SERVER.
        //It won't capture the port number I'm using (10080) on XAMPP
        $msg = "Please click on the link to activate your account:\n\n http://localhost:10080/Career-Services-Department-Survey-System/dev/SEP/pollster/pActivate.html?";
        //$msg = "Please click on the link to activate your account:\n\n http://" .  $_SERVER['SERVER_NAME'] . "/Career-Services-Department-Survey-System/dev/SEP/pollster/pActivate.html?";


        $msg .= "token=". $bytes . "\n\nDo not reply to this email.";     
   
        //"from" param is not a valid email address.
        if(!mail( $email, "USS Account Activation", $msg, "From: webslave@notarealdomain.com" )){
            echo "System failed to send activation email. Please try again.";
            header("Location: ./pollster/pSignup.html?error=mailFailed");
            die("mail function failure");
        }else{
            header("Location: ./pollster/pSignup.html?error=noError");
                    die();
        }
    }
}