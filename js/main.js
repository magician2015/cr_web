
$(document).ready(function() {
	
	// prevent accidental form submission on 'enter'
	$('input,select').keypress(function(event) { return event.keyCode != 13; });

	$('#svc').on('click', '.btn-add', function(event) {
		event.preventDefault();
		
		$('#svc').append('                    <div class="input-group">\n' +
		'                        <input type="text" class="form-control" placeholder="Example: Company Service/Product Name">\n' +
		'                        <span class="input-group-btn"><button type="button" class="btn btn-remove">&times;</button></span>\n' +
		'						</div>');
		
		
	});
	
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
		oPost.svc = $('#svc input[type="text"]').map(function() { return $(this).val() } ).get();
		oPost.notice = $('#notice').val();
		oPost.policy_uri = $('#policy_uri').val();
		oPost.data_controller =  {
			'on_behalf': $('#data_controller_on_behalf').is(':checked'),
			'contact': $('#data_controller_contact').val(),
			'company': $('#data_controller_company').val(),
			'address': $('#data_controller_address').val(),
			'email': $('#data_controller_email').val(),
			'phone': $('#data_controller_phone').val()
		};
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
			url: "http://api.consentreceipt.org/api/mvcr",
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
				$('#rsvc').empty();
				if (opayload.svc.length > 0) {
					$.each(opayload.svc, function(index, value) {
						$("#rsvc").append('<p>' + value + '</p>');
					});
				} else {
						$("#rsvc").append('<p>None</p>');
				}
				$("#rnotice").html(opayload.notice);
				$("#rpolicy_uri").html(opayload.policy_uri);
				$("#rdata_controller_on_behalf").html((opayload.data_controller['on_behalf'] ? 'yes' : 'no'));
				$("#rdata_controller_contact").html(opayload.data_controller['contact']);
				$("#rdata_controller_company").html(opayload.data_controller['company']);
				$("#rdata_controller_address").html(opayload.data_controller['address']);
				$("#rdata_controller_email").html(opayload.data_controller['email']);
				$("#rdata_controller_phone").html(opayload.data_controller['phone']);
				var rconsent_payload1 = Object.keys(opayload.consent_payload)[0];
				$("#rconsent_payload1").html(rconsent_payload1);
				$("#rconsent_payload2").html(opayload.consent_payload[rconsent_payload1]);
				var rconsent_payload3 = Object.keys(opayload.consent_payload)[1];
				$("#rconsent_payload3").html(rconsent_payload3);
				$("#rconsent_payload4").html(opayload.consent_payload[rconsent_payload3]);
				$('#rpurpose').empty();
				if (opayload.purpose.length > 0) {
					$.each(opayload.purpose, function(index, value) {
						$("#rpurpose").append('<p>' + value + '</p>');
					});
				} else {
						$("#rpurpose").append('<p>None</p>');
				}
				var rpii_collected1 = Object.keys(opayload.pii_collected)[0];
				$("#rpii_collected1").html(rpii_collected1);
				$("#rpii_collected2").html(opayload.pii_collected[rpii_collected1]);
				var rpii_collected3 = Object.keys(opayload.pii_collected)[1];
				$("#rpii_collected3").html(rpii_collected3);
				$("#rpii_collected4").html(opayload.pii_collected[rpii_collected3]);
				$('#rsensitive').empty();
				if (opayload.sensitive.length > 0) {
					$.each(opayload.sensitive, function(index, value) {
						$("#rsensitive").append('<p>' + value + '</p>');
					});
				} else {
					$("#rsensitive").append('<p>None</p>');
				}
				$('#rsharing').empty();
				if (opayload.sharing.length > 0) {
					$.each(opayload.sharing, function(index, value) {
						$("#rsharing").append('<p>' + value + '</p>');
					});
				} else {
					$("#rsharing").append('<p>None</p>');
				}
				$('#rcontext').empty();
				if (opayload.context.length > 0) {
					$.each(opayload.context, function(index, value) {
						$("#rcontext").append('<p>' + value + '</p>');
					});
				} else {
					$("#rcontext").append('<p>None</p>');
				}
				$("#raud").html(opayload.aud);
				$("#rscope").html(opayload.scopes);
				$("#riss").html(opayload.iss);
				var iat = opayload.iat*1000;
				iat = new Date(iat);
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
					url: "http://api.consentreceipt.org/api/jwk",
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

