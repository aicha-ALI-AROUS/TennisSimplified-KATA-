const canvas = document.querySelector("#court")
const context = canvas.getContext('2d');

//dessiner le court de tennis
let WIDTH=1000, HEIGHT=600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

//creation de l'objet filet
const filet = {
    x:WIDTH/2,
    y:HEIGHT,
    color:'#fff'
}

//creation de l'objet joueur1
const joueur1 = {
    x:0,
    y:HEIGHT/2,
    width:25,
    height:95,
    color:'#fff',
    name:"Joueur1",
    score:0,
    scoreString:"Love"
}

//creation de l'objet joueur2
const joueur2 = {
    x:WIDTH,
    y:HEIGHT/2,
    width:25,
    height:95,
    color:'#fff',
    name:"Joueur2",
    score:0,
    scoreString:"Love"
}

//creation de l'objet balle
const balle = {
    x:45,
    y:HEIGHT/2+5,
    radius:20,
    speed:5,
    velocityX:5,
    velocityY:0.5,
    color:'#ccff66'
}

//initiliser le nombre de sets (pour l'affichage dynamique des résultats)
let setsNumber = 1;

//dessiner le filet
function dessinerFilet (x,y,color) {
    context.beginPath(); 
    context.moveTo(x,y);
    context.lineTo(x,0);
    context.lineWidth = 5;
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
}

//dessiner les joueurs
function dessinerJoueur(xEllipse,yEllipse,xManche,yManche,color){
    context.beginPath();
    context.strokeStyle = color;
    context.ellipse(xEllipse, yEllipse, 25, 45, 0 * Math.PI/180, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fillRect(xManche,yManche+45,10,50);
    context.stroke();
    context.closePath();
}

//dessiner la balle (joueur 1 au service)
function dessinerBalle (x,y,r,color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2,false);
    context.closePath(); 
    context.fill();  
}

//afficher le court avec les differents objets
function affichage () {
    //vider le canevas à chaque affichage pour que les mouvement soient fluides
    context.clearRect(0,0,WIDTH,HEIGHT);
    //dessiner le filet
    dessinerFilet(filet.x,filet.y,filet.color);
    //dessiner les joueurs
    dessinerJoueur(joueur1.x,joueur1.y,joueur1.x,joueur1.y,'#fff');
    dessinerJoueur(joueur2.x,joueur2.y,joueur2.x-10,joueur2.y,'#fff');
    //dessiner la balle
    dessinerBalle(balle.x,balle.y,balle.radius,'#ccff66');
}

//gestion des mouvements de joueurs suivant la souris
canvas.addEventListener("mousemove",mvtJoueur);
function mvtJoueur (e) {
    //recuperer les coordonnées du canvas 
    let rect = canvas.getBoundingClientRect();
    //si la souris est dans la partie gauche: joueur1 bouge, sinon joueur2 bouge
    if((e.clientY - rect.top)<HEIGHT && (e.clientX - rect.left)<WIDTH/2)
        joueur1.y = e.clientY - rect.top - joueur1.height/2;
    else
        joueur2.y = e.clientY - rect.top - joueur2.height/2; 
}

//detecter si un joueur a frappé la balle (collision balle-joueur)
function detectFrappe(balle,joueur) {
    //collision balle - joueur
    balle.top = balle.y - balle.radius;
    balle.bottom = balle.y + balle.radius;
    balle.left = balle.x - balle.radius;
    balle.right = balle.x + balle.radius;

    //collision joueur - balle
    joueur.top = joueur.y;
    joueur.bottom = joueur.y + joueur.height;
    joueur.left = joueur.x;
    joueur.right = joueur.x + joueur.width;

    //la fonction renvois true si une des collisions c'est produite sinon elle renvoit false
    return balle.right > joueur.left && balle.bottom > joueur.top && balle.left < joueur.right && balle.top < joueur.bottom;
}

