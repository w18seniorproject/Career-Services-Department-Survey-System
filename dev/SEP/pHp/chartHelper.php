<?php
    class Charts{
      public static function GetSurNames($db)
      {
          $conn = $db->getConnection("poll");
        $acctName = $_SESSION['userName'];
        $sql = "SELECT `surName` FROM `results` WHERE `acctName`=? GROUP BY surName ORDER BY surName;";
        $stmt = $conn->prepare($sql);
        $stmt->execute(array($acctName));

        $rNum = $stmt->rowCount();
        if($rNum > 0){
            $resultsArr = array();

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                extract($row);

                $result = array(
                    "surName" => $surName,
                );
                $resultsArr[] = $result;
            }
            echo json_encode($resultsArr);
        }
        else{
            echo "THERE ARE NO RESULTS TO BE HAD";
        }
      }
        public static function GetAvgResults($db)
        {
            $conn = $db->getConnection("poll");
          $acctName = $_SESSION['userName'];
          $surName = $_SESSION['surName'];

          $sql = "SELECT ROUND(AVG(`rLevel`),1) AS average_relationship, `groupName` FROM `results` WHERE `acctName`=? AND `surName`=? GROUP BY groupName ORDER BY groupName;";
          $stmt = $conn->prepare($sql);
          $stmt->execute(array($acctName, $surName));

          $rNum = $stmt->rowCount();

          if($rNum > 0){
              $resultsArr = array();

              while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                  extract($row);

                  $result = array(
                      "groupName" => $groupName,
                      "rLevel" => $average_relationship
                  );
                  $resultsArr[] = $result;
              }
              echo json_encode($resultsArr);
          }
          else{
              echo "THERE ARE NO RESULTS TO BE HAD";
          }
        }

        public static function GetChartResults($db)
        {
            $conn = $db->getConnection("poll");
          $acctName = $_SESSION['userName'];
          $surName = $_SESSION['surName'];
          $sql = "SELECT * FROM `results` WHERE `acctName`=? AND `surName`=?;";
          $stmt = $conn->prepare($sql);
          $stmt->execute(array($acctName, $surName));
          $rNum = $stmt->rowCount();
          if($rNum > 0){
              $resultsArr = array();

              while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                  extract($row);

                  $result = array(
                    "recNum" => $recNum,
                    "surName" => $surName,
                    "groupName" => $groupName,
                    "surResults" => $surResults,
                    "rLevel" => $rLevel,
                    "time" => $time
                  );
                  $resultsArr[] = $result;
              }
              echo json_encode($resultsArr);
          }
          else{
              echo "THERE ARE NO RESULTS TO BE HAD";
          }
        }

        public static function GetQuestionsFromDB($db)
        {
          $conn = $db->getConnection("poll");
        $acctName = $_SESSION['userName'];
        $surName = $_SESSION['surName'];
        $sql = "SELECT `qNum`, `qChoices` FROM `questions` WHERE `acctName`=? AND `surName`=?;";
        $stmt = $conn->prepare($sql);
        $stmt->execute(array($acctName, $surName));
        $rNum = $stmt->rowCount();
        if($rNum > 0){
            $resultsArr = array();

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                extract($row);

                $result = array(

                  "sName" => $surName,
                  "qNum" => $qNum,
                  "qChoices" => $qChoices
                );
                $resultsArr[] = $result;
            }
            echo json_encode($resultsArr);
        }
        else{
            echo "THERE ARE NO RESULTS TO BE HAD";
        }
      }
    }