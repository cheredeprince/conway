;(function() {
  'use strict';

  /**
   * The default node renderer. It renders the node as a simple disc.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.nodes.cell = function(node, context, settings) {
    var prefix = settings('prefix') || '';
      
    var rx = 2*node[prefix + 'size'],
	ry = 12/5*node[prefix + 'size'],
	x0 = node[prefix + 'x'] - rx/2,
	y0 = node[prefix + 'y'] - ry/2;

      var t1 = node.attributes.num,
	  t1x = x0 + rx*(1/5),
	  t1y = y0 + ry *(1/4-1/12);

      var t2 = node.label,
	  t2x = x0 + rx*(1-1/5),
	  t2y = y0 + ry *(1/4-1/12);

    context.strokeStyle = "white";
      context.fillStyle =  node.color || settings('defaultNodeColor');
    context.beginPath();
    context.rect(
      x0,
      y0,
      rx,
      ry
    );
      if(node.state)
	  context.fill();
    context.stroke();

    context.closePath();
    context.beginPath();

      context.font = (ry/(6*8))+'ex '+'monospace';
      context.textAlign="center"; 
      context.fillStyle = "white";
      context.fillText(t1,t1x,t1y);

    context.closePath();
    context.beginPath();

      context.font = (ry/(6*8))+'ex '+'monospace';
      context.textAlign="center"; 
      context.fillStyle = "white";
      context.fillText(t2,t2x,t2y);

    context.closePath();
    context.beginPath();

      var expr = node.attributes.expr,
	  lignes = [],
	  ligne,k=0,
	  charByligne = 8;
      while(k< expr.length/charByligne){
	  lignes[k] = expr.substring(k*charByligne,charByligne*(k+1));
	  k++;
      }

      var fontSize = (ry/(6*2* Math.max((0.5+(lignes[0].length -1)*(3.5/7)),0.75) ))+'ex ',i,
	  tx = x0 + rx/2,
	  ty,
	  hx = rx /(lignes.length +1);

      context.font = fontSize +'monospace';
      context.textAlign="center";
      context.fillStyle = "white";

      for(i=0; i<lignes.length;i++){
	  ty = (1/2 + 1 + i)* hx + y0 + (ry - rx);
	  context.fillText(lignes[i],tx,ty);
      }
      context.closePath();
  };
})();
