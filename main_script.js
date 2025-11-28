var b2_txt = ""
function random_banner2_img(min,max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var random = Math.floor(Math.random() * (max - min + 1) + min);
    if (random == 1) {
        b2_txt = "https://i.postimg.cc/cC6T9bZz/rolls3.png"
    }
    if (random == 2) {
        b2_txt= "https://i.postimg.cc/7YBLSRWK/Gemini-Generated-Image-gzf8tgzf8tgzf8tg-1.png"
    }
    if (random == 3) {
        b2_txt = "https://i.postimg.cc/02tN74Bd/Gemini-Generated-Image-na26tvna26tvna26-1.png"
    }
    console.log(b2_txt);
    var banner2_img = document.getElementById("banner2_change");
    banner2_img.setAttribute('src' , b2_txt);
}
random_banner2_img(1, 3)
    

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
      <div style="display:flex;gap:.5rem;"><button class="clear-cart">Очистити</button><button class="checkout">Оформити</button></div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  overlay.addEventListener('click', closeCart);
  panel.querySelector('.close-btn').addEventListener('click', closeCart);
  panel.querySelector('.clear-cart').addEventListener('click', function(){
    for(const k in cart) delete cart[k]; renderCart();
  });
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

function renderCart(){
  const panel = document.querySelector('.cart-panel');
  if(!panel) return;
  const itemsEl = panel.querySelector('.cart-items');
  itemsEl.innerHTML = '';
  let totalCount = 0;
  for(const id in cart){
    const it = cart[id];
    totalCount += it.qty;
    const row = document.createElement('div'); row.className = 'cart-item';
    row.innerHTML = `
      <img src="${it.img}" alt="${escapeHtml(it.name)}">
      <div class="meta"><h4>${escapeHtml(it.name)}</h4>
        <div class="qty-controls">
          <button class="qty-dec" data-id="${id}">−</button>
          <input type="number" min="1" class="qty-input" data-id="${id}" value="${it.qty}" />
          <button class="qty-inc" data-id="${id}">+</button>
        </div>
      </div>
      <div><button class="remove" data-id="${id}">Видалити</button></div>
    `;
    itemsEl.appendChild(row);
  }
  panel.querySelector('.count').textContent = totalCount;
  // attach remove listeners
  panel.querySelectorAll('.remove').forEach(btn=> btn.addEventListener('click', function(e){ const id = this.dataset.id; removeFromCart(id); }));
  // attach qty controls
  panel.querySelectorAll('.qty-inc').forEach(b=> b.addEventListener('click', function(){ const id=this.dataset.id; if(cart[id]){ cart[id].qty += 1; renderCart(); }}));
  panel.querySelectorAll('.qty-dec').forEach(b=> b.addEventListener('click', function(){ const id=this.dataset.id; if(cart[id]){ cart[id].qty = Math.max(1, cart[id].qty - 1); renderCart(); }}));
  panel.querySelectorAll('.qty-input').forEach(i=> i.addEventListener('change', function(){ const id=this.dataset.id; let v = parseInt(this.value,10)||1; v = Math.max(1,v); if(cart[id]){ cart[id].qty = v; renderCart(); }}));
  updateBinBadge();
}

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function addToCart(productId){
  if(!productId) return;
  const container = document.querySelector(`[data-product-id="${productId}"]`);
  if(!container) return;
  const name = container.querySelector('h2') ? container.querySelector('h2').textContent.trim() : 'Товар';
  const img = container.querySelector('img') ? container.querySelector('img').src : '';
  // Toggle behavior: if exists remove completely, otherwise add with qty=1
  if(cart[productId]){
    delete cart[productId];
  } else {
    cart[productId] = { id: productId, name, img, qty: 1 };
  }
  renderCart();
}

function removeFromCart(productId){ 
  delete cart[productId]; 
  renderCart(); 
  button.classList.toggle("following");
  button.textContent = button.classList.contains("following") ? "" : "";
}

function openCart(){ createCartDOM(); document.querySelector('.cart-overlay').classList.add('visible'); document.querySelector('.cart-panel').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeCart(){ const ov = document.querySelector('.cart-overlay'); const p = document.querySelector('.cart-panel'); if(ov) ov.classList.remove('visible'); if(p) p.classList.remove('open'); document.body.style.overflow = ''; }

// wire .bin to open cart
document.addEventListener('DOMContentLoaded', function(){
  ensureProductIds();
  createCartDOM();
  // open cart on bin click
  const bin = document.querySelector('.bin'); if(bin) bin.addEventListener('click', openCart);
  // wire .button clicks to add item and open cart
  const productButtons = document.querySelectorAll('.button');
  productButtons.forEach(btn => {
    btn.addEventListener('click', function(e){
      // find product container
      const product = btn.closest('.rd, .sd, .std, .drd');
      if(product){
        if(!product.dataset.productId) ensureProductIds();
        addToCart(product.dataset.productId);
      }
    });
  });
});