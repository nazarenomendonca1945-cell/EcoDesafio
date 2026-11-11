const questions=[
{q:"Você terminou uma garrafa PET. Qual atitude é mais adequada?",a:["Colocar no reciclável de plástico","Jogar no orgânico","Deixar na rua","Queimar"],c:0,e:"PET é plástico e pode ser encaminhado para reciclagem quando houver coleta adequada."},
{q:"Uma casca de banana deve ser classificada, em geral, como:",a:["Metal","Orgânico","Vidro","Eletrônico"],c:1,e:"Restos de alimentos são resíduos orgânicos."},
{q:"Jornais e folhas limpas pertencem principalmente à categoria:",a:["Papel","Vidro","Metal","Orgânico"],c:0,e:"Papel limpo e seco pode ser encaminhado para reciclagem."},
{q:"Uma lata de alumínio é um resíduo de:",a:["Metal","Papel","Orgânico","Madeira"],c:0,e:"Latas de alumínio são metais recicláveis."},
{q:"Uma garrafa de vidro deve ser encaminhada para:",a:["Coleta de vidro, quando disponível","Lixo orgânico","Papel","Roupas"],c:0,e:"O vidro deve ser separado conforme o sistema de coleta disponível."},
{q:"Pilhas e baterias usadas devem ser:",a:["Jogadas no chão","Misturadas ao orgânico","Levadas a pontos de coleta específicos","Queimadas"],c:2,e:"Pilhas e baterias precisam de destinação específica."},
{q:"Um celular antigo que não será mais usado é:",a:["Lixo eletrônico","Orgânico","Papel","Resíduo de jardim"],c:0,e:"Celulares são equipamentos eletrônicos e devem ser destinados a pontos apropriados."},
{q:"Uma caixa de papelão limpa pode ser encaminhada como:",a:["Papel","Vidro","Orgânico","Metal"],c:0,e:"Papelão limpo e seco pode ser reciclável."},
{q:"Restos de verduras e legumes são exemplos de resíduos:",a:["Orgânicos","Metálicos","Eletrônicos","De vidro"],c:0,e:"Restos de alimentos são resíduos orgânicos."},
{q:"Uma camiseta em bom estado que você não usa mais pode ser:",a:["Doada ou reutilizada","Queimada","Jogada na rua","Misturada com vidro"],c:0,e:"Reutilizar e doar prolonga a vida útil dos produtos."}
];
const missions=[
"Hoje, antes de comprar algo, pergunte: eu realmente preciso disso?",
"Escolha um objeto que você pode reutilizar em vez de substituir.",
"Observe as lixeiras da escola e veja se a separação está clara.",
"Separe corretamente um material reciclável que você usaria hoje.",
"Converse com alguém sobre uma atitude de consumo responsável.",
"Evite um produto descartável quando houver uma alternativa reutilizável.",
"Procure uma embalagem que poderia ser reutilizada antes do descarte."
];
let state={questions:[],current:0,score:0,lives:3,name:""};
const $=id=>document.getElementById(id);
const best=()=>Number(localStorage.getItem("ecoBest")||0);
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function updateBest(){ $("bestScore").textContent=best()?`Melhor pontuação registrada: ${best()} pontos`:"Ainda não há pontuação registrada.";$("counterBest").textContent=best()}
function show(id){["startScreen","quizScreen","resultScreen"].forEach(x=>$(x).classList.add("hidden"));$(id).classList.remove("hidden")}
function updateLives(){ $("lives").textContent="♥ ".repeat(state.lives).trim()+" "+ "♡ ".repeat(3-state.lives).trim() }
function startGame(){
 state={questions:shuffle(questions),current:0,score:0,lives:3,name:$("playerName").value.trim()||"Participante"};
 $("score").textContent=0;$("counterScore").textContent=0;show("quizScreen");renderQuestion()
}
function renderQuestion(){
 const item=state.questions[state.current];
 $("counter").textContent=`Questão ${state.current+1} de ${state.questions.length}`;
 $("progress").style.width=`${((state.current+1)/state.questions.length)*100}%`;
 $("questionText").textContent=item.q;$("feedback").textContent="";$("nextBtn").classList.add("hidden");$("answers").innerHTML="";updateLives();
 item.a.forEach((answer,index)=>{const b=document.createElement("button");b.className="answer";b.type="button";b.textContent=answer;b.addEventListener("click",()=>answerQuestion(index,b));$("answers").appendChild(b)})
}
function answerQuestion(index,selected){
 const item=state.questions[state.current];document.querySelectorAll(".answer").forEach(b=>b.disabled=true);
 if(index===item.c){selected.classList.add("correct");state.score+=10;$("feedback").textContent="✓ Correto! "+item.e}
 else{selected.classList.add("wrong");document.querySelectorAll(".answer")[item.c].classList.add("correct");state.lives--;$("feedback").textContent="Não foi dessa vez. "+item.e}
 $("score").textContent=state.score;$("counterScore").textContent=state.score;updateLives();$("nextBtn").classList.remove("hidden")
}
function nextQuestion(){if(state.lives<=0||state.current>=state.questions.length-1){finishGame();return}state.current++;renderQuestion()}
function finishGame(){
 show("resultScreen");$("finalScore").textContent=state.score;
 let title="Continue praticando.";
 let level="Começando";
 if(state.score>=90){title=`Excelente, ${state.name}!`;level="Especialista"}
 else if(state.score>=70){title=`Muito bem, ${state.name}!`;level="Consciente"}
 else if(state.score>=50){title=`Boa tentativa, ${state.name}!`;level="Em evolução"}
 $("resultTitle").textContent=title;$("resultLevel").textContent=level;
 $("resultText").textContent=`Você fez ${state.score} pontos e acertou ${state.score/10} questão(ões). Use os feedbacks para transformar conhecimento em hábito.`;
 if(state.score>best())localStorage.setItem("ecoBest",state.score);
 $("resultBest").textContent=`Melhor: ${best()} pontos`;updateBest()
}
$("startBtn").addEventListener("click",startGame);
$("nextBtn").addEventListener("click",nextQuestion);
$("restartBtn").addEventListener("click",()=>{show("startScreen");updateBest();$("playerName").focus()});
$("playerName").addEventListener("keydown",e=>{if(e.key==="Enter")startGame()});
$("shareBtn").addEventListener("click",async()=>{const text=`EcoDesafio — ${state.name} fez ${state.score} pontos no desafio do ODS 12.`;try{await navigator.clipboard.writeText(text);$("shareStatus").textContent="Resultado copiado!";}catch{$("shareStatus").textContent=text}});
$("themeBtn").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("ecoTheme",document.body.classList.contains("dark")?"dark":"light")});
$("fontBtn").addEventListener("click",()=>{document.body.classList.toggle("large");const large=document.body.classList.contains("large");$("fontBtn").textContent=large?"A−":"A+";localStorage.setItem("ecoFont",large?"large":"normal")});
if(localStorage.getItem("ecoTheme")==="dark")document.body.classList.add("dark");
if(localStorage.getItem("ecoFont")==="large"){document.body.classList.add("large");$("fontBtn").textContent="A−";}

