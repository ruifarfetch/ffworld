/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * @version 1.0.7
 * 
 * http://wenzhixin.net.cn/p/multiple-select/
 */

(function ($) {

    'use strict';

    function MultipleSelect($el, options) {
        var that = this,
            elWidth = $el.width();
        this.$el = $el.hide();
        this.options = options;

        this.$parent = $('<div class="ms-parent"></div>');
        this.$drop = $('<div class="ms-drop ' + options.position + '"></div>');
        // Farfetch - Customizations
        this.copyAttributes = false;
        if ($el.data('copyAttributes') === true) {
            this.copyAttributes = true;
            this.$parent.data(this.$el.data());
        }
        //
        this.$el.after(this.$parent);
        this.$parent.append(this.$drop);

        // Change placeholder behaviour to accept boolean false
        if(options.placeholder !== false) {
            this.$choice = $('<button type="button" class="ms-choice"><span class="placeholder">' +
            options.placeholder + '</span><div></div></button>');

            this.$parent.append(this.$choice);

            if (this.$el.prop('disabled')) {
                this.$choice.addClass('disabled');
            }
            this.$choice.css('width', elWidth + 'px');
        }

        this.$drop.css({
            width: (options.width || elWidth) + 'px'
        });
        
        if (this.options.isopen) {
            if(this.$choice) {
                this.$choice.find('>div').addClass('open');
            }
            this.$parent.addClass('ms-parent-open');
            this.$drop.addClass('ms-drop-open').slideDown();
            if (this.options.focusInput) {
                setTimeout(function () { 
                    that.options.onOpen();
                    $('.ms-search .input_black').focus() 
                }, 400);
            }
        }
    }

    MultipleSelect.prototype = {
        constructor: MultipleSelect,

        init: function () {
            var that = this,
                html = [];

            if (this.options.showClearAll) {
                html.push(
                    '<div class="ms-clear hide"><span>' + this.options.clearAllText + '</span></div>'
                );
            }

            if (this.options.single) {
                this.$parent.addClass("ms-parent-single");
            }

            if (this.options.filter) {
                var placeholderText = this.options.placeholderText;
                var noresultsText = this.options.noresultsText;

                if (!placeholderText) {
                    placeholderText = 'Type your search here';
                }
                if (!noresultsText) {
                    noresultsText = 'No results found';
                }

                /*RES-345*/
                html.push(
                    '<div class="ms-search">',
                        '<input type="text" class="input_black" autocomplete="off" autocorrect="off" autocapitilize="off" spellcheck="false" placeholder="' + placeholderText + '">',
                        '<span class="glyphs icon-close ms-drop-text-clear js-input-text-clear hide"></span>'

                );

                if (this.options.showNoResults) {
                    html.push('<div class="ms-no-results hide">' + noresultsText + '</div>');
                }

                html.push('</div>');
            }

            html.push('<ul>');
            if (this.options.selectAll && !this.options.single) {
                html.push(
                    '<li>',
                        '<label class="fancy-checkbox">',
                            '<input type="checkbox" name="selectAll" /> ',
                            '[' + this.options.selectAllText + ']',
                        '</label>',
                    '</li>'
                );
            }

            $.each(this.$el.children(), function (i, elm) {
                html.push(that.optionToHtml(i, elm));
            });

            html.push('</ul>');
            this.$drop.html(html.join(''));
            this.$drop.find('ul').css('max-height', this.options.maxHeight + 'px');
            // Farfetch customization
            this.$drop.find('ul').attr('id', this.$el.attr('data-ul-id'));
            this.$drop.find('ul').addClass(this.$el.attr('data-ul-class'));
            // end Farfetch customization
            this.$drop.find('.multiple').css('width', this.options.multipleWidth + 'px');
            this.$searchInput = this.$drop.find('.ms-search input');
            this.$selectAll = this.$drop.find('input[name="selectAll"]');
            this.$selectGroups = this.$drop.find('input[name="selectGroup"]');
            this.$selectItems = this.$drop.find('input[name="selectItem"]:enabled');
            this.$disableItems = this.$drop.find('input[name="selectItem"]:disabled');
            this.$clearAll = this.$drop.find('div.ms-clear');
            // Farfetch customization
            this.$clearAll.attr('id', this.$el.attr('data-clear-id'));
            this.$clearAll.addClass(this.$el.attr('data-clear-class'));
            this.$clearAllSpan = this.$clearAll.find('span');
            this.$clearAllSpan.attr('id', this.$el.attr('data-clear-span-id'));
            this.$clearAllSpan.addClass(this.$el.attr('data-clear-span-class'));
            this.$clearAllSpan.attr('data-filter', this.$el.attr('data-clear-filter'));
            // end Farfetch customization
            this.$noResults = this.$drop.find('.ms-no-results');
            this.$clearInputVal = this.$drop.find('.ms-drop-text-clear');
            this.events();
            this.update();
        },
        moveAttribute: function (orig, dest, attributeName, destAttributeName) {
            var attrValue = orig.attr(attributeName);
            if (destAttributeName == undefined) {
                destAttributeName = attributeName;
            }
            if (attrValue == undefined) {
                return;
            } else {
                dest.attr(destAttributeName, attrValue);
                orig.removeAttr(attributeName);
                return;
            }
        },
        optionToHtml: function (i, elm, group, groupDisabled) {
            var that = this,
                $elm = $(elm),
                html = [],
                multiple = this.options.multiple,
                disabled,
                type = this.options.single ? 'radio' : 'checkbox';

            if ($elm.is('option') && $elm.attr("data-loaded") === undefined) {
                var value = $elm.val(),
                    text = $elm.text(),
                    selected = $elm.prop('selected');

                disabled = groupDisabled || $elm.prop('disabled');
                // Farfetch Customizations (required for multiselect)
                if (this.copyAttributes) {
                    var li = $('<li' + (multiple ? ' class="multiple"' : '') + '></li>');
                    var label = $('<label' + 'class="cenas"' + (disabled ? ' class="disabled"' : '') + '></label>');

                    var anchor = $('<a' + (group ? ' data-group="' + group + '"' : '') + '></a>');
                    var input = $('<input type="' + type + '" name="selectItem" value="' + value + '"' + (selected ? ' checked="checked"' : '') + (disabled ? ' disabled="disabled"' : '') + (group ? ' data-group="' + group + '"' : '') + '/> ');
                    // li attributes
                    li.addClass($elm.attr('data-li-class'));
                    // Input attributes
                    that.moveAttribute($elm, anchor, 'id');
                    that.moveAttribute($elm, anchor, 'class');
                    that.moveAttribute($elm, anchor, 'data-ignore');
                    that.moveAttribute($elm, anchor, 'data-filter');
                    that.moveAttribute($elm, anchor, 'data-filter-relative-deep');
                    that.moveAttribute($elm, anchor, 'data-parent-filter');
                    that.moveAttribute($elm, anchor, 'data-parent-top-filter');
                    that.moveAttribute($elm, anchor, 'order');
                    that.moveAttribute($elm, anchor, 'trk');
                    that.moveAttribute($elm, anchor, 'href');
                    that.moveAttribute($elm, anchor, 'rel');
                    $elm.attr("data-loaded", true);

                    // build the HTML elements hierarchy					
                    anchor.append('<div class="float-left"><i></i></div>').append(input);
                    anchor.append('<p class="ms-drop-option">' + text + '</p>');
                    label.append(anchor);
                    li.append(label);
                    html.push(li[0].outerHTML);
                }
                else {
                    html.push(
                        '<li' + (multiple ? ' class="multiple"' : '') + '>',
                            '<label' + (disabled ? ' class="disabled"' : '') + '>',
                                '<div class="float-left"><i></i></div>',
                                '<input type="' + type + '" name="selectItem" value="' + value + '"' +
                                    (selected ? ' checked="checked"' : '') +
                                    (disabled ? ' disabled="disabled"' : '') +
                                    (group ? ' data-group="' + group + '"' : '') +
                                    '/> ',
                                '<p class="ms-drop-option">' + text + '</p>',
                            '</label>',
                        '</li>'
                    );
                }
                // End of Farfetch Customizations
            } else if (!group && $elm.is('optgroup')) {
                var _group = 'group_' + i,
                    label = $elm.attr('label');

                disabled = $elm.prop('disabled');
                html.push(
                    '<li class="group">',
                        '<label class="optgroup' + (disabled ? ' disabled' : '') + '" data-group="' + _group + '">',
                            '<input type="checkbox" name="selectGroup"' + (disabled ? ' disabled="disabled"' : '') + ' /> ',
                            label,
                        '</label>',
                    '</li>');
                $.each($elm.children(), function (i, elm) {
                    html.push(that.optionToHtml(i, elm, _group, disabled));
                });
            }
            return html.join('');
        },

        events: function () {
            var that = this;
            if(this.$choice) {
                this.$choice.off('click').on('click', function () {
                    that[that.options.isopen ? 'close' : 'open']();
                });
            }
            this.$parent.off('keydown').on('keydown', function (e) {
                switch (e.which) {
                    case 27: // esc key
                        that.close();
                        if(that.$choice) that.$choice.focus();
                        break;
                }
            });
            this.$searchInput.off('keyup').on('keyup', function () {
                that.filter();
            });
            this.$selectAll.off('click').on('click', function () {
                var checked = $(this).prop('checked'),
                    $items = that.$selectItems.filter(':visible');
                if ($items.length === that.$selectItems.length) {
                    that[checked ? 'checkAll' : 'uncheckAll']();
                } else { // when the filter option is true
                    that.$selectGroups.prop('checked', checked);
                    $items.prop('checked', checked);
                    that.update();
                }
            });
            this.$clearAll.off('click').on('click', function () {
                that.uncheckAll();
            });
            this.$selectGroups.off('click').on('click', function () {
                var group = $(this).parent().attr('data-group'),
                    $items = that.$selectItems.filter(':visible'),
                    $children = $items.filter('[data-group="' + group + '"]'),
                    checked = $children.length !== $children.filter(':checked').length;
                $children.prop('checked', checked);
                that.updateSelectAll();
                that.update();
                that.options.onOptgroupClick({
                    label: $(this).parent().text(),
                    checked: checked,
                    children: $children.get()
                });
            });
            this.$selectItems.off('click').on('click', function () {
                that.updateSelectAll();
                that.update();
                that.updateOptGroupSelect();
                that.options.onClick({
                    label: $(this).parent().text(),
                    value: $(this).val(),
                    checked: $(this).prop('checked'),
                    li: $(this).closest("li").toggleClass("ms-drop-selected")
                });
            });

            this.$clearInputVal.off('click').on('click', function () {
                $(this).parent().find('input').val("").focus();
                $(this).parent().find('.js-input-text-clear').addClass('hide');
                $(this).parent().parent().find('.ms-no-results').hide();
                $(this).parent().parent().find('ul').removeClass('ms-list-no-results');
                $(this).parent().parent().find('ul li').show();
            });
        },

        open: function () {
            if (this.$choice && this.$choice.hasClass('disabled')) {
                return;
            }
            this.options.isopen = true;
            this.$choice.find('>div').addClass('open');
            this.$parent.addClass('ms-parent-open');
            this.$drop.addClass('ms-drop-open').slideDown();
            if (this.options.container) {
                var offset = this.$drop.offset();
                this.$drop.appendTo($(this.options.container));
                this.$drop.offset({ top: offset.top, left: offset.left });
            }
            if (this.options.filter) {
                this.$searchInput.val('');
                this.filter();
            }
            this.options.onOpen();
            /*this.$searchInput.focus();*/
        },

        close: function () {
            this.options.isopen = false;
            if (this.$choice) {
                this.$choice.find('>div').removeClass('open');
            }
            this.$parent.removeClass('ms-parent-open');
            this.$drop.removeClass('ms-drop-open').slideUp();
            if (this.options.container) {
                this.$parent.append(this.$drop);
                this.$drop.css({
                    'top': 'auto',
                    'left': 'auto'
                })
            }
            this.options.onClose();
            this.$searchInput.blur();
        },

        update: function () {
            var selects = this.getSelects('text');
            if (this.$choice && selects.length == this.$selectItems.length && this.options.overrideButtonText) {
                var $span = this.$choice.find('>span');
                $span.removeClass('placeholder').html(this.options.selectAllText);
            } else if (selects.length) {
                this.$clearAll.removeClass('hide').addClass('show');
            } else {
                this.$clearAll.addClass('hide').removeClass('show');
            }
            // set selects to select
            this.$el.val(this.getSelects());
        },

        updateSelectAll: function () {
            var $items = this.$selectItems.filter(':visible');
            this.$selectAll.prop('checked', $items.length &&
                $items.length === $items.filter(':checked').length);
        },

        updateOptGroupSelect: function () {
            var $items = this.$selectItems.filter(':visible');
            $.each(this.$selectGroups, function (i, val) {
                var group = $(val).parent().attr('data-group'),
                    $children = $items.filter('[data-group="' + group + '"]');
                $(val).prop('checked', $children.length &&
                    $children.length === $children.filter(':checked').length);
            });
        },

        //value or text, default: 'value'
        getSelects: function (type) {
            var that = this,
                texts = [],
                values = [];
            this.$drop.find('input[name="selectItem"]:checked').each(function () {
                texts.push($(this).parent().text());
                values.push($(this).val());
            });

            if (type === 'text' && this.$selectGroups.length) {
                texts = [];
                this.$selectGroups.each(function () {
                    var html = [],
                        text = $.trim($(this).parent().text()),
                        group = $(this).parent().data('group'),
                        $children = that.$drop.find('[name="selectItem"][data-group="' + group + '"]'),
                        $selected = $children.filter(':checked');

                    if ($selected.length === 0) {
                        return;
                    }

                    html.push('[');
                    html.push(text);
                    if ($children.length > $selected.length) {
                        var list = [];
                        $selected.each(function () {
                            list.push($(this).parent().text());
                        });
                        html.push(': ' + list.join(', '));
                    }
                    html.push(']');
                    texts.push(html.join(''));
                });
            }
            return type === 'text' ? texts : values;
        },

        setSelects: function (values) {
            var that = this;
            this.$selectItems.prop('checked', false);
            $.each(values, function (i, value) {
                that.$selectItems.filter('[value="' + value + '"]').prop('checked', true);
            });
            this.$selectAll.prop('checked', this.$selectItems.length ===
                this.$selectItems.filter(':checked').length);
            this.update();
        },

        enable: function () {
            if(!this.$choice) return;
            this.$choice.removeClass('disabled');
        },

        disable: function () {
            if(!this.$choice) return;
            this.$choice.addClass('disabled');
        },

        checkAll: function () {
            this.$selectItems.prop('checked', true);
            this.$selectGroups.prop('checked', true);
            this.$selectAll.prop('checked', true);
            this.update();
            this.options.onCheckAll();
        },

        uncheckAll: function () {
            this.$selectItems.prop('checked', false);
            this.$selectItems.closest("li").removeClass('ms-drop-selected');
            this.$selectGroups.prop('checked', false);
            this.$selectAll.prop('checked', false);
            this.update();
            this.options.onUncheckAll();
        },

        refresh: function () {
            this.init();
        },

        refilter: function () {

            for (var i = 0; i <= this.$el.children().length - 1; i++) {
                var elm = this.$el.children()[i];
                if ($(elm).attr("data-loaded") === undefined) {
                    this.$drop.children("ul").append(this.optionToHtml(i, elm));
                }
            }

            this.$selectItems = this.$drop.find('input[name="selectItem"]:enabled');

            this.filter();
            this.events();
        },

        filter: function () {
            var that = this,
                text = $.trim(this.$searchInput.val()).toLowerCase();
            if (text.length === 0) {
                // this.$selectItems.parent().show();
                this.$selectItems.closest('li').show();
                this.$disableItems.closest('li').show();
                this.$selectGroups.parent().show();
                this.$searchInput.parent().find('.ms-drop-text-clear').addClass('hide');
            } else {
                this.$searchInput.parent().find('.ms-drop-text-clear').removeClass('hide');
                this.$selectItems.each(function () {
                    var $parent = $(this).parent();
                    // $parent[$parent.text().toLowerCase().indexOf(text) < 0 ? 'hide' : 'show']();
                    //$parent.parent()[$parent.text().toLowerCase().indexOf(text) < 0 ? 'hide' : 'show']();
                    $parent.closest('li')[$parent.text().toLowerCase().indexOf(text) < 0 ? 'hide' : 'show']();
                });
                this.$disableItems.parent().hide();
                this.$selectGroups.each(function () {
                    var $parent = $(this).parent();
                    var group = $parent.attr('data-group'),
                    $items = that.$selectItems.filter(':visible');
                    $parent.parent()[$items.filter('[data-group="' + group + '"]').length === 0 ? 'hide' : 'show']();
                });
            }

            //Check if no matches found
            if (this.$selectItems.parent().parent().filter(':visible').length) {
                this.$noResults.hide();
                this.$drop.find('ul').removeClass('ms-list-no-results');
            } else {
                this.$noResults.show();
                this.$drop.find('ul').addClass('ms-list-no-results');
            }

            this.options.onSearch();
            this.updateOptGroupSelect();
            this.updateSelectAll();
        }
    };

    $.fn.multipleSelect = function () {
        var option = arguments[0],
            args = arguments,

            value,
            allowedMethods = ['getSelects', 'setSelects', 'enable', 'disable', 'checkAll', 'uncheckAll', 'refresh', 'refilter'];

        this.each(function () {
            var $this = $(this),
                data = $this.data('multipleSelect'),
                options = $.extend({}, $.fn.multipleSelect.defaults, typeof option === 'object' && option);

            if (!data) {
                data = new MultipleSelect($this, options);
                $this.data('multipleSelect', data);
            }

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw "Unknown method: " + option;
                }
                value = data[option](args[1]);
            } else {
                data.init();
            }
        });

        return value ? value : this;
    };

    $.fn.multipleSelect.defaults = {
        isopen: false,
        placeholder: '',
        selectAll: true,
        selectAllText: 'Select all',
        multiple: false,
        multipleWidth: 80,
        single: false,
        filter: false,
        width: undefined,
        maxHeight: 250,
        container: null,
        position: 'bottom', // 'bottom' or 'top'
        clearAllText: 'Clear',
        showClearAll: true,
        focusInput: true,
        showNoResults: true,

        onOpen: function () { return false; },
        onClose: function () { return false; },
        onCheckAll: function () { return false; },
        onUncheckAll: function () { return false; },
        onOptgroupClick: function () { return false; },
        onClick: function () { return false; },
        onSearch: function () { return false; }
    };
})(jQuery);