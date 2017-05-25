game.map = {}; // initialisation de l'objet map


//****************************** Initialise une nouvelle carte ******************************//


game.map.generateMap = function () {

  document.getElementById('map').innerHTML = ""; // réinitialise la carte

  var el = document.getElementById('map');

  for (var i = 0; i < 10; i++) { // genere une carte de 10 sur 10
    var row = document.createElement('div');
    row.setAttribute("class", "row"); // attribution classe row
    el.appendChild(row);

    for (var j = 0; j < 10; j++) {
      var col = document.createElement('div');
      col.setAttribute("class", "square"); // attribution classe row
      col.setAttribute("data-x", j + 1); // attribution attribut data-x
      col.setAttribute("data-y", i + 1); // attribution attribut data-y
      col.setAttribute("type", ""); // attribution attribut type (vide/blocked/weapon/player)
      col.setAttribute("weapon", ""); //// attribution attribut weapon (arme0 ... arme4)
      row.appendChild(col);
    }
  }
}


//****************************** Initialise les obstacles ******************************//


game.map.genererateBlocked = function (nb) {

  for (var i = 0; i < nb; i++) {
    var x = Math.ceil(Math.random() * 10); //genere un nombre entre 1 et 10
    var y = Math.ceil(Math.random() * 10);

    var blocked = document.querySelector(".square[data-x='" + x + "'][data-y='" + y + "']"); // on recupere la case

    if (blocked.getAttribute("type") === "") { // test si la case est vide
      blocked.setAttribute("type", "blocked"); // on defini le type a blocked
      blocked.classList.add("blocked"); // on attribue la classe blocked
    } else {
      i--; // si la case n'est pas vide on recommence l'iteration
    };
  }
}


//****************************** Initialise les armes ******************************//


// Initialisation de l'objet Armes
game.weapons = {
  arme0: {
    name: "Mains nues",
    damage: 10,
    css_class: "barehands"
  },
  arme1: {
    name: "Dague",
    damage: 15,
    css_class: "dague"
  },
  arme2: {
    name: "Epée",
    damage: 20,
    css_class: "sword"
  },
  arme3: {
    name: "Double épée",
    damage: 25,
    css_class: "double"
  },
  arme4: {
    name: "Sabre laser",
    damage: 35,
    css_class: "laser"
  }
}


//Placement aleatoire des armes
game.map.generateWeapons = function (nb) {

  console.log(nb + " arme(s) en jeux:");

  for (var i = 0; i < nb; i++) {

    var random = Math.ceil((Math.random() * 4) - 1); //genere un nombre entre 1 et 4
    var x = Math.ceil(Math.random() * 10); //genere un nombre entre 1 et 10
    var y = Math.ceil(Math.random() * 10);

    var weapon = document.querySelector(".square[data-x='" + x + "'][data-y='" + y + "']"); // on recupere la case

    if (weapon.getAttribute("type") === "") { // test si la case est vide

      weapon.setAttribute("type", "weapon"); // on defini le type a weapon
      weapon.setAttribute("weapon", "arme" + (random + 1)); // on defini l'arme
      weapon.classList.add(game.weapons['arme' + (random + 1)].css_class); // on ajoute la classe de l'arme

      console.log("- " + game.weapons['arme' + random].name + "(" + game.weapons['arme' + random].damage + "pts)");

    } else { // si la case n'est pas vide on recommence l'iteration
      i--;
    };
  };
}


//************************* Calcul des deplacements autorisés (max 3) ************************//


