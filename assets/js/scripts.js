/*****************************************************************************
Percent Calculator
*****************************************************************************/
var percentCalculator = (function($) {
	'use strict';

	var self = {},
		$el = $('.calculator-percent'),
		$form = $el.find('form'),
		$label = $el.find('.form-label'),
		$indicator = $el.find('.indicator'),
		$input = $el.find('input'),
		$part = $el.find('#part'),
		$whole = $el.find('#whole'),
		$pcnt = $el.find('#percent'),
		pattern = /^\d+(\.\d{2})?$/;


	self.init = function() {

		$label.on('click', function() {
			var $this = $(this),
				target = $this.attr('data-target');

			// Reset validation
			$form.parsley('reset');

			// Enable other input
			$form.find('input[disabled="disabled"]')
				.removeAttr('disabled')
				.removeClass('active');

			// Make target input read-only
			$(target)
				.attr('disabled','disabled')
				.addClass('active').val('');

			// Focus on first non-read-only input
			$input.each(function(i) {
				if ($(this).attr('disabled') === undefined ) {
					$(this).focus();
					return false;
				}
			})

			// Activate Nav
			if (!$this.hasClass('active')) {
				$label.removeClass('active');
				$this.addClass('active');

				// Show "Solving for this"
				$indicator.appendTo($this);
			}

			// Remove '%' from value
			if (target !== '#percent') {
				var pcnt = $pcnt.val().replace('%','');
				$pcnt.val(pcnt);

				return true;
			}
		});

		// Clear active input value
		$input.on('keyup', function() {
			$('input.active').val('');
		});

		// Clear placeholder
		$input.on('change', function() {
			$input.removeAttr('placeholder');
		});

		// Start timer
		$input.on('focusout', function() {

			var typingTimer,
				doneTypingInterval = 500; //time in ms, 500 = 5s

			// Solve when require values are present
			$input.keyup(function(){
				clearTimeout(typingTimer);
				if ($input.not('.active').val()) {
					typingTimer = setTimeout(solve, doneTypingInterval);
				}
			});

		});

		// Initiate Parsley JS
		$('form').parsley({
			trigger: 'focusin focusout keyup change',
			errorClass: 'has-error',
			errors: {
				classHandler: function(el) {
					return $(el).closest('.form-group');
				},
				errorsWrapper: '<ul class="help-block"></ul>',
				errorElem: '<li></li>'
			},
		});

	}

	function solve() {
		var part = $part.val(),
			whole = $whole.val(),
			pcnt = $pcnt.val(),
			solveFor = $('input.active').attr('id');

		switch (solveFor) {
			case 'part':
				self.solvePart(whole, pcnt);
				break;
			case 'whole':
				self.solveWhole(part, pcnt);
				break;
			case 'percent':
				self.solvePcnt(part, whole);
				break;
		}
	}

	self.solvePart = function(whole, pcnt) {
		var part = (pcnt/100) * whole;

		if (!part || part === Infinity) {
			return false;
		}

		if (!pattern.test(part)) {
			part = part.toFixed(2);
		}

		setValue($part, part);
		return part;
	}

	self.solveWhole = function(part, pcnt) {
		var whole = part / (pcnt/100);

		if (!whole || whole === Infinity) {
			return false;
		}

		if (!pattern.test(whole)) {
			whole = whole.toFixed(2);
		}

		setValue($whole, whole);
		return whole;
	}

	self.solvePcnt = function(part, whole) {
		var pcnt = (part/whole) * 100;
		
		if (!pcnt || pcnt === Infinity) {
			return false;
		}

		if (!pattern.test(pcnt)) {
			pcnt = pcnt.toFixed(2);
		}

		setValue($pcnt, pcnt + '%');
		return pcnt;
	}

	function setValue($field, value) {
		return $field.val(value);
	}
		
	return self;
})(jQuery);

