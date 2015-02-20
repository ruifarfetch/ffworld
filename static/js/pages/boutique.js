//BOUTIQUE REVIEWS 1.0

	FFAPI.variables.boutique = FFAPI.variables.boutique || {};
	FFAPI.methods.boutique = FFAPI.methods.boutique || {};

	$(document).ready(function() {
		var icon = '<span class="icon-search glyphs boutique-icon-search"></span>';
		$('.chosen-search').append(icon);
		///Read more methods and variables
		
		FFAPI.variables.boutique.texts = document.getElementsByClassName('readmore-text');
		FFAPI.variables.boutique.texts.readmore = FFAPI.variables.boutique.texts[0].getAttribute("data-read-more");
		FFAPI.variables.boutique.texts.readless = FFAPI.variables.boutique.texts[0].getAttribute("data-read-less");
		FFAPI.variables.boutique.review = document.getElementsByClassName('review');



		FFAPI.methods.boutique.readmore = function(ele){
			var link = document.createElement("a");        // Create a <button> element
			var t = document.createTextNode(FFAPI.variables.boutique.texts.readmore);       // Create a text node
			link.appendChild(t);
			link.className += ' ' + 'float-right align-right underline';
			ele.parentNode.appendChild(link); 

			if (!link.addEventListener) {
            	link.attachEvent("onclick", FFAPI.methods.boutique.readMoreClick);
	        } else {
	            link.addEventListener("click", FFAPI.methods.boutique.readMoreClick, false);
	        }
		}

		function previousElementSibling(el) {
		  do { el = el.previousSibling; } while ( el && el.nodeType !== 1 );
		  return el;
		}


		FFAPI.methods.boutique.readMoreClick = function(){
			var aux = this.previousElementSibling || previousElementSibling(this);
			FFAPI.methods.removeClass(aux,'review-content-more');
			this.innerHTML = FFAPI.variables.boutique.texts.readless;

			if (!this.removeEventListener) {
            	this.detachEvent("onclick", FFAPI.methods.boutique.readMoreClick);
            	this.attachEvent("onclick", FFAPI.methods.boutique.readLessClick);
	        } else {
	            this.removeEventListener("click", FFAPI.methods.boutique.readMoreClick, false);
	            this.addEventListener("click", FFAPI.methods.boutique.readLessClick, false);
	        }
		}

		FFAPI.methods.boutique.readLessClick = function(){
			var aux = this.previousElementSibling || previousElementSibling(this);
			FFAPI.methods.addClass(aux,'review-content-more');
			this.innerHTML = FFAPI.variables.boutique.texts.readmore;

			if (!this.removeEventListener) {
            	this.detachEvent("onclick", FFAPI.methods.boutique.readLessClick);
            	this.attachEvent("onclick", FFAPI.methods.boutique.readMoreClick);
	        } else {
	            this.removeEventListener("click", FFAPI.methods.boutique.readLessClick, false);
	            this.addEventListener("click", FFAPI.methods.boutique.readMoreClick, false);
	        }
		}

		for(var i = 0, aux = 0, count = 0; i < FFAPI.variables.boutique.review.length; i++){
			aux = FFAPI.methods.getElementHeight(FFAPI.variables.boutique.review[i]);
			if(aux>22){
				FFAPI.variables.boutique.review[i].className +=' '+'review-content-more';
				FFAPI.methods.boutique.readmore(FFAPI.variables.boutique.review[i]);
				count++;
			}
		}
	});







