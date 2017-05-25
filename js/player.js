game.players = {}; // on initialise l'objet player
game.players.tour = 0; // on initialise l'objet tour
game.players.fight = false; // mode combat inactif


//******************************** Initialisation des joueurs ******************************//


game.players.generatePlayers = function () {

  game.players[1] = { // joueur1
    name: "Joueur1",
    life: 100,
    coordX: 0,
    coordY: 0,
    weapon: "arme0", // arme
    action: "defend", //mode combat
    css_class: "player1" // classe
  };

  game.players[2] = { // joueur2
    name: "Joueur2",
    life: 100,
    coordX: 0,
    coordY: 0,
    weapon: "arme0",
    action: "defend",
    css_class: "player2"
  };


  for (var i = 1; i < 3; i++) {
    var x = parseInt(Math.ceil(Math.random() * 10)); // on genere un nombre entre 1 et 10
    var y = parseInt(Math.ceil(Math.random() * 10));
    game.players[i].coordX = x;
    game.players[i].coordY = y;

    var el1 = document.querySelector(".square[data-x='" + x + "'][data-y='" + y + "']"); // on recupere la case
    var test = false;


    // on test si l'adversaire est sur une case adjacente
    for (var j = -1; j < 2; j++) {
      for (var k = -1; k < 2; k++) {
        var el2 = document.querySelector(".square[data-x='" + (x - j) + "'][data-y='" + (y - k) + "']");
        if (el2) {
          if (el2.getAttribute("type") === "player") {
            test = true;
          };
        };
      };
    };

    if ((el1.getAttribute("type") !== "") || (el1.getAttribute("type") === "weapon")) {
      i--;
    } else if (test) { //si il y a unjoueur sur une case adjacente on relance l'iteration
      i--;
    } else {
      el1.setAttribute("type", "player"); // on defini le type player
      el1.classList.add(game.players[i].css_class); // on defini la classe player
    };
  };


  // Quel joueur commence ? Joueur1(0) ou Joeur2(1)
  game.players.tour = Math.round(Math.random() + 1);


  // Affichage des informations des joueurs
  var infos1Weapon = document.getElementById('weapon1');
  var infos1Life = document.getElementById('life1');

  var infos2Weapon = document.getElementById('weapon2');
  var infos2Life = document.getElementById('life2');

  // informations arme et points de vie
  infos1Weapon.innerHTML = "Armes : " + game.weapons[game.players[1].weapon].name + " (+" + game.weapons[game.players[1].weapon].damage + ")";
  infos1Life.innerHTML = "Points de vie : " + game.players[1].life;

  infos2Weapon.innerHTML = "Armes : " + game.weapons[game.players[2].weapon].name + " (+" + game.weapons[game.players[2].weapon].damage + ")";
  infos2Life.innerHTML = "Points de vie : " + game.players[2].life;
}


//******************************** Deplacement du joueur ******************************//


game.players.move = function (e) {

  if (game.players.fight === true) { // si mode combat actif
    var fuite = (game.players.tour === 1) ? 2 : 1; // le joueur est en fuite
    game.players.attack(fuite); //attaque par defaut de l'autre joueur (degats max)
    game.players.fight = false; // mode combat inactif
  };


  var player = game.players.tour; // on defini joueur actif

  // coordonnee initiale
  var xBegin = parseInt(game.players[player].coordX);
  var yBegin = parseInt(game.players[player].coordY);
  var elBegin = document.querySelector(".square[data-x='" + xBegin + "'][data-y='" + yBegin + "']"); // on recupere la case

  // coordonnee finale
  var xEnd = parseInt(e.target.getAttribute("data-x"));
  var yEnd = parseInt(e.target.getAttribute("data-y"));
  var elEnd = document.querySelector(".square[data-x='" + xEnd + "'][data-y='" + yEnd + "']"); // on recupere la case

  // test si arme presente sur chemin parcouru
  var xMove = xEnd - xBegin;
  var yMove = yEnd - yBegin;
  var elXMove = document.querySelectorAll(".square[data-x='" + xBegin + "']"); // on recupere la colonne
  var elYMove = document.querySelectorAll(".square[data-y='" + yBegin + "']"); // on recupere la ligne

  if (xMove > 0) {
    for (var i = 0; i < xMove; i++) {
      if (elYMove[xEnd - 1 - i].getAttribute("type") === "weapon") { // on defini le type weapon
        game.players.changeItem(elYMove, (xEnd - 1 - i)); // fonction de changement d'arme
      };
    };
  } else if (xMove < 0) {
    for (var i = 0; i < -xMove; i++) {
      if (elYMove[xEnd - 1 + i].getAttribute("type") === "weapon") {
        game.players.changeItem(elYMove, (xEnd - 1 + i));
      };
    };
  } else if (yMove > 0) {
    for (var i = 0; i < yMove; i++) {
      if (elXMove[yEnd - 1 - i].getAttribute("type") === "weapon") {
        game.players.changeItem(elXMove, (yEnd - 1 - i));
      };
    };
  } else
  if (yMove < 0) {
    for (var i = 0; i < -yMove; i++) {
      if (elXMove[yEnd - 1 + i].getAttribute("type") === "weapon") {
        game.players.changeItem(elXMove, (yEnd - 1 + i));
      };
    };
  };


  // on attribue la classe player
  if (elBegin && elEnd) {

    if (elEnd.getAttribute("type") === "weapon") { //si la case finale est une arme
      elEnd.setAttribute("type", "player+weapon"); // on defini le type a player+weapon
      elEnd.classList.remove(game.weapons[elEnd.getAttribute("weapon")].css_class); // on enleve la classe arme
      elEnd.classList.add(game.players[player].css_class); // on ajoute la classe player
    } else { // si le type est player
      elEnd.setAttribute("type", "player"); // on defini le type a player
      elEnd.classList.add(game.players[player].css_class); // on ajoute la classe player
    };

    if (elBegin.getAttribute("type") === "player+weapon") { //si la case initiale est une arme etnun joueur
      elBegin.setAttribute("type", "weapon");
      elBegin.classList.remove(game.players[player].css_class);
      elBegin.classList.add(game.weapons[elBegin.getAttribute("weapon")].css_class);
    } else {
      elBegin.setAttribute("type", "");
      elBegin.classList.remove(game.players[player].css_class);
    };

    game.players[player].coordX = xEnd;
    game.players[player].coordY = yEnd;
  };

  game.players[game.players.tour].action = "defend"; // mode combat inactif
  game.players.tour = (game.players.tour === 1) ? 2 : 1; // tour suivant
  game.update();
};


