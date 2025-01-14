$(function(){
    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
    
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    
    
    var spawnRate=1000;

    var lastSpawn=-1;

    var objects=[];

    var pizza = new Image();
    pizza.src = "../Media/pizza.png"

    var socket = io();

    var spiderman;
    var spiderimg = new Image();
    spiderimg.src = "../Media/spiderR.gif"

    var MoveUp = false;
    var MoveRight = false;
    var MoveDown = false;
    var MoveLeft = false;
    var LastDirection;
    var NewDirection;


    var music;
    music = new Audio("../Media/PizzaTime.ogg");
    music.addEventListener('ended', LoopMusic)

    function LoopMusic(){
        music.currentTime = 0;
        music.play();
    }

    var ps_team = 0;
    var fj_team = 0;

    assignTeam();
    
    makeSpider();
    animate();

    document.addEventListener('keydown', BeginMovement)

    var team_ps_score = 0;
    var team_fj_score = 0;
    document.getElementById('ps_score').innerHTML = "" + team_ps_score;
    document.getElementById('fj_score').innerHTML = "" + team_fj_score;

    
    function assignTeam() {
        if(ps_team == fj_team){
            assignedTeam = Math.floor(Math.random() * 2) + 1;
            
        }
        if(fj_team > ps_team){
            assignedTeam = 1;
            ps_team += 1;
         
        }
        if(ps_team > fj_team) {
            assignedTeam = 2
            fj_team += 1;

        }
        
    }
    

    function BeginMovement(x) {
        music.play();
        if (x.keyCode === 87) { 
              MoveUp = true;
              NewDirection = 0;             
        }
      
        if (x.keyCode === 68)  {
            MoveRight = true;
            NewDirection = 1;
            
            if(xcoord > window.innerWidth * 0.7){
                window.scrollBy(10,0);
            }
            
        }
      
        if (x.keyCode === 83)  {
            MoveDown = true;
            NewDirection = 2;
      
        }
      
        if (x.keyCode === 65)  {
            MoveLeft = true;
            NewDirection = 3;
        }
      
        ChangeDirection(NewDirection);
         
    }

    document.addEventListener('keyup', releaseKey)

    function releaseKey(x) {

        if (x.keyCode === 65 && x.keyCode === 39)  {
            MoveDownRight = false;
            LastDirection = 4;
        }
        if (x.keyCode === 87) { 
            MoveUp = false;
            LastDirection = 0;
        }
          
        if (x.keyCode === 68)  {
            MoveRight = false;
            LastDirection = 1;
        }
              
        if (x.keyCode === 83){ 
            MoveDown = false; 
            LastDirection = 2;
        }
              
        if (x.keyCode === 65)  {
            MoveLeft = false;
            LastDirection = 3;
            }
          
              
        }

    function Movementloop() {
        
        spider = spiderman;
            
        if(MoveUp === true){
            spider.y = (spider.y - 5);
        }
        
        if (MoveRight === true) {
            spider.x = (spider.x + 5);
        }
        
        if (MoveDown === true){
            spider.y = (spider.y + 5)
        }
        
        if (MoveLeft === true){
            spider.x = (spider.x - 5);
        }
                
        window.requestAnimationFrame(Movementloop)
                
        }

    function ChangeDirection(NewDirection){

        spider = spiderman;

        if (NewDirection !== LastDirection){
            if (NewDirection === 1){
                
                spiderimg.src="../Media/spiderR.gif"
                LastDirection = NewDirection;
            }
            if (NewDirection === 0){
                spiderimg.src="../Media/spiderU.gif"
                LastDirection = NewDirection;
            }
            
            if (NewDirection === 2){
                
                spiderimg.src="../Media/spiderD.gif"
                LastDirection = NewDirection;
            }
            if (NewDirection === 3){
                spiderimg.src="../Media/spiderL.gif"
                LastDirection = NewDirection;
            }
        }
        }
        
        window.requestAnimationFrame(Movementloop)

        socket.emit('new player');
        setInterval(function() {
            socket.emit('movement', movement);
        }, 1000 / 60);


    function spawnObject(){


        var object={
            x:Math.random()*(canvas.width-30)+15,

            y:Math.random() * (canvas.height) + 100 ,

            width: 30,

            height: 30,

            image: pizza
        }


        objects.push(object);
    }
    function makeSpider(){
        var spider={
            x:50,
      
            y:50 ,
      
            width: 75,
            height: 75,
      
            image: spiderimg,

            team: assignedTeam,
      
            }
      
            spiderman = spider;
    
    }


    function animate(){

        var time=Date.now();

        if(time>(lastSpawn+spawnRate)){
            lastSpawn=time;
            spawnObject();
        }
        requestAnimationFrame(animate);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var spider = spiderman;
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];
            ctx.drawImage(object.image, object.x, object.y, object.width, object.height);           
            ctx.drawImage(spider.image, spider.x, spider.y, spider.height, spider.width);

            if(spider.x < object.x + object.width &&
                spider.x + spider.width > object.x &&
                spider.y < object.y + object.height &&
                spider.y + spider.height > object.y){
                    ctx.clearRect(object.x, object.y, object.width, object.height)
                    objects.splice(i, 1)
                    if (spider.team == 1) {
                        team_ps_score += 1;
                        document.getElementById('ps_score').innerHTML = "" + team_ps_score;
                    }
                    else {
                        team_fj_score += 1;
                        document.getElementById('fj_score').innerHTML = "" + team_fj_score;
                    }

                }
            
        }
        
    }
});
