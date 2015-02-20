// Released under MIT license: http://www.opensource.org/licenses/mit-license.php

function runPlaceHolder() {
    function hasAttribute(node, attr) {
        return node.hasAttribute ? node.hasAttribute(attr) : !!node.getAttribute(attr);
    }

    if (!Modernizr.input.placeholder) {
        $(document).ready(function () {
            var inputs = document.querySelectorAll('input[type=text], textarea');
            for (var i = 0; i < inputs.length; i++) {
                if (hasAttribute(inputs[i], 'placeholder')) {
                    inputs[i].onfocus = function () {
                        if (this.value === this.getAttribute('placeholder')) {
                            this.value = '';
                            $(this).removeClass('placeholder');
                        }
                    };

                    inputs[i].onblur = function () {
                        if (this.value === '' || this.value === this.getAttribute('placeholder')) {
                            this.value = this.getAttribute('placeholder');
                            $(this).addClass('placeholder');
                        }
                    };

                    $(inputs[i]).parents('form').submit(function () {
                        if (inputs[i].value === inputs[i].getAttribute('placeholder')) {
                            inputs[i].value = '';
                        }
                    });

                    if (inputs[i].value === '') {
                        inputs[i].value = inputs[i].getAttribute('placeholder');
                        $(inputs[i]).addClass('placeholder');
                    }
                }
            }
        });
    }
};
runPlaceHolder();

