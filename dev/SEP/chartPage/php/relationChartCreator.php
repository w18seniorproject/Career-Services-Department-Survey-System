
<?php

  $database = new Database();

  $conn = $database->getConnection();


  $sqlquery = "SELECT groupname, ROUND(AVG(rLevel),0) AS average_relationship FROM results GROUP BY groupname ORDER BY groupname; ";
  $groupNameArray=array();
  $relationLevelArray=array();


    foreach($conn->quert($sqlquery) as $row){
      $groupNameArray[]=$row['groupname'];
      $relationLevelArray[]=$row['average_relationship'];
    }

    $response=array(
      'gNA' => $groupNameArray,
      'rLA' => $relationLevelArray
    );

    echo json_encode($response)
 ?>
