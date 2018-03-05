
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link href="css\main.css" type="text/css" rel="stylesheet">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.7.1/dist/Chart.bundle.min.js"></script>
    <script src="js\testChart2.js"></script>

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
    <title>EWU Career Services Department Survey System Survey Page</title>
  </head>
<body>
  <noscript>
   For full functionality of this site it is necessary to enable JavaScript.
   Here are the <a href="https://www.enable-javascript.com/" target="_blank">
   instructions how to enable JavaScript in your web browser</a>.
  </noscript>
  <div class="top"><header class="head"><img src="https://sites.ewu.edu/hpfw/files/2017/08/dropdown_logo.png" alt="Eastern Washington University Logo" id="EasternLogo"><p>Career Services<br>Department Survey System</p></header>
  <ul class="navigation">
    <li class="Home"><a href="#">Home</a></li>
    <li class="Charts"><a href="#">Charts</a></li>
    <li class="Surveys"><a href="#">Surveys</a></li>
    <li class="Admins"><a href="#">Admins</a></li>
    <li class="Comments"><a href="#">Comments</a></li>
  </ul>
  </div>
  <div id=surveyButtons>
  <button type="button" class="btn btn-primary" onclick="createBarChart()">Relation Chart(Bar)</button>
  <button type="button" class="btn btn-primary" onclick="createLineChart()">Relation Chart(Line)</button>
  <button type="button" class="btn btn-primary" onclick="createMixedChart()">Relation Chart(Mixed)</button></div>
<div id="graphContainer">
  <canvas id="myChart" width="500" height="500"></canvas>
</div>

</html>
