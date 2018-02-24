
<?php

  include_once "./config/database.php";

  $database = new Database();

  $conn = $database->getConnection();


  $sqlquery = "SELECT groupname, ROUND(AVG(relationlevel),0) AS average_relationship FROM results GROUP BY groupname ORDER BY groupname; ";
  $stg
  $groupNameArray=array();
  $relationLevelArray=array();


    foreach($conn->quert($sqlquery) as $row){
      $groupNameArray[]=$row['groupname'];
      $relationLevelArray[]=$row['average_relationship'];
    }


  };





 ?>

 <script type="text/javascript">
 var js_relationArray=<?php echo json_encode($relationLevelArray);  ?>;
 var js_groupArray=<?php echo json_encode($groupNameArray); ?>;

 var ctx=document.getElementById("myChart");
 var resultChart= new Chart(ctx, {
   type: 'bar';
   data: {
     datasets: [{

       label: 'Bar_Set',
       data: js_relationArray
     }, {
     label:'Line_Set',
     data: js_relationArray,

     type: 'line'
   }],
   labels:js_groupArray
 },
 options: {
     scales: {
         yAxes: [{
             ticks: {
                 beginAtZero:true
             }
         }]
     }
 }
});
 </script>
