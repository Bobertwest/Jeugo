const can = document.getElementById("myCanvas") //acceder al canvas del html mediante su id
const con = can.getContext("2d") //lo que se trabajara en dicho canvas sera en 2d

var raquetaAlto = 10;                         //variable del alto de la rqueta
var raquetaAncho = 70;                        //variable del ancho de la raqueta     
var raquetaX = can.width/2-raquetaAncho/2;     // posicion en x de la raqueta
var raquetaY = can.height-(raquetaAlto+30);     //posicion en y de la raqueta
var derecha = false;                            //tecla de la derecha
var izquierda = false;                          //tecla de la izquierda
var radio = 10;                                  //radio de la pelota
var pelotaX = can.width/2;                      //posicion en x de la pelota
var pelotaY = raquetaY-radio;                   //posicion en y de la pelota
var dx = 3;                                     //avance en x de la pelota  
var dy = -3;                                    //avance en y de la pelota
var dt = 5;                                      //avance en de la raqueta
var filas = 3;
var columnas = 6;
var bloqueAncho = 55;
var bloqueLargo = 30;
var bloqueX;
var bloqueY;
var espacioDerecha = 10;
var espacioArriba = 30;
var espacio = 10;
var score = 0;

//evento para detectar si en usuario presiona la fecha derecha o izquierda
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//fncion cunado el usuario presiona la tecla
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        derecha = true;
    }
    else if(e.keyCode == 37) {
        izquierda = true;
    }
}
//funcion cuando el usuario no esta presionando la tecla
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        derecha = false;
    }
    else if(e.keyCode == 37) {
        izquierda = false;
    }
}

/*
NOTA: EN JAVASCRIPT, CADA TECLA TIENE UN KEYCODE QUE ES UN NUMERO QUE IDENTIFICA CADA TECLA.
EN ESTE CASO "FLECHA DERECHA = 39" Y "FLECHA IZQUIERDA = 37"
*/

//FUNCION PARA DIBUJAR LA RAQUETA
function dibujarRaqueta(){
  con.beginPath();                                                
  con.rect(raquetaX, raquetaY, raquetaAncho, raquetaAlto);      //DIBUJAMOS EL RECTANGULO CON SU POSICION EN X y Y, Y SU ALTO Y ANCHO
  con.fillStyle = "blue";                                       //COLOR DE LA RAQUETA
  con.fill();                                                   //RELLENAMOS LA RAQUETA CON DICHO COLOR
  con.closePath();
}

//FUNCION PARA EL PUNTAJE
function drawScore() {
  con.font = "16px Arial";
  con.fillStyle = "#0095DD";
  con.fillText("Score: "+score, 8, 20);
}

//FUNCION PARA DIBUJAR LA PELOTA
function dibujarPelota(){
  con.beginPath();
  con.arc(pelotaX, pelotaY, radio, 0, Math.PI*2);
  con.fillStyle="yellow";
  con.fill();
  con.closePath();
//SI LA PELOTA ESTA POR DEBAJO DE L APOSICION DE LA RAQUETA, SE REINICIA EL JUEGO  
  if(pelotaY + dy > can.height-radio ){
    document.location.reload();
    score = 0;
  }
}
//CREAMOS UNA MATRIZ PARA LOS BLOQUES
var bloque = [];
for(var i = 0; i < columnas; i++){
  bloque[i] = [];
  for(var j = 0; j < filas; j++ ){
    bloque[i][j] = {x:0, y:0, status : 1}
  }
}
//FUNCION PARA DIBUJAR LOS BLOQUES
function bloques(){
  for(i = 0; i< columnas; i++){
    for(j = 0; j < filas; j++){
      if (bloque[i][j].status==1){
        bloqueX = (i*(bloqueAncho+espacio))+espacioDerecha;
        bloqueY = (j*(bloqueLargo+espacio))+espacioArriba;
        bloque[i][j].x=bloqueX;
        bloque[i][j].y=bloqueY;
        con.beginPath();
        con.rect(bloqueX,bloqueY,bloqueAncho, bloqueLargo);
        con.fillStyle = "red";
        con.fill();
        con.closePath();
      }

    }
  }
}


//FUNCION PARA DETECTAR LAS COLISIONES, RECORRERA LA MATRIZ Y DETECTARA QUE POSICION HACE CONTACTO CON LA PELOTA Y DESAPARECERA ESE BLOQUE
function collisionDetection() {
    for(i=0; i<columnas; i++) {
        for(j=0; j<filas; j++) {
            var b = bloque[i][j];
            if(b.status == 1) {
                if(pelotaX > b.x && pelotaX < b.x+bloqueAncho && pelotaY > b.y && pelotaY < b.y+bloqueLargo) {
                    dx = + dx;
                    dy = -dy;
                    b.status = 0;
                    score++;
                    //SI EL PUNTAJE ES IGUAL A LA SUMA DE TODOS LOS BLOQUES, EL JUEGO SE REINICIA Y EL USUARIO GANA
                    if(score == columnas*filas){
                      alert("Haz ganado");
                      document.location.reload();
                    }
                }
            }
        }
    }
}


//FUNCION FINAL, DONDE SE LLAMAN TODAS LAS FUNCIONES Y SE ESPECIFICA LA FORMA EN LA QUE LA PELOTA REBOTARA

function dibuja(){
  con.clearRect(0,0,can.width, can.height);
  dibujarRaqueta();
  drawScore();
  dibujarPelota();
  bloques();
  collisionDetection()

  if(pelotaX + dx > can.width-radio || pelotaX + dx < radio) {
    dx = -dx;
  }
  if(pelotaY + dy < radio) {
    dy = -dy;
  }
   

  if (pelotaX-radio > raquetaX && pelotaX-radio <raquetaX+raquetaAncho && pelotaY+radio >raquetaY){
    dx = +dx;
    dy = -dy;
  }    
  if (pelotaX > bloqueX && pelotaX <bloqueX+bloqueAncho && pelotaY > bloqueY && pelotaY <bloqueY+bloqueLargo){
    dx = +dx;
    dy = -dy;
  }
    
  if(derecha && raquetaX+raquetaAncho < can.width) {
    raquetaX = raquetaX + dt;
  }
  else if(izquierda && raquetaX > 0) {
    raquetaX = raquetaX - dt;
  }
    
  pelotaX += dx;
  pelotaY += dy;
}

//CON ESTA FUNCION SE LLAMA A LA FUNCION FINAL
setInterval(dibuja, 10);