game.map.calculateMove = function () {

  var player = game.players.tour; // defini le joueur actif
  var x = parseInt(game.players[player].coordX);
  var y = parseInt(game.players[player].coordY);

  // calcul des deplacements a droite
  for (var i = 1; i < 4; i++) {
    var el = document.querySelector(".square[data-x='" + (x + i) + "'][data-y='" + y + "']"); // on recupere la case

    if (el) { //si on ne sort pas de la carte
      if ((el.getAttribute("type") === "blocked") || (el.getAttribute("type") === "player")) { // si la case est occupee on sort de la boucle
        break;
      } else if ((el.getAttribute("type") === "") || (el.getAttribute("type") === "weapon")) { // si la case est vide ou weapon on attribue la classe "move"

        if (el.getAttribute("type") === "") { // si la case est vide
          el.setAttribute("type", "move"); // on defini le type move
        } else if (el.getAttribute("type") === "weapon") { // si la case est une arme
          el.setAttribute("type", "move+weapon"); // on defini le type move+weapon (mouvement possible et arme)
        };
        el.classList.add("move" + player); // on attribue la classe move
        el.addEventListener('click', game.map.clickMove, false); // on ajoute l'evenement click pour le deplacement du joueur
      };
    };
  };

  // calcul des deplacements
  for (var i = 1; i < 4; i++) {
    var el = document.querySelector(".square[data-x='" + (x - i) + "'][data-y='" + y + "']"); // on recupere la case
    if (el) { //si on ne sort pas de la carte
      if ((el.getAttribute("type") === "blocked") || (el.getAttribute("type") === "player")) { // si la case est bloquée on sort de la boucle
        break;
      } else if ((el.getAttribute("type") === "") || (el.getAttribute("type") === "weapon")) { // si la case est vide ou weapon on attribue la classe "move"
        if (el.getAttribute("type") === "") { // si la case est vide
          el.setAttribute("type", "move"); // on defini le type move
        } else if (el.getAttribute("type") === "weapon") { // si la case est une arme
          el.setAttribute("type", "move+weapon"); // on defini le type move+weapon (mouvement possible et arme)
        };
        el.classList.add("move" + player); // on attribue la classe move
        el.addEventListener('click', game.map.clickMove, false); // on ajoute l'evenement click pour le deplacement du joueur
      }
    };
  };

  // calcul des deplacements en haut
  for (var i = 1; i < 4; i++) {
    var el = document.querySelector(".square[data-x='" + (x) + "'][data-y='" + (y + i) + "']");

    if (el) { //si on ne sort pas de la carte
      if ((el.getAttribute("type") === "blocked") || (el.getAttribute("type") === "player")) { // si la case est bloquée on sort de la boucle
        break;
      } else if ((el.getAttribute("type") === "") || (el.getAttribute("type") === "weapon")) { // si la case est vide on attribue la classe "move"
        if (el.getAttribute("type") === "") {
          el.setAttribute("type", "move");
        } else if (el.getAttribute("type") === "weapon") {
          el.setAttribute("type", "move+weapon");
        };
        el.classList.add("move" + player);
        el.addEventListener('click', game.map.clickMove, false);
      }
    };
  };

  // calcul des deplacements en bas
  for (var i = 1; i < 4; i++) {
    var el = document.querySelector(".square[data-x='" + (x) + "'][data-y='" + (y - i) + "']");

    if (el) { //si on ne sort pas de la carte
      if ((el.getAttribute("type") === "blocked") || (el.getAttribute("type") === "player")) { // si la case est bloquée on sort de la boucle
        break;
      } else if ((el.getAttribute("type") === "") || (el.getAttribute("type") === "weapon")) { // si la case est vide on attribue la classe "move"
        if (el.getAttribute("type") === "") {
          el.setAttribute("type", "move");
        } else if (el.getAttribute("type") === "weapon") {
          el.setAttribute("type", "move+weapon");
        };
        el.classList.add("move" + player);
        el.addEventListener('click', game.map.clickMove, false);
      };
    };
  };


  // test si combat possible
  var el1 = document.querySelector(".square[data-x='" + x + "'][data-y='" + (y - 1) + "']");
  var el2 = document.querySelector(".square[data-x='" + x + "'][data-y='" + (y + 1) + "']");
  var el3 = document.querySelector(".square[data-x='" + (x - 1) + "'][data-y='" + y + "']");
  var el4 = document.querySelector(".square[data-x='" + (x + 1) + "'][data-y='" + y + "']");

  if (el1) { // si la case existe
    if (el1.getAttribute("type") === "player") { // si la case existe
      game.players.fight = true; //mode combat actif
    }
  };
  if (el2) {
    if (el2.getAttribute("type") === "player") {
      game.players.fight = true;
    };
  };
  if (el3) {
    if (el3.getAttribute("type") === "player") {
      game.players.fight = true;
    };
  };
  if (el4) {
    if (el4.getAttribute("type") === "player") {
      game.players.fight = true;
    };
  };

  var buttontAttack = document.getElementById('attack'); // on recupere le button attack
  var buttontDefend = document.getElementById('defend'); // on recupere le button defemd

  if (game.players.fight === true) { //si mode combat actif

    buttontAttack.disabled = false; // on active le button attack
    buttontAttack.style.opacity = 1; // on regle l'opacite a 1
    buttontDefend.disabled = false; // on active le button defend
    buttontDefend.style.opacity = 1;
  } else {

    buttontAttack.disabled = true; // on desactive le button attack
    buttontAttack.style.opacity = 0.4; // on regle l'opacite a 0.4
    buttontDefend.disabled = true; // on desactive le button attack
    buttontDefend.style.opacity = 0.4;
  };
};


