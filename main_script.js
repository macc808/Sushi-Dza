const buttons = [...document.getElementsByClassName("button")];
buttons.forEach(button => {
  button.addEventListener("click", function() {
    button.classList.toggle("following");
    button.textContent = button.classList.contains("following") ? "" : "";
  })
});

// for demo only
setTimeout(function() {
  document.querySelector("button").focus();
}, 500);


