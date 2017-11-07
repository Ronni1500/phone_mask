$.fn.selectRange = function (start, end) {
		    if (typeof end === 'undefined') {
		        end = start;
		    }
		    return this.each(function () {
		        if ('selectionStart' in this) {
		            this.selectionStart = start;
		            this.selectionEnd = end;
		        } else if (this.setSelectionRange) {
		            this.setSelectionRange(start, end);
		        } else if (this.createTextRange) {
		            var range = this.createTextRange();
		            range.collapse(true);
		            range.moveEnd('character', end);
		            range.moveStart('character', start);
		            range.select();
		        }
		    });
		};
		(function($) {
		    $.fn.getCursorPosition = function() {
		        var input = this.get(0);
		        if (!input) return; 
		        if ('selectionStart' in input) {
		            return input.selectionStart;
		        } else if (document.selection) {
		            // IE
		            input.focus();
		            var sel = document.selection.createRange();
		            var selLen = document.selection.createRange().text.length;
		            sel.moveStart('character', -input.value.length);
		            return sel.text.length - selLen;
		        }
		    }
		})(jQuery);

		(function($) {
		    $.fn.mask = function() {
		    var input = this;
			var cursor=0;
			var deleteVal=0;
			var value;
			var valInput='';
			var newValue='';
			input.on('click',function(){
				$(this).focus();
				if(!/\+7\(\d\d\d\)\-\d\d\d\-\d\d\-\d\d/.test($(this).val()))
				$(this).val("+7(___)-___-__-__");
				if(cursor == 0)
					$(this).selectRange(3);
				valInput = input.val().split("");
				value = input.val();
				cursor = input.getCursorPosition();
				deleteVal = valInput[cursor-1];
			});
			input.on('keydown',function(e){
				if(e.keyCode == 8){
					 valInput = input.val().split("");
					writeCursor = input.getCursorPosition();
					deleteVal = valInput[writeCursor-1];
					if((valInput[writeCursor-1] == '7' && valInput[writeCursor-2] == '+' && writeCursor ==2)|| (valInput[writeCursor-1] == '+' && valInput[writeCursor] == '7'&& writeCursor ==1)){
						deleteVal = '+7';
					}
					return false;
				}
				if(e.keyCode == 46){
					return false;
				}
			});
			input.on('keyup',function(e){
				if(e.keyCode == 8){
					if( deleteVal =='('  || deleteVal == '+7' ){
						$(this).selectRange(writeCursor);
						return false;
					}
					else if(deleteVal == '_'|| deleteVal == '-'|| deleteVal == ')'){
						$(this).selectRange(writeCursor-1);
						return false;
					}

					else{
						valInput[writeCursor-1]='_';
						newValue = valInput.join('');
						input.val(newValue);
						$(this).selectRange(writeCursor-1);
					}
					
				}

			});
			input.on('input',function(e){
				var writeCursor = input.getCursorPosition();
				var valInput = input.val().split("");
				var re = new RegExp("^[\+0-9+\(\)_\-]+$","g");
				if(!re.test(input.val())){ 
					$(this).val(value);
					$(this).selectRange(cursor);
				}
					else{
						if(e.keyCode != 8 || e.keyCode != 46){
						valInput[writeCursor]='';
						var newValue = valInput.join('');
						input.val(newValue);
						if(writeCursor == 6)
							input.selectRange(8);
						else if(writeCursor == 11)
							input.selectRange(12);
						else if(writeCursor == 14)
							input.selectRange(15);
						else if(writeCursor >= 18){
							input.val(value);
							input.selectRange(18);
						}
						else $(this).selectRange(writeCursor);
					value = $(this).val();
					cursor = writeCursor;
					}}

			});
			input.on('blur',function(){
				if(!/\+[7]\(\d{3}\)\-\d{3}\-\d{2}\-\d{2}/.test($(this).val()))
				$(this).val("");
			});
		    }
		})(jQuery);