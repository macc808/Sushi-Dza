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
  button.addEventListener("click", function() {
    button.classList.toggle("following");
    button.textContent = button.classList.contains("following") ? "" : "";
  })
});

// for demo only
setTimeout(function() {
  document.querySelector("button").focus();
}, 500);
