$(document).ready(function(){

	/*  Foundation Init    */
	$(document).foundation();

		$('.save_button').on('click', function(event) {
		  $.ajax({
				method: "POST",
				url: "/save"
			}).done(function(info){
				$('.render-success').show().fadeIn('slow');
				console.log('saved');
			}).fail(function(err){
				console.log('failed');
			});
		});

		$('.prof').on('click', function(event) {
				window.location.href= "/user/" + user.id;
		});

		$('.signout').on('click', function(event) {
				window.location.href= "signout";
		});

		$('.register').on('click', function(event) {
				window.location.href= "register"
		});

		$('.prof').on('click', function(event) {
				window.location.href= "/user/" + user.id;
		});

	/*    Mean navigation menu scroll to    */
    $('#mean_nav ul li a').click(function(e){
    	e.preventDefault();
    	scrollTo($(this).attr('href'), 900, 'easeInOutCubic');
    });

		$('.score_arrow').click(function(e){
			e.preventDefault();
			scrollTo($(this).attr('href'), 900, 'easeInOutCubic');
		});

		$('.btn_fancy').click(function(e){
			e.preventDefault();
			scrollTo($(this).attr('href'), 900, 'easeInOutCubic');
		});

    /*    Back to top button    */
    var back_top = $('#back_top');

    back_top.click(function(e){
    	e.preventDefault();
    	scrollTo(0, 900, 'easeInOutCubic');

    });

    function scrollTo(target, speed, ease){
    	$(window).scrollTo(target, speed, {easing:ease});
    }

    $(window).on('scroll', function(){
	    if($(this).scrollTop()>749)
	    {
	    	back_top.stop().animate({opacity : 1}, 250);
	    }else
	    {
	    	back_top.stop().animate({opacity : 0}, 250);
	    }
    });

});
