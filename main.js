(function(){
var d=document,r=d.documentElement,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var t=d.querySelector('.theme');
if(t)t.addEventListener('click',function(){var n=r.dataset.theme==='dark'?'light':'dark';r.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(e){}t.setAttribute('aria-pressed',n==='dark')});
var h=d.querySelector('.site-header'),p=d.querySelector('.progress'),tick=false;
function onS(){var y=scrollY,m=r.scrollHeight-innerHeight;if(h)h.classList.toggle('scrolled',y>8);if(p)p.style.transform='scaleX('+(m>0?y/m:0)+')';tick=false}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onS)}},{passive:true});onS();
d.querySelectorAll('.sg,.chips,.certs').forEach(function(g){[].forEach.call(g.querySelectorAll('li'),function(li,k){li.classList.add('rv');li.style.setProperty('--i',Math.min(k,12))})});
d.querySelectorAll('ol,ul').forEach(function(l){var it=l.querySelectorAll(':scope>li.rv');if(it.length>1)it.forEach(function(li,k){if(!li.style.getPropertyValue('--i'))li.style.setProperty('--i',k)})});
var els=d.querySelectorAll('.rv');
if(rm||!('IntersectionObserver'in window)){els.forEach(function(e){e.classList.add('in')})}
else{var io=new IntersectionObserver(function(es){es.forEach(function(e){var c=e.target.classList;if(e.isIntersecting){c.remove('out');c.add('in')}else if(c.contains('in')){c.remove('in');c.add('out')}})},{rootMargin:'0px 0px -6% 0px',threshold:0});els.forEach(function(e){io.observe(e)})}
var secs=d.querySelectorAll('main section[id]'),links={};
d.querySelectorAll('nav a[href^="/#"]').forEach(function(a){links[a.getAttribute('href').slice(2)]=a});
if(secs.length&&'IntersectionObserver'in window){var so=new IntersectionObserver(function(es){es.forEach(function(e){var a=links[e.target.id];if(a&&e.isIntersecting){for(var k in links)links[k].classList.remove('active');a.classList.add('active')}})},{rootMargin:'-45% 0px -50% 0px'});secs.forEach(function(s){so.observe(s)})}
var el=d.querySelector('.rot');
if(el){var w=JSON.parse(el.dataset.words),i=0,c=w[0].length,del=false;el.textContent=w[0];
if(!rm){setTimeout(function step(){var s=w[i];if(!del){c++;el.textContent=s.slice(0,c);if(c>=s.length){del=true;return setTimeout(step,2200)}}else{c--;el.textContent=s.slice(0,c);if(c<=0){del=false;i=(i+1)%w.length}}setTimeout(step,del?35:70)},2200);del=true}}
})();
