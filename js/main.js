
$(document).ready(function() {
	
	// prevent accidental form submission on 'enter'
	$('input,select').keypress(function(event) { return event.keyCode != 13; });

	$('#purpose').on('click', '.btn-add', function(event) {
		event.preventDefault();
		
		$('#purpose').append('                    <div class="input-group">\n' +
		'                        <input type="text" class="form-control" placeholder="Example: marketing">\n' +
		'                        <span class="input-group-btn"><button type="button" class="btn btn-remove">&times;</button></span>\n' +
		'						</div>');
		
		
	});
	
	$('#sensitive').on('click', '.btn-add', function(event) {
		event.preventDefault();
		$('#sensitive').append('                    <div class="input-group">\n' +
		'                        <input type="text" class="form-control" placeholder="Example: http://example.com/medical">\n' +
		'                        <span class="input-group-btn"><button type="button" class="btn btn-remove">&times;</button></span> \n' +
		'						</div>');
	});
	
	$('#sharing').on('click', '.btn-add', function(event) {
		event.preventDefault();
		$('#sharing').append('                    <div class="input-group">\n' +
		'                        <input type="text" class="form-control" placeholder="Example: contact information">\n' +
		'                        <span class="input-group-btn"><button type="button" class="btn btn-remove">&times;</button></span> \n' +
		'						</div>');
	});

	$('#context').on('click', '.btn-add', function(event) {
		event.preventDefault();
		$('#context').append('                    <div class="input-group">\n' +
		'                        <input type="text" class="form-control" placeholder="Example: active privacy policy consent">\n' +
		'                        <span class="input-group-btn"><button type="button" class="btn btn-remove">&times;</button></span> \n' +
		'						</div>');
	});


	$(document).on('click', '.btn-remove', function(event) {
		event.preventDefault();
		
		$(event.currentTarget.parentElement.parentElement).remove();
		
	});
	
	$('#submit').on('click', function(event) {
	  
		event.preventDefault();
		$('html, body').animate({
			scrollTop: $(".receipt").offset().top - 55
		}, 1000);
   
	  
	  
		var oPost = {};
		oPost.jurisdiction = $('#jurisdiction').val();
		oPost.sub = $('#sub').val();
		oPost.svc = [$('#svc1').val(),$('#svc2').val()];
		oPost.notice = $('#notice').val();
		oPost.policy_uri = $('#policy_uri').val();
		oPost.data_controller =  [$('#data_controller1').val(),$('#data_controller2').val(),$('#data_controller3').val(),$('#data_controller4').val(),$('#data_controller5').val(),$('#data_controller6').val()];
		oPost.consent_payload = {};
		oPost.consent_payload[$('#consent_payload1').val()] = $('#consent_payload2').val();
		oPost.consent_payload[$('#consent_payload3').val()] = $('#consent_payload4').val();
		oPost.purpose = $('#purpose input[type="text"]').map(function() { return $(this).val() } ).get();
		oPost.pii_collected = {};
		oPost.pii_collected[$('#pii_collected1').val()] = $('#pii_collected2').val();
		oPost.pii_collected[$('#pii_collected3').val()] = $('#pii_collected4').val();
		oPost.sensitive = $('#sensitive input[type="text"]').map(function() { return $(this).val() } ).get();
		oPost.sharing = $('#sharing input[type="text"]').map(function() { return $(this).val() } ).get();
		oPost.context = $('#context input[type="text"]').map(function() { return $(this).val() } ).get()
		oPost.aud = $('#aud').val();
		oPost.scopes = $('#scope').val();



		$.ajax({
			type: "POST",
			url: "http://www.consentreceipt.org/api/mvcr",
			data: JSON.stringify(oPost),
			contentType : "application/json", 
			success: function (data) {
				console.log(data);
				console.log("SUCCESS");
				var receipt = new Blob([data], {type: "application/jwt"});
				var url  = URL.createObjectURL(receipt);
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
				$("#rdata_controller1").html(opayload.data_controller[0]);
				$("#rdata_controller2").html(opayload.data_controller[1]);
				$("#rdata_controller3").html(opayload.data_controller[2]);
				$("#rdata_controller4").html(opayload.data_controller[3]);
				$("#rdata_controller5").html(opayload.data_controller[4]);
				$("#rdata_controller6").html(opayload.data_controller[5]);
				var rconsent_payload1 = Object.keys(opayload.consent_payload)[0];
				$("#rconsent_payload1").html(rconsent_payload1);
				$("#rconsent_payload2").html(opayload.consent_payload[rconsent_payload1]);
				var rconsent_payload3 = Object.keys(opayload.consent_payload)[1];
				$("#rconsent_payload3").html(rconsent_payload3);
				$("#rconsent_payload4").html(opayload.consent_payload[rconsent_payload3]);
				$.each(opayload.purpose, function(index, value) {
					$("#rpurpose").append('<p>' + value + '</p>');
				});
				var rpii_collected1 = Object.keys(opayload.pii_collected)[0];
				$("#rpii_collected1").html(rpii_collected1);
				$("#rpii_collected2").html(opayload.pii_collected[rpii_collected1]);
				var rpii_collected3 = Object.keys(opayload.pii_collected)[1];
				$("#rpii_collected3").html(rpii_collected3);
				$("#rpii_collected4").html(opayload.pii_collected[rpii_collected3]);
				$.each(opayload.sensitive, function(index, value) {
					$("#rsensitive").append('<p>' + value + '</p>');
				});
				$.each(opayload.sharing, function(index, value) {
					$("#rsharing").append('<p>' + value + '</p>');
				});
				$.each(opayload.context, function(index, value) {
					$("#rcontext").append('<p>' + value + '</p>');
				});
				$("#raud").html(opayload.aud);
				$("#rscope").html(opayload.scopes);
				$("#riss").html(opayload.iss);
				var iat = new Date(opayload.iat);
				$("#riat").html(iat);
				$("#rjti").html(opayload.jti);


				$("#rhidden").show("slow");
				$("#receipt").hide("slow");

				$("#receiptdl a").attr('href', url);
				$("#receiptdl a").attr('disabled', false);

				//
				// check signature
				//
   
				// fetch key
				var jwt = data;
				$.ajax({
					type: "GET",
					url: "http://www.consentreceipt.org/api/jwk",
					data: "json",
					success: function(data) {
						console.log(data);
						var key = KEYUTIL.getKey(data.keys[0]); // there's only one key to parse
				
						// validate the JWT
						var isValid = KJUR.jws.JWS.verify(jwt, key);
						if (isValid) {
							$('#sig').removeClass('bg-warning');
							$('#sig').addClass('bg-success');
							$('#sig').html('Receipt signature is valid.');
						} else {
							$('#sig').removeClass('bg-warning');
							$('#sig').addClass('bg-danger');
							$('#sig').html('Receipt signature is invalid.');
						}
					},
					error: function() {
						$('#sig').removeClass('bg-warning');
						$('#sig').addClass('bg-danger');
						$('#sig').html('Unable to fetch key for receipt.');
					}
				});
   
			},
			error: function(data) {
				console.log(data);
				console.log("ERROR");
			}
		});
	});
});

