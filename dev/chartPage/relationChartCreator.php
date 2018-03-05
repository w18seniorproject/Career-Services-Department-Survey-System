
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
 var js_relationArrayJSON=<?php echo json_encode($relationLevelArray);  ?>;
 var js_relationArray=jQuery.parseJSON(js_relationArrayJSON);
 var js_groupArrayJSON=<?php echo json_encode($groupNameArray); ?>;
var js_groupArray=jQuery.parseJSON(js_groupArrayJSON);
 var temp=document.getElementById("myChart");
 var ctx=temp.getContext("2d");
 var resultChart=null;
 function createMixedChart(){
   if(resultChart!=null)
   {
        resultChart.destroy();
   }
   resultChart= new Chart(ctx, {
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
}

function createLineChart(){
  if(resultChart!=null)
  {
       resultChart.destroy();
  }
  resultChart= new Chart(ctx, {
  type: 'line',
  data: js_relationArray,
  labels:js_groupArray,
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
}

function createBarChart(){
  if(resultChart!=null)
  {
       resultChart.destroy();
  }
  resultChart= new Chart(ctx, {
  type: 'bar',
  data: js_relationArray,
  labels:js_groupArray,
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
}
 </script>
