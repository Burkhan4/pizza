const slider = document.getElementById("slider");
const btnOrder = document.getElementById("btn-order");
const btnMenu = document.getElementById("btn-menu");

function setActive(index) {
  if (index === 0) {
    slider.style.transform = "translateX(0)";
    btnOrder.classList.add("text-white");
    btnOrder.classList.remove("text-orange-400");
    btnMenu.classList.add("text-orange-400");
    btnMenu.classList.remove("text-white");
  } else {
    slider.style.transform = "translateX(190px)";
    btnMenu.classList.add("text-white");
    btnMenu.classList.remove("text-orange-400");
    btnOrder.classList.add("text-orange-400");
    btnOrder.classList.remove("text-white");
  }
}

const API_BASE_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:5000'
  : 'https://backend3-sandy.vercel.app';

async function fetchPizzas() {
  try {
    const response = await fetch(API_BASE_URL + '/products', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status} ${response.statusText}`);
    }

    const pizzas = await response.json();

    console.log('Yuklangan pizzalar soni:', pizzas.length);
    console.log('Birinchi pizza:', pizzas[0]);

    const grid1 = document.getElementById('pizza-grid-1');
    const grid2 = document.getElementById('pizza-grid-2');

    if (grid1) {
      grid1.innerHTML = '';
      pizzas.slice(0, 4).forEach(pizza => {
        grid1.appendChild(createPizzaCard(pizza));
      });
    }

    if (grid2) {
      grid2.innerHTML = '';
      pizzas.slice(4, 8).forEach(pizza => {
        grid2.appendChild(createPizzaCard(pizza));
      });
    }

  } catch (error) {
    console.error('Fetch xatosi:', error);

    const message = `
      Pizzalarni yuklab bo'lmadi.<br>
      Xato: ${error.message}<br><br>
      <small>Iltimos, backend ishlayotganligini va CORS sozlanganligini tekshiring.</small>
    `;

    [document.getElementById('pizza-grid-1'), document.getElementById('pizza-grid-2')]
      .forEach(grid => {
        if (grid) {
          grid.innerHTML = `<p class="text-red-500 text-center col-span-full text-lg">${message}</p>`;
        }
      });
  }
}

function createPizzaCard(pizza) {
  const card = document.createElement('div');
  card.className = 'overflow-hidden transition-transform duration-300 transform border shadow-2xl from-gray-900 to-gray-800 rounded-3xl shadow-orange-900/30 border-orange-800/20 hover:scale-105';

  const formattedPrice = (pizza.price / 1000).toFixed(2);

  card.innerHTML = `
    <div class="relative">
      <img 
        src="${pizza.image}" 
        alt="${pizza.name}" 
        class="w-full h-48 object-cover rounded-t-3xl" 
        onerror="this.src='https://via.placeholder.com/400x300/111827/ffffff?text=${encodeURIComponent(pizza.name)}'"
      />
    </div>
    <div class="p-6 text-center">
      <h3 class="text-2xl font-bold font-heading text-white mb-2">${pizza.name}</h3>
      <p class="text-sm text-gray-300 mb-4 line-clamp-3">${pizza.desc || 'Tavsif yo‘q'}</p>

      <div class="flex justify-center gap-3 mb-5">
        <button class="w-11 h-11 bg-orange-600/30 rounded-full text-white font-medium hover:bg-orange-600 transition text-sm">22</button>
        <button class="w-11 h-11 bg-orange-600/30 rounded-full text-white font-medium hover:bg-orange-600 transition text-sm">28</button>
        <button class="w-11 h-11 bg-orange-600/30 rounded-full text-white font-medium hover:bg-orange-600 transition text-sm">33</button>
      </div>

      <button class="w-full py-2.5 bg-orange-600/30 rounded-full text-orange-300 font-medium hover:bg-orange-600 hover:text-white transition mb-5 text-sm">
        + Ingredients
      </button>

      <div class="flex items-center justify-between mb-5 px-2">
        <span class="text-2xl font-bold text-white">${formattedPrice}$</span>
        
        <div class="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-full quantity-controls">
          <button class="decrement w-8 h-8 bg-orange-600/40 rounded-full hover:bg-orange-600 transition text-white font-bold">-</button>
          <span class="quantity text-lg font-semibold w-6 text-center">1</span>
          <button class="increment w-8 h-8 bg-orange-600/40 rounded-full hover:bg-orange-600 transition text-white font-bold">+</button>
        </div>
      </div>

      <button class="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full font-bold text-lg shadow-lg hover:brightness-110 hover:shadow-orange-600/50 transition order-btn">
        Order Now
      </button>
    </div>
  `;

  const quantitySpan = card.querySelector('.quantity');
  const decrementBtn = card.querySelector('.decrement');
  const incrementBtn = card.querySelector('.increment');

  let quantity = 1;

  incrementBtn.addEventListener('click', () => {
    quantity++;
    quantitySpan.textContent = quantity;
  });

  decrementBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantitySpan.textContent = quantity;
    }
  });
  return card;
}

document.addEventListener('DOMContentLoaded', fetchPizzas);