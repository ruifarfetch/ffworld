if ($.validator && FFAPI.translations) {
	$.validator.messages = {
		required: FFAPI.translations.requiredErrorMsg,
		remote: FFAPI.translations.remoteErrorMsg,
		email: FFAPI.translations.emailErrorMsg,
		url: FFAPI.translations.urlErrorMsg,
		date: FFAPI.translations.dateErrorMsg,
		dateISO: FFAPI.translations.dateISOErrorMsg,
		number: FFAPI.translations.numberErrorMsg,
		digits: FFAPI.translations.digitsErrorMsg,
		creditcard: FFAPI.translations.creditcardErrorMsg,
		equalTo: FFAPI.translations.equalToErrorMsg,
		maxlength: $.validator.format(FFAPI.translations.numCharactersErrorMsg),
		minlength: $.validator.format(FFAPI.translations.minlengthErrorMsg),
		rangelength: $.validator.format(FFAPI.translations.rangelengthErrorMsg),
		range: $.validator.format(FFAPI.translations.rangeErrorMsg),
		max: $.validator.format(FFAPI.translations.maxErrorMsg),
		min: $.validator.format(FFAPI.translations.minErrorMsg)
	};
}