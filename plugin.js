jQuery(function($) {
  //プラグインを作る時の決まり文句
  //$.fn.メソッド名 = 〜でプラグインを定義する
  $.fn.liteslider = function(options) {
    var defaultOptions = {
      effect: 'slide',
      navigation: true,
      pagination: true,
      slideshow: true,
      slideshowSpeed: 5000,
      animationSpeed: 1000
    };
    var target = $(this);
    //extendはマージする関数です。デフォルトと引数のオプションでマージしてオプションを決定します
    var options = $.extend({}, defaultOptions, options);
    //この名前でコンテイナーを作っています
    var container = target.find('.slides-container');
    //この名前でulを作っています　ul class=.slideです。つまりliの数をゲットしています
    var slideCount = target.find('.slides > li').length;
    var slides = target.find('.slides');
    var pagination;
    var slideNo = 1;
    var slideWidth = 0;
    var slidePos = 0;
    var isSlideAction = false;

    function init() {
      if (options.effect === 'slide') {
        /* 最後のスライドから最初のスライドへアニメーションさせるため、最後に最初のスライドを追加 */
        //やっていることは最初のノードをappendしているだけ
        slides.append(slides.find('> li:first-child').clone(true));
      } else {
        slides.find('> li:not(:first-child)').css({position:"absolute", left:"0", top:"0", opacity:"0"});
      }
      //ナビゲーションがtureならばナビゲーションを追加する
      if (options.navigation) {
        target.append('<div class="slide-nav-prev">&lt;</div><div class="slide-nav-next">&gt;</div>');
        //ついでにナビにクリックアクションを設定します
        $(".slide-nav-prev").click(function() {
          isSlideAction = true;
          if (options.effect === 'slide') {
            slidePrev();
          } else {
            fade(slideNo === 1 ? slideCount : slideNo - 1);
          }
        });
        $(".slide-nav-next").click(function() {
          isSlideAction = true;
          if (options.effect === 'slide') {
            slideNext();
          } else {
            fade(slideNo >= slideCount ? 1 : slideNo + 1);
          }
        });
      }
      //ページネーションはスライドの数だけくっつけます
      if (options.pagination) {
        var paginationHtml = '<ol class="slide-pagination">';
        for (var i = 0; i < slideCount; i++) {
          paginationHtml += '<li></li>';
        }
        paginationHtml += '</ol>';
        //アペンドします
        target.append(paginationHtml);
        //さらにページネーションを取得して
        pagination = target.find('.slide-pagination li');
        //ページネーションにアクションをつけます
        pagination.click(function() {
          isSlideAction = true;
          var index = pagination.index(this);
          if (options.effect === 'slide') {
            slide(index + 1);
          } else {
            fade(index + 1);
          }
        });
        pagination.eq(slideNo - 1).addClass('slide-active');
      }
      resize();
      slides.find('> li').show();
    }//end init
    //ここまでinitメソッドです


    function resize() {
      //.slides-containerです。cssではoverflow:hiddenのみが設定親が100%です
      slideWidth = container.width();
      //一つのスライドの大きさはこういうことね
      slides.find('li').css({"width": slideWidth + "px"});
      if (options.effect === 'slide') {
        slides.width((slideCount + 1) * slideWidth);
        slidePos = (slideNo - 1) * slideWidth;
        container.animate({scrollLeft: slidePos}, 1, "swing");
      } else {
        slides.width(slideWidth);
      }
    }

    function slideNext() {
      slidePos = ((slideNo - 1) * slideWidth);
      container.animate({scrollLeft: slidePos}, 1, "swing", function() {
        slideNo++;
        slidePos = ((slideNo - 1) * slideWidth);
        container.animate({scrollLeft: slidePos}, options.animationSpeed, "swing");
        if (slideNo > slideCount) {
          slideNo = 1;
        }
        if (options.pagination) {
          pagination.removeClass('slide-active');
          pagination.eq(slideNo - 1).addClass('slide-active');
        }
      });
    }

    function slidePrev() {
      if (slideNo === 1) {
        slideNo = slideCount + 1;
      }
      slidePos = ((slideNo - 1) * slideWidth);
      container.animate({scrollLeft: slidePos}, 1, "swing", function() {
        slideNo--;
        slidePos = ((slideNo - 1) * slideWidth);
        container.animate({scrollLeft: slidePos}, options.animationSpeed, "swing");
        if (options.pagination) {
          pagination.removeClass('slide-active');
          pagination.eq(slideNo - 1).addClass('slide-active');
        }
      });
    }

    function slide(no) {
      if (slideNo === no)
        return;
      slidePos = ((slideNo - 1) * slideWidth);
      container.animate({scrollLeft: slidePos}, 1, "swing", function() {
        slideNo = no;
        slidePos = ((slideNo - 1) * slideWidth);
        container.animate({scrollLeft: slidePos}, options.animationSpeed, "swing");
        if (options.pagination) {
          pagination.removeClass('slide-active');
          pagination.eq(slideNo - 1).addClass('slide-active');
        }
      });
    }

    function fade(no) {
      var slide = slides.find('> li');
      $(slide[slideNo - 1]).animate({opacity: '0'}, options.animationSpeed);
      $(slide[no - 1]).animate({opacity: '1'}, options.animationSpeed);
      slideNo = no;
      if (options.pagination) {
        pagination.removeClass('slide-active');
        pagination.eq(slideNo - 1).addClass('slide-active');
      }
    }

    if (options.slideshow) {
      setInterval(function() {
        if (!isSlideAction) {
          if (options.effect === 'slide') {
            slideNext();
          } else {
            fade(slideNo >= slideCount ? 1 : slideNo + 1);
          }
        } else {
          isSlideAction = false;
        }
      }, options.animationSpeed + options.slideshowSpeed);
    }

    $(window).resize(function() { resize(); });

    init();
  };
});
Copy
liteslider.css
.liteslider {
    width: 100%;
    height: auto;
    position: relative;
}
.liteslider img {
    max-width: 100%;
    height: auto;
}
.liteslider .slides-container {
    overflow: hidden;
}
.liteslider ul.slides {
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;
    max-width: none;
}
.liteslider ul.slides > li {
    float: left;
    text-align: center;
    position: relative;
}
.liteslider ul.slides > li:not(:first-child) {
    display: none;
}
.liteslider ul.slides:after {
    content: "";
    display: block;
    clear: both;
}
.liteslider .slide-content {
    position: absolute;
    margin: 0;
    padding: 10px;
    top: 0;
    left: 0;
    width: 100%;
    text-align: left;
}

