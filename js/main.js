(function($, undefined) {
	
	$.fn.reveal = function(){
		var args = Array.prototype.slice.call(arguments);
		return this.each(function(){
			var img = $(this),
				src = img.attr("data-original");
			src && img.removeAttr('data-original').attr("src", src).load(function() {
				var _load = img.attr('data-load');
				if(_load && _load != '' && window[_load] && typeof window[_load] == 'function') window[_load].apply(img);
				img[args[0]||"show"].apply(img, args.splice(1));
			}).each(function() {
				if(this.complete) $(this).load();
			});
		});
	}

	$.fn.loadImages = function() {
		var args = Array.prototype.slice.call(arguments);
		var total = $(this).filter('img:not([loaded])').length;
		var loaded = 0;
		if(total > 0) {
			this.each(function(){
				var img = $(this),
					src = img.attr("data-original");
				
				src && img.removeAttr('data-original').attr("src", src).load(function() {
					var _load = img.attr('data-load');
					if(_load && _load != '' && window[_load] && typeof window[_load] == 'function') window[_load].apply(img);
					img[args[1]||"show"].apply(img, args.splice(2));
					img.attr('loaded', '1');

					loaded++;
					if(total == loaded && typeof args[0] == 'function') args[0]();
				}).each(function() {
					if(this.complete) $(this).load();
				});
			});
		}
	}

	$(document).on('contextmenu', 'img, .img-wrap, .main-header', function(e) {
    return false;
	});

	$(document).ready(function() {

		var tmpImg = new Image();
		tmpImg.src = '../img/slider/1.jpg';
		tmpImg.onload = function() {
			$('.js-header-slider :first-child').show().fadeOut(0).fadeIn(1200, function() { $(this).css('opactiy', 1); });
			$(".js-header-slider").addClass('ready');
			setTimeout(function() {
				$('.js-header-slider').css('background-color', '#000');
			}, 1500);
			$('.js-header-slider :gt(0)').hide();
			var header_slider = setInterval(function () {
				$('.js-header-slider :first-child').fadeOut(800).next().fadeIn(800).end().appendTo('.js-header-slider');
			}, 5800);

			$('#header-slider-prev').click(function () {
				clearInterval(header_slider);
				$('.js-header-slider :first-child').fadeOut(800);
				$('.js-header-slider :last-child').fadeIn(800).prependTo('.js-header-slider'); 
			});
			$('#header-slider-next').click(function () {
				clearInterval(header_slider);
				$('.js-header-slider :first-child').fadeOut(800).next().fadeIn(800).end().appendTo('.js-header-slider');
			});
		}

			// загрузка картинок только при скролле на них
			/*setInterval(function() {

			});*/

			// отслеживает время Ajax-запроса, если больше 1 секунды, то показывает индикатор загрузки.
			setInterval(function() {
				if(ajaxStartTime && (new Date()).getTime() - ajaxStartTime > 600) {
					__showPreloader();
				}
			}, 50);

			
			mainMenu_Fix();
			$(document).on('change', '.js-file', function() {
				$(this).parent().find('.js-text').val($(this).val());
			});
			customFile();
			
			sliderNav_Init();
			dropdown_Init();
			slideDown_Init('quality');
			slideDown_Init('materials');

			portfolioSlider_Init();
			housesSlider_Init();
			

			// ajax-формы
			$(document).on('click', '.js-create-project, .js-to-date, .js-request-form', function(e) {
				e.preventDefault();
				var $t = $(e.currentTarget);
				var target_cls = $t.attr('data-target');
				if(target_cls && target_cls != '') {
					var $trg = $('.'+target_cls);
					if($trg.length) {
						if($trg.attr('loaded') != 1) {
							var furl = $t.attr('data-url');
							if(furl && furl != '') {
								var url = 'ajax/form_'+furl+'.html?2';
								_ajaxLoader(url, function(content) {
									$trg.append(content).attr('loaded', 1);
									setTimeout(function() {
										customFile();
										dropdown_Init();
										createOverlay($trg);
									}, 500);
								});
							}
						} else {
							createOverlay($trg);
						}
					}
				}
			});
			/*overlay_Init($('.js-create-project'), $('.js-project-tab'));
			overlay_Init($('.js-to-date'), $('.js-to-date-tab'));
			overlay_Init($('.js-request-form'), $('.js-request-tab'));*/

			var slider_props = {
			  loop: true,
			  autoWidth: false,
			  mouseDrag: false,
			  nav: true,
			  items: 1
			};

			$('#current-works-slider').owlCarousel(slider_props);
			$('#ended-works-slider').owlCarousel(slider_props);
			$('#all-works-slider').owlCarousel(slider_props);

			$('#ended-works-custom-prev').click(function() {
				$("#ended-works-slider").data('owlCarousel').prev();
			});
			$('#ended-works-custom-next').click(function() {
				$("#ended-works-slider").data('owlCarousel').next();
			});
			$('#current-works-custom-prev').click(function() {
				$("#current-works-slider").data('owlCarousel').prev();
			});
			$('#current-works-custom-next').click(function() {
				$("#current-works-slider").data('owlCarousel').next();
			});
			
			$('.work-slider-nav-btn').click(function() {
		  	$('.all-works').removeClass('active');
			  if (!$(this).hasClass('active')) {
			    $('.work-slider-nav-btn').removeClass('active');
			    $(this).addClass('active');
			    $('.works-slider-box').removeClass('active');
			    $('.'+this.dataset.slider).addClass('active');
			  }
			});
			$('#all-works-open').click(function() {
				$('.all-works').addClass('active');
			});
			$('.all-works').on('click', '#close-all-works, #all-works-slider-overlay', function() {
				$('.all-works').removeClass('active');
			});
			$('.all-works').on('click', 'figure', function () {
				var ended_works = $('#ended-works-slider');
				$('.all-works').removeClass('active');
				// ended_works.to(parseInt(this.dataset.id));
				ended_works.trigger('to.owl.carousel', [parseInt(this.dataset.id)-1]);
			});
			$(document).on('click', '.fotogallery-request-form, .all-works-request-form', function(e) {
			  e.preventDefault();
			  var $t = $(e.currentTarget);
			  var target_cls = $t.attr('data-target');
			  var work_id = $t.attr('data-id');
			  if(target_cls && target_cls != '') {
			    var $trg = $('.'+target_cls);
			    if($trg.length) {
			      if($trg.attr('loaded') != 1) {
			        var furl = $t.attr('data-url');
			        if(furl && furl != '') {
			          var url = 'ajax/'+furl+'.php?id='+work_id;
			          _ajaxLoader(url, function(content) {
			            $trg.html(content) //.attr('loaded', 1);
			            setTimeout(function() {
			              customFile();
			              dropdown_Init();
			              createOverlay($trg);
			              $('.js-work-slider').owlCarousel({
										  loop: true,
										  autoWidth: false,
										  mouseDrag: false,
										  items: 1,
										});
										var work_slider = $(".js-work-slider").data('owlCarousel');
										$('.work-custom-prev').click(function() {
											work_slider.prev();
											setTimeout(function(){
												$('#work-photo-name').html($(".js-work-slider .active img").data('id'));
											}, 150);
										});
										$('.work-custom-next').click(function() {
											work_slider.next();
											setTimeout(function(){
												$('#work-photo-name').html($(".js-work-slider .active img").data('id'));
											}, 150);
										});

			            }, 500);
			          });
			        }
			      } else {
			        createOverlay($trg);
			      }
			    }
			  }
			});
			$(document).on('click', '#contact-popup-btn', function(e) {
			  e.preventDefault();
			  var $t = $(e.currentTarget);
		    var $trg = $('.js-contacts-tab');
		    var content;
		    if($trg.length) {
	        createOverlay($trg);
		    }
			});
		

			contacts_Switch();
			
			// project popup via ajax
			offers.init();
			/*$(document).on('click', '.js-offers-btn', function() {
				var o = $(this).attr('href').replace('#', '');
				var i = ($('.js-offers-tab').attr('loaded') != 1) ? 1 : 0;
				if(o != '') {
					var btn = $(this);
					_ajaxLoader('ajax/get_offer.php?o='+o+'&i='+i, function(content) {
						if(!i) {
							$('.js-offers-tab').append(content).attr('loaded', 1);
							offersOverlay_init(btn);
						} else {
							$('.js-offers-tab-slides').trigger('add.owl.carousel', [content]);
							
						}
					});
				}
			});*/

			/*$('img').lazyload({
				failure_limit: 20,
				skip_invisible: true,
				effect: "fadeIn",
				data_attribute: 'src'
			});*/
			$(window).scroll(__onScroll);
			__onScroll();
			//setInterval(__onScroll, 250);

		$(document).on('submit', 'form', _sendForm);

		$(document).on('click', '.js-overlay-close', function(e) {
			var $tab = $('.js-overlay > :not(.dn)');
			if($tab.length) closeOverlay($tab);
			e.stopPropagation();
		});

		$(document).on('click', '.thx-page a', _hideThx);
		initArticles();
		detectHashHouse();
	});
})(jQuery);