const menuBtn=$("menuBtn"),mainNav=$("mainNav");
menuBtn.addEventListener("click",()=>{
 const open=mainNav.classList.toggle("open");
 menuBtn.setAttribute("aria-expanded",open?"true":"false");
 menuBtn.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");
});
mainNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
 mainNav.classList.remove("open");
 menuBtn.setAttribute("aria-expanded","false");
 menuBtn.setAttribute("aria-label","Abrir menu");
}));

const range=$("habitRange");
function updateHabit(){
 const days=Number(range.value);$("habitValue").textContent=`${days} ${days===1?"dia":"dias"}`;
 $("habitMessage").textContent=[
 "Comece com uma atitude simples.",
 "Você já está criando uma rotina.",
 "Boa! Pequenas escolhas contam.",
 "Consistência começa com pequenos passos.",
 "Você está construindo um hábito.",
 "Ótimo ritmo. Continue.",
 "Excelente frequência.",
 "Parabéns! Transforme isso em rotina."
 ][days];
}
range.addEventListener("input",updateHabit);updateHabit();

$("challengeBtn").addEventListener("click",()=>{
 const item=missions[Math.floor(Math.random()*missions.length)];
 $("challengeText").textContent=item;
 $("counterReduce").textContent=Number($("counterReduce").textContent)+1;
});
$("year").textContent=new Date().getFullYear();
updateBest();

