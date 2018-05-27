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

           $arguments = $_POST['arguments'];

           $sqlquery = "SELECT qNum FROM question WHERE surName = $arguments ; ";
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

           $arguments = $_POST['arguments'];

           $sqlquery = "SELECT surResults FROM results WHERE surName=$arguments; ";
           $surQuestions=array();


             foreach($conn->quert($sqlquery) as $row){
               $surQuestions[]=$row['qNum'];
             }


             echo json_encode($surQuestions);
             break;
         }


       }



     }