function initArticles() {
	$(".articles-section .articles .swiper-container").swiper({
									noSwiping:!0,
									noSwipingClass:"no-swiping",
									simulateTouch:!1,
									direction:"vertical",
									slidesPerView:2,
									nextButton:".articles-section .articles .swiper-container .next",
									prevButton:".articles-section .articles .swiper-container .prev"
								})
}

function detectHashHouse() {
  if (window.location.hash && 'undefined' != typeof window.location.hash) {
    var a = window.location.hash.replace('#', ''),
    b = '.js-offers-btn[href="#' + a + '"]';
    $(b).length && $(b).click()
  }
}

function __changeBack() {
	if($(this).parent('.js-materials-images, .js-quality-images').length) {
		$(this).parent().css('background-color', '#000');
	}
}

var ajaxStartTime = null;
var _ajaxXhr = null;
function _ajaxLoader(url, callback) {
	if(_ajaxXhr && _ajaxXhr[0] == url) return;
	ajaxStartTime = (new Date()).getTime();
	var _xhr = $.get(url, callback).complete(function() {
		ajaxStartTime = null;
		_ajaxXhr = null;
		//__hidePreloader();
	});
	_ajaxXhr = [url, _xhr];
}
function __showPreloader() {
	if(!$('.js-overlay .ajax-loader:not(.dn)').length) {
		$('.js-overlay .ajax-loader').remove();
		var el = $('<div class="ajax-loader" />');
		el.appendTo('.js-overlay');
		createOverlay(el, true);
	}
}
function __hidePreloader() {
	closeOverlay($('.js-overlay .ajax-loader'));
	$('.js-overlay .ajax-loader').remove();
}

