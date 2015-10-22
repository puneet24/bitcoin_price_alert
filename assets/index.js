var appbase = new Appbase({
  url: 'https://scalr.api.appbase.io',
  appname: 'testgsoc',
  username: 'JxGrCcfHZ',
  password: '1c46a541-98fa-404c-ad61-d41571a82e14'
});

appbase.streamDocument({
  type: "bitcoin_price",
  id: '1'
}).on('data', function(res) {
  var data = res._source;
  $('#avg').text(data.last);
  $('#last').text(data.last);
  $('#bid').text(data.bid);
  $('#ask').text(data.ask);
  $('#timestamp').text(data.timestamp);
  $('#volume').text(data.total_vol);
}).on('error', function(err) {
  console.log("streaming error: ", err);
});

$('#select_type').on('change',function(){
  $('#lowerprice').removeAttr("readonly");
  $('#upperprice').removeAttr("readonly");
  $("#upperprice").val("");
  $("#lowerprice").val("");
  switch($('#select_type').val()){
    case "range": break;
    case "lessthan" : $("#lowerprice").val("0");
                      $("#lowerprice").prop("readonly", true);
                      break;
    case "greaterthan" : $("#upperprice").val("1000");
                         $("#upperprice").prop("readonly", true);
                         break;
    case "fixvalue" : $('#lowerprice').val($('#upperprce').val());
                      $("#lowerprice").prop("readonly", true);
  }
});

$('#upperprice').on('change',function(){
  if($('#select_type').val() == "fixvalue")
    $('#lowerprice').val($("#upperprice").val());
});

$('#submit').on('click',function(){
  $('.alert').remove();
  if($('#price').val() == "" || $('#email').val() == ""){
    $('#notification_status').append('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><center><strong>Warning!</strong> Please fille the details properly.</center></div>');
  }
  else{
    $.ajax({
      url: "http://0.0.0.0:3000/alerting", 
      data: { 
              "lowerprice": $('#lowerprice').val(),
              "upperprice": $('#upperprice').val(), 
              "email": $('#email').val()
          }   
      });
    $('#notification_status').append('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><center><strong>Price Set!</strong> You will get Email when Bitcoin price is in range : <b>'+$('#lowerprice').val()+' to '+$('#upperprice').val()+'</center></div>');
    $('#price').val("");
    $('#email').val("");
  }
  
});