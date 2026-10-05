var wp=document.getElementById('wp');
var depth=+document.body.getAttribute('data-depth')||0;

/* scroll-reveal for home page sections */
(function(){
var rs=[].slice.call(document.querySelectorAll('.rw2,.fin'));if(!rs.length)return;
if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches){rs.forEach(function(r){r.classList.add('ok')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('ok');io.unobserve(e.target)}})},{rootMargin:'0px 0px -20% 0px',threshold:.1});rs.forEach(function(r){io.observe(r)})})();

/* page wipe transition between pages */
function getPrev(){try{var v=sessionStorage.getItem('pgD');return v===null?null:+v}catch(e){return null}}
function setPrev(d){try{sessionStorage.setItem('pgD',d)}catch(e){}}
var prev=getPrev();
if(prev!==null&&prev!==depth&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  var r=depth<prev?' r':'';
  wp.style.transition='none';
  wp.className='wipe'+r+' in';
  void wp.offsetWidth;
  wp.style.transition='';
  wp.classList.add('out');
  setTimeout(function(){wp.style.transition='none';wp.className='wipe';void wp.offsetWidth;wp.style.transition=''},430);
}
setPrev(depth);

document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href]');
  if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;
  var h=a.getAttribute('href');
  if(!/^[a-z-]+\.html$/.test(h)||a.target==='_blank')return;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  e.preventDefault();
  var nd=/^project-/.test(h)?2:h==='index.html'?0:1;
  wp.className='wipe'+(nd<depth?' r':'');
  void wp.offsetWidth;
  wp.classList.add('in');
  setTimeout(function(){location.href=h},320);
});
addEventListener('pageshow',function(e){if(e.persisted){wp.className='wipe'}});

/* ---------- email links: if no mail app opens, offer copy / Gmail ---------- */
(function(){
var st=document.createElement('style');
st.textContent='.mt{position:fixed;left:50%;bottom:max(18px,env(safe-area-inset-bottom,0px));transform:translate(-50%,16px);opacity:0;z-index:80;background:#171B20;color:#F2F0EC;padding:14px 16px;display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;width:max-content;max-width:min(92vw,560px);font:500 14px/1.35 Archivo,system-ui,sans-serif;box-shadow:0 18px 40px -12px #0009;transition:opacity .3s,transform .3s}'
+'.mt.on{opacity:1;transform:translate(-50%,0)}.mt b{font:500 12px/1.3 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.03em;overflow-wrap:anywhere}'
+'.mt button,.mt a{font:700 13px/1 Archivo,system-ui,sans-serif;color:#F2F0EC;background:none;border:1px solid #F2F0EC66;padding:8px 12px;cursor:pointer;transition:background .2s,border-color .2s}'
+'.mt button:hover,.mt a:hover{background:#7D263D;border-color:#7D263D}.mt .x{border:0;padding:6px 8px;margin-left:auto;font-size:18px}.mt .x:hover{background:none;color:#fff}';
document.head.appendChild(st);
var box=null,hide=null;
function copy(t,btn){
  function ok(){btn.textContent='Copied ✓'}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok,fb)}else fb();
  function fb(){var ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');ok()}catch(e){}ta.remove()}
}
function show(addr){
  if(box)box.remove();clearTimeout(hide);
  box=document.createElement('div');box.className='mt';box.setAttribute('role','status');
  var t=document.createElement('span');t.textContent='No mail app opened? Use:';
  var b=document.createElement('b');b.textContent=addr;
  var c=document.createElement('button');c.type='button';c.textContent='Copy address';c.onclick=function(){copy(addr,c)};
  var g=document.createElement('a');g.href='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(addr);g.target='_blank';g.rel='noopener';g.textContent='Open in Gmail ↗';
  var x=document.createElement('button');x.type='button';x.className='x';x.setAttribute('aria-label','Close');x.textContent='×';x.onclick=function(){box.classList.remove('on')};
  box.append(t,b,c,g,x);document.body.appendChild(box);
  void box.offsetWidth;box.classList.add('on');
  hide=setTimeout(function(){box&&box.classList.remove('on')},12000);
}
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href^="mailto:"]');if(!a)return;
  var addr=decodeURIComponent(a.getAttribute('href').slice(7).split('?')[0]),left=false;
  function gone(){left=true}
  addEventListener('blur',gone);document.addEventListener('visibilitychange',gone);
  setTimeout(function(){removeEventListener('blur',gone);document.removeEventListener('visibilitychange',gone);if(!left)show(addr)},1100);
});
})();