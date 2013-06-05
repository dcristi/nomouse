/**
 * jQuery noMouse
 *
 * Adds support for touch events into jQuery core.
 * Provides mouse-to-touch mapping.
 * 
 * @author Cristian Dobre
 * @url http://blog.nighttime.ro/?p=164
 * @year 2013
 */

( function( $, d ){

	var e = $.event, id = 'sm-touchevents', $body, $elm, support = false, touchProp = 'clientX clientY pageX pageY screenX screenY target'.split( ' ' );
	
	/**
	 * Detect touch events support
	 * @Modernizr touchevents.js
	 */
	$( d ).ready( function(){
		
		$body = $( 'body' ).prepend( $elm = $( d.createElement( "div" ) ).attr( "id", id ) );
		
		$.support.touchevents = support = ( function( prefixes, testCSS ) {
			
			var result = false, query;
			
			if( ( 'ontouchstart' in window ) || window.DocumentTouch && d instanceof DocumentTouch ) result = true;
			else {
				query = ['@media (', prefixes.join( 'touch-enabled),(' ), 'heartz', ')', '{#' + id + '{top:9px;position:absolute}}' ].join( '' );
				testCSS( query, function( node ) { result = node.offsetTop === 9 });
			}
			
			return result;
			
		})( ' -webkit- -moz- -o- -ms- '.split( ' ' ), function( css, fn ){ 
			
			$elm.prepend( '<style>' + css + '</style>' );
			fn( d.getElementById( id ) );

		});
		
	});
	
	
	
	function Touch( mouseEvent ){
		
		this.identifier = 0;
		for( var i = 0 ; i < touchProp.length; i++ ) this[ touchProp[ i ] ] = mouseEvent[ touchProp[ i ] ];
	
	}
	
	/**
	 * Use jQuery special events
	 */
	$.each({
	
		mousedown : 'touchstart',
		mousemove : 'touchmove',
		mouseup : 'touchend'
	
	}, function( orig, type ){
		
		function touchClick( e ){ 
			$.event.trigger( type, e, e.target );
			return false;
		}
		
		/**
		 * Add handlers into special categories
		 */
		e.special[ type ] = {
			
			add : function( handleObj ){
				
				var handler = handleObj.handler;

				handleObj.handler = function( e ){
					
					if( support ) arguments[ 0 ] = e.originalEvent;
					
					return handler.apply( this, arguments );
				
				};
		
			},
			
			/**
			 * This is where the magic happens
			 */
			trigger : function( simulated, original ){
				
				simulated.originalEvent = original.originalEvent;
				simulated.changedTouches = [ new Touch( original ) ];
				
			},
			
			setup : function(){ 
				
				if( ! support ) $( this ).on( orig, touchClick );				
				return ! support;
				
			},
			
			teardown : function(){ 
				
				if( ! support ) $( this ).off( orig, touchClick );				
				return ! support 
				
			}
		
		}
	
	});

})( jQuery, document );