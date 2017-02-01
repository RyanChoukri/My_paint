$(document).ready(function() {

	$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      hover: true, // Activate on hover
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'right' // Displays dropdown with edge aligned to the left of button
    }
  );


	$(".button-collapse").sideNav();
	$('.modal-trigger').leanModal();
	$('#push,secton').pushpin({ top:$('#push').height() });
	$('.collapsible').collapsible({});
});