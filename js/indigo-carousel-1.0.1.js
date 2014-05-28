// ensure namespace is set
var Indigio = window.Indigio || {};

// create my plugin
Indigio.Css3Carousel = {

	currentItemIndex: 0,
	degFactor : 0,
	spinnerDegrees : 0,
	canvasWidth : 0,
	carousel : null,
	spinner: null,
	items : null,
	itemsLength : 0,
	pager: null,
	activeItem: null,
	options: {
		'carouselClass' : ".carousel",
		'spinnerClass' : ".spin-container",
		'itemClass' : ".carousel-item",
		'pagerClass' : ".carousel-pager",
		'radius' : 0,
		'createPager': true,
		'pagerIndexName': "page",
		'perspectiveOriginX' : 50,
		'perspectiveOriginY' : 50,
		'rotationCallback': null
	},

	init: function (options) {
		var that = this;
		var transformDegrees = 0;
		
		this.options = $.extend(true, {}, this.options, options);

		this.carousel = $(this.options.carouselClass);
		this.spinner = $(this.options.spinnerClass);
		this.items = $(this.options.carouselClass+' '+this.options.itemClass);
		this.items.css('position','absolute');
		this.itemsLength = this.items.length;
		
		// Set first element as active
		this.activeItem = this.items.first().addClass('active');
		
		this.canvasWidth = this.carousel.width();
		this.degFactor = 360 / this.itemsLength;

		if(this.options.radius < 1){ this.options.radius = this.items.outerWidth();	}
		
		this.createCSS3(this.items, 'transform-style', 'preserve-3d');
		
		this.createCSS3(this.carousel, 'transform-style', 'preserve-3d');
		this.createCSS3(this.carousel, 'perspective', this.canvasWidth*2+'px');
		this.createCSS3(this.carousel, 'perspective-origin', this.options.perspectiveOriginX + '%' + this.options.perspectiveOriginY + '%');
		
		this.createCSS3(this.spinner, 'transform-style', 'preserve-3d');
		this.createCSS3(this.spinner, 'transform-origin', '50% 50% -'+this.options.radius+'px');
		
		// this.createCSS3(carousel, 'perspective-origin', '43% -15%');
		$.each(this.items, function(i){
			that.createCSS3(this, 'transform', 'rotateY('+transformDegrees+'deg)');
			that.createCSS3(this, 'transform-origin', '50% 50% -'+that.options.radius+'px'); 
			// Center Image
			$(this).css('left', (that.canvasWidth/2 - $(this).outerWidth()/2) + 'px');
			transformDegrees += that.degFactor;
		});
		
		if(this.options.createPager){ 
			this.pager = $(this.options.pagerClass);
			this.displayPager();
			this.setupPager();
		}
		this.triggers();
	},
	
	triggers: function(){
		var that = this;
		$('.carousel-trigger-left').on('click', function(){
			that.rotate(-1);
		});
		$('.carousel-trigger-right').on('click', function(){
			that.rotate(1);
		});
	},
	
	createCSS3: function(target, property, value){
		var array = new Array(
			'-webkit-'+ property,
			'-moz-'+ property,
			'-ms-'+property+'-webkit-'+ property,
			'-o-'+property,
			property
		);
		
		$.each(array, function(index, content){ 
			$(target).css(content, value);
		});
	},
	
	displayPager: function(){
		var appendClass = this.options.pagerIndexName;
		var appendStr = "";
		
		for(i=0; i < this.itemsLength; i++){
			appendStr += "<li data-item-nr='"+i+"' class='"+appendClass+" "+appendClass+"-"+(i+1)+"'><a href='#'>"+(i+1)+"</a></li>"
		}
		this.pager.append(appendStr);
	},
	
	rotate: function(steps){
		var degreesToTurn = 0;
		this.currentItemIndex += steps;
		
		// left
		if(steps < 0){
			steps = Math.abs(steps); // reverts steps
			if(steps == 1){
				if(this.activeItem.is(':first-child')){
					this.activeItem.removeClass('active');
					$(this.options.itemClass).last().addClass('active');
				}else{
					this.activeItem.removeClass('active').prev().addClass('active');
				}
				
			}else{
				this.activeItem.removeClass('active');
				$(this.items).eq(this.currentItemIndex).addClass('active');
			}
		// right	
		}else if(steps > 0){
			steps = -Math.abs(steps);  // reverts steps		
			if(steps == -1){
				if(this.activeItem.is(':last-child')){
					this.activeItem.removeClass('active');
					$(this.options.itemClass).first().addClass('active');
				}else{
					this.activeItem.removeClass('active').next().addClass('active');
				}
			}else{
				this.activeItem.removeClass('active');
				$(this.items).eq(this.currentItemIndex).addClass('active');
			}
			
		}
		
		degreesToTurn = steps * this.degFactor;
		// + and - don't matter
		this.spinnerDegrees += degreesToTurn;
	
		this.activeItem =  $(this.options.itemClass+'.active');

		this.createCSS3(this.spinner, 'transform', 'rotateY('+this.spinnerDegrees+'deg)');
		this.currentItemIndex = this.activeItem.index();
		if(this.options.createPager){
			$("."+this.options.pagerIndexName).removeClass('active').eq(this.currentItemIndex).addClass('active');
		}
		
		if(this.options.rotationCallback != null){
			this.options.rotationCallback();
		}
	},
	
	setupPager: function(){
		var that = this;
		var pagerIndex = 0;
		var steps = 0;
		
		$("."+this.options.pagerIndexName).first().addClass('active');
		
		$("."+this.options.pagerIndexName).on('click', function(e){
			e.preventDefault();
			
			pagerIndex = $(this).index();	
			steps =  pagerIndex - that.currentItemIndex;	
			that.rotate(steps);
		});
	}
	
}