/**
 * User: plepers
 * Date: 28/10/2013 20:05
 */



(function( global){

  var __hasProp = {}.hasOwnProperty;


  var PIXI = global.PIXI || {};


  _setupPaint = function( pattr, graphics ) {

    var opacity = pattr[OPACITY];
    var alpha;

    if( opacity !== null )
      alpha = parseFloat( opacity.cssText );
    else alpha = 1.0;

    var paint = pattr[FILL];

    if( paint ) {

      switch( paint.paintType ) {
        case SVG_PAINTTYPE_RGBCOLOR :

          var color = paint.rgbColor;
          var r = parseInt( color.red.cssText, 10 );
          var g = parseInt( color.green.cssText, 10 );
          var b = parseInt( color.blue.cssText, 10 );
          graphics.beginFill( (r<<16)|(g<<8)|b , alpha );
          break;

      }

    }
  }

  _tearDownPaint = function( pattr, g ) {

    var paint = pattr[FILL];

    if( paint ) {

      switch( paint.paintType ) {
        case SVG_PAINTTYPE_RGBCOLOR :
          g.endFill();
          break;
      }
    }

  }


  Stack = function() {
    var s = this._stack = {};

    for(var i=0; i<NPROPS;i++)
       s[PPROPS[i]] = [];

  }

  Stack.prototype.pushNode = function(node){
    var val, p, s = this._stack;
    for(var i=0; i<NPROPS;i++){
      p = PPROPS[i];
      val = node.getPresentationAttribute(p);
      if( val )
        s[p].push(val);
    }
  }

  Stack.prototype.popNode = function(node){
    var val, p, s = this._stack;
    for(var i=0; i<NPROPS;i++){
      p = PPROPS[i];
      val = node.getPresentationAttribute(p);
      if( val )
        s[p].pop();
    }
  }

  Stack.prototype.getAttributes = function(){
    var p, l, att = {}, s = this._stack;
    for(var i=0; i<NPROPS;i++){
      p = PPROPS[i];
      l = s[p].length
      if( l > 0 )
        att[p] = s[p][l-1];
      else
        att[p]=null;
    }

    return att;
  }







  Traverser = function( g ) {
    var ctx = this.context = {};

    ctx.stack = new Stack();

    ctx.displayStack = [];
    ctx.fillStack = [];
    ctx.alphaStack = [];
    ctx.graphics = g;
  }

  Traverser.prototype.enterNode = function( node ) {
    var i, l, paint;
    var ctx = this.context;

    var hasPAttributes = (node.getPresentationAttribute !== undefined);

    if( hasPAttributes )
      ctx.stack.pushNode( node );




    var plist = node.Points || node.animatedPoints;
    if( plist !== undefined && plist.numberOfItems>0) {

      var pAttr = ctx.stack.getAttributes();

      _setupPaint( pAttr, ctx.graphics );

      var point = plist.getItem( 0 );

      ctx.graphics.moveTo( point.x, point.y );

      for (i = 1, l = plist.numberOfItems; i < l; i++) {
        point = plist.getItem( i );
        ctx.graphics.lineTo( point.x, point.y );
      }

      _tearDownPaint( pAttr, ctx.graphics );
    }



    if( node.children !== undefined ) {

      var children = node.children;

      for (i = 0, l = children.length; i < l; i++) {
        this.enterNode( children[i] );
      }
    }


    if( hasPAttributes )
      ctx.stack.popNode( node );



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


  const FILL    = "fill";
  const OPACITY = "opacity";

  const PPROPS = [
    FILL,
    OPACITY
  ];

  const NPROPS = PPROPS.length;


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



  global.PIXI = PIXI
})(this)
