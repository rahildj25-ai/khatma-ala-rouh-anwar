const SHELL_CACHE="anwar-shell-v5";
const PAGE_CACHE="anwar-warsh-pages-v1";
const SHELL_FILES=["./","./index.html","./sw.js","./IMG_20261106_005137.png","./IMG_20261106_005153.jpg"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(SHELL_CACHE).then(cache=>cache.addAll(SHELL_FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("anwar-shell-")&&k!==SHELL_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET")return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 if(request.mode==="navigate"){
  event.respondWith(fetch(request).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(SHELL_CACHE).then(cache=>cache.put("./index.html",copy));}
   return response;
  }).catch(async()=> (await caches.match("./index.html")) || new Response("الموقع غير محفوظ بعد. افتحيه مرة واحدة بالإنترنت ثم أعيدي المحاولة.",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}})));
  return;
 }
 event.respondWith(caches.match(request).then(cached=>{
  if(cached)return cached;
  return fetch(request).then(response=>{
   if(response.ok&&url.origin===self.location.origin){const copy=response.clone();caches.open(SHELL_CACHE).then(cache=>cache.put(request,copy));}
   return response;
  });
 }));
});
