// var staticCacheName = "pwa";

// self.addEventListener("install", function (e) {
//   e.waitUntil(
//     caches.open(staticCacheName).then(function (cache) {
//       return cache.addAll(["/ "]);
//     })
//   );
// });

// self.addEventListener("fetch", function (event) {
//   console.log(event.request.url);

//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       return response || fetch(event.request);
//     })
//   );
// });


//exp8
// const CACHE_NAME = 'ecommerce-pwa-cache-v2';
// const urlsToCache = [
// '/',
// '/app.js',
// 'style.css',
// 'index.html',
// 'image',
// // Add more URLs of assets to cache as needed
// ];
// self.addEventListener('install', event => {
// event.waitUntil(
// caches.open(CACHE_NAME)
// .then(cache => {
// console.log('Opened cache');
// return cache.addAll(urlsToCache);
// }));});
// self.addEventListener('activate', event => {
// event.waitUntil(
// caches.keys().then(cacheNames => {
// return Promise.all(
// cacheNames.filter(cacheName => {
// return cacheName !== CACHE_NAME;
// }).map(cacheName => {
// return caches.delete(cacheName);
// }));}));});
// self.addEventListener('fetch', event => {
// event.respondWith(
// caches.match(event.request)
// .then(response => {
// return response || fetch(event.request);
// }));});


//exp 9

const CACHE_NAME = 'ecommerce-pwa-cache-v2';
const urlsToCache = [

  '/',
'/app.js',
'style.css',
'index.html',
'image',
     // This is a directory, not a file, it won't work like this
    // Add more URLs of assets to cache as needed
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        checkResponse(event.request).catch(function () {
            console.log("Fetch from cache successful!");
            return returnFromCache(event.request);
        })
    );
    console.log("Fetch successful!");
    event.waitUntil(addToCache(event.request));
});

self.addEventListener("sync", (event) => {
    if (event.tag === "syncMessage") {
        console.log("Sync successful!");
    }
});

// Push event listener
// self.addEventListener("push", function (event) {
//     if (event && event.data) {
//         try {
//             var data = event.data.json();
//             if (data && data.method === "pushMessage") {
//                 console.log("Push notification sent");
//                 self.registration.showNotification("Ecommerce website", {
//                     body: data.message
//                 });
//             }
//         } catch (error) {
//             console.error("Error parsing push data:", error);
//         }
//     }
// });
self.addEventListener("push", function (event) {
  if (event && event.data) {
      try {
          var data = event.data.json();
          if (data && data.method === "pushMessage") {
              console.log("Push notification received");

              if (Notification.permission === 'granted') {
                  console.log("Showing push notification");
                  self.registration.showNotification("Ecommerce website", {
                    body: "Hello, this is a notification from the Ecommerce website."
                });
                
              } else {
                  console.warn("Notification permission not granted.");
              }
          }
      } catch (error) {
          console.error("Error parsing push data:", error);
      }
  }
});





function checkResponse(request) {
    return new Promise(function (fulfill, reject) {
        fetch(request)
        .then(function (response) {
            if (response.status !== 404) {
                fulfill(response);
            } else {
                reject(new Error("Response not found"));
            }
        }).catch(function (error) { // Added catch for fetch errors
            reject(error);
        });
    });
}

function returnFromCache(request) {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (!matching || matching.status == 404) {
                return cache.match("offline.html");
            } else {
                return matching;
            }
        });
    });
}

function addToCache(request) {
    return caches.open(CACHE_NAME).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response.clone()).then(function () {
                return response;
            });
        });
    });
}
