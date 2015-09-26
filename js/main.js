
$(document).ready(function() {
	var HOST = "http://localhost:3000/api";

	$.fn.serializeObject = function()
	{
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	        	var splitName = this.name.split(".");
	        	if(splitName.length > 1){
	        		o[splitName[0]] = o[splitName[0]] || {}
	        		o[splitName[0]][splitName[1]] = this.value || '';
	        	}else{
	        		o[this.name] = this.value || '';	
	        	}
	        }
	    });
	    return o;
	};
	
	// prevent accidental form submission on 'enter'
	$('input,select').keypress(function(event) { return event.keyCode != 13; });

	$(".js-example-tags").select2({
	  tags: ["CISWG Membership","Join", "Bob’s store", "delivery"]
	});

	var listPurpose = [
		  	{id: "core_function", text: "Core Function"}, {id: "contracted_service", text: "Contracted Service"}, {id: "delivery", text: "Delivery"},
		  	{id: "contact_requested", text: "Contact Requested"}, {id: "personalized_experience", text: "Personalized Experience"}, {id: "marketing", text: "Marketing"},
		  	{id: "marketing_thirdparties", text: "Marketing Third Parties"}, {id: "sharing_for_delivery", text: "Sharing for Delivery"}, {id: "sharing_for_marketing", text: "Sharing for Marketing"},
		  	{id: "3rd_party_sharing_for_corefunction", text: "3rd Party Sharing for Core Function"}, {id: "legally_required_data_retention", text: "Legally Required Data Retention"},
		  	{id: "required_by_law_enforcement_or_government", text: "Required by Law Enforcement or Government"}, {id: "protecting_your_health", text: "Protecting Your Heath"},
		  	{id: "protecting_our_interests", text: "Protecting Our Interests"}, {id: "improve_performance", text: "Improve Performance"}
		];
	var listSensitive = [
			{id: "biographical", text: "Biographical"}, {id: "contact", text: "Contact"}, {id: "biometric", text: "Biometric"},{id: "social_contact", text: "Social Contact"},
			{id: "network", text: "Network/Service"}, {id: "health", text: "Health"}, {id: "financial", text: "Financial"}, {id: "officialId", text: "Official ID"},
			{id: "social_benefit", text: "Social Benefit Data"}, {id: "judicial", text: "Judicial Data"}, {id: "asset", text: "Asset Data"}, {id: "hr", text: "HR Data"},
			{id: "mental_health", text: "Mental Health"}, {id: "membership", text: "Membership"},{id: "behavioral", text: "Behavioral"}, {id: "profiling", text: "Profiling"}
		];

	var createOwn = function(term, data){
			if($(data).filter(function(){
				return this.text.localeCompare(term) === 0;
			}).length === 0){
				return {
					id: term,
					text: term
				};
			};
		};

	function initDropdown(purposeItem, sensitiveItem){
		purposeItem = purposeItem || $(".purpose_item");
		sensitiveItem = sensitiveItem || $(".pi_sensitive");
		purposeItem.select2({
			createSearchChoice: createOwn,
			placeholder: "Choose or enter your own purpose",
			multiple: false,
		  	data: listPurpose,
			searchInputPlaceholder: "--Add your own and Enter here--"
		});

		sensitiveItem.select2({
			placeholder: "Select PI category",
			multiple: true,
			data: listSensitive
		})
	}

	initDropdown();


	//init event
	$('#purpose').on('click',function(event){
		event.preventDefault();

		var $purpose = $('#purpose_template .purpose').clone();
		$('.purpose_list').append($purpose);

		initDropdown($purpose.find(".purpose_item"), $purpose.find(".pi_sensitive"));
	});

	$("input#on_sensitive").on('change', function(event){
		var check = $(this).is(":checked");
		$("#options").css("display", check?"block":"none");
	});

	$("input#other").on('change', function(event){
		var check = $(this).is(":checked");
		$("#other_pi").prop("disabled", !check);
	});

	$(document).on('click', '.close', function(event) {
		event.preventDefault();
		
		$(event.currentTarget.parentElement.parentElement).remove();
		
	});

	function initData(){
		var timestamp = Math.floor(Date.now()/1000);
		$("#timestamp").val(timestamp);
		$.get(HOST + "/token", function(data){
			$("#uniqueID").val(data);
		})
	}

	function serializeForm(){
		var data = $("#consent_form").serializeObject();
		data.data_controller.on_behalf = (data.data_controller.on_behalf == 'true');
		return data;
	}

	function getPurposeList(){
		listPurpose = [];
		$(".purpose_list .purpose").each(function(item){
			var purpose = {};
			purpose.serviceName = $(this).find("input[type='text']").val();
			purpose.purpose = $(this).find(".purpose_item").select2("val");
			purpose.pi = $(this).find(".pi_sensitive").select2("val");
			listPurpose.push(purpose);
		})
		return listPurpose;
	}

	function getSensitiveInformation(){
		var sensitiveList = [];
		if($("input#on_sensitive").is(":checked")){
			$.each($("input[name='sensitive_options']:checked"), function() {
			  	sensitiveList.push($(this).val());
			});
		}
		if($("input#other").is(":checked")){
			sensitiveList.push($("#other_pi").val());
		}
		return sensitiveList;
	}

	$('#submit').on('click', function(event) {
		event.preventDefault();
		$('html, body').animate({
			scrollTop: $(".receipt").offset().top - 55
		}, 1000);

		postData = serializeForm();
		var purposeList = getPurposeList();
		postData.sensitive = getSensitiveInformation();
		//waiting for confirm about format
		postData.purpose = [];
		postData.sharing = [];
		postData.pii_collected = {};

		$.ajax({
			type: "POST",
			url: HOST + "/mvcr",
			data: JSON.stringify(postData),
			contentType : "application/json", 
			success: function (data) {
				console.log("SUCCESS: ", data);
				var receipt = new Blob([data], {type: "application/jwt"});
				var url  = URL.createObjectURL(receipt);
				var segments = data.split('.');
				var payloadSeg = segments[1];

				var payload = b64utos(payloadSeg);
				var opayload = JSON.parse(payload);
				console.log(opayload);

				$("#rjurisdiction").html(opayload.jurisdiction);
				$("#rsub").html(opayload.sub);
				$("#rnotice").html(opayload.notice);
				$("#rpolicy_uri").html(opayload.policy_uri);
				$("#rdata_controller_on_behalf").html((opayload.data_controller['on_behalf'] ? 'yes' : 'no'));
				$("#rdata_controller_contact").html(opayload.data_controller['contact']);
				$("#rdata_controller_company").html(opayload.data_controller['company']);
				$("#rdata_controller_address").html(opayload.data_controller['address']);
				$("#rdata_controller_email").html(opayload.data_controller['email']);
				$("#rdata_controller_phone").html(opayload.data_controller['phone']);
				$('#rpurpose').empty();
				if (opayload.purpose.length > 0) {
					$.each(opayload.purpose, function(index, value) {
						$("#rpurpose").append('<p>' + value + '</p>');
					});
				} else {
						$("#rpurpose").append('<p>None</p>');
				}

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
				
				$("#rmoc").html(opayload.moc);
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
					url: HOST + "/jwk",
					data: "json",
					success: function(data) {
						console.log(data);
						var key = KEYUTIL.getKey(data.keys[0]); // there's only one key to parse
				
						// validate the JWT
						var isValid = KJUR.jws.JWS.verify(jwt, key);
						if (isValid) {
							$('#sig').removeClass('bg-warning');
							$('#sig').addClass('bg-success');
							$('#sig').html('<span class="glyphicon glyphicon-ok"></span> Receipt signature is valid.');
						} else {
							$('#sig').removeClass('bg-warning');
							$('#sig').addClass('bg-danger');
							$('#sig').html('<span class="glyphicon glyphicon-remove"></span> Receipt signature is invalid.');
						}
					},
					error: function() {
						$('#sig').removeClass('bg-warning');
						$('#sig').addClass('bg-danger');
						$('#sig').html('<span class="glyphicon glyphicon-warning-sign"></span> Unable to fetch key for receipt.');
					}
				});
   
			},
			error: function(data) {
				console.log(data);
				console.log("ERROR");
			}
		});

	});


	initData();



	$('#svc').on('click', '.btn-add', function(event) {
		event.preventDefault();
		
		$('#svc').append('                    <div class="input-group">\n' +
		'                        <input type="text" class="form-control" placeholder="Example: Company Service/Product Name">\n' +
		'                        <span class="input-group-btn"><button type="button" class="btn btn-remove">&times;</button></span>\n' +
		'						</div>');
		
		
	});
	
	// $('#purpose').on('click', '.btn-add', function(event) {
	// 	event.preventDefault();
		
	// 	$('#purpose').append('                    <div class="input-group">\n' +
	// 	'                        <input type="text" class="form-control" placeholder="Example: marketing">\n' +
	// 	'                        <span class="input-group-btn"><button type="button" class="btn btn-remove">&times;</button></span>\n' +
	// 	'						</div>');
		
		
	// });
	
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
	
	$('#submit_old').on('click', function(event) {
	  
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

	function test_json(){
		var json_data = {
		 	"jurisdiction" : "US",
		 	"iat": 1443282118,
		 	"moc": "web form",
		 	"iss": "http://www.consentreceipt.org/",
		 	"jti": "cba37edd4e223a44ea0197498663af81c0d68cdf7b5f13975096e34435339e51f86b6bf674f9725632b6f451b4a78c2fb09d3fcd38c978f004fcf99e65bdceab",
		 	"sub" : "example@example.com" ,

		 	"data_controller" : {"on_behalf": true, "contact": "Dave Controller", "company": "Data Controller Inc.", "address": "123 St., Place", "email": "dave@datacontroller.com", "phone": "00-123-341-2351"},
		 	"policy_uri" : "http://example.com/privacy" ,

		 	"purpose" : ["CISWG Membership", "Join"],

		 	"pii_collected" : {"name" : "Sarah Squire","email" : "sarah@engageidentity.com"} ,
			"sensitive" : ["health"] ,

			"sharing" : ["contact information","demographic information"],

			"notice" : "http://example.com/shortnotice" ,
			"scopes" : "read update"
		}

		$.ajax({
				type: "POST",
				url: HOST + "/mvcr",
				data: JSON.stringify(json_data),
				contentType : "application/json", 
				success: function (data) {
					console.log("SUCCESS: ", data);
					var receipt = new Blob([data], {type: "application/jwt"});
					var url  = URL.createObjectURL(receipt);
					var segments = data.split('.');
					var payloadSeg = segments[1];

					var payload = b64utos(payloadSeg);
					var opayload = JSON.parse(payload);
					console.log(opayload);

					$("#rjurisdiction").html(opayload.jurisdiction);
					$("#rsub").html(opayload.sub);
					$("#rnotice").html(opayload.notice);
					$("#rpolicy_uri").html(opayload.policy_uri);
					$("#rdata_controller_on_behalf").html((opayload.data_controller['on_behalf'] ? 'yes' : 'no'));
					$("#rdata_controller_contact").html(opayload.data_controller['contact']);
					$("#rdata_controller_company").html(opayload.data_controller['company']);
					$("#rdata_controller_address").html(opayload.data_controller['address']);
					$("#rdata_controller_email").html(opayload.data_controller['email']);
					$("#rdata_controller_phone").html(opayload.data_controller['phone']);
					$('#rpurpose').empty();
					if (opayload.purpose.length > 0) {
						$.each(opayload.purpose, function(index, value) {
							$("#rpurpose").append('<p>' + value + '</p>');
						});
					} else {
							$("#rpurpose").append('<p>None</p>');
					}

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
					
					$("#rmoc").html(opayload.moc);
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
						url: HOST + "/jwk",
						data: "json",
						success: function(data) {
							console.log(data);
							var key = KEYUTIL.getKey(data.keys[0]); // there's only one key to parse
					
							// validate the JWT
							var isValid = KJUR.jws.JWS.verify(jwt, key);
							if (isValid) {
								$('#sig').removeClass('bg-warning');
								$('#sig').addClass('bg-success');
								$('#sig').html('<span class="glyphicon glyphicon-ok"></span> Receipt signature is valid.');
							} else {
								$('#sig').removeClass('bg-warning');
								$('#sig').addClass('bg-danger');
								$('#sig').html('<span class="glyphicon glyphicon-remove"></span> Receipt signature is invalid.');
							}
						},
						error: function() {
							$('#sig').removeClass('bg-warning');
							$('#sig').addClass('bg-danger');
							$('#sig').html('<span class="glyphicon glyphicon-warning-sign"></span> Unable to fetch key for receipt.');
						}
					});
				},
				error: function(data){
					console.log("ERROR: ", data);
				}
			});
	}

});