var _imgLoadTimeout;
function __onScroll() {
	var curr = parseInt($(window).scrollTop());
	var bline = curr + parseInt($(window).height());

	if(bline > parseInt($('#contacts').offset().top) - 200) {
		if($('.js-map-switch[data-id^="rus"]').length > 0) {
			map_Init('moskowMap', 55.000889, 36.462750, 54.998999, 36.475550);
			map_Init('omskMap', 54.989342, 73.368212, 54.939342, 73.708212, 10);
		}
		map_Init('belMap', 53.941770, 27.566540, 53.939826, 27.579330);
	} else {
		for(var i in _maps) { delete _maps[i]; }
		for(var i in mapInited) { $('#'+mapInited[i]+' *').remove(); }
		mapInited = [];
		_maps = [];
	}

	/*if(bline > parseInt($("#portfolio").offset().top) - 100 || 1==1) {
		portfolioSlider_Init();
	}

	if(bline > parseInt($(".js-slider-houses").offset().top) - 150 || 1==1) {
		housesSlider_Init();
	}*/

	if(_imgLoadTimeout) clearTimeout(_imgLoadTimeout);
	_imgLoadTimeout = setTimeout(function() {
		_imgLoad();
	}, 50);
}

var _customs_started = [];
function _imgLoad() {
	$('img[data-original]').each(function() {
		var custom = null;
		if($(this).parents('.materials-section, .quality-section, #portfolio').length) return;//custom = $('.materials-section');
		
		/*if(custom) {
			console.log(custom.attr('class'), custom.offset());
			if(_customs_started.indexOf(custom.attr('class')) === -1 && _isElVisible(custom)) {
				_customs_started.push(custom.attr('class'));
				console.log(1, custom.attr('class'));
				if(custom.hasClass('command-section')) {
					$('.js-portfolio-nav .owl-item img, .js-portfolio-slider .item.active .owl-item.active img').loadImages(function() {
						$('.js-portfolio-slider .item .owl-item.active img', custom).loadImages(function() {
							$('img', custom).loadImages(null, 'fadeIn', 100);
						}, 'fadeIn', 100);
						/*$('.js-portfolio-nav .owl-item img', custom).loadImages(function() {
							$('.js-portfolio-slider .item .owl-item img:first-child', custom).loadImages(function() {
								$('img', custom).loadImages(null, 'fadeIn', 100);
							}, 'fadeIn', 100);
						}, 'fadeIn', 100);*
					}, 'fadeIn', 100);
				} else {
					$('img.active', custom).loadImages(function() {
						$('img:not(.active)').loadImages(null, 'fadeIn', 100);
					}, 'fadeIn', 100);
				}
			}
		} else */if(_isElVisible($(this))) {
			$(this).reveal('fadeIn', 100);
		}
	});

	$('.materials-section, #portfolio, .quality-section').each(function() {
		var custom = $(this);
		var _name = custom.attr('class');

		if(_customs_started.indexOf(_name) === -1 && _isElVisible(custom)) {
			_customs_started.push(_name);
			if(custom.is('#portfolio')) {
				$('.js-portfolio-nav .owl-item img, .js-portfolio-slider .item.active .owl-item.active img').loadImages(null, 'fadeIn', 100);//function() {
				$('.js-portfolio-slider .item .owl-item.active img', custom).loadImages(null, 'fadeIn', 100);//function() {
				//$('img', custom).loadImages(null, 'fadeIn', 100);
				$('.js-portfolio-slider .item.active .owl-item img', custom).loadImages(null, 'fadeIn', 100);
				//}, 'fadeIn', 100);
					/*$('.js-portfolio-nav .owl-item img', custom).loadImages(function() {
						$('.js-portfolio-slider .item .owl-item img:first-child', custom).loadImages(function() {
							$('img', custom).loadImages(null, 'fadeIn', 100);
						}, 'fadeIn', 100);
					}, 'fadeIn', 100);*/
				//}, 'fadeIn', 100);
			} else {
				$('img.active', custom).loadImages(null, 'fadeIn', 100);//function() {
					$('img', custom).loadImages(null, 'fadeIn', 100);
				//}, 'fadeIn', 100);
			}
		}
	});
}

