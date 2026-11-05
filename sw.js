const SHELL_CACHE="anwar-shell-v3";
const PAGE_CACHE="anwar-warsh-pages-v1";
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(SHELL_CACHE).then(cache=>cache.addAll(["./","./index.html"])).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("anwar-shell-")&&k!==SHELL_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET")return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname.includes("/warsh/")){
  event.respondWith(caches.open(PAGE_CACHE).then(async cache=>{
   const cached=await cache.match(request);
   if(cached)return cached;
   try{return await fetch(request);}catch(e){return new Response("هذه الصفحة غير محفوظة بعد. اتصلي بالإنترنت وحمّلي صفحات المصحف أولاً.",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}});}
  }));
  return;
 }
 if(request.mode==="navigate"){
  event.respondWith(fetch(request).then(response=>{
   const copy=response.clone();caches.open(SHELL_CACHE).then(cache=>cache.put("./index.html",copy));return response;
  }).catch(()=>caches.match("./index.html")));
 }
});
