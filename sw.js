// Mudamos para v2 para obrigar o celular a baixar o novo index.html
const CACHE_NAME = 'awm-refeicoes-v2';

// Lista de arquivos que o celular precisa salvar para rodar offline
const urlsToCache = [
  './',
  './index.html', 
  './manifest.json',
  './icone_v3.png',
  './LOGOTIPO.jpg',
  // Os espaços foram trocados por %20 para evitar erro de download no Service Worker
  './Captura%20de%20tela%202026-02-13%20132630.jpg',
  './OLHOFECHADO_V2.png',
  './OLHOABERTO.png'
];

// Instalação: Salva tudo no Cache
self.addEventListener('install', event => {
  // O skipWaiting faz o novo cache assumir imediatamente, sem precisar fechar o app
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Arquivos em cache salvos com sucesso!');
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação: Limpa caches antigos se você atualizar a versão
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
  // Garante que a página atual já use o novo Service Worker
  return self.clients.claim();
});

// Interceptador: Tenta pegar da rede primeiro (para ter sempre o mais atual), se cair a internet, pega do cache offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
