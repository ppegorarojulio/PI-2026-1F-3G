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
  let comecoToque = 0;
  let fimToque = 0;
  window.addEventListener('touchstart', (event) => {
    comecoToque = event.changedTouches[0].screenX
  });
 window.addEventListener('touchstart', (event) => {
    fimToque = event.changedTouches[0].screenX
    arraste()
  })

  function arraste() {
    const distanciaMin = 50; 
    const diferenca = comecoToque - fimToque;

    if (Math.abs(diferenca) > distanciaMin) {
      if (diferenca > 0) {
        atualizarCarrossel(indexAtual + 1);
      } else {
        atualizarCarrossel(indexAtual - 1);
      }
    }
  }
 botoes.forEach((botao, i) => {
    botao.addEventListener('click', () => {
      atualizarCarrossel(i);
    });
  });
 
  items[0].classList.add("carrossel__card-presente");
  botoes[0].classList.add("carrossel__botao-presente");

});

const traducoes = {
    'pt': {
        
        'menu.inicio': 'Início',
        'menu.traducao': 'Tradução',
        'menu.dublagem': 'Dublagem',
        'menu.legenda': 'Legendagem',
        'menu.interpretes': 'Intérpretes',
        
        
        'home.titulo_principal': 'Aprenda Informações sobre',
        'home.titulo_tidle': 'T.I.D.LE.',
        'home.descricao': 'Saiba como tradução, intérpretes, dublagem e legendagem aproximam pessoas e culturas.',
        
        
        'abordagem.titulo': 'Nossa abordagem',
        'abordagem.descricao_antes': 'Conheça detalhadamente cada área de informações que disponibilizamos ao interagir e explorar pela nossa coletânea de conhecimentos sobre ',
        'abordagem.span': 'Tradução, Dublagem, Legendagem e Intérpretes.',
        
        
        'card1.titulo': 'Tradução',
        'card1.descricao': 'Descubra como transformar ideias e significados entre diferentes línguas.',
        
        'card2.titulo': 'Dublagem',
        'card2.descricao': 'Descubra como a dublagem recria vozes e sentidos, levando histórias além das barreiras do idioma.',
        
        'card3.titulo': 'Legendagem',
        'card3.descricao': 'Descubra como a legendagem transforma falas em texto, preservando os sentidos e as emoções.',
        
        'card4.titulo': 'Intérpretes',
        'card4.descricao': 'Descubra como os intérpretes lidam com a pressão de traduzir em tempo real, equilibrando precisão, emoção e contexto cultural.',
        
        
        'teste.titulo': 'Faça você mesmo!',
        'teste.descricao': 'Acesse nossa experiência única de dublar o vídeo de sua escolha para experimentar o processo dos dubladores ao vivo.',
        'teste.botao': 'Testar     ➜',
        
        
        'footer.sobre': 'Sobre Nós',
        'footer.sobre_texto': '📍Nós somos estudantes do Primeiro Ano do EM do Instituto Federal Catarinense - Campus Concórdia, cursamos informática para internet. Criamos esse site com o intuito de disponibilizar informações.',
        'footer.contato': 'Contato',
        'footer.contato_texto': '✉️ 3grupopi@gmail.com'
    },
    
    'en': {
        
        'menu.inicio': 'Home',
        'menu.traducao': 'Translation',
        'menu.dublagem': 'Dubbing',
        'menu.legenda': 'Subtitle',
        'menu.interpretes': 'Interpreters',
        
        
        'home.titulo_principal': 'Learn Information about',
        'home.titulo_tidle': 'T.I.D.LE.',
        'home.descricao': 'Learn how translation, interpreters, dubbing and subtitling bring people and cultures together.',
        
        
        'abordagem.titulo': 'Our approach',
        'abordagem.descricao_antes': 'Learn in detail about each area of information we provide by interacting and exploring our collection of knowledge about ',
        'abordagem.span': 'Translation, Dubbing, Subtitling and Interpreters.',
        
        
        'card1.titulo': 'Translation',
        'card1.descricao': 'Discover how to transform ideas and meanings between different languages.',
        
        'card2.titulo': 'Dubbing',
        'card2.descricao': 'Discover how dubbing recreates voices and meanings, taking stories beyond language barriers.',
        
        'card3.titulo': 'Subtitling',
        'card3.descricao': 'Discover how subtitling transforms speech into text, preserving meanings and emotions.',
        
        'card4.titulo': 'Interpreters',
        'card4.descricao': 'Discover how interpreters handle the pressure of translating in real time, balancing precision, emotion and cultural context.',
        
        
        'teste.titulo': 'Do it yourself!',
        'teste.descricao': 'Access our unique experience of dubbing the video of your choice to experience the process of dubbing actors live.',
        'teste.botao': 'Test     ➜',
        
        
        'footer.sobre': 'About Us',
        'footer.sobre_texto': '📍We are first-year high school students from Instituto Federal Catarinense - Campus Concórdia, studying internet computing. We created this website to provide information.',
        'footer.contato': 'Contact',
        'footer.contato_texto': '✉️ 3grupopi@gmail.com'
    }
};


function mudarLingua(ling) {
    document.documentElement.lang = ling;
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (traducoes[ling] && traducoes[ling][key]) {
            element.textContent = traducoes[ling][key];
        }
    });
    
    localStorage.setItem('lingPreferrida', ling);
    
    document.querySelectorAll('.linguagemBt').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === ling) {
            btn.classList.add('active');
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const lingSalva= localStorage.getItem('lingPreferrida') || 'pt';
    mudarLingua(lingSalva);
});


document.querySelectorAll('.linguagemBt').forEach(bt => {
    bt.addEventListener('click', () => {
        const ling = bt.getAttribute('data-lang');
        mudarLingua(ling);
    });
});