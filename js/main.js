



function apiPost(jurisdiction) {

var jurisdiction = document.getElementById('jurisdiction').value;
var sub = document.getElementById('sub').value;
var svc1 = document.getElementById('svc1').value;
var svc2 = document.getElementById('svc2').value;
var notice = document.getElementById('notice').value;
var policy_uri = document.getElementById('policy_uri').value;
var data_controller1 = document.getElementById('data_controller1').value;
var data_controller2 = document.getElementById('data_controller2').value;
var data_controller3 = document.getElementById('data_controller3').value;
var data_controller4 = document.getElementById('data_controller4').value;
var consent_payload1 = document.getElementById('consent_payload1').value;
var consent_payload2 = document.getElementById('consent_payload2').value;
var consent_payload3 = document.getElementById('consent_payload3').value;
var consent_payload4 = document.getElementById('consent_payload4').value;
var purpose1 = document.getElementById('purpose1').value;
var purpose2 = document.getElementById('purpose2').value;
var pii_collected1 = document.getElementById('pii_collected1').value;
var pii_collected2 = document.getElementById('pii_collected2').value;
var pii_collected3 = document.getElementById('pii_collected3').value;
var pii_collected4 = document.getElementById('pii_collected4').value;
var sensitive1 = document.getElementById('sensitive1').value;
var sensitive2 = document.getElementById('sensitive2').value;
var sharing1 = document.getElementById('sharing1').value;
var sharing2 = document.getElementById('sharing2').value;
var context1 = document.getElementById('context1').value;
var context2 = document.getElementById('context2').value;
var aud = document.getElementById('aud').value;
var scope = document.getElementById('scope').value;


var oInput = '{"jurisdiction" : "' + jurisdiction + '","sub" : "' + sub + '" ,"svc" : ["' + svc1 + '","' + svc2 + '"] ,"notice" : "' + notice + '" ,	"policy_uri" : "' + policy_uri + '" ,	"data_controller" : {"' + data_controller1 + '" : "' + data_controller2 + '","' + data_controller3 + '" : "' + data_controller4 + '"} ,	"consent_payload" : {"' + consent_payload1 + '" : "' + consent_payload2 + '","' + consent_payload3 + '" : "' + consent_payload4 + '"} ,	"purpose" : ["' + purpose1 + '","' + purpose2 + '"] ,	"pii_collected" : {"' + pii_collected1 + '" : "' + pii_collected2 + '","' + pii_collected3 + '" : "' + pii_collected4 + '"} ,	"sensitive" : ["' + sensitive1 + '","' + sensitive2 + '"] ,	"sharing" : ["' + sharing1 + '","' + sharing2 + '"] ,	"context" : ["' + context1 + '","' + context2 + '"] ,	"aud" : "' + aud + '" ,	"scopes" : "' + scope + '"  }';


jQuery(document).ready(function(){
$.ajax({
  type: "POST",
  url: "http://localhost:8080/api/mvcr",
  data: oInput,
  contentType : "application/json", 
    dataType: 'json',
  success: function (data) {
	var newdata = data.responseText;
  	var segments = newdata.split('.');

  	var headerSeg = segments[0];
    var payloadSeg = segments[1];
    var signatureSeg = segments[2];

    var header = b64utos(headerSeg);
    var payload = b64utos(payloadSeg);

    var prettyPayload = "";
   for(var i = 0; i < payload.length; ++i)
   {
       if(payload[i] == ",")
       {
          prettyPayload += " ,<br>";
       }
       else
       {
          prettyPayload += payload[i];
       }
   }
   
   document.getElementById("receipt").innerHTML = "<h3>Header</h3>" + header + "<br><h3>Payload</h3>" + prettyPayload + "<br><h3>Signature</h3>" + signatureSeg;
  },
error: function (data) {
	var newdata = data.responseText;
	var blob = new Blob([newdata], {type: "application/json"});
	var url  = URL.createObjectURL(blob);
  	var segments = newdata.split('.');


  	var headerSeg = segments[0];
    var payloadSeg = segments[1];
    var signatureSeg = segments[2];

    var header = b64utos(headerSeg);
    var payload = b64utos(payloadSeg);

    var prettyPayload = "";
   for(var i = 0; i < payload.length; ++i)
   {
       if(payload[i] == ",")
       {
          prettyPayload += " ,<br>";
       }
       else
       {
          prettyPayload += payload[i];
       }
   }
   
   document.getElementById("receipt").innerHTML = "<h3>Header</h3>" + header + "<br><h3>Payload</h3>" + prettyPayload + "<br><h3>Signature</h3>" + signatureSeg;

   document.getElementById("receiptdl").outerHTML = '<a id="receiptdl" class="btn btn-primary" download role="button" href="' + url + '">Download Receipt &raquo;</a>';

}
});
});
}



    
