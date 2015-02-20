/*
 *  jQuery EasyShare - v1.0.0
 *  A Plugin for social sharing
 *  Made by Samuel Torres
 */
;(function ( $, window, document, undefined ) {
		var pluginName = "socialShare",
		defaults = {
			url: window.location.href
		},
		popupwindow = function(url, title, w, h) {
		  var left = (screen.width/2)-(w/2),
		  top = (screen.height/2)-(h/2);
		  return window.open(url, title, "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width="+w+", height="+h+", top="+top+", left="+left);
		},
		shareAttributes = {
			getUrl: function(socialButton){
				var jQsocialButton = $(socialButton.element),
				buttonShareUrl = jQsocialButton.data("socialurl");
				//if we have a url on button
				if(buttonShareUrl){
					//if we define a custom url transformer
					if(socialButton.options.urlTransformer){
						buttonShareUrl = socialButton.options.urlTransformer(buttonShareUrl);
					}
					//return mounted url
					return buttonShareUrl;
				}else{
					//return fallback url
					return socialButton.options.url;
				}
			},
			getText: function(socialButton){
				var jQsocialButton = $(socialButton.element),
				buttonShareText = jQsocialButton.data("socialtext");
				//get default text if it is not defined on button
				if(buttonShareText === undefined){
					buttonShareText = socialButton.options.text;
				}
				//use the meta description text for fallback if options has that option activated
				if(buttonShareText === undefined && socialButton.options.useTextFallback && socialButton.options.useTextFallback === true){
					buttonShareText = $("head meta[property='og:description']").attr("content");
				}
				return buttonShareText;
			},
			getImage: function(socialButton){
				var jQsocialButton = $(socialButton.element),
				buttonShareImage = jQsocialButton.data("socialimage");
				//get default image if its not defined on button
				if(buttonShareImage === undefined){
					buttonShareImage = socialButton.options.image;
				}
				return buttonShareImage;
			},
			getHashTags: function(socialButton){
				var jQsocialButton = $(socialButton.element),
				buttonShareHashTags = jQsocialButton.data("socialhashtags");
				//get default hashtags if its not defined on button
				if(buttonShareHashTags === undefined){
					buttonShareHashTags = socialButton.options.hashtags;
				}
				return buttonShareHashTags;
			},
			getVia: function(socialButton){
				var jQsocialButton = $(socialButton.element),
				buttonShareVia = jQsocialButton.data("socialvia");
				//get default via if its not defined on button
				if(buttonShareVia === undefined){
					buttonShareVia = socialButton.options.via;
				}

				return buttonShareVia;
			},
			getAttributes: function(socialButton){
				//gather all information about a share
				var attributes = {
					url: shareAttributes.getUrl(socialButton),
					text: shareAttributes.getText(socialButton),
					image: shareAttributes.getImage(socialButton),
					hashtags: shareAttributes.getHashTags(socialButton),
					via: shareAttributes.getVia(socialButton)
				};
				return attributes;
			}
		},
		shareUrl = {
			getFacebookUrl: function(socialButton) {
				var attributes = shareAttributes.getAttributes(socialButton),
				networkUrl = "http://www.facebook.com/sharer.php?u=";
				return networkUrl + attributes.url;
			},
			getTwitterUrl: function(socialButton){
				var attributes = shareAttributes.getAttributes(socialButton),
				networkUrl = "http://twitter.com/intent/tweet?",
				paramsJson = {},
				params = "";

				if(attributes.url){
					paramsJson.url = attributes.url;
				}
				if(attributes.text){
					paramsJson.text = attributes.text;
				}
				if(attributes.hashtags)
				{
					paramsJson.hashtags = attributes.hashtags;
				}
				if(attributes.via)
				{
					paramsJson.via = attributes.via;
				}
				//create query string of the share
				params = $.param(paramsJson);
				return networkUrl + params;
			},
			getGooglePlusUrl: function(socialButton){
				var attributes = shareAttributes.getAttributes(socialButton),
				networkUrl = "https://plus.google.com/share?url=";
				return networkUrl + attributes.url;
			},
			getPinterestUrl: function(socialButton){
				var attributes = shareAttributes.getAttributes(socialButton),
				networkUrl = "http://pinterest.com/pin/create/button/?",
				paramsJson = {},
				params = "";

				if(attributes.url){
					paramsJson.url = attributes.url;
				}
				if(attributes.text){
					paramsJson.description = attributes.text;
				}
				if(attributes.image){
					paramsJson.media = attributes.image;
				}
				//create query string of the share
				params = $.param(paramsJson);
				return networkUrl + params;
			},
			getWeiboUrl: function(socialButton){
				var attributes = shareAttributes.getAttributes(socialButton),
				networkUrl = "http://service.weibo.com/share/share.php?",
				paramsJson = {},
				params = "";

				if(attributes.url){
					paramsJson.url = attributes.url;
				}
				if(attributes.text){
					paramsJson.title = attributes.text;
				}
				if(attributes.image){
					paramsJson.pic = attributes.image;
				}
				//create query string of the share
				params = $.param(paramsJson);
				return networkUrl + params;
			}
		};
		// Constructor
		function SocialShare (element, options) {
			this.element = element;
			this.options = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}
		SocialShare.prototype = {

			init: function () {
				this.doBinds();
			},

			doBinds: function(){
				var url = this.createUrl();

				$(this.element).on("click",function(){
					popupwindow(url,"share",520, 350);
				});
			},

			createUrl: function(){
				var jQthis = $(this.element),
				//Get the social network property of the element
				socialNetwork = jQthis.data("socialnw"),
				//Initialize url
				url = "";
				//lets get the url of the share window
				switch(socialNetwork){
					case "fb":
						url = shareUrl.getFacebookUrl(this);
						break;
					case "tw":
						url = shareUrl.getTwitterUrl(this);
						break;
					case "gp":
						url = shareUrl.getGooglePlusUrl(this);
						break;
					case "pt":
						url = shareUrl.getPinterestUrl(this);
						break;
					case "wb":
						url = shareUrl.getWeiboUrl(this);
						break;
					default:
						break;
				}
				return url;
			}
		};

		$.fn.socialShare = function ( options ) {
			return this.each(function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" + pluginName, new SocialShare( this, options ) );
				}
			});
		};

	})( jQuery, window, document );