/* ECODUELO — modo competitivo profissional */
(function(){
  const positiveCards=[
    {icon:"♻️",title:"Separou os recicláveis",effect:"+12 pontos ambientais",points:12,tag:"RECICLAGEM"},
    {icon:"🛍️",title:"Recusou uma sacola desnecessária",effect:"+10 pontos ambientais",points:10,tag:"CONSUMO"},
    {icon:"🥤",title:"Usou uma garrafa reutilizável",effect:"+8 pontos ambientais",points:8,tag:"REUTILIZAÇÃO"},
    {icon:"🍽️",title:"Evitou desperdício de comida",effect:"+12 pontos ambientais",points:12,tag:"DESPERDÍCIO"},
    {icon:"🔧",title:"Consertou um produto",effect:"+14 pontos ambientais",points:14,tag:"VIDA ÚTIL"},
    {icon:"📦",title:"Reutilizou uma embalagem",effect:"+9 pontos ambientais",points:9,tag:"REUTILIZAÇÃO"},
    {icon:"💡",title:"Economizou energia",effect:"+8 pontos ambientais",points:8,tag:"ENERGIA"}
  ];
  const negativeCards=[
    {icon:"🗑️",title:"Jogou reciclável no lixo comum",effect:"-10 pontos ambientais",points:-10,tag:"DESCARTE"},
    {icon:"💧",title:"Desperdiçou água",effect:"-12 pontos ambientais",points:-12,tag:"ÁGUA"},
    {icon:"🍔",title:"Desperdiçou comida",effect:"-14 pontos ambientais",points:-14,tag:"DESPERDÍCIO"},
    {icon:"🛒",title:"Comprou sem necessidade",effect:"-9 pontos ambientais",points:-9,tag:"CONSUMO"},
    {icon:"📱",title:"Descartou eletrônico incorretamente",effect:"-15 pontos ambientais",points:-15,tag:"ELETRÔNICOS"},
    {icon:"🥤",title:"Usou descartáveis sem necessidade",effect:"-8 pontos ambientais",points:-8,tag:"DESCARTÁVEIS"},
    {icon:"📦",title:"Descartou algo reutilizável",effect:"-10 pontos ambientais",points:-10,tag:"REUTILIZAÇÃO"}
  ];
  const $=id=>document.getElementById(id);
  const p1=$("cardP1"),p2=$("cardP2"),s1el=$("scoreP1"),s2el=$("scoreP2"),e1=$("effectP1"),e2=$("effectP2"),st=$("roundStatus"),nb=$("newRoundBtn"),rb=$("resetDuelBtn"),res=$("duelResult"),win=$("duelWinner"),msg=$("duelMessage");
  const start=$("startDuelBtn"), setup=$("duelSetup"), again=$("duelAgainBtn");
  if(!p1||!start)return;
  let r=0,s1=0,s2=0,max=5,name1="Guardião Verde",name2="EcoRival",history=[];
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const esc=t=>String(t).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  function card(el,c){el.classList.remove("card-pop");void el.offsetWidth;el.classList.add("card-pop");el.innerHTML=`<div class="card-inner"><div class="card-topline"><span class="card-type">${c.points>0?'IMPACTO POSITIVO':'RISCO AMBIENTAL'}</span><span>${c.points>0?'♻️':'⚠️'}</span></div><div class="card-icon">${c.icon}</div><strong>${c.title}</strong><small>${c.tag} · ${c.effect}</small><div class="card-footer"><span>ECODESAFIO</span><span>${c.points>0?'+':''}${c.points}</span></div></div>`}
  function update(){s1el.textContent=s1;s2el.textContent=s2;st.textContent=r?`Rodada ${r} de ${max}`:`Partida pronta`;$("duelRoundTop").textContent=`${r}/${max}`;$("duelLeadTop").textContent=`${s1} × ${s2}`;$("duelStatusTop").textContent=r>=max?'Finalizada':(r?'Em andamento':'Pronto');$("roundNumber").textContent=r;$("nameP1").textContent=name1;$("nameP2").textContent=name2;$("barP1").style.width=Math.min(100,Math.max(0,s1/Math.max(1,max*14)*100))+"%";$("barP2").style.width=Math.min(100,Math.max(0,s2/Math.max(1,max*14)*100))+"%";$("trendP1").textContent=s1>s2?'Na liderança':'Acompanhe o placar';$("trendP2").textContent=s2>s1?'Na liderança':'Acompanhe o placar';}
  function saveHistory(winner){history=JSON.parse(localStorage.getItem('ecoDueloHistory')||'[]');history.unshift({n1:name1,n2:name2,s1,s2,r:max,winner,date:new Date().toLocaleDateString('pt-BR')});history=history.slice(0,5);localStorage.setItem('ecoDueloHistory',JSON.stringify(history));renderHistory()}
  function renderHistory(){const list=$("duelHistoryList");history=JSON.parse(localStorage.getItem('ecoDueloHistory')||'[]');if(!history.length){list.innerHTML='<p class="history-empty">Nenhuma partida registrada ainda.</p>';return}list.innerHTML=history.map(x=>`<div class="history-row"><strong class="${x.winner===x.n1?'winner':''}">${esc(x.n1)}</strong><strong>${x.s1} × ${x.s2}</strong><strong class="${x.winner===x.n2?'winner':''}">${esc(x.n2)}</strong><span class="history-date">${x.date}</span></div>`).join('')}
  function finish(){nb.disabled=true;let winner=s1>s2?name1:s2>s1?name2:'Empate';win.textContent=s1>s2?`🏆 ${name1} venceu!`:s2>s1?`🏆 ${name2} venceu!`:'🤝 Empate perfeito!';$("duelResultIcon").textContent=s1===s2?'🤝':'🏆';msg.textContent=s1===s2?`Os dois terminaram com ${s1} pontos ambientais.`:`${winner} terminou na frente com ${Math.max(s1,s2)} pontos. Cada escolha fez diferença.`;$("finalName1").textContent=name1;$("finalName2").textContent=name2;$("finalScore1").textContent=s1;$("finalScore2").textContent=s2;$("finalRounds").textContent=max;res.hidden=false;saveHistory(winner)}
  function round(){if(r>=max)return;r++;const a=pick(positiveCards),b=pick(negativeCards);s1=Math.max(0,s1+a.points);s2=Math.max(0,s2+b.points);card(p1,a);card(p2,b);e1.textContent=a.effect;e2.textContent=b.effect;update();if(r===max)finish();else nb.disabled=false}
  function reset(){r=0;s1=0;s2=0;name1=$("duelPlayer1").value.trim()||'Guardião Verde';name2=$("duelPlayer2").value.trim()||'EcoRival';max=Number($("duelRounds").value)||5;res.hidden=true;nb.disabled=true;e1.textContent='';e2.textContent='';p1.innerHTML='<div class="card-inner"><div class="card-topline"><span class="card-type">IMPACTO POSITIVO</span><span>♻️</span></div><div class="card-icon">?</div><strong>Aguardando carta</strong><small>Revele a primeira rodada</small><div class="card-footer"><span>ECODESAFIO</span><span>+ ?</span></div></div>';p2.innerHTML='<div class="card-inner"><div class="card-topline"><span class="card-type">RISCO AMBIENTAL</span><span>⚠️</span></div><div class="card-icon">?</div><strong>Aguardando carta</strong><small>Revele a primeira rodada</small><div class="card-footer"><span>ECODESAFIO</span><span>- ?</span></div></div>';update()}
  start.addEventListener('click',()=>{reset();setup.scrollIntoView({behavior:'smooth',block:'center'});nb.disabled=false;st.textContent='Primeira rodada liberada';});
  nb.addEventListener('click',round);rb.addEventListener('click',()=>{reset();nb.disabled=true});again.addEventListener('click',()=>{res.hidden=true;reset();nb.disabled=false});$("duelPlayer1").addEventListener('input',e=>{$("nameP1").textContent=e.target.value||'Guardião Verde'});$("duelPlayer2").addEventListener('input',e=>{$("nameP2").textContent=e.target.value||'EcoRival'});renderHistory();reset();nb.disabled=true;
})();


