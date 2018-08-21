$(function(){

  //トグルボタンをクリックした時の動作
  $('#toggle-btn-area').on('click',function(){
      $('#nav-menu').addClass('active');
      $('#overray').addClass('active');
  });

  //オーバーレイをクリックした時の動作
  $('#overray').on('click',function(){
    $('#nav-menu').removeClass('active');
    $('#overray').removeClass('active');
  });

  //タブメニューのメニューをクリックした時の動作
  $('.tab-menu li').on('click',function(){
    //thisと言う書き方でなく$thisと書く
    if($(this).hasClass('active')){
      return;
    }else{
      //どこのタブが押されたかを取得する(0始まり)
      var index = $('.tab-menu li').index(this);

      $('.tab-menu li').removeClass('active');
      $(this).addClass('active');

      $('section ul').removeClass('active').eq(index).addClass('active');
    }
  });

  /*     挿入するコード     */

  var previewCode = '<div id="photo-area"> ' +
                 '    <span class="close"><i class="far fa-times-circle"></i></span> ' +
                 '    <span class="prev"><i class="fas fa-angle-double-left"></i></span> ' +
                 '    <span class="next"><i class="fas fa-angle-double-right"></i></span> ' +
                 '    <div class="img-area"> ' +
                 '    <img src="img/1.jpg" /> ' +
                 '    </div> ' +
                 '</div> ';
  //indexは使い回すためにここで宣言しておく
  var index = null;
  //ギャラリーの画像(正確にはその親要素)がクリックされた時の動作
  $('.gallery .gallery-item').on('click',function(){
    //ギャラリーの画像の数を格納する 1始まり
    var count = $('.gallery .gallery-item').length;
    //これで保存しておけば使いまわせる
    index = $('.gallery .gallery-item').index(this);


    $('body').append(previewCode).hide().fadeIn(1000);
    var target = $(this).find('img').attr('src');
    $('#photo-area .img-area img').attr('src',target);

  });

  //要素が初期値ではないのでonで後から指定する
  $(document).on('click','#photo-area .close',function(){
    $('#photo-area').fadeOut().queue(function(){
      $('#photo-area').remove();
    });
  });

  //next prev ボタン
  //indexは0~
  //lengthは1~
  $(document).on('click','#photo-area .next',function(){

    if( index === $('.gallery .gallery-item').length -1 ){
      index = -1;
    }

    index++;

    var nextImg = $('.gallery .gallery-item').eq(index);
    var img = nextImg.find('img').attr('src');

    // $('#photo-area .img-area img').attr('src',img);
    $('#photo-area .img-area').fadeOut('fast',function(){
      $('#photo-area .img-area img').attr('src',img);
      $('#photo-area .img-area').fadeIn();
    });
  });

  //prevボタン
  $(document).on('click','#photo-area .prev',function(){

    if( index === 0){
      index = $('.gallery .gallery-item').length;
    }

    index--;

    var nextImg = $('.gallery .gallery-item').eq(index);
    var img = nextImg.find('img').attr('src');
  //  $('#photo-area .img-area img').attr('src',img);
    $('#photo-area .img-area').fadeOut('fast',function(){
      $('#photo-area .img-area img').attr('src',img);
      $('#photo-area .img-area').fadeIn();
    });
  });

  //--------------------------------------------------


  //移動する→表示していた要素を末尾に追加する。表示していた要素を削除する
  $('.slide-container .next').on('click',function(){

    //スライドを一つ分移動する
    $('.slide-container .slider').stop().animate({scrollLeft:175 + 10},500,function(){
      //一番手前にある要素を末尾にコピーする
      $('.slide-container .slider').append($('.slide-container .slider').find('> div:first-child').clone(true));
      //スライドの最初の要素を削除する。
      $('.slide-container .slider').find('> div:first-child').remove();
      //スクロール量を元に戻す。これをしないと削除したときにずれる
      $('.slide-container .slider').scrollLeft(0);

    });

  });


  //戻るボタンの動作
  $('.slide-container .prev').on('click',function(){
    //最後の要素を追加する
    $('.slide-container .slider').prepend($('.slide-container .slider').find('> div:last-child').clone(true));
    //まずスクロール位置を補正しておく
    $('.slide-container .slider').scrollLeft(185);
    //先頭にアペンドされていて、さらにスクロール位置まで移動しているので、あとはスクロール位置を戻すだけ
    $('.slide-container .slider').stop().animate({scrollLeft:-175 + 10},500,function(){
      $('.slide-container .slider').find('> div:last-child').remove();
    });

  });


});
