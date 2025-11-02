document.addEventListener('DOMContentLoaded', () => {
    const URL = "https://storage.googleapis.com/acciojob-open-file-collections/appsmith-uploads/bb3807e9b0bc49958d39563eb1759406.json";
    let menuData = [];
    const order = {};
    const menuContainer = document.getElementById('menu-container');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const orderContainer = document.getElementById('order-container');
    const orderTotal = document.getElementById('order-total');
    let orderFlowStarted = false;

    const getMenu = async () => {
        try {
            const response = await fetch(URL);
            return await response.json();
        } catch (error) {
            console.error("Error fetching menu:", error);
            menuContainer.innerHTML = "<p>Failed to load menu. Please try again later.</p>";
            return [];
        }
    };

    const renderMenu = (data) => {
        if (!data.length) return;
        data.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <img src="${item.imgSrc}" alt="${item.name}" class="food-img"/>
                <div class="food-details">
                    <div>
                        <h3>${item.name}</h3>
                        <p>$${item.price.toFixed(2)}/-</p>
                    </div>
                    <button class="food-add" data-id="${item.id}">+</button>
                </div>
            `;
            menuContainer.appendChild(menuItem);
        });
    };

    const takeOrder = () => new Promise((resolve, reject) => {
        setTimeout(() => Object.keys(order).length ? resolve(order) : reject("No items were ordered."), 2500);
    });

    const orderPrep = () => new Promise(resolve => {
        setTimeout(() => {
            console.log("Preparing order...");
            resolve({ order_status: true, paid: false });
        }, 1500);
    });

    const payOrder = (status) => new Promise((resolve, reject) => {
        setTimeout(() => status.order_status ? resolve({ order_status: true, paid: true }) : reject("Order not prepared yet"), 1000);
    });

    const thankYou = (paymentStatus) => {
        if (paymentStatus.paid) {
            const total = Object.values(order).reduce((sum, item) => sum + item.totalPrice, 0);
            alert(`Thank you for eating with us today! Total: $${total.toFixed(2)}`);

            for (let key in order) delete order[key];
            orderFlowStarted = false;
            renderOrderSummary();

            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = "Place Order";

            console.log("Order reset. Ready for next customer.");
        }
    };

    const renderOrderSummary = () => {
        orderContainer.innerHTML = '';
        let total = 0;
        for (let itemId in order) {
            const item = order[itemId];
            total += item.totalPrice;
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">
                    <button class="quantity-btn decrease" data-id="${itemId}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${itemId}">+</button>
                </div>
                <div class="order-item-price">$${item.totalPrice.toFixed(2)}</div>
                <button class="remove-btn" data-id="${itemId}">Remove</button>
            `;
            orderContainer.appendChild(orderItem);
        }
        orderTotal.textContent = `Total: $${total.toFixed(2)}`;
    };

    const handleOrderFlow = async () => {
        try {
            const takenOrder = await takeOrder();
            console.log("Order taken:", takenOrder);

            const prepStatus = await orderPrep();
            console.log("Order prepared:", prepStatus);

            const paymentStatus = await payOrder(prepStatus);
            console.log("Payment done:", paymentStatus);

            thankYou(paymentStatus);
        } catch (error) {
            console.error("Error in order flow:", error);
            alert(error);
            orderFlowStarted = false;
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = "Place Order";
        }
    };

    menuContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('food-add')) {
            const itemId = event.target.getAttribute('data-id');
            const item = menuData.find(food => food.id == itemId);
            if (item) {
                if (order[itemId]) {
                    order[itemId].quantity += 1;
                    order[itemId].totalPrice = order[itemId].quantity * order[itemId].unitPrice;
                } else {
                    order[itemId] = { name: item.name, unitPrice: item.price, quantity: 1, totalPrice: item.price };
                }
                renderOrderSummary();
            }
        }
    });

    orderContainer.addEventListener('click', (event) => {
        const itemId = event.target.getAttribute('data-id');
        if (!itemId) return;

        if (event.target.classList.contains('increase')) {
            order[itemId].quantity += 1;
        } else if (event.target.classList.contains('decrease')) {
            order[itemId].quantity -= 1;
            if (order[itemId].quantity <= 0) delete order[itemId];
        } else if (event.target.classList.contains('remove-btn')) {
            delete order[itemId];
        }

        if (order[itemId]) order[itemId].totalPrice = order[itemId].quantity * order[itemId].unitPrice;
        renderOrderSummary();
    });

    placeOrderBtn.addEventListener('click', () => {
        if (Object.keys(order).length === 0) return alert("Your order is empty!");

        if (!orderFlowStarted) {
            orderFlowStarted = true;
            placeOrderBtn.disabled = true;
            placeOrderBtn.textContent = "Processing...";
            handleOrderFlow();
        } else {
            alert("Order is already being processed. Please wait.");
        }
    });

    (async () => {
        menuData = await getMenu();
        renderMenu(menuData);
    })();
});