/*
Navigation
*/
.liteslider .slide-nav-prev,
.liteslider .slide-nav-next {
    position: absolute;
    color: #333333;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    width: 40px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    opacity: 0;
    margin-top: -20px;
    top: 50%;
    z-index: 11;
}
.liteslider .slide-nav-prev {
    left: 0;
}
.liteslider .slide-nav-next {
    right: 0;
}
.liteslider:hover .slide-nav-prev,
.liteslider:hover .slide-nav-next {
    opacity: 0.8;
}
.liteslider:hover .slide-nav-prev:hover,
.liteslider:hover .slide-nav-next:hover {
    opacity: 0.5;
}

/*
Pagination
*/
.liteslider ol.slide-pagination {
    position: absolute;
    margin: 0;
    padding: 0;
    list-style-type: none;
    bottom: 16px;
    width: 100%;
    height: 16px;
    text-align: center;
    z-index: 10;
}
.liteslider ol.slide-pagination li {
    margin: 0 5px;
    width: 14px;
    height: 14px;
    display: inline-block;
    cursor: pointer;
    background-color: #333333;
    border-radius: 10px;
    border: 2px solid rgba(255,255,255,0.3);
    opacity: 0.5;
}
.liteslider ol.slide-pagination li:hover,
.liteslider ol.slide-pagination li.slide-active {
    border: 2px solid rgba(255,255,255,0.4);
    opacity: 1.0;
}
