document.addEventListener("DOMContentLoaded", () => {
    const dateField = document.getElementById("date");
    const tiffinsField = document.getElementById("tiffins");
    const priceField = document.getElementById("price");
    const totalAmountField = document.getElementById("totalAmount");
    const submitBtn = document.getElementById("submitBtn");
    const orderTableBody = document.querySelector("#orderTable tbody");
    const totalTiffinsCell = document.getElementById("totalTiffins");
    const grandTotalAmountCell = document.getElementById("grandTotalAmount");
    const downloadBtn = document.getElementById("downloadBtn");

    const tiffinPrice = 60;
    let totalTiffins = 0;
    let grandTotalAmount = 0;

    // Set the current date
    const now = new Date();
    dateField.value = now.toLocaleString();

    // Load orders from localStorage
    loadOrders();

    // Calculate the total amount based on the number of tiffins
    tiffinsField.addEventListener("input", () => {
        const numberOfTiffins = parseInt(tiffinsField.value) || 1;
        const totalAmount = numberOfTiffins * tiffinPrice;
        totalAmountField.value = totalAmount;
    });

    // Submit button event listener
    submitBtn.addEventListener("click", () => {
        addTiffinOrder();
    });

    // Function to add a tiffin order to the table
    function addTiffinOrder() {
        const date = dateField.value;
        const numberOfTiffins = parseInt(tiffinsField.value) || 1;
        const totalAmount = parseInt(totalAmountField.value) || tiffinPrice;

        // Add order to table
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${date}</td>
            <td>${numberOfTiffins}</td>
            <td>${tiffinPrice}</td>
            <td>${totalAmount}</td>
        `;
        orderTableBody.appendChild(newRow);

        // Update totals
        totalTiffins += numberOfTiffins;
        grandTotalAmount += totalAmount;

        totalTiffinsCell.textContent = totalTiffins;
        grandTotalAmountCell.textContent = grandTotalAmount;

        // Save order to localStorage
        saveOrder({ date, numberOfTiffins, totalAmount });

        // Reset form fields
        tiffinsField.value = 1;
        totalAmountField.value = tiffinPrice;
    }

    // Function to save an order to localStorage
    function saveOrder(order) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Function to load orders from localStorage
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.forEach(order => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${order.date}</td>
                <td>${order.numberOfTiffins}</td>
                <td>${tiffinPrice}</td>
                <td>${order.totalAmount}</td>
            `;
            orderTableBody.appendChild(newRow);

            // Update totals
            totalTiffins += order.numberOfTiffins;
            grandTotalAmount += order.totalAmount;
        });

        totalTiffinsCell.textContent = totalTiffins;
        grandTotalAmountCell.textContent = grandTotalAmount;
    }

    // Download button event listener
    downloadBtn.addEventListener("click", () => {
        downloadTableAsCSV();
    });

    // Function to download the table data as CSV
    function downloadTableAsCSV() {
        let csvContent = "data:text/csv;charset=utf-8,";
        const rows = document.querySelectorAll("table tr");
        rows.forEach(row => {
            const cols = row.querySelectorAll("td, th");
            const rowData = [];
            cols.forEach(col => rowData.push(col.innerText));
            csvContent += rowData.join(",") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tiffin_order_summary.csv");
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    }

    // Request notification permission
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Function to show a notification
    function showNotification() {
        if (Notification.permission === "granted") {
            const notification = new Notification("Tiffin Reminder", {
                body: "Have you bought a tiffin today?",
                icon: "/Assets/images/Dinner.png" // Correct path to the icon image
            });

            notification.onclick = () => {
                addTiffinOrder();
            };
        }
    }

    // Calculate time until 7:00 PM
    function getTimeUntil7PM() {
        const now = new Date();
        const sevenPM = new Date();
        sevenPM.setHours(19, 0, 0, 0);

        if (now > sevenPM) {
            // If it's already past 7:00 PM, set for next day
            sevenPM.setDate(sevenPM.getDate() + 1);
        }

        return sevenPM.getTime() - now.getTime();
    }

    // Set a timeout to trigger the notification at 7:00 PM
    setTimeout(() => {
        showNotification();
        // Set an interval to show the notification every 24 hours after the first one
        setInterval(showNotification, 24 * 60 * 60 * 1000);
    }, getTimeUntil7PM());
});

// Register Service Worker for handling background notifications
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch(function(error) {
        console.log('Service Worker registration failed:', error);
    });
}
