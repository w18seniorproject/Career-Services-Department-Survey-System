<?php
  header('Content-Type: application/json');

  $aResult=array();


    if( !isset($_POST['functionname']) ) { $aResult['error'] = 'No function name!'; }

    if( !isset($_POST['arguments']) ) { $aResult['error'] = 'No function arguments!'; }

     if( !isset($aResult['error']) ){

       switch($_POST['functionname']){
         case 'questionMenuFiller':
         {
           include_once "./config/pollsterDB.php";
         
           $database = new Database();

           $conn = $database->getConnection();


           $sqlquery = "SELECT qNum FROM question WHERE surName=$_POST['arguments']; ";
           $surQuestions=array();


             foreach($conn->quert($sqlquery) as $row){
               $surQuestions[]=$row['qNum'];
             }


             echo json_encode($surQuestions);
             break;
         }
         case 'pieChartArrayCreator':
         {
           include_once "./config/pollsterDB.php";

           $database = new Database();

           $conn = $database->getConnection();


           $sqlquery = "SELECT surResults FROM results WHERE surName=$_POST['arguments']; ";
           $surQuestions=array();


             foreach($conn->quert($sqlquery) as $row){
               $surQuestions[]=$row['qNum'];
             }


             echo json_encode($surQuestions);
             break;
         }


       }



     }


 ?>
