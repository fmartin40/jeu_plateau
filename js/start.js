var game = {} // Initialisation du moteur de jeu


//******************************** Nouvelle partie ******************************//

game.new = function () {

  console.log("NOUVELLE PARTIE !");

  var nbBlocked = parseInt(document.getElementById('nbBlocked').value); // recuperation du nombre d'obstacles
  var nbWeapon = parseInt(document.getElementById('nbWeapon').value); // recuperation du nombre d'armes

  game.map.generateMap(); // on genere la carte
  game.map.genererateBlocked(nbBlocked); // on genere les obstacles
  game.map.generateWeapons(nbWeapon); // on genere les armes
  game.players.generatePlayers(); // on genere les joueurs

  console.log("Le joueur " + game.players.tour + " commence. A l'attaque!");

  game.update(); //mise a jour de la partie (joueurs et mouvements)
}


//******************************** Mise a jour partie ******************************//

game.update = function () {
  game.players.info(); // fonction de mise a jour informations 
  game.map.calculateMove(); // fonction de calcul des mouvements possibles
};