/* BATALHA ECOLÓGICA — 10 desafios ambientais */
(function(){
  const perguntasBatalha = [
    {simbolo:"🌳",nome:"Desmatamento",descricao:"O desmatamento acontece quando muitas árvores são cortadas. Isso destrói habitats, prejudica os animais e pode aumentar o aquecimento global.",pergunta:"Como podemos combater o desmatamento?",alternativas:["Plantar árvores e proteger as florestas","Cortar mais árvores","Provocar queimadas"],correta:0,explicacao:"O reflorestamento ajuda a recuperar áreas destruídas. As árvores absorvem gás carbônico, protegem o solo e servem de abrigo para os animais."},
    {simbolo:"🏭",nome:"Poluição do ar",descricao:"A fumaça das fábricas e dos veículos libera gases e partículas que contaminam o ar e podem causar problemas respiratórios.",pergunta:"Qual atitude ajuda a diminuir a poluição do ar?",alternativas:["Queimar lixo nas ruas","Utilizar bicicletas e transporte público","Aumentar a fumaça das fábricas"],correta:1,explicacao:"Utilizar bicicletas, caminhar e usar transporte público ajuda a diminuir a emissão de gases poluentes dos veículos."},
    {simbolo:"🌊",nome:"Poluição dos oceanos",descricao:"O lixo jogado no mar ameaça tartarugas, peixes e outros animais. Muitos confundem plástico com alimento.",pergunta:"Como podemos proteger os oceanos?",alternativas:["Jogar plástico na praia","Despejar lixo nos rios","Reduzir o plástico e recolher o lixo"],correta:2,explicacao:"Reduzir o uso de plástico, fazer o descarte correto e participar de limpezas de praias ajuda a proteger os animais marinhos."},
    {simbolo:"🔥",nome:"Queimadas",descricao:"As queimadas destroem a vegetação, matam animais e liberam fumaça que prejudica a saúde das pessoas.",pergunta:"Como podemos evitar queimadas?",alternativas:["Não colocar fogo na vegetação e denunciar incêndios","Queimar folhas perto das florestas","Colocar fogo no lixo"],correta:0,explicacao:"Evitar o uso do fogo e comunicar as autoridades sobre incêndios ajuda a proteger as florestas, os animais e as pessoas."},
    {simbolo:"🚰",nome:"Poluição dos rios",descricao:"O despejo de esgoto e produtos químicos nos rios contamina a água, prejudica os animais aquáticos e pode causar doenças.",pergunta:"O que devemos fazer para proteger os rios?",alternativas:["Jogar óleo na pia","Tratar o esgoto antes de devolvê-lo ao ambiente","Jogar lixo nas margens"],correta:1,explicacao:"O tratamento de esgoto retira muitos poluentes da água antes de ela retornar ao meio ambiente."},
    {simbolo:"♻️",nome:"Acúmulo de lixo",descricao:"O descarte incorreto de resíduos pode contaminar o solo e a água, entupir bueiros e prejudicar a saúde.",pergunta:"Qual atitude ajuda a diminuir o lixo?",alternativas:["Jogar resíduos em terrenos vazios","Abandonar lixo nas ruas","Separar materiais recicláveis e reutilizar produtos"],correta:2,explicacao:"A coleta seletiva separa papel, plástico, vidro e metal. Muitos desses materiais podem ser reciclados e transformados em novos produtos."},
    {simbolo:"🐟",nome:"Pesca predatória",descricao:"A pesca predatória acontece quando peixes são capturados de maneira excessiva ou ilegal, prejudicando a reprodução das espécies.",pergunta:"Como podemos proteger os animais aquáticos?",alternativas:["Respeitar os períodos de reprodução e as regras de pesca","Capturar todos os peixes possíveis","Pescar espécies ameaçadas"],correta:0,explicacao:"Respeitar os períodos de reprodução e as regras ambientais ajuda a manter as populações de peixes e o equilíbrio dos oceanos."},
    {simbolo:"💧",nome:"Desperdício de água",descricao:"A água doce é essencial para a vida. O desperdício aumenta a pressão sobre rios, reservatórios e outras fontes de abastecimento.",pergunta:"Como podemos economizar água?",alternativas:["Deixar a torneira aberta","Tomar banhos mais curtos e consertar vazamentos","Lavar calçadas com mangueira todos os dias"],correta:1,explicacao:"Fechar a torneira, tomar banhos mais curtos e consertar vazamentos são atitudes simples que ajudam a preservar a água."},
    {simbolo:"☣️",nome:"Contaminação do solo",descricao:"Pilhas, baterias e produtos químicos descartados incorretamente podem contaminar o solo e atingir as águas subterrâneas.",pergunta:"Qual é a forma correta de descartar pilhas e baterias?",alternativas:["Enterrar no quintal","Jogar no rio","Levar a pontos de coleta específicos"],correta:2,explicacao:"Pilhas e baterias devem ser levadas a pontos de coleta especializados, que encaminham esses materiais para tratamento adequado."},
    {simbolo:"🌡️",nome:"Aquecimento global",descricao:"O aquecimento global é o aumento da temperatura média do planeta, principalmente devido à emissão de gases de efeito estufa pelas atividades humanas.",pergunta:"Qual atitude ajuda a combater o aquecimento global?",alternativas:["Preservar florestas e utilizar energia renovável","Destruir áreas verdes","Aumentar a queima de combustíveis fósseis"],correta:0,explicacao:"Proteger as florestas, economizar energia e utilizar fontes renováveis, como energia solar e eólica, ajuda a reduzir as emissões de gases de efeito estufa."}
  ];

  const el = id => document.getElementById(id);
  const pontos=el("bPontos"),numero=el("bNumeroPergunta"),acertosEl=el("bAcertos"),barra=el("bBarraProgresso"),
        simbolo=el("bSimboloProblema"),nome=el("bNomeProblema"),descricao=el("bDescricaoProblema"),
        perguntaEl=el("bTextoPergunta"),alternativas=el("bAlternativas"),explicacao=el("bExplicacao"),
        resultadoTitulo=el("bResultadoTitulo"),resultadoTexto=el("bResultadoTexto"),proxima=el("bProximaPergunta"),
        areaJogo=el("bAreaJogo"),resultadoFinal=el("bResultadoFinal");

  if(!pontos || !proxima) return;

  let perguntasJogo=[], atual=0, score=0, acertos=0, respondeu=false;

  function embaralhar(lista){
    const copia=[...lista];
    for(let i=copia.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [copia[i],copia[j]]=[copia[j],copia[i]];
    }
    return copia;
  }

  function iniciar(){
    perguntasJogo=embaralhar(perguntasBatalha);
    atual=0;score=0;acertos=0;
    pontos.textContent="0";acertosEl.textContent="Acertos: 0";
    areaJogo.classList.remove("hidden");resultadoFinal.classList.add("hidden");
    mostrar();
  }

  function mostrar(){
    respondeu=false;
    const item=perguntasJogo[atual];
    numero.textContent=`Desafio ${atual+1} de ${perguntasJogo.length}`;
    acertosEl.textContent=`Acertos: ${acertos}`;
    barra.style.width=`${(atual/perguntasJogo.length)*100}%`;
    simbolo.textContent=item.simbolo;nome.textContent=item.nome;descricao.textContent=item.descricao;
    perguntaEl.textContent=item.pergunta;alternativas.innerHTML="";explicacao.classList.add("hidden");

    embaralhar(item.alternativas.map((texto,indice)=>({texto,correta:indice===item.correta}))).forEach((opcao,indice)=>{
      const botao=document.createElement("button");
      botao.type="button";botao.className="battle-answer";
      botao.textContent=`${String.fromCharCode(65+indice)}) ${opcao.texto}`;
      botao.addEventListener("click",()=>verificar(opcao,botao));
      alternativas.appendChild(botao);
    });
  }

  function verificar(opcao,botaoEscolhido){
    if(respondeu) return;
    respondeu=true;
    const item=perguntasJogo[atual];
    const botoes=alternativas.querySelectorAll("button");
    botoes.forEach(b=>b.disabled=true);

    if(opcao.correta){
      score+=10;acertos++;
      botaoEscolhido.classList.add("correct");
      resultadoTitulo.textContent="✓ Parabéns! Você acertou!";
    }else{
      botaoEscolhido.classList.add("wrong");
      resultadoTitulo.textContent="✗ Resposta incorreta!";
      botoes.forEach(b=>{
        if(b.textContent.substring(3)===item.alternativas[item.correta]) b.classList.add("correct");
      });
    }
    resultadoTexto.textContent=item.explicacao;
    pontos.textContent=score;acertosEl.textContent=`Acertos: ${acertos}`;
    explicacao.classList.remove("hidden");
    proxima.textContent=atual===perguntasJogo.length-1?"VER RESULTADO 🏆":"PRÓXIMO DESAFIO →";
  }

  proxima.addEventListener("click",()=>{
    if(!respondeu) return;
    atual++;
    if(atual<perguntasJogo.length) mostrar();
    else finalizar();
  });

  function finalizar(){
    areaJogo.classList.add("hidden");resultadoFinal.classList.remove("hidden");
    barra.style.width="100%";numero.textContent="Partida concluída!";
    el("bPontuacaoFinal").textContent=`${score}/100`;
    let mensagem;
    if(acertos===10) mensagem="🏆 Perfeito! Você é um verdadeiro defensor do planeta!";
    else if(acertos>=7) mensagem="🌱 Parabéns! Você conhece muito sobre preservação ambiental!";
    else if(acertos>=4) mensagem="🌎 Muito bem! Você está aprendendo a cuidar do meio ambiente!";
    else mensagem="💚 Continue aprendendo! Cada atitude ajuda a proteger o planeta!";
    el("bMensagemFinal").textContent=mensagem;
    el("bResumoFinal").textContent=`Você acertou ${acertos} de 10 perguntas e conquistou ${score} pontos!`;
  }

  el("bJogarNovamente").addEventListener("click",iniciar);
  iniciar();
})();
