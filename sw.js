const PREFIXO_CACHE = 'refeicoes-wm-';
const CACHE_NAME = PREFIXO_CACHE + 'v5'; // Atualizado para v5 para forçar a mudança

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
          // Só apaga se pertencer ao App de Refeições E for uma versão velha
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
          // ✅ CORREÇÃO APLICADA AQUI: Redireciona direto para o index
          return caches.match('./index.html', { ignoreSearch: true });
        }
      })
  );
});
