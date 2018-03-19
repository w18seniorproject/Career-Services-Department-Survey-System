<?php

  include_once "./config/pollsterDB.php";

  $database = new Database();

  $conn = $database->getConnection();


  $sqlquery = "SELECT surName, acctName from questions GROUP BY surName";

  $dataArray=array();


    foreach($conn->query($sqlquery) as $row){
      $dataArray[]=array("SurName"=>$row['surName'],"AcctName"=>$row['acctName']);
    }



    echo json_encode($dataArray);
 ?>
