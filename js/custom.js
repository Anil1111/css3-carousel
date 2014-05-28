
jQuery(document).ready(function(){
	Indigio.Css3Carousel.init({
		'rotationCallback' : function(){
			$('.carousel-item .text').hide();
			$('.carousel-item.active .text').fadeIn(1500);
		}
	});
	$('.carousel-item .text').hide();
	$('.carousel-item.active .text').fadeIn(1500);
	
	var slider = $('.perspective-slider');
	slider.on('change', function() {
		Indigio.css3Carousel.createCSS3(".carousel", 'perspective-origin-y', this.value+'%');
		console.log("Slider Value:" + this.value + "%");
	});
});
