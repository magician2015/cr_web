
$(document).ready(function() {

  $('#submit').on('click', function(event) {
    var oPost = {};
    oPost.jurisdiction = $('#jurisdiction').val();
    oPost.sub = $('#sub').val();
    oPost.svc = [$('#svc1').val(),$('#svc2').val()];
    oPost.notice = $('#notice').val();
    oPost.policy_uri = $('#policy_uri').val();
    oPost.data_controller = {};
    oPost.data_controller[$('#data_controller1').val()] = $('#data_controller2').val();
    oPost.data_controller[$('#data_controller3').val()] = $('#data_controller4').val();
    oPost.consent_payload = {};
    oPost.consent_payload[$('#consent_payload1').val()] = $('#consent_payload2').val();
    oPost.consent_payload[$('#consent_payload3').val()] = $('#consent_payload4').val();
    oPost.purpose = [$('#purpose1').val(),$('#purpose2').val()];
    oPost.pii_collected = {};
    oPost.pii_collected[$('#pii_collected1').val()] = $('#pii_collected2').val();
    oPost.pii_collected[$('#pii_collected3').val()] = $('#pii_collected4').val();
    oPost.sensitive = [$('#sensitive1').val(),$('#sensitive2').val()];
    oPost.sharing = [$('#sharing1').val(),$('#sharing2').val()];
    oPost.context = [$('#context1').val(),$('#context2').val()];
    oPost.aud = $('#aud').val();
    oPost.scopes = $('#scope').val();



      $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/mvcr",
        data: JSON.stringify(oPost),
        contentType : "application/json", 
        success: function (data) {
          console.log(data);
          console.log("SUCCESS");
  var blob = new Blob([data], {type: "application/json"});
  var url  = URL.createObjectURL(blob);
    var segments = data.split('.');
    var payloadSeg = segments[1];

    var payload = b64utos(payloadSeg);
    var opayload = JSON.parse(payload);
    console.log(opayload);

    $("#rjurisdiction").html(opayload.jurisdiction);
    $("#rsub").html(opayload.sub);
   
   $("#rhidden").show("slow");
   $("#receipt").hide("slow");

   document.getElementById("receiptdl").outerHTML = '<a id="receiptdl" class="btn btn-primary" download role="button" href="' + url + '">Download Receipt &raquo;</a>';
        },
        error: function(data) {
          console.log(data);
          console.log("ERROR");
        }
    });
  });
});

