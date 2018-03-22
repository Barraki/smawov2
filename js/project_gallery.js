var sma = {
  start : function() {
    sma.initProjectGallery();
  },
  projectGalleryItems: 'body a.gallery-items',
  projectGallery: null,
  initProjectGallery: function() {
    if($(sma.projectGalleryItems).length) {
      $(document).on('click', '.open-gallery', function(e) {
        var index = $(this).data('index') ? $(this).data('index') - 1 : 0;
        e.preventDefault();
        sma.showProjectGallery(index);
      });

      $(document).on('click', '.project-gallery-bar .close', function(e) {
        e.preventDefault();

        $('html').removeClass('fancybox-lock');
        $('body').removeClass('modal-open');
        sma.projectGallery.destroy();
        $('.project-gallery').remove();
        sma.projectGallery = null;
      })
    }
  },
  showProjectGallery: function(startIdx) {
    var $swiper = $('<div class="swiper-container project-gallery" />');
    var $items = $('<div class="swiper-wrapper project-gallery-items" />').appendTo($swiper);
    var caption, slide, html_class;
    $(sma.projectGalleryItems).each(function() {
      caption = $(this).attr('data-caption') ? '<div class=\'caption\'>' + $(this).data('caption') + '</div>' : '';
      html_class = $(this).attr('data-caption') ? 'swiper-slide plane' : 'swiper-slide';
      slide = '<div class="' + html_class + '" style="background-image:url(\'';
      slide += $(this).attr('href')+'?1\')" >';
      slide += caption;
      slide += '</div>';
      $items.append(slide);
    });
    $swiper.append('<div class="project-gallery-bar"> \
      <span class="prev"></span> \
      <span class="next"></span> \
      <span class="close"></span> \
      <span class="count"></span> \
    </div>');

    $('html').addClass('fancybox-lock');
    $('body').addClass('modal-open').append($swiper);

    //$('.project-gallery, .project-gallery-items, .project-gallery-items .swiper-slide').css('width', $(window).width());

    var updateGalleryCounter = function() {
      if(sma.projectGallery) {
        $('.project-gallery-bar .count').html( (sma.projectGallery.activeIndex+1) + ' / ' + sma.projectGallery.slides.length );
      }
    }
    updateGalleryCounter();

    sma.projectGallery = new Swiper ('.project-gallery', {
      loop: false,
      slidesPerView: 1,
      initialSlide: startIdx,
      keyboardControl: true,

      nextButton: '.project-gallery-bar .next',
      prevButton: '.project-gallery-bar .prev',

      onSlideChangeEnd: updateGalleryCounter,
      onInit: updateGalleryCounter,

      onSlideChangeStart: updateGalleryCounter,
    });

    updateGalleryCounter();
  },
};

  $(document).ready(function() {
    sma.start();
  });

