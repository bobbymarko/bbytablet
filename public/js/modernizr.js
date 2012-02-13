/* Modernizr 2.0.6 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-addtest
 */
;window.Modernizr=function(a,b,c){function w(a,b){return!!~(""+a).indexOf(b)}function v(a,b){return typeof a===b}function u(a,b){return t(prefixes.join(a+";")+(b||""))}function t(a){j.cssText=a}var d="2.0.6",e={},f=b.documentElement,g=b.head||b.getElementsByTagName("head")[0],h="modernizr",i=b.createElement(h),j=i.style,k,l=Object.prototype.toString,m={},n={},o={},p=[],q,r={}.hasOwnProperty,s;!v(r,c)&&!v(r.call,c)?s=function(a,b){return r.call(a,b)}:s=function(a,b){return b in a&&v(a.constructor.prototype[b],c)};for(var x in m)s(m,x)&&(q=x.toLowerCase(),e[q]=m[x](),p.push((e[q]?"":"no-")+q));e.addTest=function(a,b){if(typeof a=="object")for(var d in a)s(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return;b=typeof b=="boolean"?b:!!b(),f.className+=" "+(b?"":"no-")+a,e[a]=b}return e},t(""),i=k=null,e._version=d;return e}(this,this.document);
/* iOS
* There may be times when we need a quick way to reference whether iOS is in play or not.
* While a primative means, will be helpful for that.
*/
Modernizr.addTest('ipad', function () {
  return !!navigator.userAgent.match(/iPad/i);
});

Modernizr.addTest('iphone', function () {
  return !!navigator.userAgent.match(/iPhone/i);
});

Modernizr.addTest('ipod', function () {
  return !!navigator.userAgent.match(/iPod/i);
});

Modernizr.addTest('appleios', function () {
  return (Modernizr.ipad || Modernizr.ipod || Modernizr.iphone);
});
//Test for fixed positioning support. iOS 3 + 4 lack it. http://stackoverflow.com/questions/973875/jquery-check-if-browser-support-position-fixed
/* CSS position:fixed
* Not supported in older IE browsers, nor on Apple's iOS devices.
* Actually the token example on the Modernizr docs. http://www.modernizr.com/docs/
*/
Modernizr.addTest('positionfixed', function () {
    var test = document.createElement('div'),
        control = test.cloneNode(false),
        fake = false,
        root = document.body || (function () {
            fake = true;
            return document.documentElement.appendChild(document.createElement('body'));
        }());

    var oldCssText = root.style.cssText;
    root.style.cssText = 'padding:0;margin:0';
    test.style.cssText = 'position:fixed;top:42px';
    root.appendChild(test);
    root.appendChild(control);
    
    var ret = test.offsetTop !== control.offsetTop;

    root.removeChild(test);
    root.removeChild(control);
    root.style.cssText = oldCssText;
    
    if (fake) {
        document.documentElement.removeChild(root);
    }
    
    /* Uh-oh. iOS < 5 would return a false positive here.
    * If it's about to return true, we'll explicitly test for known iOS User Agent strings.
    * "UA Sniffing is bad practice" you say. Agreeable, but sadly this feature has made it to
    * Modernizr's list of undectables, so we're reduced to having to use this. */
    navigator.userAgent.match(/OS (\d)/i);
    return ret && (!Modernizr.appleios || (Modernizr.appleios && RegExp.$1 >= 5));
});