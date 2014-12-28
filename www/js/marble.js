var duScrollDefaultEasing=function(e){"use strict";return.5>e?Math.pow(2*e,2)/2:1-Math.pow(2*(1-e),2)/2};angular.module("duScroll",["duScroll.scrollspy","duScroll.smoothScroll","duScroll.scrollContainer","duScroll.spyContext","duScroll.scrollHelpers"]).value("duScrollDuration",350).value("duScrollSpyWait",100).value("duScrollGreedy",!1).value("duScrollOffset",0).value("duScrollEasing",duScrollDefaultEasing),angular.module("duScroll.scrollHelpers",["duScroll.requestAnimation"]).run(["$window","$q","cancelAnimation","requestAnimation","duScrollEasing","duScrollDuration","duScrollOffset",function(e,t,r,n,o,i,l){"use strict";var a=angular.element.prototype,u=function(e){return"undefined"!=typeof HTMLDocument&&e instanceof HTMLDocument||e.nodeType&&e.nodeType===e.DOCUMENT_NODE},s=function(e){return"undefined"!=typeof HTMLElement&&e instanceof HTMLElement||e.nodeType&&e.nodeType===e.ELEMENT_NODE},c=function(e){return s(e)||u(e)?e:e[0]};a.scrollTo=function(t,r,n){var o;if(angular.isElement(t)?o=this.scrollToElement:n&&(o=this.scrollToAnimated),o)return o.apply(this,arguments);var i=c(this);return u(i)?e.scrollTo(t,r):(i.scrollLeft=t,void(i.scrollTop=r))};var d,p;a.scrollToAnimated=function(e,i,l,a){l&&!a&&(a=o);var u=this.scrollLeft(),s=this.scrollTop(),c=Math.round(e-u),f=Math.round(i-s),y=null,m=this,h="scroll mousedown mousewheel touchmove keydown",g=function(e){(!e||e.which>0)&&(m.unbind(h,g),r(d),p.reject(),d=null)};if(d&&g(),p=t.defer(),!c&&!f)return p.resolve(),p.promise;var v=function(e){null===y&&(y=e);var t=e-y,r=t>=l?1:a(t/l);m.scrollTo(u+Math.ceil(c*r),s+Math.ceil(f*r)),1>r?d=n(v):(m.unbind(h,g),d=null,p.resolve())};return m.scrollTo(u,s),m.bind(h,g),d=n(v),p.promise},a.scrollToElement=function(e,t,r,n){var o=c(this);(!angular.isNumber(t)||isNaN(t))&&(t=l);var i=this.scrollTop()+c(e).getBoundingClientRect().top-t;return s(o)&&(i-=o.getBoundingClientRect().top),this.scrollTo(0,i,r,n)};var f={scrollLeft:function(t,r,n){if(angular.isNumber(t))return this.scrollTo(t,this.scrollTop(),r,n);var o=c(this);return u(o)?e.scrollX||document.documentElement.scrollLeft||document.body.scrollLeft:o.scrollLeft},scrollTop:function(t,r,n){if(angular.isNumber(t))return this.scrollTo(this.scrollTop(),t,r,n);var o=c(this);return u(o)?e.scrollY||document.documentElement.scrollTop||document.body.scrollTop:o.scrollTop}};a.scrollToElementAnimated=function(e,t,r,n){return this.scrollToElement(e,t,r||i,n)},a.scrollTopAnimated=function(e,t,r){return this.scrollTop(e,t||i,r)},a.scrollLeftAnimated=function(e,t,r){return this.scrollLeft(e,t||i,r)};var y=function(e,t){return function(r,n){return n?t.apply(this,arguments):e.apply(this,arguments)}};for(var m in f)a[m]=a[m]?y(a[m],f[m]):f[m]}]),angular.module("duScroll.polyfill",[]).factory("polyfill",["$window",function(e){"use strict";var t=["webkit","moz","o","ms"];return function(r,n){if(e[r])return e[r];for(var o,i=r.substr(0,1).toUpperCase()+r.substr(1),l=0;l<t.length;l++)if(o=t[l]+i,e[o])return e[o];return n}}]),angular.module("duScroll.requestAnimation",["duScroll.polyfill"]).factory("requestAnimation",["polyfill","$timeout",function(e,t){"use strict";var r=0,n=function(e){var n=(new Date).getTime(),o=Math.max(0,16-(n-r)),i=t(function(){e(n+o)},o);return r=n+o,i};return e("requestAnimationFrame",n)}]).factory("cancelAnimation",["polyfill","$timeout",function(e,t){"use strict";var r=function(e){t.cancel(e)};return e("cancelAnimationFrame",r)}]),angular.module("duScroll.spyAPI",["duScroll.scrollContainerAPI"]).factory("spyAPI",["$rootScope","$timeout","scrollContainerAPI","duScrollGreedy","duScrollSpyWait",function(e,t,r,n,o){"use strict";var i=function(r){var i=!1,l=!1,a=function(){l=!1;var t=r.container,o=t[0],i=0;("undefined"!=typeof HTMLElement&&o instanceof HTMLElement||o.nodeType&&o.nodeType===o.ELEMENT_NODE)&&(i=o.getBoundingClientRect().top);var a,u,s,c,d,p;for(c=r.spies,u=r.currentlyActive,s=void 0,a=0;a<c.length;a++)d=c[a],p=d.getTargetPosition(),p&&p.top+d.offset-i<20&&-1*p.top+i<p.height&&(!s||s.top<p.top)&&(s={top:p.top,spy:d});s&&(s=s.spy),u===s||n&&!s||(u&&(u.$element.removeClass("active"),e.$broadcast("duScrollspy:becameInactive",u.$element)),s&&(s.$element.addClass("active"),e.$broadcast("duScrollspy:becameActive",s.$element)),r.currentlyActive=s)};return o?function(){i?l=!0:(a(),i=t(function(){i=!1,l&&a()},o,!1))}:a},l={},a=function(e){var t=e.$id,r={spies:[]};return r.handler=i(r),l[t]=r,e.$on("$destroy",function(){u(e)}),t},u=function(e){var t=e.$id,r=l[t],n=r.container;n&&n.off("scroll",r.handler),delete l[t]},s=a(e),c=function(e){return l[e.$id]?l[e.$id]:e.$parent?c(e.$parent):l[s]},d=function(e){var t,r,n=e.$element.scope();if(n)return c(n);for(r in l)if(t=l[r],-1!==t.spies.indexOf(e))return t},p=function(e){for(;e.parentNode;)if(e=e.parentNode,e===document)return!0;return!1},f=function(e){var t=d(e);t&&(t.spies.push(e),t.container&&p(t.container)||(t.container&&t.container.off("scroll",t.handler),t.container=r.getContainer(e.$element.scope()),t.container.on("scroll",t.handler).triggerHandler("scroll")))},y=function(e){var t=d(e);e===t.currentlyActive&&(t.currentlyActive=null);var r=t.spies.indexOf(e);-1!==r&&t.spies.splice(r,1)};return{addSpy:f,removeSpy:y,createContext:a,destroyContext:u,getContextForScope:c}}]),angular.module("duScroll.scrollContainerAPI",[]).factory("scrollContainerAPI",["$document",function(e){"use strict";var t={},r=function(e,r){var n=e.$id;return t[n]=r,n},n=function(e){return t[e.$id]?e.$id:e.$parent?n(e.$parent):void 0},o=function(r){var o=n(r);return o?t[o]:e},i=function(e){var r=n(e);r&&delete t[r]};return{getContainerId:n,getContainer:o,setContainer:r,removeContainer:i}}]),angular.module("duScroll.smoothScroll",["duScroll.scrollHelpers","duScroll.scrollContainerAPI"]).directive("duSmoothScroll",["duScrollDuration","duScrollOffset","scrollContainerAPI",function(e,t,r){"use strict";return{link:function(n,o,i){o.on("click",function(o){if(i.href&&-1!==i.href.indexOf("#")){var l=document.getElementById(i.href.replace(/.*(?=#[^\s]+$)/,"").substring(1));if(l&&l.getBoundingClientRect){o.stopPropagation&&o.stopPropagation(),o.preventDefault&&o.preventDefault();var a=i.offset?parseInt(i.offset,10):t,u=i.duration?parseInt(i.duration,10):e,s=r.getContainer(n);s.scrollToElement(angular.element(l),isNaN(a)?0:a,isNaN(u)?0:u)}}})}}}]),angular.module("duScroll.spyContext",["duScroll.spyAPI"]).directive("duSpyContext",["spyAPI",function(e){"use strict";return{restrict:"A",scope:!0,compile:function(){return{pre:function(t){e.createContext(t)}}}}}]),angular.module("duScroll.scrollContainer",["duScroll.scrollContainerAPI"]).directive("duScrollContainer",["scrollContainerAPI",function(e){"use strict";return{restrict:"A",scope:!0,compile:function(){return{pre:function(t,r,n){n.$observe("duScrollContainer",function(n){angular.isString(n)&&(n=document.getElementById(n)),n=angular.isElement(n)?angular.element(n):r,e.setContainer(t,n),t.$on("$destroy",function(){e.removeContainer(t)})})}}}}}]),angular.module("duScroll.scrollspy",["duScroll.spyAPI"]).directive("duScrollspy",["spyAPI","duScrollOffset","$timeout","$rootScope",function(e,t,r,n){"use strict";var o=function(e,t,r){angular.isElement(e)?this.target=e:angular.isString(e)&&(this.targetId=e),this.$element=t,this.offset=r};return o.prototype.getTargetElement=function(){return!this.target&&this.targetId&&(this.target=document.getElementById(this.targetId)),this.target},o.prototype.getTargetPosition=function(){var e=this.getTargetElement();return e?e.getBoundingClientRect():void 0},o.prototype.flushTargetCache=function(){this.targetId&&(this.target=void 0)},{link:function(i,l,a){var u,s=a.ngHref||a.href;s&&-1!==s.indexOf("#")?u=s.replace(/.*(?=#[^\s]+$)/,"").substring(1):a.duScrollspy&&(u=a.duScrollspy),u&&r(function(){var r=new o(u,l,-(a.offset?parseInt(a.offset,10):t));e.addSpy(r),i.$on("$destroy",function(){e.removeSpy(r)}),i.$on("$locationChangeSuccess",r.flushTargetCache.bind(r)),n.$on("$stateChangeSuccess",r.flushTargetCache.bind(r))},0,!1)}}}]),angular.module("youtube-embed",["ng"]).service("youtubeEmbedUtils",["$window","$rootScope",function(e,t){function r(e,t){return e.indexOf(t)>-1}var n={},o=/https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gi,i=/t=(\d+)[ms]?(\d+)?s?/;return n.getIdFromURL=function(e){var t=e.replace(o,"$1");if(r(t,";")){var n=t.split(";");if(r(n[1],"%")){var i=decodeURIComponent(t.split(";")[1]);t=("http://youtube.com"+i).replace(o,"$1")}else t=n[0]}else r(t,"#")&&(t=t.split("#")[0]);return t},n.getTimeFromURL=function(e){e=e||"";var t=e.match(i);if(!t)return 0;var n=t[0],o=t[1],l=t[2];return"undefined"!=typeof l?(l=parseInt(l,10),o=parseInt(o,10)):r(n,"m")?(o=parseInt(o,10),l=0):(l=parseInt(o,10),o=0),l+60*o},function(){var e=document.createElement("script");e.src="https://www.youtube.com/iframe_api";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}(),n.ready=!1,e.onYouTubeIframeAPIReady=function(){t.$apply(function(){n.ready=!0})},n}]).directive("youtubeVideo",["youtubeEmbedUtils",function(e){var t=1,r={"-1":"unstarted",0:"ended",1:"playing",2:"paused",3:"buffering",5:"queued"},n="youtube.player.";return{restrict:"EA",scope:{videoId:"=?",videoUrl:"=?",player:"=?",playerVars:"=?",playerHeight:"=?",playerWidth:"=?"},link:function(o,i,l){function a(){var e=Array.prototype.slice.call(arguments);o.$apply(function(){o.$emit.apply(o,e)})}function u(e){var t=r[e.data];"undefined"!=typeof t&&a(n+t,o.player,e),o.$apply(function(){o.player.currentState=t})}function s(e){a(n+"ready",o.player,e)}function c(){var e=angular.copy(o.playerVars);e.start=e.start||o.urlStartTime;var t=new YT.Player(p,{height:o.playerHeight,width:o.playerWidth,videoId:o.videoId,playerVars:e,events:{onReady:s,onStateChange:u}});return t.id=p,t}function d(){(o.videoId||o.playerVars.list)&&(o.player&&o.player.d&&"function"==typeof o.player.destroy&&o.player.destroy(),o.player=c())}o.utils=e;var p=l.playerId||i[0].id||"unique-youtube-embed-id-"+t++;i[0].id=p,o.playerHeight=o.playerHeight||390,o.playerWidth=o.playerWidth||640,o.playerVars=o.playerVars||{};var f=o.$watch(function(){return o.utils.ready&&("undefined"!=typeof o.videoUrl||"undefined"!=typeof o.videoId||"undefined"!=typeof o.playerVars.list)},function(e){e&&(f(),"undefined"!=typeof o.videoUrl?o.$watch("videoUrl",function(e){o.videoId=o.utils.getIdFromURL(e),o.urlStartTime=o.utils.getTimeFromURL(e),d()}):"undefined"!=typeof o.videoId?o.$watch("videoId",function(){o.urlStartTime=null,d()}):o.$watch("playerVars.list",function(){o.urlStartTime=null,d()}))});o.$watchCollection(["playerHeight","playerWidth"],function(){o.player&&o.player.setSize(o.playerWidth,o.playerHeight)}),o.$on("$destroy",function(){o.player&&o.player.destroy()})}}}]),function(){angular.module("player",["youtube-embed","ngAnimate","duScroll"]).controller("PlayerController",["$window","$scope","$http","$timeout","$animate",function(e,t,r,n){t.params={story:"marble-hornets",tick:2e3,handle:void 0,loaded:!1,autoPlay:!1,fullScreen:!1,stopPlay:function(){this.autoPlay=!this.autoPlay,this.autoPlay?t.current.get().isTwitter()&&t.current.next():t.youtube.params.normal.autoplay=0},setFullScreen:function(){var e=this;t.current.isYoutube()&&(t.youtube.time=t.youtube.player.getCurrentTime()),this.fullScreen=!this.fullScreen,e._setFullScreen()},_setFullScreen:function(){var e=document.body;e.requestFullScreen?this.fullScreen?e.requestFullScreen():document.cancelFullScreen():e.webkitRequestFullScreen?this.fullScreen?e.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT):document.webkitCancelFullScreen():e.mozRequestFullScreen&&(this.fullScreen?e.mozRequestFullScreen():document.mozCancelFullScreen())}},t.story={title:"",seasons:[]},t.current={season:0,day:0,chapter:0,get:function(){if(-1!=this.season){var e=t.story.seasons[this.season].days[this.day],r=e.chapters[this.chapter];return r.date=e.date,r}return{}},set:function(e,r,o){void 0!==e&&(this.season=e,this.day=r,this.chapter=o);var i={season:this.season,day:this.day,chapter:this.chapter};localStorage.setItem("progress",JSON.stringify(i));this.get();this.isTwitter()&&t.params.autoPlay&&(t.params.handle=n(function(){t.params.autoPlay&&t.current.next()},this.get().duration))},goVideo:function(){this.isYoutube()?(t.youtube.video=this.get().id,t.youtube.description=this.get().content,t.youtube.author=this.get().account):void 0!==t.youtube.player&&t.youtube.player.stopVideo()},is:function(e,t){return this.day==e&&this.chapter==t},displayed:function(){for(var e=Math.max(this.day-3,0),r=[],n=e;e+3>n;n++)r.push(t.story.seasons[this.season].days[n]);return r},isTwitter:function(){return"twitter"==this.get().type},isYoutube:function(){return"youtube"==this.get().type},getProgress:function(){var e=t.story.seasons[this.season].duration,r=this.get().seasonProgress,n=r/e*100;return n+"%"},prev:function(){var e=this.season,r=this.day,n=this.chapter;n>0?n--:r>0&&(r--,n=t.story.seasons[this.season].days[r].chapters.length-1),this.set(e,r,n)},next:function(){var e=this.season,r=this.day,n=this.chapter;n<t.story.seasons[this.season].days[r].chapters.length-1?n++:r<t.story.seasons[this.season].days.length-1&&(r++,n=0),this.set(e,r,n)}},t.youtube={player:void 0,video:void 0,description:"",author:"",time:0,params:{normal:{autoplay:0,modestbranding:1,enablejsapi:1,rel:0},full:{autoplay:1,modestbranding:1,enablejsapi:1,rel:0,controls:0}}},t.timeConverter=function(e){var t=new Date(1e3*e),r=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return{year:t.getFullYear(),month:r[t.getMonth()-1],date:t.getDate(),hour:("0"+t.getHours()).slice(-2),min:("0"+t.getMinutes()).slice(-2),sec:("0"+t.getSeconds()).slice(-2),getDate:function(){return this.date+" "+this.month+" "+this.year},getTime:function(){return this.hour+":"+this.min}}},t.load=function(){r({method:"GET",url:"stories/"+t.params.story+".min.json"}).success(function(e){t.story=e,t.params.loaded=!0,n(function(){if(null!==localStorage.getItem("progress")){var e=JSON.parse(localStorage.getItem("progress"));t.current.season=e.season,t.current.day=e.day,t.current.chapter=e.chapter}t.current.set()},1e3)})},t.startScroll=function(){},t.stopScroll=function(){},window.onmousewheel=function(e){t.startScroll(e.deltaY>0?"next":"prev")},window.onkeyup=function(e){switch(e.which){case 38:case 37:t.prev();break;case 39:case 40:t.next();break;case 32:t.stopPlay()}t.$apply()},t.$on("youtube.player.ended",function(){t.params.autoPlay&&t.current.next()}),t.$on("youtube.player.ready",function(){0!==t.youtube.time&&(t.youtube.player.seekTo(t.youtube.time),t.youtube.time=0)}),t.load()}]).directive("dayCard",function(){return{restrict:"E",templateUrl:"views/day-card.html",controller:["$scope",function(e){e.isCurrent=function(t,r){return e.current.is(t,r)}}]}}).directive("twitterCard",function(){return{restrict:"E",templateUrl:"views/twitter-card.html"}}).animation(".chapter",function(){var e=function(e){return angular.element(e).scope()};return{addClass:function(t){var r=document.getElementById("litterature"),n=r.offsetHeight/2;r=angular.element(r),r.scrollToElementAnimated(t,n).then(function(){e(t).current.goVideo()})}}})}();