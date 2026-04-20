const CACHE_NAME = 'awm-refeicoes-v3'; // Atualizado para v3 para forçar a limpeza do cache velho

const urlsToCache = [
  './',
  './index.html', 
  './manifest.json',
  './icone_v3.png',
  './LOGOTIPO.jpg',
  './Captura de tela 2026-02-13 132630.jpg',
  './OLHOFECHADO_V2.png',
  './OLHOABERTO.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Força a instalação imediata da nova versão
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Arquivos em cache salvos com sucesso!');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Força o controle imediato
  );
});

self.addEventListener('fetch', evento => {
  evento.respondWith(
    // A MÁGICA OFFLINE AQUI: Estratégia Cache-First com ignoreSearch (Copiado do Caixinha)
    caches.match(evento.request, { ignoreSearch: true })
      .then(resposta => resposta || fetch(evento.request))
  );
});
