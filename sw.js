const PREFIXO_CACHE = 'refeicoes-wm-';
const CACHE_NAME = PREFIXO_CACHE + 'v2'; 

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
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(arquivosParaGuardar))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys().then(nomesCaches => {
      return Promise.all(
        nomesCaches.map(nomeCache => {
          // 🛡️ REGRA DE OURO: Só apaga se pertencer ao App de Refeições E for uma versão velha
          // O cache do app Caixinha fica 100% intocado!
          if (nomeCache.startsWith(PREFIXO_CACHE) && nomeCache !== CACHE_NAME) {
            console.log('Apagando cache antigo de Refeições:', nomeCache);
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
          return caches.match('./index.html', { ignoreSearch: true });
        }
      })
  );
});
