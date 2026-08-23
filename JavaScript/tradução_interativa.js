const traducoes = {
    'pt': {

      'menu.inicio': 'Início',
        'menu.traducao': 'Tradução',
        'menu.dublagem': 'Dublagem',
        'menu.legenda': 'Legendagem',
        'menu.interpretes': 'Intérpretes',
        


        'footer.sobre': 'Sobre Nós',
        'footer.sobre_texto': '📍Nós somos estudantes do Primeiro Ano do EM do Instituto Federal Catarinense - Campus Concórdia, cursamos informática para internet. Criamos esse site com o intuito de disponibilizar informações.',
        'footer.contato': 'Contato',
        'footer.contato_texto': '✉️ 3grupopi@gmail.com',

        'interativa.titulo1': 'EXPERIMENTE',
        'interativa.titulo2': 'DUBLAR',
        'interativa.descricao': 'Tenha a oportunidade de sentir na pele, ou melhor, na voz a experiência dos dubladores!',
        'interativa.passos': 'Passos:',
        'interativa.passo1_titulo': 'Seu vídeo:',
        'interativa.passo1_desc': 'Escolha algum vídeo da sua galeria ou o link do youtube.',
        'interativa.passo2_titulo': 'Dublar',
        'interativa.passo2_desc': 'Escolha o trecho do vídeo, duble de acordo com os modos disponíveis.',
        'interativa.passo3_titulo': 'Ver',
        'interativa.passo3_desc': 'Veja o resultado final ou baixe-o.',
        'teste.titulo': 'Faça você mesmo!',
        'projeto.tutorial': 'Dê Upload do vídeo (mp4) e selecione o trecho que você queira dublar, após isso clique em Ouvir Trecho para saber suas falas e clique em Começar Dublagem e tente sincroniza-las com as ondas de aúdio',
        'projeto.tutorial2': 'Depois veja o resultado e baixe se quiser compartilhar com amigos',
        'projeto.inicio': 'Inicio do trecho (segundos)',
        'projeto.fim': 'Fim do trecho (segundos)',
        'projeto.ouvir': 'Ouvir original',
        'projeto.comecar': 'Começar Dublagem',
        'projeto.parar': 'Parar',
        'projeto.status': 'Envie um vídeo para começar.',
        'projeto.status1': 'Dublagem salva. Você já pode assistir ou baixar o vídeo.',
        'projeto.status2': 'Vídeo dublado baixado com sucesso.',
        'projeto.status3': 'Vídeo carregado.',
        'projeto.status4': 'Não foi possível ler o áudio deste vídeo.',
        'projeto.status5': 'Trecho original finalizado. Agora você pode dublar.',
        'projeto.status6': 'Ouvindo o áudio original.',
        'projeto.status7': 'Escolha um trecho válido.',
        'projeto.status8': 'O vídeo está sem som para você fazer a dublagem.',
        'projeto.status9': 'Não foi possível iniciar o microfone.',
        'projeto.status10': 'Reprodução interrompida.',
        'projeto.resultado': 'Resultado da dublagem',
        'projeto.modo1': 'Modo 1',
        'projeto.modo2': 'Modo 2',
        'projeto.assistirDublagem': 'Assistir dublagem',
        'projeto.baixar': 'Baixar vídeo dublado'
    },

    'en': {


        'menu.inicio': 'Home',
        'menu.traducao': 'Translation',
        'menu.dublagem': 'Dubbing',
        'menu.legenda': 'Subtitle',
        'menu.interpretes': 'Interpreters',
        


        'footer.sobre': 'About Us',
        'footer.sobre_texto': '📍We are first-year high school students from Instituto Federal Catarinense - Campus Concórdia, studying internet computing. We created this website to provide information.',
        'footer.contato': 'Contact',
        'footer.contato_texto': '✉️ 3grupopi@gmail.com',
          
        
        'interativa.titulo1': 'EXPERIENCE',
        'interativa.titulo2': 'DUBBING',
        'interativa.descricao': 'Have the opportunity to feel in your skin, or rather, in your voice, the experience of voice actors!',
        'interativa.passos': 'Steps:',
        'interativa.passo1_titulo': 'Your video:',
        'interativa.passo1_desc': 'Choose a video from your gallery or a YouTube link.',
        'interativa.passo2_titulo': 'Dubbing',
        'interativa.passo2_desc': 'Choose the video segment, dub according to the available modes.',
        'interativa.passo3_titulo': 'Watch',
        'teste.titulo': 'Do it Yourself!',
        'interativa.passo3_desc': 'See the final result or download it.',
        'projeto.tutorial': 'Upload your video (MP4) and select the clip you want to dub. Then, click “Listen to Clip” to hear your lines. After that, click “Start Dubbing” and try to synchronize your voice with the audio waves.',
        'projeto.tutorial2': 'Then see the result and download it if you want to share it with friends',
        'projeto.inicio': 'Clip start (seconds)',
        'projeto.fim': 'Clip end (seconds)',
        'projeto.ouvir': 'Listen to original',
        'projeto.comecar': 'Start Dubbing',
        'projeto.parar': 'Stop',
        'projeto.status': 'Upload a video to start.',
        'projeto.status1': 'Dubbing saved. You can now watch or download the video.',
        'projeto.status2': 'Dubbed video downloaded successfully.',
        'projeto.status3': 'Video loaded.',
        'projeto.status4': 'Could not read the audio from this video.',
        'projeto.status5': 'Original clip finished. You can now dub.',
        'projeto.status6': 'Listening to the original audio.',
        'projeto.status7': 'Choose a valid clip.',
        'projeto.status8': 'The video is muted for you to do the dubbing.',
        'projeto.status9': 'Could not start the microphone.',
        'projeto.status10': 'Playback interrupted.',
        'projeto.resultado': 'Dubbing result',
        'projeto.modo1': 'Mode 1',
        'projeto.modo2': 'Mode 2',
        'projeto.assistirDublagem': 'Watch dubbing',
        'projeto.baixar': 'Download dubbed video'
    }
}

export function mudarLingua(ling) {
    const idiomaAtual = ling || localStorage.getItem('lingPreferrida') || 'pt';
    document.documentElement.lang = idiomaAtual;
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (traducoes[idiomaAtual] && traducoes[idiomaAtual][key]) {
            element.textContent = traducoes[idiomaAtual][key];
        }
    });
    
    localStorage.setItem('lingPreferrida', idiomaAtual);
    
    document.querySelectorAll('.linguagemBt').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === idiomaAtual) {
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