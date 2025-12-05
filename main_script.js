let b2_txt = "";
let b2price = 0;
let salePrice = 0;
function random_banner2_img(min, max) {

    let random = Math.floor(Math.random() * (max - min + 1) + min);

    salePrice = 0;

    if (random == 1) { b2_txt = "https://i.postimg.cc/FzF2HWj7/rolls3.webp"; salePrice = 0.1; b2price = 420; }
    if (random == 2) { b2_txt = "https://i.postimg.cc/nrV6hRvr/rolls1.webp"; salePrice = 0.1; b2price = 450; }
    if (random == 3) { b2_txt = "https://i.postimg.cc/prVgLGDn/rolls7.webp"; salePrice = 0.1; b2price = 390; }

    if (random == 4) { b2_txt = "https://i.postimg.cc/L5yGYtTB/Sushi2.webp"; salePrice = 0.08; b2price = 80; }
    if (random == 5) { b2_txt = "https://i.postimg.cc/Xq2tGf8x/Sushi6.webp"; salePrice = 0.08; b2price = 85; }
    if (random == 6) { b2_txt = "https://i.postimg.cc/PJ60pW4M/Sushi4.webp"; salePrice = 0.08; b2price = 90; }

    if (random == 7) { b2_txt = "https://i.postimg.cc/FzPwdyZ0/sets8.webp"; salePrice = 0.2; b2price = 1200; }
    if (random == 8) { b2_txt = "https://i.postimg.cc/sxnbQYcB/sets2.webp"; salePrice = 0.2; b2price = 1100; }
    if (random == 9) { b2_txt = "https://i.postimg.cc/ZnfXB8cN/sets5.webp"; salePrice = 0.2; b2price = 1850; }

    // ОНОВЛЮЄМО ВЖЕ ІСНУЮЧІ ЕЛЕМЕНТИ
    const old_price = document.querySelector('.banner2_old');
    const new_price = document.querySelector('.banner2_new');
    const banner2_img = document.getElementById("banner2_change");

    if (old_price && new_price && banner2_img) {

        old_price.textContent = b2price + " грн";
        let discounted = Math.round(b2price - (b2price * salePrice));
        new_price.textContent = discounted + " грн";

        banner2_img.src = b2_txt;
    }
}


document.addEventListener('DOMContentLoaded', function(){
  // ... існуючий код ...
  random_banner2_img(1, 9);
  // Додаємо toggle для article при кліку на стрілку
  const toggleArrow = document.querySelector('.toggle-arrow');
  const categories = document.querySelector('.categories');
  if (toggleArrow && categories) {
    toggleArrow.addEventListener('click', function() {
      categories.classList.toggle('open');
      // Змінюємо стрілку (наприклад, ▼ на ▲)
      toggleArrow.textContent = categories.classList.contains('open') ? '▲' : '▼';
    });
  }
  
  // ... решта існуючого коду ...
});

const buttons = [...document.getElementsByClassName("button")];
buttons.forEach(button => {
  globalThis.button = button; // for use in removeFromCart
  button.addEventListener("click", function() {
    button.classList.toggle("following");
    button.textContent = button.classList.contains("following") ? "" : "";
  })
  // ensure a `.like` button exists immediately before each `.button`
  if (!button.previousElementSibling || !button.previousElementSibling.classList.contains('like')) {
    const likeEl = document.createElement('button');
    likeEl.className = 'like';
    likeEl.setAttribute('aria-pressed', 'false');
    likeEl.setAttribute('title', 'Like');
    button.parentNode.insertBefore(likeEl, button);
  }
});

const likebtns = [...document.getElementsByClassName("like")];
likebtns.forEach(likebtn => {
  likebtn.addEventListener("click", function() {
    likebtn.classList.toggle("liked");
    likebtn.setAttribute('aria-pressed', likebtn.classList.contains('liked'));
  })
});

// for demo only
setTimeout(function() {
  document.querySelector("button").focus();
}, 500);

