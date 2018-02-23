
<?php

  include_once "./config/database.php";

  $database = new Database();

  $conn = $database->getConnection();


  $sqlquery = "SELECT groupname, ROUND(AVG(relationlevel),0) AS average_relationship FROM results GROUP BY groupname ORDER BY groupname; ";
  $relations = mysqli_query($con, $sqlquery);

  $groupNameArray=$relationLevel->fetch_array(MYSQLI_ASSOC);
  $relationLevelArray=$relationLevel->fetch_array(MYSQLI_NUM);

 ?>

 <script type="text/javascript">
 var js_relationArray=<?php echo json_encode($relationLevelArray);  ?>;
 var js_groupArray=<?php echo json_encode($groupNameArray); ?>;

 var ctx=document.getElementById("myChart");
 var resultChart= new Chart(ctx, {
   type: 'bar';
   data: {
     datasets: [{

       labels: js_groupArray,
       data: js_relationArray
     }]
   }
 })
 </script>
