//Mes variables
var tailleGrille = 10;
var coordonnées = /** @class */ (function () {
    function coordonnées(x, y) {
        this.x = x;
        this.y = y;
    }
    //vérif de légalité de deux points
    coordonnées.prototype.equals = function (autre) {
        return this.x === autre.x && this.y === autre.y;
    };
    return coordonnées;
}());
// état initial du serpent et directions
var serpent = [new coordonnées(4, 4)];
var direction = 'droite';
// Génération aléatoire de la nourriture
var pomme = new coordonnées(Math.floor(Math.random() * tailleGrille), Math.floor(Math.random() * tailleGrille));
var finDeJeu = false;
// Génération de la grille et état initial
function apparitionGrille() {
    var grille = Array(tailleGrille).fill(null).map(function () { return Array(tailleGrille).fill(' '); });
    // Place du serpent dans la grille
    serpent.forEach(function (segment) { return grille[segment.y][segment.x] = '*'; });
    // Place de la nourriture
    grille[pomme.y][pomme.x] = '\x1b[31mO\x1b[0m';
    console.clear();
    console.log('Utilisez les touches Z (Haut), S (Bas), Q (Gauche), D (Droite) pour jouer.');
    // Affichage de la grille
    grille.forEach(function (row) { return console.log(row.join('|')); });
}
// MAJ de l'état du jeu
function mAJ() {
    if (finDeJeu)
        return;
    // Calcul de la nouvelle tête du serpent
    var nouvelleTete = new coordonnées(serpent[0].x, serpent[0].y);
    switch (direction) {
        case 'haut':
            nouvelleTete.y--;
            break;
        case 'bas':
            nouvelleTete.y++;
            break;
        case 'droite':
            nouvelleTete.x++;
            break;
        case 'gauche':
            nouvelleTete.x--;
            break;
    }
    // Vérif des collisions avec les murs ou avec le corps
    if (nouvelleTete.x < 0 || nouvelleTete.y < 0 || nouvelleTete.x >= tailleGrille || nouvelleTete.y >= tailleGrille ||
        serpent.some(function (segment) { return segment.equals(nouvelleTete); })) {
        finDeJeu = true;
        console.log('Game Over!');
        return;
    }
    // Vérif du serpent mangeant la nourriture
    if (nouvelleTete.equals(pomme)) {
        // Générer nouvelle pomme
        pomme = new coordonnées(Math.floor(Math.random() * tailleGrille), Math.floor(Math.random() * tailleGrille));
    }
    else {
        // sinon le serpent rétréci
        serpent.pop();
    }
    // Ajout de la nouvelle tête du serpent
    serpent.unshift(nouvelleTete);
    apparitionGrille();
}
//Assigniation des touches et changement de directions
function touches(key) {
    switch (key) {
        case 'z':
            if (direction !== 'bas')
                direction = 'haut';
            break;
        case 's':
            if (direction !== 'haut')
                direction = 'bas';
            break;
        case 'q':
            if (direction !== 'droite')
                direction = 'gauche';
            break;
        case 'd':
            if (direction !== 'gauche')
                direction = 'droite';
            break;
    }
}
// Boucle du jeu
function boucleJeu() {
    if (!finDeJeu) {
        mAJ();
        setTimeout(boucleJeu, 500); // vitesse du jeu (500ms par mouvement)
    }
}
// Initialisation du jeu
apparitionGrille();
boucleJeu();
// Capture des entrées utilisateur
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('data', touches);
