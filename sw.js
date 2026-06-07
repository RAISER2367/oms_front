// Слухач події приходу Push-повідомлення від бекенду
self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      // Розпаковуємо JSON, який надіслав наш сервер
      const payload = event.data.json();
      
      const title = payload.title || '🧁 OMS Сповіщення';
      const options = {
        body: payload.body || 'Нові зміни на борді замовлень!',
        icon: '/icons/Icon-192.png',  // Стандартна іконка твого Flutter PWA
        badge: '/icons/Icon-192.png', // Маленька іконка для верхньої панелі Android
        vibrate: [200, 100, 200],     // Режим вібрації телефона
        data: {
          url: self.location.origin   // Запам'ятовуємо адресу нашого сайту
        }
      };

      event.waitUntil(
        self.registration.showNotification(title, options)
      );
    } catch (e) {
      // Якщо раптом сервер надіслав звичайний текст замість JSON
      const text = event.data.text();
      event.waitUntil(
        self.registration.showNotification('🧁 OMS Сповіщення', {
          body: text,
          icon: '/icons/Icon-192.png'
        })
      );
    }
  }
});

// Обробник кліку користувача по сповіщенню на екрані
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // Прибираємо пуш із панелі

  // Перевіряємо, чи відкрита вже вкладка з нашою програмою в браузері
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus(); // Фокусуємо кондитера на відкритій вкладці
        }
      }
      // Якщо сайт OMS повністю закритий — відкриваємо його заново
      if (clients.openWindow && event.notification.data && event.notification.data.url) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});