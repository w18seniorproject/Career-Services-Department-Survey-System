var js_relationArrayJSON;
var js_groupArrayJSON;

$.ajax({

  type: "POST",
  url: 'include/relationChartCreator.php',
  dataType: 'json'
  success: function(json){
    js_relationArrayJSON=json.rLA;
    js_groupArrayJSON=json.gNA;
  }

});
var js_relationArray=jQuery.parseJSON(js_relationArrayJSON);

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
