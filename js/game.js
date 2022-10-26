//GAME DESENVOLVIDO POR DANIEL RIGO DE MORAIS
//R.A.: 00098577
//ESTUDANTE DE JOGOS DIGITAIS - UNISO


// SELECIONAR CANVAS
const cvs = document.getElementById("fish");
const ctx = cvs.getContext("2d");

// VARIÁVEIS E CONSTANTES
let frames = 0;
const DEGREE = Math.PI/180;

// CARREGAR SPRITE DO GAME
const sprite = new Image();
sprite.src = "img/sprite.png";

// CARREGAR SONS
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";


// ESTADO DO JOGO
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}


// COORDENADA DO BOTÃO START NO GAME OVER
const startBtn = {
    x : 120,
    y : 296,
    w : 83,
    h : 29
}


// CONTROLE DO JOGO
cvs.addEventListener("click", function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            if(fish.y - fish.radius <= 0) return;
            fish.flap();
            FLAP.play();
            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
            
// CHECAR QUANDO APERTAR BOTÃO DE START
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                fish.speedReset();
                score.reset();
                state.current = state.getReady;
            }
            break;
    }
});


// PLANO DE FUNDO
const bg = {
    sX : 0,
    sY : 0,
    w : 320,
    h : 480,
    x : 0,
    y : cvs.height - 480,
    
    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
    
}


// PRIMEIRO PLANO - chao
const fg = {
    sX: 471,
    sY: 7,
    w: 320,
    h: 55,
    x: 0,
    y: cvs.height - 55,
    
    dx : 2,
    
    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
    
    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}


// PEIXE - PLAYER
const fish = {
    animation : [
        {sX: 335, sY : 1},
        {sX: 378, sY : 1},
        {sX: 426, sY : 1},
        {sX: 378, sY : 1}
    ],
    x : 50,
    y : 150,
    w : 34,
    h : 26,
    
    radius : 12,
    
    frame : 0,
    
    gravity : 0.25,
    jump : 4.6,
    speed : 0,
    rotation : 0,
    
    draw : function(){
        let fish = this.animation[this.frame];
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, fish.sX, fish.sY, this.w, this.h,- this.w/2, - this.h/2, this.w, this.h);
        
        ctx.restore();
    },
    
    flap : function(){
        this.speed = - this.jump;
    },
    
    update: function(){
// SE O ESTADO DO JOGO ESTIVER PRONTO, O PEIXE DEVE BATER(FLAP) DEVAGAR
        this.period = state.current == state.getReady ? 10 : 5;

// AUMENTA O QUADRO(FRAME) EM 1, A CADA PERIODO
        this.frame += frames%this.period == 0 ? 1 : 0;

// O QUADRO(FRAME) VAI DE 0 A 4, DEPOIS DENOVO PARA 0
        this.frame = this.frame%this.animation.length;
        
        if(state.current == state.getReady){
            this.x = 25;
            this.y = 200;
// DEPOIS DE DAR GAME OVER, RESETA A POSIÇÃO DO PEIXE
            this.rotation = 0 * DEGREE;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            
            if(this.y + this.h/2 >= cvs.height - fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                if(state.current == state.game){
                    state.current = state.over;
                    DIE.play();
                }
            }
            

// SE A VELOCIDADE É MAIOR QUE O SALTO, O PEIXE ESTÁ CAINDO
            if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            }else{
                this.rotation = -25 * DEGREE;
            }
        }
        
    },
    speedReset : function(){
        this.speed = 0;
    }
}


// MENSAGEM DE (PRONTO) GET READY
const getReady = {
    sX : 0,
    sY : 489,
    w : 320,
    h : 480,
    x : cvs.width/2 - 320/2,
    y : 0,
    
    draw: function(){
        if(state.current == state.getReady){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
    
}


// MENSAGEM DE (PERDEU) GAME OVER
const gameOver = {
    sX : 325,
    sY : 489,
    w : 320,
    h : 480,
    x : cvs.width/2 - 320/2,
    y : 0,
    
    draw: function(){
        if(state.current == state.over){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);   
        }
    }
    
}


// TUBOS - OBSTÁCULOS
const pipes = {
    position : [],
    
    top : {
        sX : 394,
        sY : 81
    },
    bottom:{
        sX : 332,
        sY : 81
    },
    
    w : 53,
    h : 400,
    gap : 85,
    maxYPos : -150,
    dx : 2,
    
    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            
// TOP TUBO
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);  
            
// BOTTOM TUBO
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);  
        }
    },
    
    update: function(){
        if(state.current !== state.game) return;
        
        if(frames%100 == 0){
            this.position.push({
                x : cvs.width,
                y : this.maxYPos * ( Math.random() + 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let bottomPipeYPos = p.y + this.h + this.gap;
            
// COLISÃO DETECTADA
// TOP TUBO
            if(fish.x + fish.radius > p.x && fish.x - fish.radius < p.x + this.w && fish.y + fish.radius > p.y && fish.y - fish.radius < p.y + this.h){
                state.current = state.over;
                HIT.play();
            }
// BOTTOM TUBO
            if(fish.x + fish.radius > p.x && fish.x - fish.radius < p.x + this.w && fish.y + fish.radius > bottomPipeYPos && fish.y - fish.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                HIT.play();
            }
            
// MOVE O TUBO PARA ESQUERDA
            p.x -= this.dx;
            
// SE OS TUBOS VÃO ALÉM DA TELA, EXCLUÍMOS DA MATRIZ
            if(p.x + this.w <= 0){
                this.position.shift();
                score.value += 1;
                SCORE_S.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    },
    
    reset : function(){
        this.position = [];
    }
    
}


// PONTOS
const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    sX: 150,
    sY: 45,
    
    draw : function(){

        
        if(state.current == state.game){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.font = "35px Passion One";
            ctx.fillText(this.value, this.sX, this.sY);//ALTERA POSIÇÃO DO SCORE IN GAME
            ctx.strokeText(this.value, this.sX, this.sY);//ALTERA POSIÇÃO DO SCORE IN GAME
            //cvs.width/2,
            
        }else if(state.current == state.over){
        ctx.fillStyle = "#734c1e";
      //  ctx.strokeStyle = "#684318";
            // VALOR DOS PONTOS
            ctx.font = "21px Passion One";
            ctx.fillText(this.value, 165, 257); //ALTERA POSIÇÃO DO SCORE DO GAME OVER
            //ctx.strokeText(this.value, 165, 258);//ALTERA POSIÇÃO DO SCORE DO GAME OVER
            // MELHOR PONTO
            ctx.fillText(this.best, 189, 289);//ALTERA POSIÇÃO DO HIGH SCORE
            //ctx.strokeText(this.best, 189, 290);//ALTERA POSIÇÃO DO HIGH SCORE
        }
    },
    
    reset : function(){
        this.value = 0;
    }
}


// DESENHAR
function draw(){
    ctx.fillStyle = "#1E92D6"; //cor padrao do plano de fundo
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    
    bg.draw();
    pipes.draw();
    fg.draw();
    fish.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}


// ATUALIZAÇÃO
function update(){
    fish.update();
    fg.update();
    pipes.update();
}


// REPETIÇÃO
function loop(){
    update();
    draw();
    frames++;
    
    requestAnimationFrame(loop);
}
loop();

//GAME DESENVOLVIDO POR DANIEL RIGO DE MORAIS
//R.A.: 00098577
//ESTUDANTE DE JOGOS DIGITAIS - UNISO