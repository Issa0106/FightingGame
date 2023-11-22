const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

let yellowRect1width = -432;
let yellowRect2width = 432;
let commandsBlocked = false;
let isPlayerOnGround = true;
let isEnemyOnGround = true;




canvas.width = 960
canvas.height = 530

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.6

class Sprite {
   constructor({position, velocity, color, offset, health, playerName}){
       this.position = position
       this.velocity = velocity
       this.width = 50
       this.height = 150
       this.lastKey
       this.attackBox = {
           position: {
               x: this.position.x,
               y: this.position.y
           },
           offset,
           width: 150,
           height: 100
       }
       this.color = color
       this.isAttacking
       this.health = health 
       this.playerName = playerName

   }

   draw() {
       // attack Box
       if (this.isAttacking) {
           c.fillStyle = 'green'
           c.fillRect(
               this.attackBox.position.x,
               this.attackBox.position.y,
               this.attackBox.width,
               this.attackBox.height
           )
           }

       // player
       c.fillStyle = this.color
       c.fillRect(this.position.x, this.position.y, this.width, this.height)

   }

   update() {
       this.draw()
       this.attackBox.position.x = this.position.x + this.attackBox.offset.x
       this.attackBox.position.y = this.position.y

       this.position.x += this.velocity.x
       this.position.y += this.velocity.y

       if (this.position.y + this.height + this.velocity.y >= canvas.height) {
           this.velocity.y = 0
       } else this.velocity.y += gravity
   }

   attack () {
       this.isAttacking = true
       setTimeout(() => {
           this.isAttacking = false
       }, 100)
   }
}


const player = new Sprite({
   position: {
       x: 215,
       y: 0
   },
   velocity: {
       x: 0,
       y: 0
   },
   color: 'blue',
   offset:{
       x: 0,
       y: 0
   },
   health: 432,
   playerName: namePlayer
})

const enemy = new Sprite({
   position: {
       x: 695,
       y: 0
   },
   velocity: {
       x: 0,
       y: 0
   },
   color: 'red',
   offset:{
       x: -100,
       y: 0
   },
   health: 432,
   playerName: nameEnemy
})

const keys = {
   q: {
       pressed: false
   },
   d: {
       pressed: false
   },
   z: {
       pressed: false
   },
   ArrowLeft: {
       pressed: false
   },
   ArrowRight: {
       pressed: false
   },
   ArrowUp: {
       pressed: false
   }
}

const gameHistory = [];

// Fonction pour initialiser une nouvelle partie
function initializeGame(playerName, enemyName) {
    yellowRect1width = -432;
    yellowRect2width = 432;
    commandsBlocked = false;
    isPlayerOnGround = true;
    isEnemyOnGround = true;

    player.position = { x: 215, y: 0 };
    enemy.position = { x: 695, y: 0 };

    player.velocity = { x: 0, y: 0 };
    enemy.velocity = { x: 0, y: 0 };

    player.health = 432;
    enemy.health = 432;

    player.playerName = playerName;
    enemy.playerName = enemyName;

    animate();
}

// Fonction pour enregistrer le résultat de la partie dans l'historique
function saveGameResult(winner) {
    const gameResult = {
        player1: player.playerName,
        player2: enemy.playerName,
        winner: winner,
    };
    gameHistory.push(gameResult);
}

// Fonction pour afficher l'historique des parties
function showGameHistory() {
    console.log("Historique des parties:");
    gameHistory.forEach((result, index) => {
        console.log(`Partie ${index + 1}: ${result.player1} vs ${result.player2}, Gagnant: ${result.winner}`);
    });
}

// ...

// Fonction pour recommencer le jeu avec les mêmes noms
function restartGame() {
    initializeGame(player.playerName, enemy.playerName);
}

// Fonction pour changer les noms des joueurs et recommencer le jeu
function changeNamesAndRestart() {
    const newPlayerName = prompt("Nouveau nom du joueur (p1) :");
    const newEnemyName = prompt("Nouveau nom du joueur (p2) :");

    if (newPlayerName && newEnemyName) {
        initializeGame(newPlayerName, newEnemyName);
    } else {
        alert("Veuillez entrer les deux noms de joueurs.");
    }
}

function checkBorders(sprite) {
   // Vérifie le bord gauche du canvas
   if (sprite.position.x < 0) {
       sprite.position.x = 0;
   }

   // Vérifie le bord droit du canvas
   if (sprite.position.x + sprite.width > canvas.width) {
       sprite.position.x = canvas.width - sprite.width;
   }

   // Vérifie le bord supérieur du canvas
   if (sprite.position.y < 0) {
       sprite.position.y = 0;
   }

}


function rectCollision({ rect1, rect2}) {
   return (
       rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x && 
       rect1.attackBox.position.x <=rect2.position.x + rect2.width && 
       rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y && 
       rect1.attackBox.position.y <=rect2.position.y + rect2.height
   )
}