function _isElVisible(img) {
	var coords = img.offset();
	
	var wTop = parseInt($(window).scrollTop())+50;
	var wBottom = wTop + parseInt($(window).height())+100;
	
	coords.bottom = coords.top + img.height();
	
	var topVisible = coords.top >= wTop && coords.top <= wBottom;
	var bottomVisible = coords.bottom <= wBottom && coords.bottom >= wTop;
	var centerVisible = coords.top < wTop && coords.bottom > wBottom;
	//console.log(img, topVisible, bottomVisible);
	
	return topVisible || bottomVisible || centerVisible;
}

jQuery.fn.visible = function() { return this.css('visibility', 'visible'); };
jQuery.fn.invisible = function() { return this.css('visibility', 'hidden'); };

var offers = {

	max_pos: 1,
	added: 0,

	init: function() {
		$(document).on('click', '.js-offers-btn', function(e) {
			e.preventDefault();
			var name = $(this).attr('href').substring(1);
			window.location.hash = '#'+name;
			offers.showOffer(name, this);
		});


		$(document).on('click', '.js-slide-down-btn', function() {
			var _cnt = $(this).toggleClass('active').parent().toggleClass('active');
			_cnt.prev('.slide-box').toggleClass('active');
			_cnt.next('.slide-box').toggleClass('active');
		});


		$(document).on('click', '.js-offers-tabs-nav .pseudo', function() {
			var $t = $(this),
				attr = $t.attr('data-id');
			
			$(this).parents('.js-offers-tabs-nav').find('.pseudo').removeClass('active');
			$t.addClass('active');
			$($t.parents('div')[0]).find('.js-offers-tabs .item').addClass('dn');
			//$('.js-param-tab').addClass('dn');
			$('.js-offers-tabs [data-id="' + attr + '"]').removeClass('dn');
			//$('.js-param-tab[data-id="' + attr + '"]').removeClass('dn');
		});


		$(document).on('click', '.js-expand-all-btn', function() {
			var items = $(this).toggleClass('active')
				.parents('.js-expand-wrap').find('.js-slide-down-btn');
			if($(this).hasClass('active'))
				items.addClass('active').parent().next().addClass('active');
			else
				items.removeClass('active').parent().next().removeClass('active');
		});

		$(document).on('click', '.customNextBtn', function() {
			$('.js-offers-tab-slides').trigger('next.owl.carousel');
			offers.clearTab();
		});

		$(document).on('click', '.customPrevBtn', function() {
			$('.js-offers-tab-slides').trigger('prev.owl.carousel');
			offers.clearTab();
		});

		$(".js-same-projects-slider").owlCarousel({
			loop: true,
			items: 2,
			dots: false,
			nav: false,
			margin: 16
		});
		$(document).on('click', '.same-projects-next', function() {
			$('.js-same-projects-slider').trigger('next.owl.carousel');
		});

		$(document).on('click', '.same-projects-prev', function() {
			$('.js-same-projects-slider').trigger('prev.owl.carousel');
		});

		$('.js-offers-btn').each(function() {
			offers.max_pos = Math.max(offers.max_pos, parseInt($(this).attr('data-pos')));
		});
	},

	clearTab: function() {
		var $tab = $('.js-expand-wrap'),
			$btnSlide = $('.js-slide-down-btn'),
			$slideBox = $('.js-slide-box');
			
		$tab.removeClass('active');
		$btnSlide.removeClass('active');
		$slideBox.removeClass('active');
		$('.js-offers-tabs-nav .pseudo').removeClass('active').filter('[data-id=srub]').addClass('active');
		$('.js-offers-tabs .item').addClass('dn').filter('[data-id=srub]').removeClass('dn');
	},

	initSliders: function(name, startPos, btn) {
		startPos = startPos || 0;
		setTimeout(function() {
			/*$('.js-offers-tab-slides').owlCarousel({
				autoWidth: true,
				mouseDrag: false,
				//lazyLoad: true,
				//URLhashListener:true,
				autoHeight:true,
				nav: false,
				items: 1,
				startPosition: startPos-1,
				loop: false,
				onInitialized: function() {
					offers._onContentLoaded(btn);
					$('.offer-projects-nav .projects').text($('.js-offers-tab-slides .owl-item.active .offer-slider h1').text());
					offers.toggleArrows();
				},
				onTranslated: function() {
					$('.offer-projects-nav .projects').text($('.js-offers-tab-slides .owl-item.active .offer-slider h1').text());
					offers.toggleArrows();
				}
			});*/
			var carousel = $('.offers-tab-slides__wrapper').on('jcarousel:createend', function() {
				offers._onContentLoaded(btn);
				$('.offer-projects-nav .projects').text($('.js-offers-tab-slides .offer-slider').eq(0).find('h1').text());
				//offers.toggleArrows();
				$(this).jcarousel('scroll', startPos, false);
				offers.onChangeItem();
			}).on('jcarousel:visiblein', '.item[data-hash]', function() {
				$('.offer-projects-nav .projects').text($('.offer-slider h1', $(this)).text());
				offers.onChangeItem();
			}).jcarousel({
				animation: 250
			});

			$('.offer-projects-nav .customPrevBtn').on('jcarouselcontrol:active', function() {
				$(this).removeClass('inactive');
			}).on('jcarouselcontrol:inactive', function() {
				$(this).addClass('inactive');
			}).jcarouselControl({
				target: '-=1',
				carousel: carousel
			});

			$('.offer-projects-nav .customNextBtn').on('jcarouselcontrol:active', function() {
				$(this).removeClass('inactive');
			}).on('jcarouselcontrol:inactive', function() {
				$(this).addClass('inactive');
			}).jcarouselControl({
				target: '+=1',
				carousel: carousel
			});


			/*.owlCarousel({
				autoWidth: true,
				mouseDrag: false,
				//lazyLoad: true,
				//URLhashListener:true,
				autoHeight:true,
				nav: false,
				items: 1,
				startPosition: startPos-1,
				loop: false,
				onInitialized: function() {
					offers._onContentLoaded(btn);
					$('.offer-projects-nav .projects').text($('.js-offers-tab-slides .owl-item.active .offer-slider h1').text());
					offers.toggleArrows();
				},
				onTranslated: function() {
					$('.offer-projects-nav .projects').text($('.js-offers-tab-slides .owl-item.active .offer-slider h1').text());
					offers.toggleArrows();
				}
			});*/
		}, 100);
	},

	onChangeItem: function() {
		window.location.hash = '#'+$('.offers-tab-slides__wrapper').jcarousel('target').data('hash');
		$('.offers-tab-slides__wrapper').find('.item').removeClass('active');
		$('.offers-tab-slides__wrapper').jcarousel('target').addClass('active');
	},

	toggleArrows: function() {
		if($('.js-offers-tab-slides .owl-item.active').is(':first-child')) {
			$('.offer-projects-nav .customPrevBtn').addClass('inactive');
		} else {
			$('.offer-projects-nav .customPrevBtn').removeClass('inactive');
		}

		if($('.js-offers-tab-slides .owl-item.active').is(':last-child')) {
			$('.offer-projects-nav .customNextBtn').addClass('inactive');
		} else {
			$('.offer-projects-nav .customNextBtn').removeClass('inactive');
		}
	},

	showOffer: function(name, btn) {
		var btn = $(btn);
		var exists = $('.js-offers-tab-slides .item[data-hash='+name+']').length > 0;
		if(exists) {
			offers.clearTab();
			if($('.js-offers-tab').hasClass('dn')) {
				createOverlay($('.js-offers-tab'));
			}
			offers._showOfferProcess.apply(offers, [name, btn]);
		} else {
			var iw = ($('.js-offers-tab').attr('loaded') != 1) ? 1 : 0;
			_ajaxLoader('ajax/offers-1.php', function(content) {
				if($('.js-offers-tab').hasClass('dn')) {
					createOverlay($('.js-offers-tab'));
				}
				if(iw == 1 || 1==1) {
					$('.js-offers-tab').append(content);
					$('.js-offers-tab').attr('loaded', 1);
					//offers._onContentLoaded(btn);
					offers.initSliders(name, parseInt(btn.attr('data-pos'))-1, btn);
				} else {
					/*var _sel = '.js-offers-tab-slides .owl-item:not(.cloned) .item[data-pos]';
					if(!$('.js-offers-tab-slides.owl-carousel').length) {
						_sel = '.js-offers-tab-slides .item[data-pos]';
					}
					var items = $(_sel).clone();
					if($('.js-offers-tab-slides.owl-carousel').length) {
						$('.js-offers-tab-slides.owl-carousel').removeClass('owl-carousel owl-theme owl-loaded owl-text-select-on');
						delete $('.js-offers-tab-slides').data().owlCarousel;
					}

					var _pos = parseInt(btn.attr('data-pos')),
						_at = $('.js-offers-tab-slides .item[data-pos]').eq(0),
						_at_type = 'insertAfter',
						_at_pos = 1;

					//if(_pos != offers.max_pos) {
						
						var elidx = 0;
						items.each(function() {
							var tpos = parseInt($(this).attr('data-pos'));
							if(tpos < _pos) {
								_at = $(this);
								_at_type = 'insertAfter';
								_at_pos = elidx+1;
							} else if(tpos > _pos) {
								_at = $(this);
								_at_type = 'insertBefore';
								_at_pos = elidx;
							}
							elidx++;
							//console.log(tpos, _pos, _at_pos);
						});
					//}
					_at = $(_at).parent('.owl-item').length ? $(_at).parent('.owl-item') : _at;
					console.log(_at_pos, _at_type, _at[0]);

					$('.js-offers-tab-slides').append(items);
					$(content)[_at_type](_at);
					if($('.js-offers-tab-slides.owl-carousel').length) {
						//console.log(_at); throw 'qwe';
						//$(content)[_at_type](_at);
						offers.initSliders(name, _at_pos, btn);
						//$('.js-offers-tab-slides').trigger('destroy.owl.carousel');
						//$(content)[_at_type](_at);
						//$('.js-offers-tab-slides').trigger('refresh.owl.carousel').trigger('to.owl.carousel', [_at_pos, 0]);
						//console.log(_at_pos);
						//$('.js-offers-tab-slides').trigger('add.owl.carousel', [$('<div class="owl-item">'+content+'</div>'), _at_pos]).trigger('refresh.owl.carousel', [null, 'speed']).trigger('to.owl.carousel', [_at_pos, 0]);
						//offers._onContentLoaded(btn);
					} else {
						//$(content)[_at_type](_at);
						offers.initSliders(name, _at_pos, btn);
					}
					//$('.js-offers-tab-slides').append(content);
					//$('.js-offers-tab-slides').trigger('refresh.owl.carousel');
					//offers._showOfferProcess.apply(offers, [name, btn]);*/
				}
			});
		}
	},

	_showOfferProcess: function(name, btn) {
		var pos = (btn && btn['attr'] ? parseInt(btn.attr('data-pos'))-1 : 0);
		//$('.js-offers-tab-slides').data('owlCarousel').reset(pos+1);
		$('.offers-tab-slides__wrapper').jcarousel('scroll', pos, false);
		//$('.js-offers-tab-slides').trigger('to.owl.carousel', [pos, 1]);
		if(btn) {
			var cap = $('.js-offers-tab-slides .item[data-hash='+btn.attr('href').substring(1)+'] .offer-slider h1').eq(0).text();
			offers.onChangeItem();
			$('.offer-projects-nav .projects').text(cap);
			if($(btn).parents('.price-table').length) {
				$('.js-offers-tabs-nav .pseudo[data-id=key]', $('.offers-tab-slides__wrapper').jcarousel('target')).click();
				$('.js-overlay').scrollTop(0);
				//$('.js-offers-tab-slides .owl-item.active .js-offers-tabs-nav .pseudo[data-id=key]').click();
			}
		}
	},

	_onContentLoaded: function(btn) {
		setTimeout(function() {
			$('.js-offer-slider:not(.owl-carousel)').owlCarousel({
				loop: true,
				//lazyLoad: true,
				autoWidth: true,
				mouseDrag: false,
				nav: true,
				items: 1
				//animateOut: 'fadeOut'
			});

			if($(btn).parents('.price-table').length) {
				$('.js-offers-tabs-nav .pseudo[data-id=key]', $('.offers-tab-slides__wrapper').jcarousel('target')).click();
				$('.js-overlay').scrollTop(0);
				//$('.js-offers-tab-slides .owl-item.active .js-offers-tabs-nav .pseudo[data-id=key]').click();
			}

			customFile();
		}, 500);
	}
}

