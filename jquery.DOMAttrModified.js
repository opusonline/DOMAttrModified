/*!
 * jQuery DOMAttrModified Event trigger plugin
 *
 * Copyright (c) 2011 Stefan Benicke
 *
 * Dual licensed under the MIT and GPL licenses
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($) {
	// TODO: prevent original DOMAttrModified event when fired
	
	var _event = $.Event('DOMAttrModified');
	
	var _type = {
		MODIFICATION: 1,
		ADDITION: 2,
		REMOVAL: 3
	};
	
	var _trigger = function($element, params) {
		if (params.attrChange === undefined ) {
			params.attrChange =
				params.newValue === null || params.newValue === undefined   ? _type.REMOVAL :
				params.prevValue === null || params.prevValue === undefined ? _type.ADDITION :
																			_type.MODIFICATION;
		}
		$.extend(_event, params);
		$element.trigger(_event);
	};
	
	var _attr = $.attr;
	
	$.attr = function(element, name, new_value) {
		var prev_value = _attr(element, name);
		if (new_value === undefined) {
			return prev_value;
		}
		if (String(new_value) !== String(prev_value)) {
			_trigger($(element), {attrName: name, prevValue: prev_value, newValue: new_value});
			return _attr(element, name, new_value);
		}
	};
	
	var _val = $.fn.val;
	
	$.fn.val = function(new_value) {
		if (new_value === undefined) {
			return _val.apply(this);
		}
		return this.each(function() {
			var $element = $(this);
			var prev_value = _val.apply($element);
			if (new_value !== prev_value) {
				_trigger($element, {prevValue: prev_value, newValue: new_value});
				_val.call($element, new_value);
			}
		});
	};
	
	var _html = $.fn.html;
	
	$.fn.html = function(new_value) {
		if (new_value === undefined) {
			return _html.apply(this);
		}
		return this.each(function() {
			var $element = $(this);
			_trigger($element, {newValue: new_value, attrChange: _type.MODIFICATION});
			_html.call($element, new_value);
		});
	};
	
})(jQuery);