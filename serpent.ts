//Mes variables
let tailleGrille = 10;
class coordonnées {
    constructor(public x: number, public y: number){}

    //vérif de légalité de deux points
    equals(autre: coordonnées): boolean {
        return this.x === autre.x && this.y === autre.y;
    }
}

// état initial du serpent et directions
let serpent: coordonnées[] = [new coordonnées(4 , 4)];
let direction: string = 'droite';

// Génération aléatoire de la nourriture
let pomme: coordonnées = new coordonnées (Math.floor(Math.random() * tailleGrille), Math.floor(Math.random() * tailleGrille)) ;
let finDeJeu = false;

// Génération de la grille et état initial
function apparitionGrille() {
    const grille: string[][] = Array(tailleGrille).fill(null).map(() => Array(tailleGrille).fill(' '));

    // Place du serpent dans la grille
    serpent.forEach(segment => grille[segment.y][segment.x] = '*');

    // Place de la nourriture
    grille[pomme.y][pomme.x] = 'O';

    console.clear();
    console.log('Utilisez les touches Z (Haut), S (Bas), Q (Gauche), D (Droite) pour jouer.');

    // Affichage de la grille
    grille.forEach(row => console.log(row.join('|')));
}

// MAJ de l'état du jeu
function mAJ() {
    if (finDeJeu) return;

    // Calcul de la nouvelle tête du serpent
    const nouvelleTete: coordonnées = new coordonnées(serpent[0].x, serpent[0].y);

    switch (direction) {
        case 'haut': nouvelleTete.y--; break;
        case 'bas': nouvelleTete.y++; break;
        case 'droite': nouvelleTete.x++; break;
        case 'gauche': nouvelleTete.x--; break;
    }

    // Vérif des collisions avec les murs ou avec le corps
    if (nouvelleTete.x < 0 || nouvelleTete.y < 0 || nouvelleTete.x >= tailleGrille || nouvelleTete.y >= tailleGrille ||
        serpent.some(segment => segment.equals(nouvelleTete))) {
        finDeJeu = true;
        console.log('Game Over!');
        return;
    }

    // Vérif du serpent mangeant la nourriture
    if (nouvelleTete.equals(pomme)) {
        // Générer nouvelle pomme
        pomme = new coordonnées (Math.floor(Math.random() * tailleGrille), Math.floor(Math.random() * tailleGrille));
    } else {
        // sinon le serpent rétréci
        serpent.pop();
    }

    // Ajout de la nouvelle tête du serpent
    serpent.unshift(nouvelleTete);
    apparitionGrille();
}

//Assigniation des touches et changement de directions
function touches(key: string) {
    switch (key) {
        case 'z':
            if (direction !== 'bas') direction = 'haut';
            break;
        case 's':
            if (direction !== 'haut') direction = 'bas';
            break;
        case 'q':
            if (direction !== 'droite') direction = 'gauche';
            break;
        case 'd':
            if (direction !== 'gauche') direction = 'droite';
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