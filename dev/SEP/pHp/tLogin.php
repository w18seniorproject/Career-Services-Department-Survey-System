<?php
    class TakerLogin{
        public static function login($db){
            $conn = $db->getConnection('taker');
            $pin = new pin($conn);
            $survey = json_decode($pin->getPin($_POST['pin']), true);

            if(isset($survey['surName']) && isset($survey['acctName'])){
                $surveyName = $survey['surName'];
                $account = $survey['acctName'];
                $groupName = $survey['groupName'];
            }
            elseif(isset($survey['message'])){
                if($survey['message'] === 'notUni'){
                    header("Location: user/uLogin.html?error=notUnique");
                    exit("We messed up. Pins aren't unique");
                    //THIS SHOULD NEVER HAPPEN
                }elseif($survey['message'] === 'badPin'){
                    header("Location: user/uLogin.html?error=wrongPin");
                    exit();
                }
            }
            else{
                http_response_code(500);
                exit();
                //THIS SHOULD NEVER HAPPEN
            }

            session_unset();
            $_SESSION["surName"] = $surveyName;
            $_SESSION["acctName"] = $account;
            $_SESSION["groupName"] = $groupName;
            $_SESSION['startTime'] = time();

            header("Location: user/uSurvey.html");
        }
    }