function determineWinner({player, enemy}) {
   if (player.health > enemy.health) {
       c.fillStyle = 'white';
       c.textAlign = 'center';
       c.fillText(namePlayer + ' Wins', canvas.width/2 , canvas.height/2);
   } else if (player.health < enemy.health) {
       c.fillStyle = 'white';
       c.textAlign = 'center';
       c.fillText(nameEnemy + ' Wins', canvas.width/2 , canvas.height/2)
   } else if (player.health === enemy.health) {
       c.fillStyle = 'white';
       c.textAlign = 'center';
       c.fillText('Tie', canvas.width/2 , canvas.height/2)
   }
}

function animate() {
   window.requestAnimationFrame(animate)
   c.fillStyle = 'black'
   c.fillRect(0, 0, canvas.width, canvas.height)

   // rect fond
   c.fillStyle = 'red'
   c.fillRect(0, 22.5, 432 , 35)

   c.fillStyle = 'red'
   c.fillRect(528, 22.5, 432 , 35)

   //timer
   c.fillStyle = 'blue'
   c.fillRect(432, 17.5, 96 , 45)

   // rect 1 , 2
   c.fillStyle = 'yellow';
   c.fillRect(432, 22.5, yellowRect1width, 35);

   c.fillStyle = 'yellow';
   c.fillRect(528, 22.5, yellowRect2width, 35);
   
   // name player
    c.fillStyle = 'black';
    c.textAlign = 'center';
    c.font = '20px Arial';
    c.fillText(namePlayer, 60, 47)

    c.fillStyle = 'black';
    c.textAlign = 'center';
    c.font = '20px Arial';
    c.fillText(nameEnemy, 900 , 47)


   player.update() 
   enemy.update()

   checkBorders(player);
   checkBorders(enemy);

   player.velocity.x = 0
   enemy.velocity.x =0

   // player movement
   if (keys.q.pressed && player.lastKey === 'q') {
       player.velocity.x = -5
   } else if (keys.d.pressed && player.lastKey === 'd') {
       player.velocity.x = 5
   } else if (keys.z.pressed && isPlayerOnGround) {
        player.velocity.y = -15;
        isPlayerOnGround = false; 
   }


   // enemy movement
   if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
       enemy.velocity.x = -5
   } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
       enemy.velocity.x = 5
   } else if (keys.ArrowUp.pressed && isEnemyOnGround) {
    enemy.velocity.y = -15;
    isEnemyOnGround = false; 
}

   // detect for collision
   if (
       rectCollision({
           rect1: player,
           rect2: enemy
       }) &&
       player.isAttacking
   ) {
       player.isAttacking = false
       console.log('player attack')
       // health bar 2
       if (yellowRect2width !== 0) {
           yellowRect2width -= 108
           enemy.health -= 108;
           console.log(enemy.health)
       } else {
           yellowRect2width = 0;
       }
   }

   if (
       rectCollision({
           rect1: enemy,
           rect2: player
       }) &&
       enemy.isAttacking
   ) {
       enemy.isAttacking = false
       console.log('enemy attack')
       // health bar 1
       if (yellowRect1width !== 0) {
           yellowRect1width += 108;
           player.health -= 108
           console.log(player.health)
       } else {
           yellowRect1width = 0;
       }
   }

   // end game
   if (enemy.health <= 0 || player.health <= 0) {
       determineWinner({player, enemy})
       commandsBlocked = true;
   }

   // player, enemy on ground
   if (player.position.y + player.height >= canvas.height) {
    isPlayerOnGround = true;
    }
    if (enemy.position.y + enemy.height >= canvas.height) {
    isEnemyOnGround = true;
    }
   
   
}



animate()

window.addEventListener('keydown', (event) => {
    if (!commandsBlocked) {
        switch (event.key) {
            // player key
               case 'q':
                   keys.q.pressed = true
                   player.lastKey = 'q'
                   break
               case 'd':
                   keys.d.pressed = true
                   player.lastKey = 'd'
                   break
                case 'z':
                if (isPlayerOnGround) {
                    player.velocity.y = -15;
                    isPlayerOnGround = false;
                }
                break;
               case 's':
                   player.attack()
                   break
            // enemy key
               case 'ArrowLeft':
                   keys.ArrowLeft.pressed = true
                   enemy.lastKey = 'ArrowLeft'
                   break
               case 'ArrowRight':
                   keys.ArrowRight.pressed = true
                   enemy.lastKey = 'ArrowRight'
                   break
                case 'ArrowUp':
                if (isEnemyOnGround) {
                    enemy.velocity.y = -15;
                    isEnemyOnGround = false;
                }
                break;
               case 'ArrowDown':
                   enemy.attack()
                   break
               
           }
           //console.log(event.key)
    }
   
})

window.addEventListener('keyup', (event) => {
   // player key
   if (!commandsBlocked) {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'q':
            keys.q.pressed = false
            break
    }
    // enemy key
    switch (event.key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
    }
    //console.log(event.key)
}
   
})


console.log("Player Name:", namePlayer);
console.log("Enemy Name:", nameEnemy);