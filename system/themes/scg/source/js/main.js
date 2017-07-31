var initializeEvents = function() {
  var window_width = $(window).innerWidth();
  var window_height = $(window).innerHeight();
  if (window_height <= 400) {
    $('.share_wrap_outer').hide();
  }
  //share_wrap_outer
  $("h1.page-title").fitText(1.3, { minFontSize: '20px', maxFontSize: '80px' });
  //$(".page-content h2").fitText(1.5, { minFontSize: '20px', maxFontSize: '60px' });
  $('select').material_select();
  $('.obscure').each(function() {
    var address = $(this).attr("data-obscure").split('%').join('@').split('&').join('.')
    //alert(address);
    $(this).html(address)
  });
  
  var youtubesubscribescript = '<script src="https://apis.google.com/js/platform.js"></script>'
  var twitterscript =                 '<script>window.twttr = (function(d, s, id) {';
      twitterscript = twitterscript + 'var js, fjs = d.getElementsByTagName(s)[0],';
      twitterscript = twitterscript + 't = window.twttr || {};';
      twitterscript = twitterscript + 'if (d.getElementById(id)) return t;';
      twitterscript = twitterscript + 'js = d.createElement(s);';
      twitterscript = twitterscript + 'js.id = id;';
      twitterscript = twitterscript + 'js.src = "https://platform.twitter.com/widgets.js";';
      twitterscript = twitterscript + 'fjs.parentNode.insertBefore(js, fjs);';
      twitterscript = twitterscript + 't._e = [];';
      twitterscript = twitterscript + 't.ready = function(f) {';
      twitterscript = twitterscript + 't._e.push(f);'
      twitterscript = twitterscript + '};';
      twitterscript = twitterscript + 'return t;';
      twitterscript = twitterscript + '}(document, "script", "twitter-wjs"));</script>';
  
  // We need to get the app_id from the meta_tag if possible.
  var facebookscript = '';
      facebookscript = facebookscript + '<div id="fb-root"></div>';
      facebookscript = facebookscript + '<script>(function(d, s, id) {';
      facebookscript = facebookscript + 'var js, fjs = d.getElementsByTagName(s)[0];';
      facebookscript = facebookscript + 'if (d.getElementById(id)) return;';
      facebookscript = facebookscript + 'js = d.createElement(s); js.id = id;';
      facebookscript = facebookscript + 'js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=514568561907093";';
      facebookscript = facebookscript + 'fjs.parentNode.insertBefore(js, fjs);';
      facebookscript = facebookscript + "}(document, 'script', 'facebook-jssdk'));</script>";    
  
  
  

  var first_visit_cookie_name = $('#first_visit_modal').attr('data-cookie-name');
  if (first_visit_cookie_name && (!$('#first_visit_modal').hasClass('first_visit_processed'))) {
    $('#first_visit_modal').addClass('first_visit_processed').firstVisitPopup({
	  cookieName : first_visit_cookie_name,
	});
  }
  
  $('.form_default').each(function(){
    var default_value = $(this).attr('data-form-default');
    $(this).addClass('default_processed').DefaultValue(default_value);
  });
  
    var twitter_load = function(item) {
     
        $(item).after(twitterscript);
        $(item).removeClass('tweet-link').addClass('tweet_processed');
    
        var tweet_id = $(item).attr('data-tweet-id');
        var tweet_div = $(item)[0];
        var window_width =  $(window).innerWidth();
        var twitter_width = 500;
        if (window_width < 500) {
          twitter_width = window_width - 40;
        }
        twttr.ready(function(evt) {
          twttr.widgets.createTweet(tweet_id, tweet_div, 
            {
              conversation : 'none',    // or all
              theme        : 'light', // or dark
              dnt          : 'true',
              width        :  twitter_width,
              align        : 'center'
            })
        });
    }
    
    var injection_html_call = function(item) {
      var file_path = $(item).attr('data-injection-html');
      $(item).removeClass('injection_html').addClass('injection_html_processed').load(file_path, initializeEvents).css('visibility','visible').hide().fadeIn('slow');
    }
    
    var parallax_load = function(item) {
      // We get the height of the image and apply the height to ensure we don't have a big overflow.
      // We should add a breakpoint to hide internal items that don't fit.
      if (!$(item).parent().hasClass("config_height") || window_width < 1000) {
        var parallax_image_height = $(item).children('img').innerHeight()  / 1.5;
        if (parallax_image_height >= 100) {
          $(item).parent().css('height', parallax_image_height);
        }
      }
      
      
      $(item).parallax().addClass('parallax_processed');
    }
    
    var lazy_image_call = function(item) {
      $(item).hide().attr("src", $(item).attr("data-src")).fadeIn(500).removeClass("lazy");
      if ($(item).parent().hasClass('parallax')) {
        parallax_load($(item).parent());
      }
    } 
    
    var fb_load = function(item) {
      var fb_post_width = window_width * .9;
      
      $(item).addClass('fb_item_processed').removeClass('fb_post_wrap');
      if ($('body').hasClass('fb_loaded')) {
        FB.XFBML.parse(document.getElementById('result'));
        //code
      }
      else {
        $('body').prepend(facebookscript).addClass('fb_loaded');
      }  
      
    }
    
    $(".fb_post_wrap:in-viewport").each(function(){
      fb_load(this);
    });
    
    $(".lazy:in-viewport").each(function() {
        lazy_image_call(this);
    });
    
    $('.injection_html:in-viewport').each(function(){
       injection_html_call(this);
    });
    
    $(".tweet-link:in-viewport").each(function() {
      twitter_load(this);
    });
    
    $(window).bind("scroll", function(event) {
        $(".lazy:in-viewport").each(function() {
            lazy_image_call(this);
        });
        
        $('.injection_html:in-viewport').each(function(){
            injection_html_call(this);
        });
        
        $(".tweet-link:in-viewport").each(function() {
          twitter_load(this);
        });
        
        $(".fb_post_wrap:in-viewport").each(function(){
          fb_load(this);
        });
    });
    
   
    
    // Load javascript for social media subscribe buttons asynchronously.
    // We should make this so that the code is only added once (done for facebook)
    var social_open = function() { 
      $(youtubesubscribescript).insertBefore( "#side-subscribe" );
      $(twitterscript).insertBefore( "#side-subscribe" );
      //if ($('body').hasClass('fb_loaded')) {
      //  if (FB) {
      //    FB.XFBML.parse(document.getElementById('result'));
      //  }
      //}
      //else {
      $('body').prepend(facebookscript).addClass('fb_loaded');
      //}  
    }
    //var current_path = window.location.pathname;

    
    $('.follow').sidr({
        name: 'sidr_social',
        onOpen: social_open,
        side: 'right'
      });
    $('#menu_button').sidr({
        name: 'sidr_menu',
        onOpen: social_open,
        side: 'left'
      });
    $('.sidr_close').click(function(){
      $.sidr('close', 'sidr_menu');
      $.sidr('close', 'sidr_social');
      });
}
$(document).ready(initializeEvents());