// --- Cart implementation ---
const cart = {};

// load persisted cart if any
function loadCart(){
  try{ const raw = localStorage.getItem('sushidza_cart'); if(raw){ const obj=JSON.parse(raw); for(const k in obj) cart[k]=obj[k]; }}catch(e){console.error(e)}
}

function saveCart(){
  try{ localStorage.setItem('sushidza_cart', JSON.stringify(cart)); }catch(e){console.error(e)}
}
function ensureProductIds(){
  const containers = document.querySelectorAll('.rd, .sd, .std, .drd');
  containers.forEach((el, index) => {
    if (!el.dataset.productId) {
      // create a predictable id using class and index
      const base = el.className.split(' ')[0] || 'prod';
      el.dataset.productId = `${base}-${index+1}`;
    }
  });
}

// augment existing product elements with price/weight dataset attributes when possible
function ensureProductMetadata(){
  const containers = document.querySelectorAll('.rd, .sd, .std, .drd');
  containers.forEach((el)=>{
    // price
    if(!el.dataset.price){
      const p = parsePriceFromElement(el);
      if(p !== null) el.dataset.price = String(p);
    }
    // weight
    if(!el.dataset.weight){
      const w = parseWeightFromElement(el);
      if(w) el.dataset.weight = w;
    }
  });
}

// read price text like <span class="price">190</span> -> 190 (number)
function parsePriceFromElement(el){
  const priceEl = el.querySelector('.price');
  if(priceEl){
    const txt = priceEl.textContent.replace(/[^0-9.,]/g,'').replace(',','.');
    const n = parseFloat(txt);
    if(!isNaN(n)) return n;
  }
  return null;
}

// read weight text like <span class="weight">Вага:320г</span> -> "320 г"
function parseWeightFromElement(el){
  const wEl = el.querySelector('.weight');
  if(wEl){
    const txt = wEl.textContent || '';
    const m = txt.match(/(\d+)[^\d]?/);
    if(m) return m[1] + ' г';
    return txt.trim();
  }
  return null;
}

