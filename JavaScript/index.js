document.querySelectorAll(".carrossel").forEach((carrossel) => {
  const items = carrossel.querySelectorAll(".carrossel__card");
  const botoesHtml = Array.from(items, () => {
    return `<span class="carrossel__botao"></span>`;
  });

  carrossel.insertAdjacentHTML(
    "beforeend",
    `
		<div class="carrossel__nav">
			${botoesHtml.join("")}
		</div>
	`
  );

  const botoes = carrossel.querySelectorAll(".carrossel__botao");

  botoes.forEach((botao, i) => {
    botao.addEventListener("click", () => {
      items.forEach((item) =>
        item.classList.remove("carrossel__card-presente")
      );
      botoes.forEach((botao) =>
        botao.classList.remove("carrossel__botao-presente")
      );

      items[i].classList.add("carrossel__card-presente");
      botao.classList.add("carrossel__botao-presente");
    });
  });

 
  items[0].classList.add("carrossel__card-presente");
  botoes[0].classList.add("carrossel__botao-presente");
});
