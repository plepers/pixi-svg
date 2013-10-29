/**
 * User: plepers
 * Date: 28/10/2013 20:05
 */


var PIXI = PIXI || {};

(function(){

  var __hasProp = {}.hasOwnProperty;



  _setupPaint = function( paint, graphics ) {

    switch( paint.paintType ) {
      case SVG_PAINTTYPE_RGBCOLOR :

        var color = paint.rgbColor;
        var r = parseInt( color.red.cssText, 10 );
        var g = parseInt( color.green.cssText, 10 );
        var b = parseInt( color.blue.cssText, 10 );
        graphics.beginFill( (r<<16)|(g<<8)|b );
        break;
      case SVG_PAINTTYPE_UNKNOWN              :
      case SVG_PAINTTYPE_RGBCOLOR_ICCCOLOR    :
      case SVG_PAINTTYPE_NONE                 :
      case SVG_PAINTTYPE_CURRENTCOLOR         :
      case SVG_PAINTTYPE_URI_NONE             :
      case SVG_PAINTTYPE_URI_CURRENTCOLOR     :
      case SVG_PAINTTYPE_URI_RGBCOLOR         :
      case SVG_PAINTTYPE_URI_RGBCOLOR_ICCCOLOR:
      case SVG_PAINTTYPE_URI:
    }

  }

  _tearDownPaint = function( paint, g ) {

    switch( paint.paintType ) {
      case SVG_PAINTTYPE_RGBCOLOR :
        g.endFill();
        break;
      case SVG_PAINTTYPE_UNKNOWN              :
      case SVG_PAINTTYPE_RGBCOLOR_ICCCOLOR    :
      case SVG_PAINTTYPE_NONE                 :
      case SVG_PAINTTYPE_CURRENTCOLOR         :
      case SVG_PAINTTYPE_URI_NONE             :
      case SVG_PAINTTYPE_URI_CURRENTCOLOR     :
      case SVG_PAINTTYPE_URI_RGBCOLOR         :
      case SVG_PAINTTYPE_URI_RGBCOLOR_ICCCOLOR:
      case SVG_PAINTTYPE_URI:
    }

  }


  Traverser = function( g ) {
    var ctx = this.context = {};
    ctx.displayStack = [];
    ctx.paintStack = [];
    ctx.graphics = g;
  }

  Traverser.prototype.enterNode = function( node ) {
    var i, l, paint;
    var ctx = this.context;



    if( node.getPresentationAttribute !== undefined ) {
      paint = node.getPresentationAttribute('fill');
      if(paint!==null){
        ctx.paintStack.push( paint );
        _setupPaint( paint, ctx.graphics );
      }
    }



    var plist = node.Points || node.animatedPoints;
    if( plist !== undefined && plist.numberOfItems>0) {

      var point = plist.getItem( 0 );

      ctx.graphics.moveTo( point.x, point.y );

      for (i = 1, l = plist.numberOfItems; i < l; i++) {
        point = plist.getItem( i );
        ctx.graphics.lineTo( point.x, point.y );
      }
    }



    if( node.children !== undefined ) {

      var children = node.children;

      for (i = 0, l = children.length; i < l; i++) {
        this.enterNode( children[i] );
      }
    }

    if( paint !== null ) {
      ctx.paintStack.pop();
      _tearDownPaint( paint, ctx.graphics );
      _setupPaint( ctx.graphics, ctx.paintStack[ctx.paintStack.length-1] );
    }


  }

  Traverser.prototype.leaveNode = function( node ) {

  }




  PIXI.Svg  = function( svgEl )
  {

    PIXI.Graphics.call( this );
    this.traverser = new Traverser( this );
    this.traverser.enterNode( svgEl );
  }

  // constructor
  PIXI.Svg.prototype = Object.create( PIXI.Graphics.prototype );
  PIXI.Svg.prototype.constructor = PIXI.Svg;





  const SVG_PAINTTYPE_UNKNOWN               = 0;
  const SVG_PAINTTYPE_RGBCOLOR              = 1;
  const SVG_PAINTTYPE_RGBCOLOR_ICCCOLOR     = 2;
  const SVG_PAINTTYPE_NONE                  = 101;
  const SVG_PAINTTYPE_CURRENTCOLOR          = 102;
  const SVG_PAINTTYPE_URI_NONE              = 103;
  const SVG_PAINTTYPE_URI_CURRENTCOLOR      = 104;
  const SVG_PAINTTYPE_URI_RGBCOLOR          = 105;
  const SVG_PAINTTYPE_URI_RGBCOLOR_ICCCOLOR = 106;
  const SVG_PAINTTYPE_URI                   = 107;

})()
