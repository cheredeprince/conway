var S = (function(){

  var sigmaCont = document.getElementById('container'),
      widthCont = sigmaCont.offsetWidth,
      heightCont = sigmaCont.offsetHeight,
      marginTabRatio = 1/6,
      tabSize = Math.min( (widthCont/18)*(1-marginTabRatio)/2 ,(heightCont/8)*(5/6)*(1-marginTabRatio)/2 ),
      defaultNodeColor = '#3E3E3E',
      defaultEdgeColor = '#3E3E3E',
      selectedEdgeColor = '#AAAAAA',
      foundColor = "green",
      createdColor = "red",
      dyingColor = "blue";


  sigma.classes.graph.addMethod('getSize', function(p){
    var prefix = p || '',
	xmax = - Infinity,
	xmin = Infinity,
	ymax = -Infinity,
	ymin = Infinity,
	nodes = this.nodesIndex,
	id;

    for(id in nodes){
      if(nodes[id][prefix+'x'] >xmax)
	xmax =  nodes[id][prefix+'x'] 
      if(nodes[id][prefix+'x'] <xmin)
	xmin =  nodes[id][prefix+'x'] 
      if(nodes[id][prefix+'y'] >ymax)
	ymax =  nodes[id][prefix+'y'] 
      if(nodes[id][prefix+'y'] <ymin)
	ymin =  nodes[id][prefix+'y'] 
    }
    return {
      xmin : xmin,
      xmax : xmax,
      ymin : ymin,
      ymax : ymax
    };
  });

  sigma.classes.graph.addMethod('rescale',function(ps,w,h){
    var prefixs = ps || [''],
	width  = w || 1,
	height = h || 1,
	g = this,
	nodes = g.nodesIndex,
	node, id,p;

    var sizes= [],s;
    

    for(p in prefixs)
      sizes[p] = g.getSize(prefixs[p]);
    
    for(s in sizes){
      var tx =  sizes[s].xmin + (sizes[s].xmax - sizes[s].xmin)/2,
	  ty =  sizes[s].ymin + (sizes[s].ymax - sizes[s].ymin)/2,
	  ratio = Math.min((1-3/18)*h/(sizes[s].ymax - sizes[s].ymin),(1-1/18)*w/(sizes[s].xmax - sizes[s].xmin));
      for(id in nodes){
	nodes[id][prefixs[s]+'x'] = (nodes[id][prefixs[s]+'x'] -tx)*ratio; 
	nodes[id][prefixs[s]+'y'] = (nodes[id][prefixs[s]+'y'] -ty)*ratio;
      }
    }	
  });

  sigma.classes.graph.addMethod('setType',function(value){
    if(value == 'cell'){
      for(var id in this.nodesIndex){
	this.nodesIndex[id].type = 'cell';
	this.nodesIndex[id].size = tabSize;
	// this.nodesIndex[id].color = 'white';
      }
    }else{
      for(var id in this.nodesIndex){
	this.nodesIndex[id].size = 10;
	this.nodesIndex[id].type = 'circle';
	// this.nodesIndex[id].color = defaultNodeColor;
      }
    }
  });

  sigma.classes.graph.addMethod('findExpr',function(expr){
    var nodes = this.nodesIndex,id;
    if(parseInt(expr[expr.length-1])>3 || parseInt(expr[expr.length -1]) == 0){
      if(expr.substring(0,expr.length -1) == "31221132221222112112322211")
	return('94');
      else if(expr.substring(0,expr.length -1) == "1311222113321132211221121332211"){
	return('93');
      }
      return(false);
    }else
      for(id in nodes){
	if(nodes[id].attributes.expr == expr)
	  return(id);
      }
    return(false);
  });



  sigma.classes.graph.addMethod('findDesint',function(id){
    var nodes = this.nodesIndex;
    if(nodes[id])
      return(nodes[id].attributes.desint);
  });

  sigma.classes.graph.addMethod('findLabel',function(id){
    var nodes = this.nodesIndex;
    if(nodes[id])
      return(nodes[id].label);
  });

  sigma.classes.graph.addMethod('setEdgesAttr',function(nodeid,attrs){
    var relativeNode, edge,attr;
    for(relativeNode in this.allNeighborsIndex[nodeid]){
      for(edge in this.allNeighborsIndex[nodeid][relativeNode]){
	for(attr in attrs)
	  this.edgesIndex[edge][attr] = attrs[attr];
	
      }
    }
  });


  sigma.classes.graph.addMethod('setNodesState',function(createdNodes){
    var id,nodeTocreate=[],c,i,e;
    for(id in this.nodesIndex){
      if(this.nodesIndex[id].state == "dying" ){
	this.nodesIndex[id].color = defaultNodeColor;
	delete this.nodesIndex[id].state;
	//on supprime la couleur des arrêtes partant des éléments mourrants
	for(c in this.outNeighborsIndex[id]){
	  for(e in this.outNeighborsIndex[id][c]){
	    if(this.edgesIndex[e].color)
	      delete this.edgesIndex[e].color;
	  }
	}
      }
      if(this.nodesIndex[id].state == "found" || this.nodesIndex[id].state == "created"){
	this.nodesIndex[id].color = dyingColor;
	this.nodesIndex[id].state = "dying";
	nodeTocreate.push(id);
      }else
	if(createdNodes.indexOf(parseInt(id)) != -1){
	  this.nodesIndex[id].color = foundColor;
	  this.nodesIndex[id].state = "found";
	}
    }
    for(i in nodeTocreate){
      for(c in this.outNeighborsIndex[nodeTocreate[i]]){
	this.nodesIndex[c].color = createdColor;
	this.nodesIndex[c].state = "created";
	for(e in this.outNeighborsIndex[nodeTocreate[i]][c]){
	  this.edgesIndex[e].color = createdColor;
	}
      }
    }
  });

  sigma.classes.graph.addMethod('initState',function(createdNodes){
    var id;
    for(id in this.nodesIndex){
      if(this.nodesIndex[id].state)
	delete this.nodesIndex[id].state;
      delete this.nodesIndex[id].color;
    }
    for(id in this.edgesIndex){
      delete this.edgesIndex[id].color;
    }
  });




  var sigmaCont = document.getElementById('container'),
      widthCont = sigmaCont.offsetWidth,
      heightCont = sigmaCont.offsetHeight,
      marginTabRatio = 1/6,
      tabSize = Math.min( (widthCont/18)*(1-marginTabRatio)/2 ,(heightCont/8)*(5/6)*(1-marginTabRatio)/2 ),
      defaultNodeColor = '#3E3E3E',
      defaultEdgeColor = '#3E3E3E',
      selectedEdgeColor = '#AAAAAA',
      graphDisplay = "table",
      timeoutOverId,
      timeoutResizeId;

  var s = new sigma({
    renderers: [
      {
	container: document.getElementById('container'),
	type: 'canvas' // sigma.renderers.canvas works as well
      }
    ]
  });

  s.settings({
    doubleClickEnabled : false,
    enableHovering     : false,
    drawLabels         : false,
    autoRescale    : false,
    autoResize     : false,
    edgeColor     : "default",
    defaultEdgeColor : defaultEdgeColor,
    defaultEdgeType: "curvedArrow",
    maxEdgeSize:   10,
    maxNodeSize    : 100,
    defaultNodeColor:  '#3E3E3E',
    nodesPowRatio : 1,
    zoomMax: 1,
    zoomMin: 0.1
  });





  sigma.parsers.json('g.json',s, function(){
    s.graph.rescale(['','graph_','tab_'],widthCont,heightCont);
    s.graph.setType('cell');
    s.refresh();
  });


  var resizeToggle = function(){
    clearTimeout(timeoutResizeId);
    timeoutResizeId = setTimeout(function(){
      widthCont = sigmaCont.offsetWidth;
      heightCont = sigmaCont.offsetHeight;
      tabSize = Math.min( (widthCont/18)*(1-marginTabRatio)/2 ,(heightCont/8)*(5/6)*(1-marginTabRatio)/2 );
      s.graph.rescale(['','graph_','tab_'],widthCont,heightCont);
      if(graphDisplay == 'table'){
	s.graph.setType('cell');
      }
      s.refresh();
    },50);
  };

  window.addEventListener('resize',function(){
    resizeToggle();
  });

  var overToggle = function(node){
    clearTimeout(timeoutOverId);
    timeoutOverId = setTimeout(function(){
      s.refresh();
    },200);
  };

  s.bind("overNode",function(event){
    if(graphDisplay == "graph" && event.data.node.type == "circle"){
      event.data.node.type = "cell";
      event.data.node.size = tabSize;
      s.graph.setEdgesAttr(event.data.node.id,{
	size : 2
      });
      overToggle();
    }
  });


  s.bind("outNode",function(event){
    if(graphDisplay == "graph" && event.data.node.type == "cell"){

      event.data.node.type = "circle";
      event.data.node.size = 10;
      s.graph.setEdgesAttr(event.data.node.id,{
	size: 1
      });
      overToggle();
    }
  });


  document.getElementById('but').onclick =  function(){
    if(graphDisplay == "table"){
      s.graph.setType('circle');
      var prefix = 'graph_';
      sigma.plugins.animate(
	s,
	{
	  x: prefix + 'x',
	  y: prefix + 'y'
	},
	{
	  onComplete : function(){
	    graphDisplay = "graph";
	  },
	  duration : 1000
	}
      );
    }else{
      sigma.plugins.animate(
	s,
	{
	  x:  'tab_x',
	  y:  'tab_y'
	},
	{
	  onComplete : function(){
	    s.graph.setType('cell');
	    graphDisplay = "table";
	    s.refresh();
	  },
	  duration : 1000
	}
      );
      
    }
  };
  return s;

})();


