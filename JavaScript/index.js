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

  let indexAtual = 0;

  function atualizarCarrossel(indexNovo) {
    items[indexAtual].classList.remove('carrossel__card-presente');
    botoes[indexAtual].classList.remove('carrossel__botao-presente');
    
    indexAtual = (indexNovo + items.length) % items.length;
    
    items[indexAtual].classList.add('carrossel__card-presente');
    botoes[indexAtual].classList.add('carrossel__botao-presente');
  }


  window.addEventListener('keydown', (event) => {
    const tecla = event.key;
    if (tecla === 'ArrowRight' || tecla.toLowerCase() === 'd') {
      atualizarCarrossel(indexAtual + 1);
  } else if (tecla === 'ArrowLeft' || tecla.toLowerCase() === 'a') {
      atualizarCarrossel(indexAtual - 1);
  }
  });
  
 botoes.forEach((botao, i) => {
    botao.addEventListener('click', () => {
      atualizarCarrossel(i);
    });
  });

 
  items[0].classList.add("carrossel__card-presente");
  botoes[0].classList.add("carrossel__botao-presente");

});