//****************************** Gestion du clic sur la carte ******************************//

game.map.clickMove = function (e) {
  game.map.deleteMove(); // fonction pour la suppression des mouvements possibles
  game.players.move(e); // fonction de placement du joueur
};


//****************************** Suppression des deplacements autorisés ******************************//
game.map.deleteMove = function () {

  var player = game.players.tour; // on defini le joueur actif
  var x = parseInt(game.players[player].coordX);
  var y = parseInt(game.players[player].coordY);

  // suppression des deplacements a droite
  for (var i = 1; i < 4; i++) {
    var el = document.querySelector(".square[data-x='" + (x + i) + "'][data-y='" + y + "']"); // on recupere la carte

    if (el) { //si on ne sort pas de la carte

      if (el.getAttribute("type") === ("move")) { // si la case est de type move
        el.setAttribute("type", ""); // on defini le type move a vide
        el.classList.remove("move" + player); // on enleve la classe player
        el.removeEventListener('click', game.map.clickMove, false); //on supprime l'evenement onclick

      } else if (el.getAttribute("type") === ("move+weapon")) { // si la case est de type move+weapon
        el.setAttribute("type", "weapon"); // on defini le type move a weapon
        el.classList.remove("move" + player); // on enleve la classe player
        el.removeEventListener('click', game.map.clickMove, false); //on supprime l'evenement onclick
      };
    };
  };

  // suppression des deplacements a gauche
  for (var i = 1; i < 4; i++) {
    var el = document.querySelector(".square[data-x='" + (x - i) + "'][data-y='" + y + "']");

    if (el) { //si on ne sort pas de la carte

      if (el.getAttribute("type") === ("move")) {
        el.setAttribute("type", "");
        el.classList.remove("move" + player);
        el.removeEventListener('click', game.map.clickMove, false);

      } else if (el.getAttribute("type") === ("move+weapon")) {
        el.setAttribute("type", "weapon");
        el.classList.remove("move" + player);
        el.removeEventListener('click', game.map.clickMove, false);
      };
    };
  };

  // suppression des deplacements en haut
  for (var i = 1; i < 4; i++) {
    var el = document.querySelector(".square[data-x='" + (x) + "'][data-y='" + (y + i) + "']");

    if (el) { //si on ne sort pas de la carte

      if (el.getAttribute("type") === ("move")) {
        el.setAttribute("type", "");
        el.classList.remove("move" + player);
        el.removeEventListener('click', game.map.clickMove, false);

      } else if (el.getAttribute("type") === ("move+weapon")) {
        el.setAttribute("type", "weapon");
        el.classList.remove("move" + player);
        el.removeEventListener('click', game.map.clickMove, false);
      };
    };
  };

  // suppression des deplacements en bas
  for (var i = 1; i < 4; i++) {
    var el = document.querySelector(".square[data-x='" + (x) + "'][data-y='" + (y - i) + "']");

    if (el) { //si on ne sort pas de la carte

      if (el.getAttribute("type") === ("move")) {
        el.setAttribute("type", "");
        el.classList.remove("move" + player);
        el.removeEventListener('click', game.map.clickMove, false);

      } else if (el.getAttribute("type") === ("move+weapon")) {
        el.setAttribute("type", "weapon");
        el.classList.remove("move" + player);
        el.removeEventListener('click', game.map.clickMove, false);
      };
    };
  };
};


// genere la carte a l'ouverture de l'application
game.map.generateMap();