const CACHE_NAME = 'awm-refeicoes-v1';

// Lista de arquivos que o celular precisa salvar para rodar offline
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

// Instalação: Salva tudo no Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Arquivos em cache salvos com sucesso!');
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação: Limpa caches antigos se você atualizar a versão (v2, v3...)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptador: Tenta pegar do cache primeiro; se não achar, busca na rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
