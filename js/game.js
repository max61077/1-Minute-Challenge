var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 10;
var c = canvas.getContext('2d');
var mouseX  = 30, mouseY = 0, ins = true, game = false, won = false, lose = false ;
var b = new Bar(mouseX,mouseY,'yellow');
var balls = []
var score = 0 , lives = 3 ,time = 60, count = 0;
function Bar(x,y,clr){
    this.x = x;
    this.y = y;
    this.clr = clr;
    this.draw = function(){
        c.fillStyle = this.clr;
        c.fillRect(mouseX,mouseY-75,20,150);
    }
    this.update = function(){
        if(mouseY < 75)
            mouseY = 75;
        if(mouseY+75 > canvas.height)
            mouseY = canvas.height-75;
        this.draw();
    }
}

function Circle(x,y,dx,dy,r,clr){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.clr = clr;
    this.draw = function(){
        c.beginPath();
        c.arc(this.x,this.y,this.r,0,2*Math.PI,false);
        c.fillStyle = this.clr;
        c.fill();
        c.closePath();
    }

    this.isOffScreen = function(){
        return this.x - this.r < 0
    }

    this.collision = function(){
        return this.x - this.r < mouseX + 20 && this.y < mouseY + 75 && this.y + this.r > mouseY - 75
    }
    this.update = function(){
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}
var colors = ['red','black','blue','green']
function anime(){
    c.clearRect(0,0,canvas.width,canvas.height);
    if(ins)
      instructions()
    if(game){
      b.update();
      b.clr = 'yellow'
      if(Math.random()*10 < 0.5){
          let r = Math.floor(Math.random()*4)
          balls.push(new Circle(1400 + Math.floor(Math.random()*30) ,Math.random()*canvas.height,-5-Math.floor(Math.random()*10),0,15,colors[r]));
      }
      for(let i = balls.length-1; i >= 0;i--){
          balls[i].update()
          if(balls[i].collision()){
              if(balls[i].clr == 'red')
                  checkGame()
              else
                  score += 5
              balls.splice(i,1)
          }
          else if(balls[i].isOffScreen())
              balls.splice(i,1)
      }    
      life()
      dispScore()
      dispTime()
      checkScore()
    }
    if(won)
      win()
    else if(!game && !ins && !won)
      gameover()
    if(count == 5)
      clearInterval(i)
    id = window.requestAnimationFrame(anime);
}
anime();


let i, int;
function checkGame(){
    lives -= 1
    count = 0
    clearInterval(i)
    i = setInterval(() => {b.clr = 'red';count++},200)
    if(lives == 0){
        game = false
        lose = true
      }
}
function reset(){
    lives = 3
    score = 0
    time = 60
    ins = true
    won = false
    lose = false
    balls = []
}

function checkTime(){
    time -= 1
    if(time == 0 && !ins){
        game = false
        lose = true
    }
}

function checkScore(){
    if(score >= 400){
        won = true
        game = false
    }
}

function life(){
    c.textAlign = 'center'
    c.fillStyle = 'black';
    c.font = "30px impact";
    c.fillText("Lives: "+lives,70,40);
    c.lineWidth = 1
}

function dispScore(){
    c.textAlign = 'center'
    c.fillStyle = 'black';
    c.font = "30px impact";
    c.fillText("Score: "+score,canvas.width - 80,40);
    c.lineWidth = 1
}

function dispTime(){
    c.textAlign = 'center'
    c.fillStyle = 'red';
    c.font = "30px impact";
    c.fillText(time,canvas.width/2,40);
    c.lineWidth = 1
}

function gameover(){
    clearInterval(int)
    c.textAlign = 'center'
    c.fillStyle = 'red';
    c.font = "100px impact";
    c.fillText('Game Over', canvas.width/2, canvas.height/2);
    c.font = "35px Arial";
    c.fillText("Score: "+score,canvas.width / 2,40);
    c.fillText('Tap to Play Again!!!', canvas.width/2, canvas.height/2 + 70);
}

function instructions(){
    c.fillStyle = 'dodgerblue';
    c.font = '60px impact';
    c.textAlign = 'center'
    c.fillText('1 Minute Challenge', canvas.width / 2, canvas.height / 7);
    c.font = '40px impact'
    c.fillStyle = 'red'
    c.fillText('Instructions', canvas.width / 2, canvas.height / 3.5);
    c.font = '25px Arial'
    c.fillText('1. You have 1 minute and 3 lives to score 400.', canvas.width / 2, canvas.height / 3.5 + 50);
    c.fillText('2. You have to collect the NON-RED balls which will give you 5 pts each.', canvas.width / 2, canvas.height / 3.5 + 100);
    c.fillText('3. Each RED ball will decrease your life by 1.', canvas.width / 2, canvas.height / 3.5 + 150);
    c.font = '40px impact'
    c.fillStyle = 'red'
    c.fillText('Controls', canvas.width / 2, canvas.height / 1.6);
    c.font = '25px Arial'
    c.fillText('Mouse as well as touchscreen oriented', canvas.width / 2, canvas.height / 1.6 + 50);
    c.fillText('(Works well in chrome Browser)', canvas.width / 2, canvas.height / 1.6 + 100);
    c.font = '40px impact'
    c.fillStyle = 'red'
    c.fillText('Tap to Play!!', canvas.width / 2, canvas.height / 1.6 + 170);
}

function win(){
    clearInterval(int)
    c.textAlign = 'center'
    c.fillStyle='red';
    c.font="100px impact";
    c.fillText('You Win',canvas.width/2,canvas.height/2);
    c.font = "35px Arial";
    c.fillText('Remaining Time: '+time+' sec',canvas.width/2,40);
    c.fillText('Tap to Play Again!!!', canvas.width/2, canvas.height/2 + 70);
}

document.addEventListener('mousemove',(pos) => {
    mouseY = pos.clientY;
})

document.addEventListener('touchmove',(evt) => {
    mouseY = evt.touches[0].clientY
} );

document.addEventListener('click',() => {
  if(ins && !game){
    ins = false
    game = true
    int = setInterval(checkTime,1000)
  }
  if(!game && (won || lose)){
    ins = true
    reset()
  }
});