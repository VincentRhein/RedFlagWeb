var mouseIsDown = false;
var x = 0;
var y = 0;
var width = 0;
var height = 0;
var demoMode = false;

var backgroundImage = "images/1_EDIT.jpg"

var backgroundImageURL = "url("+backgroundImage+")";

var imageWidth = 0
var imageHeight = 0

var img = new Image();

img.onload = function() {
    imageWidth = this.width
    imageHeight = this.height
}

img.src = backgroundImage;

var imageBoxStyle =
    {
//        "background-color":"red",
        "background-image": backgroundImageURL
    };

$("div.imageBox").css(imageBoxStyle);

function imageBoxX( ) {
    return $("div.imageBox").position().left;
}
function imageBoxY( ) {
    return $("div.imageBox").position().top;
}
function imageBoxWidth( ) {
    return $("div.imageBox").width();
}
function imageBoxHeight( ) {
    return $("div.imageBox").height( );
}

function trueMouseDown( e ) {
  demoMode = false;
  onMouseDown( e );
}

function onMouseDown( e ) {

    // Remove any old selection boxes
    $("div.selectionBox").remove()
    $("div.imageBox").append("<div class='selectionBox'>")


    x = e.pageX - imageBoxX();
    y = e.pageY - imageBoxY();

    var pos =
        {
            "background" : "white",
            "opacity": 0.7,
            "left" : x,
            "top" : y,
            "width" : 0,
            "height" : 0
        }

    $("div.selectionBox").css(pos);

    mouseIsDown = true;
};

function onMouseMove( e ) {
    if ( !mouseIsDown )
    {
        return;
    }

    var right = e.pageX - imageBoxX();
    var bottom = e.pageY - imageBoxY();

    width = right - x
    height = bottom - y

    var pos =
        {
            "width" : width,
            "height" : height
        }

    $("div.selectionBox").css(pos);
};

function setCssDelayed( id, css, ms ) {
    $( id ).delay( ms ).queue( function( next ) {
        $( this ).css( css );

        next( );
      } );
}

function slideZoom( ) {
    var offsetString = "-" + x + "px" + " -" + y + "px";
    var magBoxPosition = $("div.magnificationBox").position();
    var magBoxWidth = $("div.magnificationBox").width()
    var magBoxHeight = $("div.magnificationBox").height()

    var bgsize = magBoxWidth + "px ";

    var s =
        {
            "background":backgroundImageURL+offsetString,
            "opacity":1,
            "width" : width,
            "height" : height,
            "background-size" : bgsize,

        }

    // The slidingPictureBox is positioned in absolute coordinates,
    //  so need to add the imageBox's top left to x,y which are
    //  relative to the imageBox.
    var p =
        {
            "left" : x + imageBoxX(),
            "top" : y + imageBoxY()
        }

    //  Remove any old slidingPictureBox and add a new one
    $("div.slidingPictureBox").remove()
    $("body").append("<div class='slidingPictureBox'>")

    $("div.slidingPictureBox").css(s)
    $("div.slidingPictureBox").css(p)

    var zoomFactor = magBoxWidth / width;
    bgsize = (zoomFactor * magBoxWidth) + "px"
    var offsetString = "-" + (x*zoomFactor) + "px" + " -" + (y*zoomFactor) + "px";

    var transitionCss =
        {
            "background":backgroundImageURL+offsetString,
            "left" : magBoxPosition.left,
            "top" : magBoxPosition.top,
            "width" : magBoxWidth,
            "height" : magBoxHeight,
            "background-size" : bgsize
        }


    setCssDelayed( "div.slidingPictureBox", transitionCss, 1000)
}

var onMouseUp = function()
{
    mouseIsDown = false;

    slideZoom()
};

$("div.imageBox").mousedown( trueMouseDown )
$("div.imageBox").mousemove( onMouseMove )
$("div.imageBox").mouseup( onMouseUp )

var demo = function()
{
  var w = 120
  var h = 60

  var x = Math.random() * (imageBoxWidth()-w);
  var y = Math.random() * (imageBoxHeight()-h);

  x += imageBoxX();
  x += imageBoxY();

  var mouseDownEvent =
    {
      "pageX" : x,
      "pageY" : y,
      "demo" : true
    }

  onMouseDown(mouseDownEvent)

  var mouseUpEvent =
    {
      "pageX" : x + w,
      "pageY" : y + h
    }

  onMouseMove(mouseUpEvent)
  onMouseUp()

  window.setTimeout(demo,3000)
}


if ( demoMode )
{
  window.setTimeout(demo,3000);
}

function repositionZoomBox( ) {
	$( '.slidingPictureBox' ).css( {
		'left': $( '.magnificationBox' ).offset( ).left + 'px',
		'top': $( '.imageBox' ).offset( ).top + 'px',
		'width': $( '.magnificationBox' ).outerWidth( ) + 'px',
		'transition': 'none'
	} );
}

$( 'body' ).scroll( repositionZoomBox );
$( window ).resize( repositionZoomBox );


function selectMiniature( ) {

	// Load the proper image file into the magnification box
	var imagefile = $( this ).attr( 'data-large' );
	backgroundImageURL = 'url(' +imagefile  + ')';
	$( 'div.imageBox, div.slidingPictureBox' ).css( 'background-image', 'url(' + imagefile + ')' );

	// Show the proper title
	var imagetitle = $( this ).attr( 'data-title' );
	$( '.image-title h3' ).text( imagetitle );


	// Jump to the proper verticl offset on the page
	$( 'html, body' ).animate( { 'scrollTop': '+=' + $( '#GOTO' ).offset( ).top + 'px' }, 1 );
}

$( '.minitureStrip img' ).click( selectMiniature );
