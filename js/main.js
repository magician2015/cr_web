
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
    $("#rsvc1").html(opayload.svc[0]);
    $("#rsvc2").html(opayload.svc[1]);
    $("#rnotice").html(opayload.notice);
    $("#rpolicy_uri").html(opayload.policy_uri);
    var rdata_controller1 = Object.keys(opayload.data_controller)[0];
    $("#rdata_controller1").html(rdata_controller1);
    $("#rdata_controller2").html(opayload.data_controller[rdata_controller1]);
    var rdata_controller3 = Object.keys(opayload.data_controller)[1];
    $("#rdata_controller3").html(rdata_controller3);
    $("#rdata_controller4").html(opayload.data_controller[rdata_controller3]);
    var rconsent_payload1 = Object.keys(opayload.consent_payload)[0];
    $("#rconsent_payload1").html(rconsent_payload1);
    $("#rconsent_payload2").html(opayload.consent_payload[rconsent_payload1]);
    var rconsent_payload3 = Object.keys(opayload.consent_payload)[1];
    $("#rconsent_payload3").html(rconsent_payload3);
    $("#rconsent_payload4").html(opayload.consent_payload[rconsent_payload3]);
    $("#rpurpose1").html(opayload.purpose[0]);
    $("#rpurpose2").html(opayload.purpose[1]);
    var rpii_collected1 = Object.keys(opayload.pii_collected)[0];
    $("#rpii_collected1").html(rpii_collected1);
    $("#rpii_collected2").html(opayload.pii_collected[rpii_collected1]);
    var rpii_collected3 = Object.keys(opayload.pii_collected)[1];
    $("#rpii_collected3").html(rpii_collected3);
    $("#rpii_collected4").html(opayload.pii_collected[rpii_collected3]);
    $("#rsensitive1").html(opayload.sensitive[0]);
    $("#rsensitive2").html(opayload.sensitive[1]);
    $("#rsharing1").html(opayload.sharing[0]);
    $("#rsharing2").html(opayload.sharing[1]);
   
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