//mise à jour des mouvements
function mouvements (){
    //gestion des mouvements de la balle
    balle.x+=balle.velocityX;
    balle.y+=balle.velocityY;

    //determiner quel joueur a frappé la balle ( à gauche du filet : joueur1, à droite du filet: joueur2 )
    let joueur = (balle.x < WIDTH/2)? joueur1 : joueur2;
    //creer un nombre aleatoire qui decide de la direction de la balle lors de la frappe
    let randomizeDirection = Math.floor(Math.random() * 11);
    if(detectFrappe(balle,joueur)){
        balle.velocityX = -balle.velocityX;
        //si le nombre aleatoir est pair la balle change d'angle de mouvement
        if(randomizeDirection % 2 === 0)
            balle.velocityY = -balle.speed * Math.sin(Math.PI/20);
        else
            balle.velocityY = balle.speed * Math.sin(Math.PI/20);
    }

    //calcule et mise à jour du score des joueurs
    if((balle.x - balle.radius) <0){
        //le joueur 2 marque un point
        calculeScore(joueur2);
        afficherScore();
        service ();
    }
    else if ((balle.x + balle.radius-10) > WIDTH){
        //le joueur1 marque un point
        calculeScore(joueur1);
        afficherScore();
        service ();
    }

}

//calcule du score actuel (un joueur a marqué un point)
function calculeScore (joueur) {
    switch(joueur.score) {
        case 0:
          joueur.score=15;
          joueur.scoreString="Fifteen";
          break;
        case 15:
          joueur.score=30;
          joueur.scoreString="Thirty";
          break;
        case 30:
            switch(joueur){
                case joueur1:
                    if(joueur2.score===40){
                        joueur.score=40; 
                        joueur.scoreString="Deuce";
                        joueur2.scoreString="Deuce";
                    }
                    else{
                        joueur.score=40;
                        joueur.scoreString="Forty";
                    }
                    break;
                case joueur2:
                     if(joueur1.score===40){
                        joueur.score=40; 
                        joueur.scoreString="Deuce";
                        joueur1.scoreString="Deuce";
                    }
                    else{
                        joueur.score=40;
                        joueur.scoreString="Forty";
                    }
                    break;
            }
            break;
        case 40:
            switch(joueur){
                case joueur1:
                    if(joueur2.score<40){
                        //le joueur1 a gagné un jeu
                        afficherGagnant(joueur);
                    }
                    else if(joueur2.score===40){
                        joueur.score=50;
                        joueur.scoreString="AD";
                        joueur2.scoreString="Forty";
                    }
                    else {
                       joueur.score=40;
                       joueur.scoreString="Deuce";
                       joueur2.score=40; 
                       joueur2.scoreString="Deuce";
                    }
                    break;
                case joueur2:
                    if(joueur1.score<40){
                        //le joueur2 a gagné un jeu
                        afficherGagnant(joueur);
                    }
                    else if(joueur1.score===40){
                        joueur.score=50;
                        joueur.scoreString="AD";
                        joueur1.scoreString="Forty";
                    }
                    else {
                       joueur.score=40;
                       joueur.scoreString="Deuce";
                       joueur1.score=40; 
                       joueur1.scoreString="Deuce";
                    }
                    break;
            }
            break;
        case 50:
            switch(joueur){
                case joueur1:
                        //le joueur1 a gagné le jeu
                        afficherGagnant(joueur);
                    break;
                case joueur2:
                        //le joueur2 a gagné le jeu
                        afficherGagnant(joueur);
                    break;
            }
            break;
      }

}

//affichage du gagnant du match
function afficherGagnant (gagnant) {
    if (confirm("le ganant du match est: "+gagnant.name+".\n"+"Voulez vous rejouer un match?")){
        location.reload();
    }
    else{
        window.alert("Merci d'avoir jouer au Tennis sur notre page \n"+"Au revoir!");
        window.close();
    }
}

//mise à jour de l'affichage du score
function afficherScore () {
    document.getElementById("score-joueur1").innerHTML =(joueur1.scoreString);
    document.getElementById("score-joueur2").innerHTML =(joueur2.scoreString);
}

//demarrer une nouvelle manche (un des joueur a marqué le point)
function service () {
    balle.x = 45;
    balle.y = HEIGHT/2+5,
    balle.speed = 5;
    balle.velocityX = -balle.velocityX;
    joueur1.x = 0;
    joueur1.y = HEIGHT/2;
    joueur2.x = WIDTH;
    joueur2.y = HEIGHT/2;
}

//execution du jeu
function tennis () {
    mouvements();
    affichage();
}

//une boucle pour definire la vitesse des mouvements du jeu
const mouvementsParSeconde=50;
setInterval(tennis,1000/mouvementsParSeconde);