// @codekit-prepend "jq.kinetic.min.js"
// @codekit-prepend "jq.parallax-scroll.js"



$(document).ready(function() {

	/* ========================================================================= */

	// !– Foreign functions

	/* ========================================================================= */


	//Randomize list of elements (http://stackoverflow.com/questions/1533910)
	(function($) {

	$.fn.randomize = function(childElem) {
		return this.each(function() {
			var $this = $(this);
			var elems = $this.children(childElem);
			elems.sort(function() { return (Math.round(Math.random())-0.5); });
			$this.detach(childElem);
			for(var i=0; i < elems.length; i++)
				$this.append(elems[i]);
			});
	}
	})(jQuery);




	/* ========================================================================= */

	// !– Cosmetics

	/* ========================================================================= */

	$('html').removeClass('no-js');

	var is_touch_device = 'ontouchstart' in document.documentElement;
	if (is_touch_device) {$('body').addClass('touchdevice');}

	//In case randomizing the order of albums is needed
	// $(".projects").randomize("li");
	$projects_item_container = $('<div class="projects_item_container" />');
	$('.projects_item').wrap($projects_item_container);
	$('.projects_item_container').prepend('<span class="back"><span>back</span></span>').hide();
	$('.projects_item').append('<span class="back_end"><span>back</span></span>');
	if(!$('body.touchdevice').length) {
		$('.projects_item_container').kinetic({triggerHardware:true});
	}

	


	/* ============================================================================
		
	Open about window
		
	============================================================================ */

	function showInfoWindow() {
		$('#about').show();
		$('.page-header').css('position','fixed');
		$('.menu li').hide();
		$('.menu #close').show();
		// $('#about .text').hide();
		// $('#about .text[lang="english"]').show();
		// $('#about .nav a').removeClass('current');
		// $('#about .nav a[data-lang=russian]').addClass('current');
	}

	function hideInfoWindow() {
		$('.page-header').css('position','absolute');
		$("#about").hide('fast');
		$('.menu li').show();
		$('.menu #close').hide();
	}


	$('#about').hide();
	$('#about').wrapInner('<div class="inner"></div>');
	$('.menu ul').append('<li id="close"><a href="javascript:;">close</a></li>');
	$('.menu #close').hide();
	// $('#about header').prepend('<div class="nav"><a data-lang="russian" href="javascript:;">RU</a><a data-lang="english" href="javascript:;">EN</a></div>');
	$('a[href="#about"]').on('click', function(event) {
		event.preventDefault();
		showInfoWindow();

	});

	$('#about .nav').on('click', 'a', function() {
		if ($(this).hasClass('current') == false ) {
			$('#about .nav a').removeClass('current');
			$(this).addClass('current');
			var clicked_lang = $(this).data('lang');
			$('#about .text').hide();
			$('#about .text[lang='+clicked_lang+']').show();
		}
	});
	$('.menu').on('click', '#close', function() {
		if ( $("#about").is(":visible") ) {
			hideInfoWindow();
		}
	});

	

	/* ============================================================================
		
	Show project gallery
		
	============================================================================ */

	


	// !Append HTML

	$('.projects>li').each(function() {
		var margin_left = Math.floor(Math.random() * (1 - 200) + 200)
		var margin_top = 60 + Math.floor(Math.random() * (10 - 70) + 70)
		$(this).css('margin-left',margin_left).css('margin-top',margin_top);
	});



	// !Set vars



	// !Functions

	function recalculateGalDimensions($what) {
		var totalWidth = 0;
		$what.find('img, video').each(function() {
			totalWidth += parseInt($(this).width(), 10);
		});
		$what.css('width',(totalWidth+4)+'px').css('height',$(window).height());
	}


	// !Launch onload functions


	

	// !Events

	//Not panoramas
	$('.projects').on('click', ':not(.panorama) .projects_cover', function() {
		var $pic = $(this).next('.projects_item_container');
		var $pi = $pic.find('.projects_item');
		$pic.show();
		recalculateGalDimensions($pi);
		// carouselInit($pi);
		$(this).addClass('opened');
		$pic.scrollLeft(0).scrollTop(0);
	});
	//Panoramas
	$('.projects').on('click', '.panorama .projects_cover', function() {
		var $pic = $(this).next('.projects_item_container');
		var $pi = $pic.find('.projects_item');
		$pic.show();
		var imgWidth = $pic.find('img').first().width();
		var windowWidth = $(window).width();
		$pic.scrollLeft(0);
		// $pic.scroll();
		// $pic.on('click', function(e) {
		// 	e.preventDefault();
		// 	$(this).stop();
		// });
		$(this).addClass('opened');
	});

	$(document).on('keyup', function(event) {
		if (event.which == 27) {
			$('.projects_item_container').hide();
			$('.projects_cover.opened').removeClass('opened');
			if ( $("#about").is(":visible") ) {
				hideInfoWindow();
			}
		}
	});

	$('.back, .back_end').on('click', function() {
		$('.projects_item_container').hide();
		$('.projects_cover.opened').removeClass('opened');
	});

	var resizeTimer;

	$(window).on('resize', function() {

		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			recalculateGalDimensions($('.projects:not(.panorama) .projects_cover.opened').next('.projects_item_container').find('.projects_item'));
		}, 250);
	});


	var $videos = $('#gallery video');
	$videos.on('canplaythrough', function() {
	    this.play();
		if (this.paused) {
			$(this).parents('li').addClass('paused');
		}
	});
	$videos.on('pause', function() {
		$(this).closest('li').addClass('paused');
	});
	$videos.on('play', function() {
		$(this).closest('li').removeClass('paused');
	});
	$('#gallery').on('click', '.paused', function() {
		console.log('play!');
		$(this).find('video').get(0).play();
	});
	$('#gallery .projects_item').on('click', 'li:not(.paused):has(video)', function() {
		console.log('pause!');
		$(this).find('video').get(0).pause();
	});


});