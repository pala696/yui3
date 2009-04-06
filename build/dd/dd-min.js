YUI.add("dd-ddm-base",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};A.NAME="dragDropMgr";A.ATTRS={dragCursor:{value:"move"},clickPixelThresh:{value:3},clickTimeThresh:{value:1000},dragMode:{value:"point",setter:function(C){this._setDragMode(C);return C;}}};B.extend(A,B.Base,{_setDragMode:function(C){if(C===null){C=B.DD.DDM.get("dragMode");}switch(C){case 1:case"intersect":return 1;case 2:case"strict":return 2;case 0:case"point":return 0;}return 0;},CSS_PREFIX:"yui-dd",_activateTargets:function(){},_drags:[],activeDrag:false,_regDrag:function(C){this._drags[this._drags.length]=C;},_unregDrag:function(D){var C=[];B.each(this._drags,function(F,E){if(F!==D){C[C.length]=F;}});this._drags=C;},initializer:function(){B.Node.get("document").on("mousemove",this._move,this,true);B.Node.get("document").on("mouseup",this._end,this,true);},_start:function(C,F,D,E){this._startDrag.apply(this,arguments);},_startDrag:function(){},_endDrag:function(){},_dropMove:function(){},_end:function(){if(this.activeDrag){this._endDrag();this.activeDrag.end.call(this.activeDrag);this.activeDrag=null;}},stopDrag:function(){if(this.activeDrag){this._end();}return this;},_move:function(C){if(this.activeDrag){this.activeDrag._move.apply(this.activeDrag,arguments);this._dropMove();}},setXY:function(E,F){var D=parseInt(E.getStyle("top"),10),C=parseInt(E.getStyle("left"),10),G=E.getStyle("position");if(G==="static"){E.setStyle("position","relative");}if(isNaN(D)){D=0;}if(isNaN(C)){C=0;}E.setStyle("top",(F[1]+D)+"px");E.setStyle("left",(F[0]+C)+"px");},cssSizestoObject:function(D){var C=D.split(" ");switch(C.length){case 1:C[1]=C[2]=C[3]=C[0];break;case 2:C[2]=C[0];C[3]=C[1];break;case 3:C[3]=C[1];break;}return{top:parseInt(C[0],10),right:parseInt(C[1],10),bottom:parseInt(C[2],10),left:parseInt(C[3],10)};},getDrag:function(D){var C=false,E=B.Node.get(D);if(E instanceof B.Node){B.each(this._drags,function(G,F){if(E.compareTo(G.get("node"))){C=G;}});}return C;}});B.namespace("DD");B.DD.DDM=new A();},"@VERSION@",{requires:["node","base"],skinnable:false});YUI.add("dd-ddm",function(A){A.mix(A.DD.DDM,{_pg:null,_debugShim:false,_activateTargets:function(){},_deactivateTargets:function(){},_startDrag:function(){if(this.activeDrag.get("useShim")){this._pg_activate();this._activateTargets();}},_endDrag:function(){this._pg_deactivate();this._deactivateTargets();},_pg_deactivate:function(){this._pg.setStyle("display","none");},_pg_activate:function(){var B=this.activeDrag.get("activeHandle"),C=B.getStyle("cursor");if(C=="auto"){C=this.get("dragCursor");}this._pg_size();this._pg.setStyles({top:0,left:0,display:"block",opacity:((this._debugShim)?".5":"0"),cursor:C});},_pg_size:function(){if(this.activeDrag){var B=A.Node.get("body"),D=B.get("docHeight"),C=B.get("docWidth");this._pg.setStyles({height:D+"px",width:C+"px"});}},_createPG:function(){var C=A.Node.create("<div></div>"),B=A.Node.get("body");C.setStyles({top:"0",left:"0",position:"absolute",zIndex:"9999",overflow:"hidden",backgroundColor:"red",display:"none",height:"5px",width:"5px"});if(B.get("firstChild")){B.insertBefore(C,B.get("firstChild"));}else{B.appendChild(C);}this._pg=C;this._pg.on("mouseup",this._end,this,true);this._pg.on("mousemove",this._move,this,true);A.on("resize",this._pg_size,window,this,true);A.on("scroll",this._pg_size,window,this,true);}},true);A.DD.DDM._createPG();},"@VERSION@",{requires:["dd-ddm-base"],skinnable:false});YUI.add("dd-ddm-drop",function(A){A.mix(A.DD.DDM,{_noShim:false,_activeShims:[],_hasActiveShim:function(){if(this._noShim){return true;}return this._activeShims.length;},_addActiveShim:function(B){this._activeShims[this._activeShims.length]=B;},_removeActiveShim:function(C){var B=[];A.each(this._activeShims,function(E,D){if(E._yuid!==C._yuid){B[B.length]=E;}});this._activeShims=B;},syncActiveShims:function(B){A.later(0,this,function(C){var D=((C)?this.targets:this._lookup());A.each(D,function(F,E){F.sizeShim.call(F);},this);},B);},mode:0,POINT:0,INTERSECT:1,STRICT:2,useHash:true,activeDrop:null,validDrops:[],otherDrops:{},targets:[],_addValid:function(B){this.validDrops[this.validDrops.length]=B;return this;},_removeValid:function(B){var C=[];A.each(this.validDrops,function(E,D){if(E!==B){C[C.length]=E;}});this.validDrops=C;return this;},isOverTarget:function(B){if(this.activeDrag&&B){var C=this.activeDrag.mouseXY;if(C){if(this.activeDrag.get("dragMode")==this.STRICT){return this.activeDrag.get("dragNode").inRegion(B.region,true,this.activeDrag.region);}else{if(B&&B.shim){return B.shim.intersect({top:C[1],bottom:C[1],left:C[0],right:C[0]},B.region).inRegion;}else{return false;}}}else{return false;}}else{return false;}},clearCache:function(){this.validDrops=[];this.otherDrops={};this._activeShims=[];},_activateTargets:function(){this.clearCache();A.each(this.targets,function(C,B){C._activateShim.apply(C,[]);},this);this._handleTargetOver();},getBestMatch:function(F,D){var C=null,E=0,B;A.each(F,function(I,H){var G=this.activeDrag.get("dragNode").intersect(I.get("node"));I.region.area=G.area;if(G.inRegion){if(G.area>E){E=G.area;C=I;}}},this);if(D){B=[];A.each(F,function(H,G){if(H!==C){B[B.length]=H;}},this);return[C,B];}else{return C;}},_deactivateTargets:function(){var B=[],C,E=this.activeDrag,D=this.activeDrop;if(E&&D&&this.otherDrops[D]){if(!E.get("dragMode")){B=this.otherDrops;delete B[D];}else{C=this.getBestMatch(this.otherDrops,true);D=C[0];B=C[1];}E.get("node").removeClass(this.CSS_PREFIX+"-drag-over");if(D){D.fire("drop:hit",{drag:E,drop:D,others:B});E.fire("drag:drophit",{drag:E,drop:D,others:B});}}else{if(E){E.get("node").removeClass(this.CSS_PREFIX+"-drag-over");E.fire("drag:dropmiss",{pageX:E.lastXY[0],pageY:E.lastXY[1]});}else{}}this.activeDrop=null;A.each(this.targets,function(G,F){G._deactivateShim.apply(G,[]);},this);},_dropMove:function(){if(this._hasActiveShim()){this._handleTargetOver();}else{A.each(this.otherDrops,function(C,B){C._handleOut.apply(C,[]);});}},_lookup:function(){if(!this.useHash){return this.validDrops;
}var B=[];A.each(this.validDrops,function(D,C){if(D.shim&&D.shim.inViewportRegion(false,D.region)){B[B.length]=D;}});return B;},_handleTargetOver:function(){var B=this._lookup();A.each(B,function(D,C){D._handleTargetOver.call(D);},this);},_regTarget:function(B){this.targets[this.targets.length]=B;},_unregTarget:function(C){var B=[],D;A.each(this.targets,function(F,E){if(F!=C){B[B.length]=F;}},this);this.targets=B;D=[];A.each(this.validDrops,function(F,E){if(F!==C){D[D.length]=F;}});this.validDrops=D;},getDrop:function(C){var B=false,D=A.Node.get(C);if(D instanceof A.Node){A.each(this.targets,function(F,E){if(D.compareTo(F.get("node"))){B=F;}});}return B;}},true);},"@VERSION@",{requires:["dd-ddm"],skinnable:false});YUI.add("dd-drag",function(D){var E=D.DD.DDM,T="node",G="dragging",N="dragNode",C="offsetHeight",K="offsetWidth",R="mouseup",P="mousedown",M="dragstart",H="drag:mouseDown",B="drag:afterMouseDown",F="drag:removeHandle",L="drag:addHandle",Q="drag:removeInvalid",S="drag:addInvalid",J="drag:start",I="drag:end",O="drag:drag",A=function(){A.superclass.constructor.apply(this,arguments);E._regDrag(this);};A.NAME="drag";A.ATTRS={node:{setter:function(U){var V=D.get(U);if(!V){D.fail("DD.Drag: Invalid Node Given: "+U);}else{V=V.item(0);}return V;}},dragNode:{setter:function(U){var V=D.Node.get(U);if(!V){D.fail("DD.Drag: Invalid dragNode Given: "+U);}return V;}},offsetNode:{value:true},clickPixelThresh:{value:E.get("clickPixelThresh")},clickTimeThresh:{value:E.get("clickTimeThresh")},lock:{value:false,setter:function(U){if(U){this.get(T).addClass(E.CSS_PREFIX+"-locked");}else{this.get(T).removeClass(E.CSS_PREFIX+"-locked");}return U;}},data:{value:false},move:{value:true},useShim:{value:true},activeHandle:{value:false},primaryButtonOnly:{value:true},dragging:{value:false},parent:{value:false},target:{value:false,setter:function(U){D.later(0,this,function(V){this._handleTarget(V);},U);return U;}},dragMode:{value:null,setter:function(U){return E._setDragMode(U);}},groups:{value:["default"],getter:function(){if(!this._groups){this._groups={};}var U=[];D.each(this._groups,function(W,V){U[U.length]=V;});return U;},setter:function(U){this._groups={};D.each(U,function(W,V){this._groups[W]=true;},this);return U;}},handles:{value:null,setter:function(U){if(U){this._handles={};D.each(U,function(W,V){this._handles[W]=true;},this);}else{this._handles=null;}return U;}},bubbles:{writeOnce:true,value:D.DD.DDM}};D.extend(A,D.Base,{addToGroup:function(U){this._groups[U]=true;E._activateTargets();return this;},removeFromGroup:function(U){delete this._groups[U];E._activateTargets();return this;},target:null,_handleTarget:function(U){if(D.DD.Drop){if(U===false){if(this.target){E._unregTarget(this.target);this.target=null;}return false;}else{if(!D.Lang.isObject(U)){U={};}U.bubbles=this.get("bubbles");U.node=this.get(T);this.target=new D.DD.Drop(U);}}else{return false;}},_groups:null,_createEvents:function(){this.publish(H,{defaultFn:this._handleMouseDown,queuable:false,emitFacade:true,bubbles:true});var U=[B,F,L,Q,S,J,I,O,"drag:drophit","drag:dropmiss","drag:over","drag:enter","drag:exit"];D.each(U,function(W,V){this.publish(W,{type:W,emitFacade:true,bubbles:true,preventable:false,queuable:false});},this);if(this.get("bubbles")){this.addTarget(this.get("bubbles"));}},_ev_md:null,_startTime:null,_endTime:null,_handles:null,_invalids:null,_invalidsDefault:{"textarea":true,"input":true,"a":true,"button":true},_dragThreshMet:null,_fromTimeout:null,_clickTimeout:null,deltaXY:null,startXY:null,nodeXY:null,lastXY:null,realXY:null,mouseXY:null,region:null,_handleMouseUp:function(U){this._fixIEMouseUp();if(E.activeDrag){E._end();}},_fixDragStart:function(U){U.preventDefault();},_ieSelectFix:function(){return false;},_ieSelectBack:null,_fixIEMouseDown:function(){if(D.UA.ie){this._ieSelectBack=D.config.doc.body.onselectstart;D.config.doc.body.onselectstart=this._ieSelectFix;}},_fixIEMouseUp:function(){if(D.UA.ie){D.config.doc.body.onselectstart=this._ieSelectBack;}},_handleMouseDownEvent:function(U){this.fire(H,{ev:U});},_handleMouseDown:function(V){var U=V.ev;this._dragThreshMet=false;this._ev_md=U;if(this.get("primaryButtonOnly")&&U.button>1){return false;}if(this.validClick(U)){this._fixIEMouseDown();U.halt();this._setStartPosition([U.pageX,U.pageY]);E.activeDrag=this;this._clickTimeout=D.later(this.get("clickTimeThresh"),this,this._timeoutCheck);}this.fire(B,{ev:U});},validClick:function(Y){var X=false,U=Y.target,W=null,V=null,Z=false;if(this._handles){D.each(this._handles,function(a,b){if(D.Lang.isString(b)){if(U.test(b+", "+b+" *")&&!W){W=b;X=true;}}});}else{if(this.get(T).contains(U)||this.get(T).compareTo(U)){X=true;}}if(X){if(this._invalids){D.each(this._invalids,function(a,b){if(D.Lang.isString(b)){if(U.test(b+", "+b+" *")){X=false;}}});}}if(X){if(W){V=Y.currentTarget.queryAll(W);Z=false;V.each(function(b,a){if((b.contains(U)||b.compareTo(U))&&!Z){Z=true;this.set("activeHandle",b);}},this);}else{this.set("activeHandle",this.get(T));}}return X;},_setStartPosition:function(U){this.startXY=U;this.nodeXY=this.get(T).getXY();this.lastXY=this.nodeXY;this.realXY=this.nodeXY;if(this.get("offsetNode")){this.deltaXY=[(this.startXY[0]-this.nodeXY[0]),(this.startXY[1]-this.nodeXY[1])];}else{this.deltaXY=[0,0];}},_timeoutCheck:function(){if(!this.get("lock")){this._fromTimeout=true;this._dragThreshMet=true;this.start();this._alignNode([this._ev_md.pageX,this._ev_md.pageY],true);}},removeHandle:function(U){if(this._handles[U]){delete this._handles[U];this.fire(F,{handle:U});}return this;},addHandle:function(U){if(!this._handles){this._handles={};}if(D.Lang.isString(U)){this._handles[U]=true;this.fire(L,{handle:U});}return this;},removeInvalid:function(U){if(this._invalids[U]){this._invalids[U]=null;delete this._invalids[U];this.fire(Q,{handle:U});}return this;},addInvalid:function(U){if(D.Lang.isString(U)){this._invalids[U]=true;this.fire(S,{handle:U});}return this;},initializer:function(){this.get(T).dd=this;if(!this.get(T).get("id")){var U=D.stamp(this.get(T));
this.get(T).set("id",U);}this._invalids=D.clone(this._invalidsDefault,true);D.later(100,this,this._createEvents);if(!this.get(N)){this.set(N,this.get(T));}this._prep();this._dragThreshMet=false;},_prep:function(){var U=this.get(T);U.addClass(E.CSS_PREFIX+"-draggable");U.on(P,this._handleMouseDownEvent,this,true);U.on(R,this._handleMouseUp,this,true);U.on(M,this._fixDragStart,this,true);},_unprep:function(){var U=this.get(T);U.removeClass(E.CSS_PREFIX+"-draggable");U.detach(P,this._handleMouseDownEvent,this,true);U.detach(R,this._handleMouseUp,this,true);U.detach(M,this._fixDragStart,this,true);},start:function(){if(!this.get("lock")&&!this.get(G)){E._start(this.deltaXY,[this.get(T).get(C),this.get(T).get(K)]);this.get(T).addClass(E.CSS_PREFIX+"-dragging");this.fire(J,{pageX:this.nodeXY[0],pageY:this.nodeXY[1]});this.get(N).on(R,this._handleMouseUp,this,true);var U=this.nodeXY;this._startTime=(new Date()).getTime();this.region={"0":U[0],"1":U[1],area:0,top:U[1],right:U[0]+this.get(T).get(K),bottom:U[1]+this.get(T).get(C),left:U[0]};this.set(G,true);}return this;},end:function(){this._endTime=(new Date()).getTime();if(this._clickTimeout){this._clickTimeout.cancel();}this._dragThreshMet=false;this._fromTimeout=false;if(!this.get("lock")&&this.get(G)){this.fire(I,{pageX:this.lastXY[0],pageY:this.lastXY[1],startTime:this._startTime,endTime:this._endTime});}this.get(T).removeClass(E.CSS_PREFIX+"-dragging");this.set(G,false);this.deltaXY=[0,0];this.get(N).detach(R,this._handleMouseUp,this,true);return this;},_align:function(U){return[U[0]-this.deltaXY[0],U[1]-this.deltaXY[1]];},_alignNode:function(U,W){var V=this._align(U);this._moveNode(V,W);},_moveNode:function(X,Y){if(!this.get(G)){Y=true;}var U=[],V=[],W=null;U[0]=(X[0]-this.lastXY[0]);U[1]=(X[1]-this.lastXY[1]);V[0]=(X[0]-this.nodeXY[0]);V[1]=(X[1]-this.nodeXY[1]);if(this.get("move")){if(D.UA.opera){this.get(N).setXY(X);}else{E.setXY(this.get(N),U);}this.realXY=X;}this.region={"0":X[0],"1":X[1],area:0,top:X[1],right:X[0]+this.get(N).get(K),bottom:X[1]+this.get(N).get(C),left:X[0]};W=this.nodeXY;if(!Y){this.fire(O,{pageX:X[0],pageY:X[1],info:{start:W,xy:X,delta:U,offset:V}});}this.lastXY=X;},_move:function(W){if(this.get("lock")){return false;}else{this.mouseXY=[W.pageX,W.pageY];if(!this._dragThreshMet){var V=Math.abs(this.startXY[0]-W.pageX),U=Math.abs(this.startXY[1]-W.pageY);if(V>this.get("clickPixelThresh")||U>this.get("clickPixelThresh")){this._dragThreshMet=true;this.start();this._alignNode([W.pageX,W.pageY]);}}else{if(this._clickTimeout){this._clickTimeout.cancel();}this._alignNode([W.pageX,W.pageY]);}}},stopDrag:function(){if(this.get(G)){E._end();}return this;},destructor:function(){E._unregDrag(this);this._unprep();if(this.target){this.target.destroy();}}});D.namespace("DD");D.DD.Drag=A;},"@VERSION@",{requires:["dd-ddm-base"],skinnable:false});YUI.add("dd-proxy",function(F){var E=F.DD.DDM,A="node",B="dragNode",C="proxy",D,G=function(){G.superclass.constructor.apply(this,arguments);};G.NAME="dragProxy";G.ATTRS={moveOnEnd:{value:true},resizeFrame:{value:true},proxy:{value:false,setter:function(H){this._setProxy(H);return H;}},positionProxy:{value:true},borderStyle:{value:"1px solid #808080"}};D={_setProxy:function(H){if(H){if(this.get(B).compareTo(this.get(A))){this._createFrame();this.set(B,E._proxy);}}else{this.set(B,this.get(A));}},_createFrame:function(){if(!E._proxy){E._proxy=true;var I=F.Node.create("<div></div>"),H=F.Node.get("body");I.setStyles({position:"absolute",display:"none",zIndex:"999",top:"-999px",left:"-999px"});H.insertBefore(I,H.get("firstChild"));I.set("id",F.stamp(I));I.addClass(E.CSS_PREFIX+"-proxy");E._proxy=I;}},_setFrame:function(){var J=this.get(A),H,I;if(this.get("resizeFrame")){E._proxy.setStyles({height:J.get("offsetHeight")+"px",width:J.get("offsetWidth")+"px"});}H=E.activeDrag.get("activeHandle");I=H.getStyle("cursor");if(I=="auto"){I=E.get("dragCursor");}this.get(B).setStyles({visibility:"hidden",display:"block",cursor:I,border:this.get("borderStyle")});if(this.get("positionProxy")){this.get(B).setXY(this.nodeXY);}this.get(B).setStyle("visibility","visible");},initializer:function(){if(this.get(C)){this._createFrame();}},start:function(){if(!this.get("lock")){}G.superclass.start.apply(this);if(this.get(C)){this._setFrame();}},end:function(){if(this.get(C)&&this.get("dragging")){if(this.get("moveOnEnd")){this.get(A).setXY(this.lastXY);}this.get(B).setStyle("display","none");}G.superclass.end.apply(this);}};F.extend(G,F.DD.Drag,D);F.DD.Drag=G;},"@VERSION@",{requires:["dd-ddm","dd-drag"],skinnable:false});YUI.add("dd-constrain",function(E){var A="dragNode",G="offsetHeight",F="offsetWidth",B=null,D=function(){D.superclass.constructor.apply(this,arguments);};D.NAME="dragConstrained";D.ATTRS={stickX:{value:false},stickY:{value:false},tickX:{value:false},tickY:{value:false},tickXArray:{value:false},tickYArray:{value:false},constrain2region:{value:false,getter:function(C){if(E.Lang.isObject(C)){var H={};E.mix(H,C);return H;}else{return false;}},setter:function(C){if(E.Lang.isObject(C)){if(E.Lang.isNumber(C.top)&&E.Lang.isNumber(C.right)&&E.Lang.isNumber(C.left)&&E.Lang.isNumber(C.bottom)){var H={};E.mix(H,C);return H;}else{return false;}}else{if(C!==false){return false;}}return C;}},gutter:{value:"0",setter:function(C){return E.DD.DDM.cssSizestoObject(C);}},constrain2node:{value:false,setter:function(H){if(!this.get("constrain2region")){var C=E.Node.get(H);if(C){return C;}}else{if(this.get("constrain2region")!==false){}}return false;}},constrain2view:{value:false}};B={start:function(){D.superclass.start.apply(this,arguments);this._regionCache=null;},_regionCache:null,_cacheRegion:function(){this._regionCache=this.get("constrain2node").get("region");},getRegion:function(K){var I={},J=null,C=null,H=this.get("gutter");if(this.get("constrain2node")){if(!this._regionCache){E.on("resize",this._cacheRegion,this,true,window);this._cacheRegion();}I=E.clone(this._regionCache);}else{if(this.get("constrain2region")){I=this.get("constrain2region");
}else{if(this.get("constrain2view")){I=this.get("node").get("viewportRegion");}else{return false;}}}E.each(H,function(L,M){if((M=="right")||(M=="bottom")){I[M]-=L;}else{I[M]+=L;}});if(K){J=this.get(A).get(G);C=this.get(A).get(F);I.right=I.right-C;I.bottom=I.bottom-J;}return I;},_checkRegion:function(C){var I=C,J=this.getRegion(),K=this.get(A).get(G),H=this.get(A).get(F);if(I[1]>(J.bottom-K)){C[1]=(J.bottom-K);}if(J.top>I[1]){C[1]=J.top;}if(I[0]>(J.right-H)){C[0]=(J.right-H);}if(J.left>I[0]){C[0]=J.left;}return C;},inRegion:function(I){I=I||this.get(A).getXY();var H=this._checkRegion([I[0],I[1]]),C=false;if((I[0]===H[0])&&(I[1]===H[1])){C=true;}return C;},_align:function(I){var C=D.superclass._align.apply(this,arguments),H=this.getRegion(true);if(this.get("stickX")){C[1]=(this.startXY[1]-this.deltaXY[1]);}if(this.get("stickY")){C[0]=(this.startXY[0]-this.deltaXY[0]);}if(H){C=this._checkRegion(C);}C=this._checkTicks(C,H);return C;},_calcTicks:function(N,M,J,L,K){var H=((N-M)/J),I=Math.floor(H),C=Math.ceil(H);if((I!==0)||(C!==0)){if((H>=I)&&(H<=C)){N=(M+(J*I));if(L&&K){if(N<L){N=(M+(J*(I+1)));}if(N>K){N=(M+(J*(I-1)));}}}}return N;},_calcTickArray:function(O,P,N,K){var H=0,L=P.length,J=0,I,C,M;if(!P||(P.length===0)){return O;}else{if(P[0]>=O){return P[0];}else{for(H=0;H<L;H++){J=(H+1);if(P[J]&&P[J]>=O){I=O-P[H];C=P[J]-O;M=(C>I)?P[H]:P[J];if(N&&K){if(M>K){if(P[H]){M=P[H];}else{M=P[L-1];}}}return M;}}return P[P.length-1];}}},_checkTicks:function(L,J){var K=(this.startXY[0]-this.deltaXY[0]),I=(this.startXY[1]-this.deltaXY[1]),C=this.get("tickX"),H=this.get("tickY");if(C&&!this.get("tickXArray")){L[0]=this._calcTicks(L[0],K,C,J.left,J.right);}if(H&&!this.get("tickYArray")){L[1]=this._calcTicks(L[1],I,H,J.top,J.bottom);}if(this.get("tickXArray")){L[0]=this._calcTickArray(L[0],this.get("tickXArray"),J.left,J.right);}if(this.get("tickYArray")){L[1]=this._calcTickArray(L[1],this.get("tickYArray"),J.top,J.bottom);}return L;}};E.extend(D,E.DD.Drag,B);E.DD.Drag=D;},"@VERSION@",{skinnable:false,requires:["dd-drag"],optional:["dd-proxy"]});YUI.add("dd-plugin",function(B){var A=function(C){C.node=C.owner;A.superclass.constructor.apply(this,arguments);};A.NAME="dd-plugin";A.NS="dd";B.extend(A,B.DD.Drag);B.namespace("plugin");B.plugin.Drag=A;},"@VERSION@",{skinnable:false,requires:["dd-drag"],optional:["dd-constrain","dd-proxy"]});YUI.add("dd-drop",function(A){var B="node",G=A.DD.DDM,F="offsetHeight",C="offsetWidth",I="drop:over",H="drop:enter",D="drop:exit",E=function(){E.superclass.constructor.apply(this,arguments);A.later(100,this,this._createShim);G._regTarget(this);};E.NAME="drop";E.ATTRS={node:{setter:function(J){var K=A.Node.get(J);if(!K){A.fail("DD.Drop: Invalid Node Given: "+J);}return K;}},groups:{value:["default"],setter:function(J){this._groups={};A.each(J,function(L,K){this._groups[L]=true;},this);return J;}},padding:{value:"0",setter:function(J){return G.cssSizestoObject(J);}},lock:{value:false,setter:function(J){if(J){this.get(B).addClass(G.CSS_PREFIX+"-drop-locked");}else{this.get(B).removeClass(G.CSS_PREFIX+"-drop-locked");}return J;}},bubbles:{writeOnce:true,value:A.DD.DDM}};A.extend(E,A.Base,{_createEvents:function(){var J=[I,H,D,"drop:hit"];A.each(J,function(L,K){this.publish(L,{type:L,emitFacade:true,preventable:false,bubbles:true,queuable:false});},this);if(this.get("bubbles")){this.addTarget(this.get("bubbles"));}},_valid:null,_groups:null,shim:null,region:null,overTarget:null,inGroup:function(J){this._valid=false;var K=false;A.each(J,function(M,L){if(this._groups[M]){K=true;this._valid=true;}},this);return K;},initializer:function(){A.later(100,this,this._createEvents);var J=this.get(B),K;if(!J.get("id")){K=A.stamp(J);J.set("id",K);}J.addClass(G.CSS_PREFIX+"-drop");},destructor:function(){G._unregTarget(this);if(this.shim){this.shim.get("parentNode").removeChild(this.shim);this.shim=null;}this.get(B).removeClass(G.CSS_PREFIX+"-drop");},_deactivateShim:function(){if(!this.shim){return false;}this.get(B).removeClass(G.CSS_PREFIX+"-drop-active-valid");this.get(B).removeClass(G.CSS_PREFIX+"-drop-active-invalid");this.get(B).removeClass(G.CSS_PREFIX+"-drop-over");this.shim.setStyles({top:"-999px",left:"-999px",zIndex:"2"});this.overTarget=false;},_activateShim:function(){if(!G.activeDrag){return false;}if(this.get(B)===G.activeDrag.get(B)){return false;}if(this.get("lock")){return false;}var J=this.get(B);if(this.inGroup(G.activeDrag.get("groups"))){J.removeClass(G.CSS_PREFIX+"-drop-active-invalid");J.addClass(G.CSS_PREFIX+"-drop-active-valid");G._addValid(this);this.overTarget=false;this.sizeShim();}else{G._removeValid(this);J.removeClass(G.CSS_PREFIX+"-drop-active-valid");J.addClass(G.CSS_PREFIX+"-drop-active-invalid");}},sizeShim:function(){if(!G.activeDrag){return false;}if(this.get(B)===G.activeDrag.get(B)){return false;}if(this.get("lock")){return false;}if(!this.shim){A.later(100,this,this.sizeShim);return false;}var O=this.get(B),M=O.get(F),K=O.get(C),Q=O.getXY(),P=this.get("padding"),J,N,L;K=K+P.left+P.right;M=M+P.top+P.bottom;Q[0]=Q[0]-P.left;Q[1]=Q[1]-P.top;if(G.activeDrag.get("dragMode")===G.INTERSECT){J=G.activeDrag;N=J.get(B).get(F);L=J.get(B).get(C);M=(M+N);K=(K+L);Q[0]=Q[0]-(L-J.deltaXY[0]);Q[1]=Q[1]-(N-J.deltaXY[1]);}this.shim.setStyles({height:M+"px",width:K+"px",top:Q[1]+"px",left:Q[0]+"px"});this.region={"0":Q[0],"1":Q[1],area:0,top:Q[1],right:Q[0]+K,bottom:Q[1]+M,left:Q[0]};},_createShim:function(){var J=A.Node.create('<div id="'+this.get(B).get("id")+'_shim"></div>');J.setStyles({height:this.get(B).get(F)+"px",width:this.get(B).get(C)+"px",backgroundColor:"yellow",opacity:".5",zIndex:"1",overflow:"hidden",top:"-900px",left:"-900px",position:"absolute"});G._pg.appendChild(J);this.shim=J;J.on("mouseover",this._handleOverEvent,this,true);J.on("mouseout",this._handleOutEvent,this,true);},_handleTargetOver:function(){if(G.isOverTarget(this)){this.get(B).addClass(G.CSS_PREFIX+"-drop-over");G.activeDrop=this;G.otherDrops[this]=this;if(this.overTarget){G.activeDrag.fire("drag:over",{drop:this,drag:G.activeDrag});
this.fire(I,{drop:this,drag:G.activeDrag});}else{this.overTarget=true;this.fire(H,{drop:this,drag:G.activeDrag});G.activeDrag.fire("drag:enter",{drop:this,drag:G.activeDrag});G.activeDrag.get(B).addClass(G.CSS_PREFIX+"-drag-over");}}else{this._handleOut();}},_handleOverEvent:function(){this.shim.setStyle("zIndex","999");G._addActiveShim(this);},_handleOutEvent:function(){this.shim.setStyle("zIndex","1");G._removeActiveShim(this);},_handleOut:function(J){if(!G.isOverTarget(this)||J){if(this.overTarget){this.overTarget=false;if(!J){G._removeActiveShim(this);}if(G.activeDrag){this.get(B).removeClass(G.CSS_PREFIX+"-drop-over");G.activeDrag.get(B).removeClass(G.CSS_PREFIX+"-drag-over");this.fire(D);G.activeDrag.fire("drag:exit",{drop:this});delete G.otherDrops[this];if(G.activeDrop===this){G.activeDrop=null;}}}}}});A.DD.Drop=E;},"@VERSION@",{requires:["dd-ddm-drop","dd-drag"],skinnable:false});YUI.add("dd-drop-plugin",function(A){var B=function(C){C.node=C.owner;B.superclass.constructor.apply(this,arguments);};B.NAME="dd-drop-plugin";B.NS="drop";A.extend(B,A.DD.Drop);A.namespace("plugin");A.plugin.Drop=B;},"@VERSION@",{requires:["dd-drop"],skinnable:false});YUI.add("dd",function(A){},"@VERSION@",{use:["dd-ddm-base","dd-ddm","dd-ddm-drop","dd-drag","dd-proxy","dd-constrain","dd-plugin","dd-drop","dd-drop-plugin"],skinnable:false});