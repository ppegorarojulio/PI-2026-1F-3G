const arquivoVideo = document.querySelector(".arquivoVideo")
const video = document.querySelector(".video")
const tempos = document.querySelector(".tempos")
const inputInicio = document.getElementById("inicio")
const inputFim = document.getElementById("fim")
const botoes = document.querySelector(".botoes-js")
const canvas = document.querySelector(".onda")
const context = canvas.getContext("2d")
const ouvirOriginal = document.querySelector(".ouvirOriginal")
const dublarBotao = document.querySelector(".dublar")
const pararBotao = document.querySelector(".parar")
const mensagemStatus = document.querySelector(".status")
const resultado = document.querySelector(".resultado")
const videoResultado = document.querySelector(".videoResultado")
const ouvirDublado = document.querySelector(".ouvir")
const baixarVideoBotao = document.querySelector(".baixarVideo")
const audioDublado = document.querySelector(".audioDublado")
const modoComSomBotao = document.querySelector(".CSom");
const modoSemSomBotao = document.querySelector(".SSom");
const volume_original = 0.15;

    let audioContext;
    let sourceVideo;
    let ganhoVideo;
    let analyserMicrofone;
    let destinoGravacao;
    let streamMicrofone;
    let sourceMicrofone;
    let gravadorAudio;
    let pedacosAudio = [];
    let fonteVideoResultado;
    let fonteAudioDublado;
    let ganhoVideoResultado;
    let destinoExportacao;
    let gravadorVideo;
    let pedacosVideo = [];
    let audioBuffer;
    let urlVideo;
    let urlDublagem;
    let urlVideoDublado;
    let animacaoOnda;
    let dublando = false;
    let tocandoOriginal = false;
    let exportandoVideo = false;
    let trechoGravado;
    let picosVideo = [];
    let picosDublagem = [];
    let ultimoIndice = -1;
    let modoComSom = true;
    let reproduzindoResultado = false;

      function ajustarCanvas() {
      const escala = window.devicePixelRatio || 1;

      canvas.width = canvas.clientWidth * escala;
      canvas.height = canvas.clientHeight * escala;

      context.setTransform(escala, 0, 0, escala, 0, 0);

      prepararOnda();
      desenharOnda();
    }

    window.addEventListener("resize", ajustarCanvas);

    function obterTrecho() {
      const inicio = Number(inputInicio.value);
      const fim = Number(inputFim.value);

      if (
        Number.isNaN(inicio) ||
        Number.isNaN(fim) ||
        inicio < 0 ||
        fim > video.duration ||
        inicio >= fim
      ) {
        return null;
      }

      return { inicio, fim };
    }
    modoComSomBotao.addEventListener("click", () => {
      modoComSom = true;
      atualizarModo();
    });
    modoSemSomBotao.addEventListener("click", () => {
      modoComSom = false;
      atualizarModo();
    });

    function atualizarModo() {
      if (ganhoVideoResultado && audioContext) {ganhoVideoResultado.gain.setValueAtTime(
          modoComSom ? volume_original : 0, audioContext.currentTime
        );
      }

      modoComSomBotao.classList.toggle("ativo", modoComSom);
      modoSemSomBotao.classList.toggle("ativo", !modoComSom);
    }

    async function iniciarAudio() {
      if (audioContext) return;

      audioContext = new AudioContext();

      sourceVideo =
        audioContext.createMediaElementSource(video);

      ganhoVideo = audioContext.createGain();
      ganhoVideo.gain.value = 1;

      sourceVideo.connect(ganhoVideo);
      ganhoVideo.connect(audioContext.destination);

      destinoGravacao =
        audioContext.createMediaStreamDestination();

      analyserMicrofone = audioContext.createAnalyser();
      analyserMicrofone.fftSize = 1024;

      const ganhoSilencioso = audioContext.createGain();
      ganhoSilencioso.gain.value = 0;

      analyserMicrofone.connect(ganhoSilencioso);
      ganhoSilencioso.connect(audioContext.destination);
    }

    async function ativarMicrofone() {
      streamMicrofone = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      sourceMicrofone =
        audioContext.createMediaStreamSource(streamMicrofone);

      sourceMicrofone.connect(destinoGravacao);
      sourceMicrofone.connect(analyserMicrofone);
    }

    function desativarMicrofone() {
      if (sourceMicrofone) {
        sourceMicrofone.disconnect();
        sourceMicrofone = null;
      }

      if (streamMicrofone) {
        streamMicrofone.getTracks().forEach(track => track.stop());
        streamMicrofone = null;
      }
    }

    function criarPicos(inicio, fim, quantidade) {
      const canal = audioBuffer.getChannelData(0);
      const taxa = audioBuffer.sampleRate;

      const amostraInicio = Math.floor(inicio * taxa);
      const amostraFim = Math.floor(fim * taxa);

      const tamanhoBloco = Math.max(
        1,
        Math.floor((amostraFim - amostraInicio) / quantidade)
      );

      const picos = [];

      for (let i = 0; i < quantidade; i++) {
        const primeiro = amostraInicio + i * tamanhoBloco;
        const ultimo = Math.min(primeiro + tamanhoBloco, amostraFim);

        let maior = 0;

        for (let j = primeiro; j < ultimo; j++) {
          maior = Math.max(maior, Math.abs(canal[j] || 0));
        }

        picos.push(maior);
      }

      return picos;
    }

    function prepararOnda() {
      const trecho = obterTrecho();

      if (!audioBuffer || !trecho || !canvas.clientWidth) return;

      const quantidade = Math.ceil(canvas.clientWidth / 2);

      picosVideo = criarPicos(
        trecho.inicio,
        trecho.fim,
        quantidade
      );

      picosDublagem = new Array(quantidade).fill(0);
    }

    function nivelDoAudio(analyser) {
      const dados = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(dados);

      let soma = 0;

      for (const valor of dados) {
        const amostra = (valor - 128) / 128;
        soma += amostra * amostra;
      }

      return Math.sqrt(soma / dados.length);
    }

    function desenharOnda() {
      const largura = canvas.clientWidth;
      const altura = canvas.clientHeight;

      context.clearRect(0, 0, largura, altura);
      context.fillStyle = "#030609";
      context.fillRect(0, 0, largura, altura);

      if (!picosVideo.length) return;

      const meio = altura / 2;
      const larguraBarra = largura / picosVideo.length;

      for (let i = 0; i < picosVideo.length; i++) {
        const tamanho = Math.max(2, picosVideo[i] * altura * 0.46);
        const x = i * larguraBarra;

        context.fillStyle = "#34404c";

        context.fillRect(
          x,
          meio - tamanho,
          Math.max(1, larguraBarra - 1),
          tamanho * 2
        );
      }

      const gradiente = context.createLinearGradient(0, 0, largura, 0);
      gradiente.addColorStop(0, "#F2274C");
      gradiente.addColorStop(0.5, "#ffffff");
      gradiente.addColorStop(1, "#0b4e8a");

      context.fillStyle = gradiente;
      context.shadowColor = "#3986c9";
      context.shadowBlur = 8;

      for (let i = 0; i < picosDublagem.length; i++) {
        if (picosDublagem[i] < 0.02) continue;

        const tamanho = Math.max(
          2,
          picosDublagem[i] * altura * 0.46
        );

        const x = i * larguraBarra;

        context.fillRect(
          x,
          meio - tamanho,
          Math.max(1, larguraBarra - 1),
          tamanho * 2
        );
      }

      context.shadowBlur = 0;
    }

    function iniciarGravacaoAudio() {
      pedacosAudio = [];

      const formatos = [
        "audio/webm;codecs=opus",
        "audio/webm"
      ];

      const formato = formatos.find(
        item => MediaRecorder.isTypeSupported(item)
      );

      gravadorAudio = new MediaRecorder(
        destinoGravacao.stream,
        formato ? { mimeType: formato } : undefined
      );

      gravadorAudio.addEventListener("dataavailable", evento => {
        if (evento.data.size > 0) {
          pedacosAudio.push(evento.data);
        }
      });

      gravadorAudio.addEventListener("stop", () => {
        const blob = new Blob(pedacosAudio, {
          type: gravadorAudio.mimeType || "audio/webm"
        });

        if (urlDublagem) {
          URL.revokeObjectURL(urlDublagem);
        }

        urlDublagem = URL.createObjectURL(blob);

        audioDublado.src = urlDublagem;

        videoResultado.src = urlVideo;
        videoResultado.currentTime = trechoGravado.inicio;

        resultado.style.display = "block";

        mensagemStatus.textContent =
          "Dublagem salva. Você já pode assistir ou baixar o vídeo."
      });

      gravadorAudio.start();
    }

    function atualizar() {
      if (!dublando) return;

      const trecho = obterTrecho();

      if (!trecho || video.currentTime >= trecho.fim || video.ended) {
        finalizar();
        return;
      }

      const progresso = (video.currentTime - trecho.inicio) /
        (trecho.fim - trecho.inicio);

      const indice = Math.floor(progresso * picosDublagem.length);

      const nivelVoz = Math.min(
        1,
        nivelDoAudio(analyserMicrofone) * 4
      );

      if (indice >= 0 && indice < picosDublagem.length) {
        picosDublagem[indice] = Math.max(
        picosDublagem[indice],
        nivelVoz
        );
      };
      desenharOnda();
      animacaoOnda = requestAnimationFrame(atualizar);
    };

    function finalizar() {
      if (!dublando) return;
      dublando = false;
      video.pause();
      cancelAnimationFrame(animacaoOnda);
      if ( gravadorAudio && gravadorAudio.state !== "inactive") {
        gravadorAudio.stop();
      }
      desativarMicrofone();
      ganhoVideo.gain.setValueAtTime(
        1,
        audioContext.currentTime
      );

      dublarBotao.disabled = false;
      dublarBotao.textContent = "Começar dublagem";

      desenharOnda();
    }

    async function prepararAudioResultado() {
      await iniciarAudio();

      if (fonteVideoResultado) return;

      fonteVideoResultado =
        audioContext.createMediaElementSource(videoResultado);
      ganhoVideoResultado = audioContext.createGain();
      ganhoVideoResultado.gain.value = modoComSom ? volume_original : 0;
      fonteVideoResultado.connect(ganhoVideoResultado);
      ganhoVideoResultado.connect(audioContext.destination);
      fonteAudioDublado =
        audioContext.createMediaElementSource(audioDublado);
      fonteAudioDublado.connect(audioContext.destination);
      destinoExportacao =
        audioContext.createMediaStreamDestination();
      ganhoVideoResultado.connect(destinoExportacao);
      fonteAudioDublado.connect(destinoExportacao);
    };

    function pararOriginal() {
      tocandoOriginal = false;
      video.pause();

      if (ganhoVideo && audioContext) {
        ganhoVideo.gain.setValueAtTime(
          1,
          audioContext.currentTime
        );
      }
    }

    async function tocarResultado(exportar = false) {
      if (!urlDublagem || !trechoGravado) return;
      if (reproduzindoResultado) return;
      reproduzindoResultado = true;
      bloquear(true);
      await prepararAudioResultado();
      atualizarModo();
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      videoResultado.pause();
      audioDublado.pause();
      videoResultado.currentTime = trechoGravado.inicio;
      audioDublado.currentTime = 0;

      if (exportar) {
        iniciarExportacaoVideo();
      }

      await Promise.all([
        videoResultado.play(),
        audioDublado.play()
      ]);
    };

    function iniciarExportacaoVideo() {
      if (!videoResultado.captureStream) {
        alert(
          "Seu navegador não suporta a exportação de vídeo. Use Chrome ou Edge."
        );
        return;
      }

      const streamVideo = videoResultado.captureStream();

      const streamFinal = new MediaStream([
        ...streamVideo.getVideoTracks(),
        ...destinoExportacao.stream.getAudioTracks()
      ]);

      const formatos = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm"
      ];

      const formato = formatos.find(
        item => MediaRecorder.isTypeSupported(item)
      );

      pedacosVideo = [];

      gravadorVideo = new MediaRecorder(
        streamFinal,
        formato ? { mimeType: formato } : undefined
      );

      gravadorVideo.addEventListener("dataavailable", evento => {
        if (evento.data.size > 0) {
          pedacosVideo.push(evento.data);
        }
      });

      gravadorVideo.addEventListener("stop", () => {
        const blob = new Blob(pedacosVideo, {
          type: gravadorVideo.mimeType || "video/webm"
        });

        if (urlVideoDublado) {
          URL.revokeObjectURL(urlVideoDublado);
        }

        urlVideoDublado = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = urlVideoDublado;
        link.download = "video-dublado.webm";

        document.body.appendChild(link);
        link.click();
        link.remove();

        mensagemStatus.textContent =
          "Vídeo dublado baixado com sucesso.";

        baixarVideoBotao.disabled = false;
        baixarVideoBotao.textContent = "Baixar vídeo dublado";

        exportandoVideo = false;
      });

      exportandoVideo = true;

      baixarVideoBotao.disabled = true;
      baixarVideoBotao.textContent = "Gerando vídeo...";

      gravadorVideo.start();
    }

    function finalizarExportacaoVideo() {
      if (
        gravadorVideo &&
        gravadorVideo.state !== "inactive"
      ) {
        gravadorVideo.stop();
      }
    }

    arquivoVideo.addEventListener("change", async () => {
      const arquivo = arquivoVideo.files[0];

      if (!arquivo) return;

      if (urlVideo) {
        URL.revokeObjectURL(urlVideo);
      }

      if (urlDublagem) {
        URL.revokeObjectURL(urlDublagem);
        urlDublagem = null;
      }

      if (urlVideoDublado) {
        URL.revokeObjectURL(urlVideoDublado);
        urlVideoDublado = null;
      }

      pararOriginal();

      videoResultado.pause();
      audioDublado.pause();

      resultado.style.display = "none";

      urlVideo = URL.createObjectURL(arquivo);

      video.src = urlVideo;
      video.style.display = "block";

      try {
        await iniciarAudio();

        const dados = await arquivo.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(dados);

        mensagemStatus.textContent = "Vídeo carregado.";

        if (Math.floor(video.duration)) {
          prepararOnda();
          desenharOnda();
        }
      } catch (erro) {
        console.error(erro);

        mensagemStatus.textContent =
          "Não foi possível ler o áudio deste vídeo.";
      }
    });

    video.addEventListener("loadedmetadata", () => {
      inputInicio.max = Math.floor(video.duration);
      inputFim.max = Math.floor(video.duration);
      inputFim.value = Math.floor(video.duration).toFixed(1);

      tempos.style.display = "grid";
      botoes.style.display = "flex";

      ajustarCanvas();
    });

    video.addEventListener("timeupdate", () => {
      const trecho = obterTrecho();

      if (
        tocandoOriginal &&
        trecho &&
        video.currentTime >= trecho.fim
      ) {
        pararOriginal();

        mensagemStatus.textContent =
          "Trecho original finalizado. Agora você pode dublar.";
      }
    });

    inputInicio.addEventListener("input", () => {
      prepararOnda();
      desenharOnda();
    });

    inputFim.addEventListener("input", () => {
      prepararOnda();
      desenharOnda();
    });

    ouvirOriginal.addEventListener("click", async () => {
      if (reproduzindoResultado) return;
      const trecho = obterTrecho();

      if (!trecho || dublando) return;

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      ganhoVideo.gain.setValueAtTime(
        1,
        audioContext.currentTime
      );

      tocandoOriginal = true;
      video.currentTime = trecho.inicio;

      await video.play();

      mensagemStatus.textContent = "Ouvindo o áudio original.";
    });

    dublarBotao.addEventListener("click", async () => {
      if (reproduzindoResultado) return;
      const trecho = obterTrecho();

      if (!trecho) {
        mensagemStatus.textContent = "Escolha um trecho válido.";
        return;
      }

      try {
        await iniciarAudio();

        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        pararOriginal();

        videoResultado.pause();
        audioDublado.pause();

        prepararOnda();
        trechoGravado = { ...trecho };

        await ativarMicrofone();
        iniciarGravacaoAudio();

        ganhoVideo.gain.setValueAtTime(
          0,
          audioContext.currentTime
        );

        video.currentTime = trecho.inicio;

        dublando = true;
        dublarBotao.disabled = true;
        dublarBotao.textContent = "Dublando...";

        await video.play();

        mensagemStatus.textContent =
          "O vídeo está sem som para você fazer a dublagem.";

        atualizar();
      } catch (erro) {
        console.error(erro);

        dublando = false;
        desativarMicrofone();

        ganhoVideo.gain.setValueAtTime(
          1,
          audioContext.currentTime
        );

        mensagemStatus.textContent =
          "Não foi possível iniciar o microfone.";
      }
    });

    pararBotao.addEventListener("click", () => {
      if (dublando) {
        finalizar();
      } else {
        pararOriginal();
        mensagemStatus.textContent = "Reprodução interrompida.";
      }
    });

    ouvirDublado.addEventListener("click", async () => {
      await tocarResultado(false);
    });

    baixarVideoBotao.addEventListener("click", async () => {
      await tocarResultado(true);
    });

    audioDublado.addEventListener("ended", () => {
      videoResultado.pause();

      if (exportandoVideo) {
        finalizarExportacaoVideo();
      }

      reproduzindoResultado = false;
      bloquear(false);
    });

    function bloquear(bloquear) {
      ouvirOriginal.disabled = bloquear;
      dublarBotao.disabled = bloquear;
    }