var mapInited = [], _maps = [];
function map_Init(target, locLat, locLong, cLat, cLong, zoom){
	if(mapInited.indexOf(target) < 0) {
		zoom = zoom || 15;
		var image = 'img/ico-marker.png',
			location = new google.maps.LatLng(locLat, locLong),
			options = {
				zoom: zoom,
				center: new google.maps.LatLng(cLat, cLong),
				scrollwheel: false,
				disableDefaultUI: true,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			},
			map = new google.maps.Map(document.getElementById(target), options),
			marker = new google.maps.Marker({
				map: map,
				draggable: true,
				position: location,
				icon: image
			});
		_maps.push(map);
		mapInited.push(target);
	}
}

function mainMenu_Fix(){
	var $menu = $('.js-main-menu'),
		$link = $('a', $menu),
		menuOffsetTop = $('.js-header').innerHeight();

	$link.click(function(){
		$("html, body").animate({scrollTop: $($(this).attr('href')).offset().top - 0}, 1500);
		$(this).blur();
		window.location.hash = $(this).attr('href');
		return false;
	});

	menuPos();

	$(window).on('scroll', function() {
		menuPos();
	});

	function menuPos() {
		var t = $(window).scrollTop();
		var bline = t + parseInt($(window).height());
		if (t >= menuOffsetTop) {
			$menu.addClass('fixed-menu');
		} else {
			$menu.removeClass('fixed-menu');
		}

		$('.fixed-menu .a').removeClass('active').each(function() {
			var $el = $('.'+$(this).data('ma'));
			if($el.length > 0) {
				if($('.fixed-menu .a.active').length <= 0 && _isElVisible($el)) {
					$(this).addClass('active');
				}
			}
		});
	}
}

