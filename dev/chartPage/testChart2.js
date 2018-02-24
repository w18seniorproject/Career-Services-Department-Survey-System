//var js_relationArray=<?php echo json_encode($relationLevelArray);  ?>;
//var js_groupArray=<?php echo json_encode($groupNameArray); ?>;
function createTestChart(){
var ctx=document.getElementById("myChart");
var resultChart= new Chart(ctx, {
  type: 'bar',
  data: {
    datasets: [{

      label: 'Average Relation Level',
      data: [2,5,4,2],
      backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ]
    }, {
    data: [2,5,4,2],

    type: 'line'
  }],
  labels:["Biology","Business", "Computer Science","History"]
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