(function(S){

  var listNumber = ['0','1','2','3','4','5','6','7','8','9'],
      alphabet = ['a','b','c','d','e','f','g','h','i','j'],
      findingTerms = [],
      lastfindingTerms = [],
      mixinPhase = false,
      naturelPhase = false,
      term = ['1'],
      day = 0,
      evalTime = 0, // temps d'évaluation de la dernière execution
      firstTooLong = true, // le temps n'a pas encore été trop long
      whenStop = function(){},
      isRunning = false,
      isPaused  = false,
      isWaiting = false,
      lastNumberOfTerm = 1,
      exoticSeq = document.getElementById('exotic-seq'),
      mixinSeq = document.getElementById('mixin-seq'),
      naturelSeq = document.getElementById('naturel-seq'),
      startForm = document.getElementById('start'),
      pauseBut  = document.getElementById('pause'),
      seed = document.getElementById('seed'),
      warmMessage = document.getElementById('warm');


  startForm.addEventListener('submit',function(e){
    e.preventDefault();
    if(!isWaiting)
      init(seed.value);
  },false);

  pauseBut.addEventListener('click', function(e){
    togglePause();
  },false);

  var initSeed = function(v){
    seed.value = v;
  }

  var init = function(t){
    term = [String(t)] || ['1'];	
    if( ! isNaN(parseInt(t)) ){
      if(isRunning){
	findingTerms = [];
	mixinPhase = false;
	naturelPhase = false;
	day = 1;
	S.graph.initState();
	firstTooLong = true;
	evalTime =0;
	isWaiting = true;
	whenStop = function(){
	  isWaiting = false;
	  initDisplay();
	  isRunning = true;
	  togglePause(false);
	  run();
	};
	isRunning = false; 
      }else{
	isRunning = true;
	togglePause(false);
	run();
      }
      return true;
    }else
      return false;
  };

  var run = function(){
    if(evalTime > 700 && firstTooLong){
      togglePause(true,true);
      firstTooLong = false;
      
    }
    //    isRunning = true;
    var finished = false,
	timeout = false,
	startTime = new Date().getTime();
    
    findingTerms = [];
    lastNumberOfTerm = term.length;
    term = conway(term,function(){
      evalTime =  new Date().getTime() -startTime;
      var next= function(){
	if(isRunning){
	  setTimeout(function(){
	    if(!isPaused && isRunning)
	      run();
	    else{ 
	      if(isRunning)
		//on attend une demi seconde pour voir si on est toujours en pause
		setTimeout(next,500);
	      else // on a arrêté pendant l'attente
		return whenStop();
	    }
	  },(evalTime >1000)?0:1000-evalTime); //  on attend au moins une seconde
	}else{ // on a arrête pendant l'exécution
	  return whenStop();
	}
      };
      next();
    });
    day ++;
    if(findingTerms.length != 0 && !mixinPhase)
      mixinPhase = true;
    displayTerm(term);
    S.graph.setNodesState(findingTerms);
    S.refresh();
  };

  var conwayRec = function(n,k){
    var i,t=[String(n)];
    for(i=0; i<k ;i++)
      t = conway(t);
    return t;
  };

  var initDisplay = function(){
    exoticSeq.innerHTML = '';
    mixinSeq.innerHTML = '';
    naturelSeq.innerHTML = '';
  };

  var displayTerm = function(terme){
    var r ="",i,t;
    for(i in terme){
      t= terme[i];
      if(typeof t == "string"){
	r += t+" ";
      }else if(typeof t == "number"){
	
	r += S.graph.findLabel(String(t))+" ";
      }
    }
    var li = document.createElement('li'),
	terms = document.createElement('p');
    
    terms.innerHTML = r;
    li.value = day;

    if(naturelPhase){
      var p = document.createElement('p'),
	  num = document.createElement('span'),
	  coef = document.createElement('span');

      num.innerHTML = terme.length +' éléments';
      coef.innerHTML = ' (x'+ Math.round(1000*terme.length/lastNumberOfTerm)/1000 + ')';
      coef.title = "combien de fois ce terme contient plus d'éléments que le terme précédents";
      p.appendChild(num);
      p.appendChild(coef);

      li.appendChild(p);

      naturelSeq.insertBefore(li,naturelSeq.firstChild);
    }else if(mixinPhase){
      mixinSeq.insertBefore(li,mixinSeq.firstChild);
    }else
      exoticSeq.insertBefore(li,exoticSeq.firstChild);

    li.appendChild(terms);
    
  }
  
  var togglePause = function(value,dispWarm){

    if(typeof value != 'undefined')
      isPaused = value;
    else
      isPaused = !isPaused;
    
    if(isRunning){
      pauseBut.disabled = false;
      if(isPaused)
	pauseBut.value = 'Reprendre';
      else
	pauseBut.value = 'Pause';
    }else
      pauseBut.disabled = true;

    //affichage message warm
    if(dispWarm)
      warmMessage.innerHTML = "Pause ! La génération du terme suivant va prendre du temps. Pour continuer, appuyer sur reprendre.";
    else
      warmMessage.innerHTML = "";
  }

  var conway = function(terme,cb){
    var t, i,newTerme = [];

    for(i in terme){
      t= terme[i];
      if(typeof t == "string"){
	haveString = true;
	newTerme = newTerme.concat(cutTerme(conwayOne(t)));
      }else if(typeof t == "number"){
	newTerme = newTerme.concat(S.graph.findDesint(String(t)));
      }
    }
    
    findElt(newTerme);
    if(cb)
      cb();
    return newTerme;
  };

  var findElt = function(terme){
    var i,id, allNaturel = true;
    for(i in terme){
      if(typeof terme[i] == "string"){
	id = S.graph.findExpr(terme[i]);
	if(id){
	  terme[i] = parseInt(id);
	  findingTerms.push(parseInt(id));
	}else
	  allNaturel = false;
      }
    }
    
    if(!naturelPhase && allNaturel){
      naturelPhase = true;
    }

    return(terme);
  }

  var cutTerme = function(string){
    var text = string;
    text=text.replace("212 ","2 12 ");
    text=text.replace("2121","2 121");
    text=text.replace("2123","2 123");
    text=text.replace("213 ","2 13 ");
    text=text.replace("2131","2 131");
    text=text.replace("2132","2 132");
    text=text.replace("21112","2 1112");
    text=text.replace("21113","2 1113");
    text=text.replace("2312","2 312");
    text=text.replace("23112","2 3112");
    text=text.replace("2313","2 313");
    text=text.replace("23113","2 3113");
    text=text.replace("2321","2 321");
    text=text.replace("23221","2 3221");
    text=text.replace("2323","2 323");
    text=text.replace("23223","2 3223");
    text=text.replace("122 ","1 22 ");
    text=text.replace("322 ","3 22 ");
    text=text.replace("122121","1 22 121");
    text=text.replace("122123","1 22 123");
    text=text.replace("122131","1 22 131");
    text=text.replace("122132","1 22 132");
    text=text.replace("322121","3 22 121");
    text=text.replace("322123","3 22 123");
    text=text.replace("322131","3 22 131");
    text=text.replace("322132","3 22 132");
    text=text.replace("1221112","1 22 1112");
    text=text.replace("1221113","1 22 1113");
    text=text.replace("3221112","3 22 1112");
    text=text.replace("3221113","3 22 1113");
    text=text.replace(/1(0|[4-9])1/,'1$1 1');
    text=text.replace(/1(0|[4-9])2/,"1$1 2");
    text=text.replace(/1(0|[4-9])3/,"1$1 3");
    text=text.replace(/2(0|[4-9])1/,"2$1 1");
    text=text.replace(/2(0|[4-9])2/,"2$1 2");
    text=text.replace(/2(0|[4-9])3/,"2$1 3");
    text=text.replace(/3(0|[4-9])1/,"3$1 1");
    text=text.replace(/3(0|[4-9])2/,"3$1 2");
    text=text.replace(/3(0|[4-9])3/,"3$1 3");
    return text.split(' ');
  };
  
  var conwayOne = function(n){
    var s = String(n),
	l = s[0],
	i = 1,
	k = 0,
	r = '';
    while(k+1<s.length){
      k++;
      if(l == s[k])
	i++;
      else{
	r+= i +l;
	i=1;
	l= s[k];
      }
    }
    r+= i+l;
    return(r);
  };

  var conwayNext = function(n){
    var s= String(n);
    var l = listNumber,
	i;
    //on regarde et on compte les chiffres et on code le résultat dans l'alphabet
    for(i=0; i<l.length;i++){
      
      var re1 = new RegExp(l[i]+l[i]+l[i],'g'),
	  re2 = new RegExp(l[i]+l[i],'g'),
	  re3 = new RegExp(l[i],'g');
      
      s = s.replace(re1 ,'d'+alphabet[parseInt(l[i])])
	.replace(re2  ,'c'+alphabet[parseInt(l[i])])
	.replace(re3  ,'b'+alphabet[parseInt(l[i])])
    }
    // on plus que des lettres et on les replace par des chiffres
    for(i=0; i<l.length;i++){
      var re = new RegExp(alphabet[parseInt(l[i])],'g');
      s = s.replace(re,l[i]);
    }
    return(s);
  };
})(S);
