const  add_cart_buttons = [...document.getElementsByClassName("add_to_cart")];
buttons.forEach(add_to_cart => {
  button.addEventListener("click", function() {
    button.classList.toggle("addcart");
    button.textContent = button.classList.contains("addcart") ? "Прибрати з кошика" : "Додати до кошика";
  })
});

// for demo only
setTimeout(function() {
  document.getElementsByClassName("add_to_cart").focus();
}, 500);