function customFile() {
	var $input = $('.js-file');
	
	$input.each(function(){
		$(this).css('opacity',0).parent().find('.js-text').attr('readonly', true);
	});
}

function sliderNav_Init() {
	var $nav = $('.js-slider-houses-nav'),
		$btn = $('.pseudo', $nav);
		
	$btn.click(function(e) {
		$btn.removeClass('active');
		var $t = $(this);
		//_activeHouseCat = $(this).attr('href').substring(1);
		var _cat = $(this).attr('href').substring(1);
		setTimeout(function() {
			$('.js-slider-houses .owl-item .item').addClass('invisible').filter('[data-cat="'+_cat+'"]').removeClass('invisible');
			$t.addClass('active');
		}, 200);
	});
}

function dropdown_Init() {
	$('.js-select').jsSelect().on('change', function(e) {
		if($('option:selected', this).is(':first-child'))
			$(e.target).parent().find('.js-selected').removeClass('active');
		else
			$(e.target).parent().find('.js-selected').addClass('active');
	});
}

var housesInited = false;
function housesSlider_Init() {
	if(!housesInited) {
		housesInited = true;
		$('.js-slider-houses').owlCarousel({
			autoWidth: true,
			//lazyLoad: true,
			URLhashListener:true,
			loop: true,
			nav: true,
			margin: 17,
			items: 4,
			onInitialized: function() {
				if(window.location['hash'] && window.location.hash != '') {
					var hash = window.location.hash.substring(1);
					var link = $('.js-slider-houses-nav .pseudo[href="#'+hash+'"]');
					if(link.length) {
						$('html, body').scrollTop($('.js-slider-houses-nav').offset().top);
						setTimeout(function() { link.trigger('click'); $(window).trigger('hashchange.owl.navigation'); }, 4000);
					}
				}
			},
			onTranslate: __housesOnReleased
		});
	}
}
var _activeHouseCat = null;
function __housesOnReleased() {
	if(_activeHouseCat) {
		//$('.js-slider-houses .owl-item .item').addClass('invisible').filter('[data-cat="'+_activeHouseCat+'"]').removeClass('invisible');
		_activeHouseCat = null;
	} else {
		$('.js-slider-houses .owl-item .item').removeClass('invisible');
		$('.js-slider-houses-nav .pseudo').removeClass('active');
	}
	return;


	var active = $('.js-slider-houses .owl-item.active');

	$('.js-slider-houses .owl-item .item').removeClass('current');
	//$('.js-slider-houses-nav a.pseudo').removeClass('active');
	var cats = {};
	active.each(function() {
		cats[$('.item', this).data('cat')] = $('.item', this).data('cat');
	});

	var sl = [], sli = [];
	for(var i in cats) {
		sl.push('.js-slider-houses .owl-item.active .item[data-cat="'+i+'"]');
	//	sli.push('.js-slider-houses-nav a.pseudo[href="#'+i+'"]');
	}

	$(sl.join(',')).addClass('current');
	//$(sli.join(',')).addClass('active');
}

