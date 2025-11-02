document.addEventListener('DOMContentLoaded', () => {
    const URL = "https://storage.googleapis.com/acciojob-open-file-collections/appsmith-uploads/bb3807e9b0bc49958d39563eb1759406.json";

    let menuData = [];
    const order = {};
    const menuContainer = document.getElementById('menu-container');

    const handleOrderFlow = async () => {
        const data = await getMenu();
        menuData = data;
        renderMenu(data);

        try {
            const takenOrder = await takeOrder();
            console.log("Order taken successfully:", takenOrder);

            const prepStatus = await orderPrep(takenOrder);
            console.log("Order prepared:", prepStatus);

            const paymentStatus = await payOrder(prepStatus);
            console.log("Payment done:", paymentStatus);

            thankYou();

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getMenu = async () => {
        try {
            const response = await fetch(URL);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    }

    const takeOrder = async () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Object.keys(order).length > 0) {
                    resolve(order);
                } else {
                    reject("No items were ordered.");
                }
            }, 2500);
        });
    }

    const orderPrep = async (order) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                for (let key in order) {
                    console.log(`Preparing the order: ${order[key].name} x${order[key].quantity}`);
                }
                resolve({ order_status: true, paid: false });
            }, 1500);
        });
    };


    const payOrder = async () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                
            }, 1000);
        });
    }

    const thankYou = () => {

    }

    const renderMenu = (data) => {
        data.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.name}" class="food-img"/>
            <div class="food-details">
                <div class="food-info">
                    <h3 class="food-name">${item.name}</h3>
                    <p class="food-price">$${item.price}/-</p>
                </div>
                <div class="food-action">
                    <button class="food-add" data-id="${item.id}">+</button>
                </div>
            </div>
        `;
            menuContainer.appendChild(menuItem);
        });
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
                    order[itemId] = {
                        name: item.name,
                        unitPrice: item.price,
                        quantity: 1,
                        totalPrice: item.price
                    }
                }
                console.log(`Added ${item.name} - $${item.price} : Quantity: ${order[itemId].quantity}  = $${order[itemId].totalPrice}`);
                console.log("Current order:", order);
            }
        }
    });

    handleOrderFlow();
});