<?php

  include_once "./config/pollsterDB.php";

  $database = new Database();

  $conn = $database->getConnection();
  $username=$_SESSION["acctName"];

  $sqlquery = "SELECT surName, acctName from questions WHERE acctName=$username GROUP BY surName";

  $dataArray=array();


    foreach($conn->query($sqlquery) as $row){
      $dataArray[]=array("SurName"=>$row['surName'],"AcctName"=>$row['acctName']);
    }



    echo json_encode($dataArray);
 ?>