var poftfolioInited = false;
function portfolioSlider_Init() {
	if(!poftfolioInited) {
		poftfolioInited = true;
		var $slidersMenu = $('.js-portfolio-nav'),
			$btn = $('.js-group', $slidersMenu);
		
		__initPortfolioSlider($('.js-portfolio-slider > .item.active .js-portfolio'));
		/*$('.js-portfolio-slider > .item.active .js-portfolio').owlCarousel({
			autoWidth: true,
			lazyLoad: true,
			loop: true,
			nav: true,
			items: 1,
			onInitialized: function() {
				$('.js-portfolio.owl-carousel').attr('inited', 1);
			}
		});*/
		
		$slidersMenu.owlCarousel({
			autoWidth: true,
			//lazyLoad: true,
			loop: false,
			nav: true,
			margin: 8,
			items: 5
		});
		
		$btn.click(function() {
			var $t = $(this);
			
			$btn.removeClass('active');
			$t.addClass('active');
			
			var $slider = $('.js-portfolio-slider'),
				id = $t.attr('data-id');
			
			$('li', $slider).removeClass('active');
			$('[data-id="' + id +'"]', $slider).addClass('active');
			if(parseInt($('[data-id="' + id +'"] .js-portfolio', $slider).attr('inited')) !== 1) {
				__initPortfolioSlider($('[data-id="' + id +'"] .js-portfolio', $slider));
				//_imgLoad();
			} else {
				onPortfoioChanged();
			}
		});
	}
}

function __initPortfolioSlider(item) {
	item.owlCarousel({
		autoWidth: true,
		lazyLoad: true,
		loop: true,
		nav: true,
		items: 1,
		onInitialized: onPortfoioChanged
	});
}

function onPortfoioChanged() {
	$('.js-portfolio-slider > .item').removeClass('current').filter('.active').addClass('current');
	$('.js-portfolio.owl-carousel').attr('inited', 1);//.prev('.ajax-loader__wrapper').remove();
}

function slideDown_Init(className) {
	var $textCont = $('.js-' + className +'-text'),
		$btn = $('li', $textCont),
		$img = $('.js-' + className +'-images img');
		
	$btn.on('click', function() {
		var $t = $(this),
			index = $t.index();
		
		$btn.removeClass('active');
		$t.addClass('active');
		
		$img.removeClass('active')
			.eq(index).addClass('active');
	});
}