//******************************** Informations du joueur ******************************//


game.players.info = function () {

  if (game.players[1].life <= 0) { // si point de vie inferieur a zero
    alert("Le joueur 1 est mort!");
    game.new(); // nouvelle partie
  };

  if (game.players[2].life <= 0) {
    alert("Le joueur 2 est mort!");
    game.new();
  };

  // Determine les styles des joueurs actifs/inactifs
  var el1 = document.getElementById('player1').style.opacity = 0.4;
  var el2 = document.getElementById('player2').style.opacity = 0.4;
  document.getElementById('player' + game.players.tour).style.opacity = 1;
};


//******************************** Changement de l'arme ******************************//


game.players.changeItem = function (el, nb) { //on recoit la colonne/ligne et le numero entre 0 et 9

  var change = el[nb].getAttribute("weapon"); // variable de stockage pour le changement

  if (game.players[game.players.tour].weapon === "arme0") { // si le joueur n'a pas d'arme (mains nues)
    el[nb].classList.remove(game.weapons[el[nb].getAttribute("weapon")].css_class); // on enleve la classe arme
    el[nb].setAttribute("weapon", ""); // on defini weapon a vide
    el[nb].setAttribute("type", ""); // on defini  type a vide
    game.players[game.players.tour].weapon = change; //on affecte l'arme au joueur

    //on met a jour le champ Armes du joueur
    var infosWeapon = document.getElementById('weapon' + game.players.tour);
    infosWeapon.innerHTML = "Armes : " + game.weapons[game.players[game.players.tour].weapon].name + " (+" + game.weapons[game.players[game.players.tour].weapon].damage + ")";

  } else { // si le joueur a deja une arme

    el[nb].classList.remove(game.weapons[el[nb].getAttribute("weapon")].css_class); // on enleve la classe arme
    el[nb].classList.add(game.weapons[game.players[game.players.tour].weapon].css_class); // on ajoute la nouvelle classe arme

    el[nb].setAttribute("weapon", game.players[game.players.tour].weapon); // on defini weapon 
    el[nb].setAttribute("type", "weapon"); // on defini type a weapon

    game.players[game.players.tour].weapon = change; // on affecte la nouvelle arme

    //on met a jour le champ Armes du joueur
    var infosWeapon = document.getElementById('weapon' + game.players.tour);
    infosWeapon.innerHTML = "Armes : " + game.weapons[game.players[game.players.tour].weapon].name + " (+" + game.weapons[game.players[game.players.tour].weapon].damage + ")";
  };
};


//******************************** Attaque du joueur ******************************//


game.players.attack = function (away) {

  var tour = game.players.tour; // joueur actif
  var otherTour = (game.players.tour === 1) ? 2 : 1; //auter joueur

  if (away) { //si le joueur est en fuite il recoit une attaque par defaut

    var awayLife = game.players[tour].life; // points de vie
    var damage = game.weapons[game.players[away].weapon].damage; // domage arme
    awayLife -= damage;
    game.players[tour].life = awayLife;

    // mise a jour informations
    var life = document.getElementById('life' + tour);
    life.innerHTML = "Points de vie : " + awayLife;
    console.log("Le joueur " + tour + " fuit:  -" + damage);

  } else {

    game.players[tour].action = "attack"; //le joueur est em mode attaque

    var damage = game.weapons[game.players[tour].weapon].damage;
    var life = game.players[otherTour].life;

    if (game.players[otherTour].action === "defend") { //si l'adversaire est en mode defense, les degats sont divides par 2
      damage /= 2;
      life -= damage;
      game.players[otherTour].life = life;
      var elLife = document.getElementById('life' + otherTour);
      elLife.innerHTML = "Points de vie : " + life;

    } else { //si l'adversaire est en mode attaque
      life -= damage;
      game.players[otherTour].life = life;
      var elLife = document.getElementById('life' + otherTour);
      elLife.innerHTML = "Points de vie : " + life;
    };

    game.map.deleteMove(); // fonction de suppression des mouvements autorises
    game.players.tour = (game.players.tour === 1) ? 2 : 1; // nouveau tour
    game.update();
  };
};


game.players.defend = function () {
  game.players[game.players.tour].action = "defend";

  game.map.deleteMove();
  game.players.tour = (game.players.tour === 1) ? 2 : 1;
  game.update();
};