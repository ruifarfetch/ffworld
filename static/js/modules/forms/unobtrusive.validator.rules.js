if ($.validator) {
  // Custom validator for br CPF address field
  $.validator.addMethod("validcpf", function (value, element, params) {
    var cpf = value.replace(/\.|-/ig, "");

    if (cpf == '') return false;

    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
      /*cpf == "11111111111" ||*/
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
      return false;

    // Valida 1o digito
    var add = 0;
    for (var i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    var rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
      return false;

    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
      return false;

    return true;
  });

  $.validator.unobtrusive.adapters.add("validcpf", [""], function (options) {
    options.messages["validcpf"] = options.message;
    options.rules['validcpf'] = true;
  });

  // Custom validator for credit card date
  $.validator.addMethod("creditcardmonth", function (value, element, params) {
    var year = parseInt($(params).val());
    var month = parseInt(value);
    if (isNaN(year) || isNaN(month))
      return false;
    return new Date(year, month, 0) >= new Date();
  });

  $.validator.unobtrusive.adapters.add("creditcardmonth", ["yearpropertyname"], function (options) {
    options.rules["creditcardmonth"] = "#" + options.params.yearpropertyname;
    options.messages["creditcardmonth"] = options.message;
  });

  $.validator.addMethod('numericlessthan', function (value, element, params) {
    var otherValue = $(params.element).val();

    return isNaN(value) && isNaN(otherValue) || (params.allowequality === 'True' ? parseFloat(value) <= parseFloat(otherValue) : parseFloat(value) < parseFloat(otherValue));
  }, '');

  $.validator.unobtrusive.adapters.add('numericlessthan', ['other', 'allowequality'], function (options) {
    other = options.params.other,
    element = $(options.form).find(':input[name=' + other + ']')[0];

    options.rules['numericlessthan'] = { allowequality: options.params.allowequality, element: element };
    if (options.message) {
      options.messages['numericlessthan'] = options.message;
    }
  });

  // Custom "RequiredIf" client-side validator
  $.validator.addMethod('requiredif',
       function (value, element, parameters) {
         var id = '#' + parameters['dependentproperty'];

         var form = $(element).closest("form");

         // get the target value (as a string, 
         // as that's what actual value will be)
         var targetvalue = parameters['targetvalue'];
         targetvalue =
             (targetvalue == null ? '' : targetvalue).toString();

         // get the actual value of the target control
         // note - this probably needs to cater for more 
         // control types, e.g. radios
         var control = form.find(id);
         var controltype = control.attr('type');
         var actualvalue =
             controltype === 'checkbox' ?
             (control.attr('checked') != null ? "true" : "false") :
             control.val();

         // if the condition is true, reuse the existing 
         // required field validator functionality
         if (targetvalue === actualvalue)
           return $.validator.methods.required.call(
             this, value, element, parameters);

         // This element is not required because the required target element is not required
         return "requiredif-ok";
       }
   );

  $.validator.unobtrusive.adapters.add(
     'requiredif',
     ['dependentproperty', 'targetvalue'],
     function (options) {
       options.rules['requiredif'] = {
         dependentproperty: options.params['dependentproperty'],
         targetvalue: options.params['targetvalue']
       };
       options.messages['requiredif'] = options.message;
     });


  // Validator extension for custom dropdowns
  $.validator.setDefaults({
      ignore: "input:hidden:not(.dropdownhidden, .searchableajaxdropdown, .sizeUnavailableValueForValidate),select.dropdown-searchable",
    highlight: function (element, errorClass, validClass) {

      if (element.type === 'radio') {
        this.findByName(element.name).removeClass(validClass).addClass(errorClass);
      } else if ($(element).hasClass("dropdownhidden")) {
        var name = $(element).attr("name"),
            dropDownDiv = $(this.currentForm).find("div[data-input-hidden-name='" + name + "']");

        if (dropDownDiv.length > 0) {
          dropDownDiv.removeClass(validClass).addClass(errorClass);
        }
      } else if ($(element).hasClass("searchableajaxdropdown") || $(element).hasClass("dropdown-searchable")) {
        var name = $(element).attr("name"),
            spanError = $(this.currentForm).find("span[data-valmsg-for='" + name + "']");

        if (spanError.length > 0) {
          var dropDownDiv = spanError.siblings("div.chosen-container");
          if (dropDownDiv.length > 0)
            dropDownDiv.removeClass(validClass).addClass(errorClass);
        }
      } else {
        $(element).removeClass(validClass).addClass(errorClass);
      }
    },
    unhighlight: function (element, errorClass, validClass) {
      if (element.type === 'radio') {
        this.findByName(element.name).removeClass(errorClass).addClass(validClass);
      } else if ($(element).hasClass("dropdownhidden")) {
        var name = $(element).attr("name"),
            dropDownDiv = $(this.currentForm).find("div[data-input-hidden-name='" + name + "']");

        if (dropDownDiv.length > 0) {
          dropDownDiv.removeClass(errorClass).addClass(validClass);
        }
      } else if ($(element).hasClass("searchableajaxdropdown") || $(element).hasClass("dropdown-searchable")) {
        var name = $(element).attr("name"),
            spanError = $(this.currentForm).find("span[data-valmsg-for='" + name + "']");

        if (spanError.length > 0) {
          var dropDownDiv = spanError.siblings("div.chosen-container");
          if (dropDownDiv.length > 0)
            dropDownDiv.removeClass(errorClass).addClass(validClass);
        }
      } else {
        $(element).removeClass(errorClass).addClass(validClass);
      }
    }
  });
}