function overlay_Init($btn, $tab) {
	$btn.on('click', function() {
		createOverlay($tab);
	});
}

function createOverlay($tab, modal) {
	var $overlay = $('.js-overlay'),
		$content = $('.content', $overlay),
		$body = $('body').addClass('fix'),
		$close = $('.js-overlay-close');
	
	$overlay.addClass('overlay');
	if(modal) { $overlay.addClass('modal'); }
	$tab.removeClass('dn');
	
	if(!modal) {
		$overlay.on('click', function(e) {
			if ($(e.target).closest($content).length) {
				return;
			}
			
			closeOverlay($tab);
			e.stopPropagation();
		});
	}
}

function closeOverlay($tab) {
	$('.js-overlay').removeClass('overlay').removeClass('modal'),
	$body = $('body').removeClass('fix');
	$tab.addClass('dn'),

  'function' == typeof window.history.replaceState && - 1 !== window.location.href.indexOf('#') && history.replaceState({
  }, '', window.location.href.slice(0, window.location.href.indexOf('#') + 1))
}

function contacts_Switch(){
	var $contactsList = $('.js-map-box'),
		$tab = $('li', $contactsList),
		$link = $('.js-map-switch'),
		$active = $('.js-map-switch[data-id="rus"], .js-map-switch[data-id="rus-msk"]'),
		is_bel = ($active.length <= 0);
	if(is_bel) $active = $('.js-map-switch[data-id="bel"]')
	
	/*setTimeout(function() {
		if(!is_bel) $('[data-id="bel"], [data-id="rus-omsk"]', $contactsList).addClass('dn');
		$active.addClass('active');
	}, 200);*/
	
	$link.on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		var t = $(this),
			country = t.attr('data-id').split('-')[0],
			city = t.attr('data-id').split('-')[1];

		if(country == 'rus' && !city) city = 'msk';

		$link.removeClass('active');
		$tab.addClass('dn');
		$('[data-id="'+country+'"]'+(city ? ', [data-id="'+country+'-'+city+'"]' : '')).addClass('active');
		$('[data-id="'+country+(city ? '-'+city+'' : '')+'"]', $contactsList).removeClass('dn');
		
		$.each(_maps, function(idx, map) {
			console.log(arguments);
			google.maps.event.trigger(map, 'resize');
		});
	});
}

function _sendForm(e) {
	e.preventDefault();

	var form = $(this),
		button = $('[type=submit]', $(this)).val('Загрузка...').attr('disabled', 'disabled');
	$('*', form).removeClass('error');
	if($('#project_name_value')[0] && form.find('[name=sadd]')[0]) {
		form.find('[name=sadd]').val('Проект '+$('#project_name_value').val()+'.');
	}
	console.log($('#project_name_value'));
	$.ajax({
		url: '/handle/handler.php?action=' + form.attr('data-id'),
		type: 'post',
		data: new FormData(form[0]),
		dataType: 'json',
		success: function (data) {
			if (typeof undefined != typeof data.success) {
				if(true === data.success) {
					closeOverlay($('.js-overlay > :not(.dn)'));
					form[0].reset();
					dropdown_Init();
					//alert('Заявка принята.');
					_showThx();
				} else if (data['errors'] && data['errors'] instanceof Array){
					$.each(data['errors'], function(idx, val) {
						form.find('[name='+val+']').addClass('error');
					});
				}
			} else {
				alert('Призошла ошибка!');
			}
		},
		error: function () {
			alert('Призошла ошибка!');
		},
		complete: function () {
			button.val('Отправить').removeAttr('disabled');
		},
		// http://stackoverflow.com/questions/166221/how-can-i-upload-files-asynchronously/8758614#8758614
		xhr: function () {  // Custom XMLHttpRequest
			var myXhr = $.ajaxSettings.xhr();
			if (myXhr.upload) { // Check if upload property exists
				myXhr.upload.addEventListener('progress', function (e) {
					if (e.lengthComputable) {
						button.val('Загрузка (' + (parseInt(100 * e.loaded / e.total)) + '%)');
					}
				}, false); // For handling the progress of the upload
			}
			return myXhr;
		},
		//Options to tell jQuery not to process data or worry about content-type.
		cache: false,
		contentType: false,
		processData: false
	});
}

function _showThx() {
	$('body').addClass('fix');
	$('.thx-page').fadeIn(250);
}

function _hideThx(e) {
	e.preventDefault();
	$('.thx-page').fadeOut(250, function() {
		$(this).removeAttr('style');
		$('body').removeClass('fix');
	});
}


$(document).ready(function () {
	$("#nav-bar").on("click", "a", function (event) {
		event.preventDefault();
		var id = $(this).attr('href'),
			top = $(id).offset().top - 100;
		$('body,html').animate({
			scrollTop: top
		}, 1500);
	});
});