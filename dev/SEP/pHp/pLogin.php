<?php
    class PollsterLogin {
        public static function login($db){
            $conn = $db->getConnection('poll');

            $username = $_POST["username"];

            $pass = $_POST["pword"];

            $sql = "SELECT pass FROM accounts WHERE acctName= ?;";

            $result = $conn->prepare($sql);
            $result->execute(array($username));

            if($result->rowCount() == 1){

                $row = $result->fetch(PDO::FETCH_ASSOC);
                $hash = $row["pass"];

                if(!password_verify($pass, $hash)){
                    header("Location: ./pollster/pLogin.html?error=wrongAuth");
                    die("Username and/or password do not match.");
                }
                else{
                    session_start();
                    session_destroy();
                    session_start();
                    $_SESSION["userName"] = $username;
                    header("Location: ./pollster/pDashboard.html");
                }

            }
            else if($result->rowCount() > 0){
                header("Location: ./pollster/pLogin.html?error=notUnique");
                die("Internal error. Multiple matches for username/password.");
            }
            else{
                header("Location: ./pollster/pLogin.html?error=wrongAuth");
                die("Username and/or password do not match."); 
            }
            //Check event_scheduler. If off, turn it on. Create MySQL event that removes expired tokens once daily.
            $sql = "SELECT @@event_scheduler;";
            $stmt->prepare($sql);
            $stmt->execute();
            $getStatus = $stmt->fetch(PDO::FETCH_ASSOC);

            if($getStatus == "OFF"){

            $sql = "SET GLOBAL event_scheduler = ON;";
            $stmt->prepare($sql);
            $stmt->execute();
            }

            $sql = "CREATE EVENT IF NOT EXISTS csdss.deleteExpiredTokens ON SCHEDULE EVERY 1 DAY COMMENT 'Removes expired tokens.' DO BEGIN DELETE FROM csdss.tokens WHERE expiration < NOW() END;";
            $stmt->prepare($sql);
            $stmt->execute();
        }
    }
