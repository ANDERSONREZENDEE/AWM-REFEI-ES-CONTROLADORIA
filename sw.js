const PREFIXO_CACHE = 'caixinha-wm-';
const CACHE_NAME = PREFIXO_CACHE + 'v7'; 

// Arquivos principais para guardar offline imediatamente
const arquivosParaGuardar = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './LOGOTIPO.jpg',
  './Captura de tela 2026-02-13 132630.jpg',
  './icone_v3.png',
  './OLHOABERTO.png',
  './OLHOFECHADO_V2.png',
  './atalho.png'
];

self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(arquivosParaGuardar))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys().then(nomesCaches => {
      return Promise.all(
        nomesCaches.map(nomeCache => {
          // Só apaga se pertencer ao Caixinha E for uma versão velha
          if (nomeCache.startsWith(PREFIXO_CACHE) && nomeCache !== CACHE_NAME) {
            return caches.delete(nomeCache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', evento => {
  evento.respondWith(
    caches.match(evento.request, { ignoreSearch: true })
      .then(respostaCache => {
        if (respostaCache) {
          return respostaCache; 
        }
        
        return fetch(evento.request).then(respostaRede => {
          return caches.open(CACHE_NAME).then(cache => {
            if (evento.request.method === 'GET' && respostaRede.status === 200) {
              cache.put(evento.request, respostaRede.clone());
            }
            return respostaRede;
          });
        });
      }).catch(() => {
        if (evento.request.mode === 'navigate') {
          // CORREÇÃO MÁXIMA: Agora ele sempre devolve a mesma página exata que você pediu (ex: caixinha.html)
          return caches.match(evento.request.url, { ignoreSearch: true });
        }
      })
  );
});
