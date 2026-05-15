const PREFIXO_CACHE = 'refeicoes-wm-';
const CACHE_NAME = PREFIXO_CACHE + 'v12';

const arquivosParaGuardar = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './senha.js',
  './LOGOTIPO.jpg',
  './controladoria.jpg',
  './Captura%20de%20tela%202026-02-13%20132630.jpg',
  './icone_refeicao_v7.png',
  './OLHOABERTO.png',
  './OLHOFECHADO_V2.png'
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
        if (respostaCache) return respostaCache;

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
          return caches.match('./index.html', { ignoreSearch: true });
        }
      })
  );
});
