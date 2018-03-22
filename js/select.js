(function($, undefined){
    var itemSelector = 'li',
        JsSelect = function(el) {
            var $this = $(el);
            $this.on('click', itemSelector, this.select)
                 .on('click', this.open);
            $(document).on('click', this.close);
        };

    JsSelect.prototype.select = function(e) {
        var $this = $(this),
            val = $this.data('id'),
            $parent = $this.parents('.js-select'),
            placeholder = $parent.data('placeholder'),
            $display = $parent.find('.selected'),
            $selectElem = $('select', $parent);
        if ($this.data('id') == null) {
            return false;
        }
        $selectElem.val(val).trigger('change');
        $this.siblings().removeClass('active');
        $this.addClass('active');
        if (val === '' && placeholder) {
            $display.html(placeholder);
        } else {
            $display.html($this.html());
        }
    };

    JsSelect.prototype.open = function(e) {
        var $this = $(this);
        if ( $this.hasClass('active') ) {
            $this.removeClass('active text-icon-arrow-up')
                 .addClass('text-icon-arrow-down');

        } else {
            $('.js-select').removeClass('active text-icon-arrow-up')
                    	   .addClass('text-icon-arrow-down');
            $this.addClass('active text-icon-arrow-up')
                 .removeClass('text-icon-arrow-down');
        }
    };

    JsSelect.prototype.close = function(e) {
        if ( $(e.target).closest(".js-select").length ) return;
        e.stopPropagation();
        $('.js-select').removeClass('active text-icon-arrow-up')
            		   .addClass('text-icon-arrow-down');

    };

    $.fn.jsSelect = function(options) {

        return $(this).each(function(i, el){
            var $this = $(el);
            if ($this.hasClass('js-select-enabled')) return el;
            $this.addClass('js-select-enabled');

            var $selectElem = $('select', $this),
                $selectedDisplay,
                $dropdownArrow = $('<span class="icon select-arrow select-arrow-down"></span>'),
                $item_list = $('<div class="select-items-wrap"><ul class="select-items"/></div>'),
                list_html = '',
                selected = $selectElem.val(),
                placeholder = $this.data('placeholder');

            $this.prepend($item_list).prepend($dropdownArrow);

            $selectedDisplay = $('<span class="selected js-selected"></span>');
            $this.prepend($selectedDisplay);

            $selectElem.addClass('dn');
            if ($selectElem.has('optgroup').size() > 0) {
                $('optgroup', $selectElem).each(function(i, el){
                    var $this = $(el),
                        $items = $this.find('option');

                    list_html += '<li class="opt-label">' + $this.attr('label') + '</li>';
                    $items.each(function(i, el){
                        var $this = $(el);
                        list_html += '<li data-id="' + $this.attr('value') + '">' + $this.text() + '</li>';
                    });
                });
            } else {
                $selectElem.find('option').each(function(i, el){
                    var $this = $(el);
                    list_html += '<li data-id="' + $this.attr('value') + '">' + $this.text() + '</li>';
                });
            }
            $item_list.find('ul').html(list_html);
            if (selected === '' && placeholder) {
                $selectedDisplay.html(placeholder);
            } else {
                $selectedDisplay.html($this.find('[data-id="' + selected + '"]').html());
            }
            $this.jsSelect = new JsSelect(this, el);
            return $this
        });
    };
    $.fn.jsSelect.Constructor = JsSelect
})(jQuery);