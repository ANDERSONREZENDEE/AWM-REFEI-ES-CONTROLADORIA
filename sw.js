const CACHE_NAME = 'awm-refeicoes-v3';

// Lista exata de arquivos baseada no seu repositório
const urlsToCache = [
  './',
  './index.html', 
  './manifest.json',
  './LOGOTIPO.jpg',
  './Captura%20de%20tela%202026-02-13%20132630.jpg',
  './OLHOFECHADO_V2.png',
  './OLHOABERTO.png'
];

// Instalação: Salva tudo no Cache
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Arquivos em cache salvos com sucesso (v3)!');
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação: Limpa os caches antigos (v1, v2)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Apagando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Interceptador: Tenta a rede, se cair, vai pro offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
