;(function() {
  'use strict';

  /**
   * The default node renderer. It renders the node as a simple disc.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.nodes.circle = function(node, context, settings) {
    var prefix = settings('prefix') || '';
      
    var r = node[prefix + 'size'],
	x0 = node[prefix + 'x'],
	y0 = node[prefix + 'y'];

      var t = node.label,
	  tx = x0 ,
	  ty = y0 +r/2;

      context.fillStyle = node.color || settings('defaultNodeColor');
      context.beginPath();
      context.arc(
	  x0,
	  y0,
	  r,
	  0,
	  2*Math.PI,
	  false
      );
      context.fill();
      context.closePath();

      context.beginPath();
      
      context.font = 'bold '+r/6 +'ex '+'monospace';
      context.textAlign="center"; 
      context.fillStyle = "white";
      context.fillText(t,tx,ty);
      
      context.closePath();
  };
})();