function createCartDOM(){
  if (document.querySelector('.cart-overlay')) return;
  const overlay = document.createElement('div'); overlay.className = 'cart-overlay';
  const panel = document.createElement('aside'); panel.className = 'cart-panel';

  panel.innerHTML = `
    <header>
      <h3>Кошик</h3>
      <div>
        <button class="close-btn" aria-label="Close cart">✕</button>
      </div>
    </header>
    <div class="cart-items" aria-live="polite"></div>
    <div class="cart-footer">
      <div class="total"><span>Кількість:</span><span class="count">0</span></div>
      <div class="sum"><span>Разом:</span><span class="sum-value">0 грн</span></div>
      <div style="display:flex;gap:.5rem;"><button class="clear-cart">Очистити</button><button id="check" class="checkout">Оформити</button></div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  overlay.addEventListener('click', closeCart);
  panel.querySelector('.close-btn').addEventListener('click', closeCart);
  panel.querySelector('.clear-cart').addEventListener('click', function(){
    for(const k in cart) delete cart[k];
    renderCart();
    syncButtonsWithCart();
  });
  panel.querySelector('.checkout').addEventListener('click', function(){
  window.location.href = 'order.html';})
  // ensure badge exists on the .bin button
  const bin = document.querySelector('.bin');
  if(bin && !bin.querySelector('.cart-badge')){
    const badge = document.createElement('span'); badge.className = 'cart-badge';
    bin.appendChild(badge);
  }
}

function updateBinBadge(){
  const bin = document.querySelector('.bin');
  if(!bin) return;
  const badge = bin.querySelector('.cart-badge');
  let total = 0; for(const k in cart) total += cart[k].qty;
  if(badge){ if(total>0) badge.classList.add('visible'); else badge.classList.remove('visible'); }
}

// add item by matching an image url to product containers
function addToCartByImage(imgUrl){
  if(!imgUrl) return;
  // find product whose img src endsWith or contains imgUrl
  const containers = document.querySelectorAll('.rd, .sd, .std, .drd');
  for(const el of containers){
    const img = el.querySelector('img');
    if(!img) continue;
    if(img.src && (img.src === imgUrl || img.src.endsWith(imgUrl) || img.src.indexOf(imgUrl)!==-1)){
      if(!el.dataset.productId) ensureProductIds();
      addToCart(el.dataset.productId, salePrice);
      return;
    }
  }
  // if none found, create a synthetic product id based on image
  const syntheticId = `img-${String(imgUrl).replace(/[^a-z0-9]/gi,'')}`;
  if(!cart[syntheticId]){
    cart[syntheticId] = { id: syntheticId, name: 'Товар', img: imgUrl, qty: 1 };
    renderCart();
    syncButtonsWithCart();
  }
}

function syncButtonsWithCart(){
  // iterate product containers and set/unset .following on their .button according to cart
  document.querySelectorAll('.rd, .sd, .std, .drd').forEach(el=>{
    const pid = el.dataset.productId;
    const btn = el.querySelector('.button');
    if(!btn) return;
    if(pid && cart[pid]){
      btn.classList.add('following');
    } else {
      btn.classList.remove('following');
    }
  });
}

function renderCart(){
  const panel = document.querySelector('.cart-panel');
  if(!panel) return;
  const itemsEl = panel.querySelector('.cart-items');
  itemsEl.innerHTML = '';
  let totalCount = 0;
  let totalSum = 0;
  for(const id in cart){
    const it = cart[id];
    totalCount += it.qty;
    const finalprice = it.finalprice?Number(it.finalprice):240;
    const price = it.price?Number(it.price):240; // fallback price
    const subtotal = finalprice * it.qty;
    totalSum += subtotal;
    const row = document.createElement('div'); row.className = 'cart-item';
    row.innerHTML = `
      <img src="${it.img}" alt="${escapeHtml(it.name)}">
      <div class="meta"><h4>${escapeHtml(it.name)}</h4>
        <p>Вага: ${it.weight || '—'}</p>
        <div class="qty-controls">
          <button class="qty-dec" data-id="${id}">−</button>
          <input type="number" min="1" class="qty-input" data-id="${id}" value="${it.qty}" />
          <button class="qty-inc" data-id="${id}">+</button>
        </div>
      </div>
      <div style="margin-left:auto;text-align:right">
        <div style="font-weight:700">${price} грн</div>
        <div style="color:#666">${subtotal} грн</div>
        <div><button class="remove" data-id="${id}">Видалити</button></div>
      </div>
    `;
    itemsEl.appendChild(row);
  }
  
  panel.querySelector('.count').textContent = totalCount;
  const sumEl = panel.querySelector('.sum-value'); if(sumEl) sumEl.textContent = totalSum + ' грн';
  // attach remove listeners
  panel.querySelectorAll('.remove').forEach(btn=> btn.addEventListener('click', function(e){ const id = this.dataset.id; removeFromCart(id); }));
  // attach qty controls
  panel.querySelectorAll('.qty-inc').forEach(b=> b.addEventListener('click', function(){ const id=this.dataset.id; if(cart[id]){ cart[id].qty += 1; renderCart(); }}));
  panel.querySelectorAll('.qty-dec').forEach(b=> b.addEventListener('click', function(){ const id=this.dataset.id; if(cart[id]){ cart[id].qty = Math.max(1, cart[id].qty - 1); renderCart(); }}));
  panel.querySelectorAll('.qty-input').forEach(i=> i.addEventListener('change', function(){ const id=this.dataset.id; let v = parseInt(this.value,10)||1; v = Math.max(1,v); if(cart[id]){ cart[id].qty = v; renderCart(); }}));
  updateBinBadge();
  saveCart();
}

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function addToCart(productId, salePrice){
  if(!productId) return;
  const container = document.querySelector(`[data-product-id="${productId}"]`);
  if(!container) return;
  const name = container.querySelector('h2') ? container.querySelector('h2').textContent.trim() : 'Товар';
  const img = container.querySelector('img') ? container.querySelector('img').src : '';
  // Toggle behavior: if exists remove completely, otherwise add with qty=1
  if(cart[productId]){
    delete cart[productId];
  } else {
    // ensure metadata on container
    if(!container.dataset.price || !container.dataset.weight) ensureProductMetadata();
    const price = container.dataset.price ? Number(container.dataset.price) : (parsePriceFromElement(container) || 240);
    let finalprice = price-(salePrice*price);
    const weight = container.dataset.weight || parseWeightFromElement(container) || '40 г';
    cart[productId] = { id: productId, name, img, qty: 1, finalprice, price, weight };
  }
  renderCart();
  syncButtonsWithCart();
}

function removeFromCart(productId){ 
  delete cart[productId]; 
  renderCart(); 
  syncButtonsWithCart();
}

function openCart(){ createCartDOM(); document.querySelector('.cart-overlay').classList.add('visible'); document.querySelector('.cart-panel').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeCart(){ const ov = document.querySelector('.cart-overlay'); const p = document.querySelector('.cart-panel'); if(ov) ov.classList.remove('visible'); if(p) p.classList.remove('open'); document.body.style.overflow = ''; }

// wire .bin to open cart
document.addEventListener('DOMContentLoaded', function(){
  ensureProductIds();
  ensureProductMetadata();
  loadCart();
  createCartDOM();
  // reconcile existing persisted cart items with metadata (price/weight)
  (function reconcileCart(){
    let changed = false;
    for(const id in cart){
      const it = cart[id];
      if((!it.price || !it.weight) && document.querySelector(`[data-product-id="${id}"]`)){
        const c = document.querySelector(`[data-product-id="${id}"]`);
        const p = c.dataset.price ? Number(c.dataset.price) : parsePriceFromElement(c);
        const w = c.dataset.weight || parseWeightFromElement(c);
        if(p) { it.price = p; changed = true; }
        if(w) { it.weight = w; changed = true; }
      }
    }
    if(changed) saveCart();
  })();
  // open side cart on bin click (restore previous behavior)
  const bin = document.querySelector('.bin');
  if(bin){ 
    bin.addEventListener('click', function(e){
      e && e.preventDefault();
      createCartDOM();
      openCart();
    });
  }
  // make the navigation "Доставка" go to the order page
  document.querySelectorAll('.nav_txt, .fnav_txt').forEach(a => {
    try{
      if(a.textContent && a.textContent.trim().toLowerCase().includes('доставка')){
        a.addEventListener('click', function(e){ e && e.preventDefault(); window.location.href = 'order.html'; });
      }
      
    }catch(e){/* ignore */}
  });
  document.querySelectorAll('.nav_txt, .fnav_txt').forEach(a => {
    try{
      if(a.textContent && a.textContent.trim().toLowerCase().includes('меню')){
        a.addEventListener('click', function(e){ e && e.preventDefault(); window.location.href = 'menu.html'; });
      }
    }catch(e){/* ignore */}
  });
  // wire .button clicks to  add item and open cart
  const productButtons = document.querySelectorAll('.button');
  productButtons.forEach(btn => {
    btn.addEventListener('click', function(e){
      // find product container
      const product = btn.closest('.rd, .sd, .std, .drd');
      if(product){
        if(!product.dataset.productId) ensureProductIds();
        addToCart(product.dataset.productId,0);
      }
    });
  });
  // apply saved cart state to buttons
  syncButtonsWithCart();
  renderCart();
  // wire banner order button to add current banner image
  const orderBtn = document.getElementById('order');
  if(orderBtn){
    orderBtn.addEventListener('click', function(){ if(b2_txt) addToCartByImage(b2_txt); });
  }
});
