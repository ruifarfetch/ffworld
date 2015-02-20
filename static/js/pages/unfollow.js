// Unfollow plugin
FFAPI.unfollow = {
	win: typeof window != 'undefined' && window,
    doc: typeof document != 'undefined' && document,
    docElem: null,
    ajaxing: false,
    ismansory: true,
    // Threshold
    threshold: 0,
    // Unfollow container
    anchor: null,
    // Pagination loading
    loader: null,
    // Current page
    page: 0,
	// Item templates
	templates: {},
	// Social networks
	shares: {},
	// Rendered items
	items: [],
	// Current media query
	mediaquery: 'xs',
	// Column limits based on media queries
	col: {
		'xs': { 's': 1, 'cs': 1, 'l': 1 },
		'sm': { 's': 1, 'cs': 1, 'l': 2 },
		'md': { 's': 3, 'cs': 3, 'l': 3 },
		'xl': { 's': 3, 'cs': 3, 'l': 4 }
	},
	domcols: {},
	// Columns prefix
	colprefix: 'column-',
	// Next URL to get items
	url: requireMainFolder + 'js/ajax/unfollow/unfollow.json', //http://box12-portal-slot05.fftech.info/unfollow/2/2/',
	// URL to get HTML templates
	tplurl: requireMainFolder + 'js/ajax/unfollow/templates.html',

	start: function (shares) {
		// Set document element
		this.docElem = this.doc && this.doc.documentElement;

		// Set anchor element
		this.anchor = this.doc.getElementById('unfollow-container');

		// Set loader element
		this.loader = this.doc.getElementById('unfollow-loading');

		// Set columns
		for (var i = 1; i <= this.col.xl.l; i++) {
			this.domcols[i] = document.getElementById(this.colprefix + i);
		}

		// Set social networks
		for (var i = 0; i < shares.length; i++) {
			this.shares[shares[i]] = true;
		}

		// Register on scroll callback
		FFAPI.methods.on(window, 'scroll', this.onscroll.bind(this), false);

		// Register media query listeners
        FFAPI.responsive.mediaQuerieXS.addListener(this.handlemedia);
        FFAPI.responsive.mediaQuerieSM.addListener(this.handlemedia);
        FFAPI.responsive.mediaQuerieMD.addListener(this.handlemedia);
        FFAPI.responsive.goneBigQuerie.addListener(this.handlemedia);

        // Detect media query
        this.setmedia();

        // Load templates
		this.load();
	},

	setmedia: function () {
		var media = 'xs';
		if(FFAPI.responsive.mediaQuerieSM.matches) { media = 'sm'; }
		else if(FFAPI.responsive.mediaQuerieMD.matches) { media = 'md'; }
		else if(FFAPI.responsive.goneBigQuerie.matches) { media = 'xl'; }

		if(this.mediaquery !== media) {
			this.mediaquery = media;
			return true;
		}

		return false;
	},

	handlemedia: function () {
		if(FFAPI.unfollow.setmedia()) {
			FFAPI.unfollow.responsive();
		}
	},

	load: function () {
		var self = this;
		$.get(self.tplurl, function (html) {
			var templates = html.split('<!--');
			templates.splice(0,1);
			for (var i = 0; i < templates.length; i++) {
				var lines = templates[i].split('\n');
				var types = lines[0].replace(/[^A-Z0-9_:]/ig, '').split(':');
				lines.splice(0,1);
				var template = Hogan.compile(lines.join('\n'));
				for (var j = 0; j < types.length; j++) {
					self.templates[types[j]] = template;
				}
			}

			// Do first call
			self.retrieve();
		});
	},

	parse: function (items) {
		var rendered = [];
		for (var i = 0; i < items.length; i++) {
			if(this.templates[items[i]['Type']]) {
				items[i].Shares = this.shares;
				rendered.push(this.templates[items[i]['Type']].render(items[i]));
			}
		}

		return rendered;
	},

	preload: function (items) {
		var self = this;

		// Loop items to find images
		for (var i = 0; i < items.length; i++) {
			if(items[i].Data.Image || items[i].Data.VideoThumbnail) {
				var img = new Image();
    			img.src = items[i].Data.Image || items[i].Data.VideoThumbnail;
			}
		}

		// Append rendered items
		setTimeout(function () {
			FFAPI.methods.addClass(self.loader, 'hide');
			self.append(self.parse(items));
		}, 500);

	},

	retrieve: function () {
		if(this.ajaxing) return;

		this.ajaxing = true;

		FFAPI.methods.removeClass(this.loader, 'hide');
		this.ajax();
	},

	ajax: function () {
		var self = this;
		$.ajax({
			url: self.url,
			dataType: 'json',
			success: function (json) {
				if(json.Items) {
					// Increment page
					self.page++;

					// Preload images
					self.preload(json.Items);
				}

				if(json.next_url) {
					self.url = json.next_url;
				}
			}
		});
	},

	append: function (items) {
		var self = this;
		var columns = {};
		var col = this.col[this.mediaquery];
		var itemsidx = this.items.length;

		if(this.ismansory) {
			for (var i = 0; i < items.length; i++) {
				// Create element from html
				var item = this.doc.createElement('DIV');
				item.innerHTML = items[i].replace('>', 'data-index="' + this.items.length + '">');

				// Push item to its column
				this.doc.getElementById(this.colprefix + this.mansory(col.l)).appendChild(item);
				
				// Push item to global array
				this.items.push(item);
			}
		} else {
			for (var i = 0; i < items.length; i++) {
				// not an array? create it
				if(!columns[this.colprefix + col.cs]) {
					columns[this.colprefix + col.cs] = [];
				}

				// Push item to its column
				columns[this.colprefix + col.cs].push(items[i]);

				// Push item to global array
				this.items.push(items[i]);

				// Increment column start
				if(col.cs < col.l) { col.cs++; } 
				else { col.cs = 1; }
			}

			// Loop columns
			for(var id in columns) {
				this.doc.getElementById(id).insertAdjacentHTML('beforeend', columns[id].join('\n'));
			}
		}
		
		// Bind new videos
		this.bindvideos();
		// Bind new share buttons
		self.bindshares(this.anchor.querySelectorAll('.unfollow-cards.hidden .unfollow-share-button'));
		this.bindlikes(this.anchor.querySelectorAll('.unfollow-cards.hidden .unfollow-like'));

		$.Velocity(this.anchor.querySelectorAll('.unfollow-cards.hidden'), {
			translateY: [0, 50],
   			opacity: [1, 0]
		}, { easing: "ease-in-out", duration: 500, visibility: 'visible', complete: function (elements) {
			for (var i = 0; i < items.length; i++) {
				FFAPI.methods.removeClass(elements[i], 'hidden');
			}
			self.ajaxing = false;
		} });
	},

	responsive: function () {
		var columns = {};
		var col = this.col[this.mediaquery];

		if(this.ismansory) {
			for (var i = this.col.xs.s; i < this.col.xl.l; i++) {
				this.doc.getElementById(this.colprefix + i).innerHTML = '';
			}

			for (var i = 0; i < this.items.length; i++) {
				// Append item to smallest column
				this.doc.getElementById(this.colprefix + this.mansory(col.l)).appendChild(this.items[i]);
			}
		} else {
			// reset pointer to its starting point
			col.cs = col.s;

			for (var i = 0; i < this.items.length; i++) {
				// not an array? create it
				if(!columns[this.colprefix + col.cs]) {
					columns[this.colprefix + col.cs] = [];
				}

				// Push item to its column
				columns[this.colprefix + col.cs].push(this.items[i]);

				// Increment column start
				if(col.cs < col.l) { col.cs++; } 
				else { col.cs = 1; }
			}

			// Loop columns
			for(var id in columns) {
				this.doc.getElementById(id).innerHTML = columns[id].join('\n');
			}
		}
	},

	bindvideos: function () {
		var videos = this.anchor.getElementsByClassName('video-js');
		for (var i = 0; i < videos.length; i++) {
			videojs(videos[i], { controlBar: { timeDivider: false }, nativeControlsForTouch: true });
		}
	},

	bindshares: function (els) {
		for (var i = 0; i < els.length; i++) {
			FFAPI.methods.on(els[i], 'click', function (e) {
				var mainParent = $(e.target).parents('.unfollow-cards'),
					mainChild = mainParent.find('.unfollow-share');
				if (mainChild && (!$(e.target).hasClass('color-medium-grey'))) {
					$(e.target).addClass('color-medium-grey');
					mainChild.velocity("slideDown", { duration: 300 });
				} else {
					$(e.target).removeClass('color-medium-grey');
					mainChild.velocity("slideUp", { duration: 300 });
				}
			
				require(['plu_socialShare'],function(){
					mainChild.find('.socialButton').socialShare({
					    urlTransformer: function(url){
				      		return 'http://www.farfetch.com/unfollow/?pid=' + url;
				    	}
				  	});
				});
				// Prevents default action
	            var evt = e ? e:window.event;
	            if (evt.preventDefault) evt.preventDefault();
	            evt.returnValue = false;
	            return false;
			}, false);
		}
	},

	bindlikes: function (els) {
		for (var i = 0; i < els.length; i++) {
			$(els[i]).click(function() {
				var counter = $('.likes-counter', this);
				var count =  parseInt(counter.text());

				// Toggle classes and update count
				if(FFAPI.methods.hasClass(this, 'unfollow-like-on')) {
					FFAPI.methods.removeClass(this, 'unfollow-like-on');
					count--;
				} else {
					FFAPI.methods.addClass(this, 'unfollow-like-on');
					count++;
				}

				counter.text(count);

				return false;
			});
		}
	},

	onscroll: function () {
		var v = this.viewport();
		var e = this.rectangle(this.anchor);
		if(e.b <= v.b + v.th) {
			// Do call to append elements
			this.retrieve();
		}
	},

	mansory: function(collen, index) {
		var col = 1;
		var minb = null;
		if(!index) {
			for (var i = col; i <= collen; i++) {
				var e = this.rectangle(this.doc.getElementById(this.colprefix + i));
				if(!minb || (minb && e.b < minb)) {
					minb = e.b;
					col = i;
				}
			}
		} else {
			for (var i = col; i <= collen; i++) {
				var items = this.rectangle(this.doc.getElementById(this.colprefix + i)).childNodes;
				console.log(items);
			}
		}

		return col;
	},

	rectangle: function (el) {
        el = el && !el.nodeType ? el[0] : el;
        if (!el || 1 !== el.nodeType) return false;
        var rect = el.getBoundingClientRect();
        var t = rect['top'] + this.scrolly();
        var b = t + rect['height'];
        return { t: t, b: b };
    },

    viewport: function () {
        return { t: FFAPI.unfollow.vt(), b: FFAPI.unfollow.vb(), th: FFAPI.unfollow.threshold };
    },

	vb: function () {
        return (Math.max(this.docElem['clientHeight'], this.win['innerHeight'] || 0) + this.scrolly());
    },

    vt: function () {
        return this.win.pageYOffset || this.docElem.scrollTop;
    },

    scrolly: function () {
        return this.win.pageYOffset || this.docElem.scrollTop;
    },

    outerHTML: function (node) {
    	// if IE, Chrome take the internal method otherwise build one
		return node.outerHTML || (
		function (n) {
			var div = this.doc.createElement('div'), h;
			div.appendChild( n.cloneNode(true) );
			h = div.innerHTML;
			div = null;
			return h;
		})(node);
	}
};

FFAPI.unfollow.start(['Facebook', 'Twitter', 'Pinterest']);