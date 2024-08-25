self.addEventListener('install', event => {
    console.log('Service Worker installed');
    self.skipWaiting(); // Activate the service worker immediately after installation
});

self.addEventListener('activate', event => {
    console.log('Service Worker activated');
});

self.addEventListener('push', event => {
    const options = {
        body: 'Have you bought a tiffin today?',
        icon: '/Assets/images/Dinner.png', // Correct path to the icon image
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [
            { action: 'yes', title: 'Yes', icon: '/Assets/images/yes.png' }, // Correct path to the "Yes" icon
            { action: 'no', title: 'No', icon: '/Assets/images/no.png' } // Correct path to the "No" icon
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Tiffin Reminder', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'yes') {
        // Handle the "Yes" action: perhaps add a tiffin order
        clients.openWindow('/'); // Open the app if it's not already open
    } else if (event.action === 'no') {
        // Handle the "No" action
    } else {
        clients.openWindow('/'); // Open the app if the notification is clicked
    }
});
