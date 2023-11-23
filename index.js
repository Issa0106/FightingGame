const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// variable
// largeur des barres de vies
let yellowRect1width = -432;
let yellowRect2width = 432;
// commandes bloqués
let commandsBlocked = false;
// player et enemy au sol
let isPlayerOnGround = true;
let isEnemyOnGround = true;



// fenêtre de l'écran du jeu
canvas.width = 960
canvas.height = 530
// fond du jeu 
c.fillRect(0, 0, canvas.width, canvas.height)

// gravité
const gravity = 0.6

// classe joueur 
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
       // dessine l'attackBox
       if (this.isAttacking) {
           c.fillStyle = 'green'
           c.fillRect(
               this.attackBox.position.x,
               this.attackBox.position.y,
               this.attackBox.width,
               this.attackBox.height
           )
           }

       // desine les joueurs
       c.fillStyle = this.color
       c.fillRect(this.position.x, this.position.y, this.width, this.height)

   }

   update() {
        // met à jour les dessins avec leur nouvelle position 
       this.draw()
       this.attackBox.position.x = this.position.x + this.attackBox.offset.x
       this.attackBox.position.y = this.position.y

       this.position.x += this.velocity.x
       this.position.y += this.velocity.y
        // détecte le sol et impose une gravité si le joueur touche pas le sol  
       if (this.position.y + this.height + this.velocity.y >= canvas.height) {
           this.velocity.y = 0
       } else this.velocity.y += gravity
   }

   attack () {
        // le joeur attack seulement 100ms, donc affiche l'attackBox seulement 100ms
       this.isAttacking = true
       setTimeout(() => {
           this.isAttacking = false
       }, 100)
   }
}

// création de l'objet player (p1)
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

// création de l'objet enemy (p2)
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

// clés préssées 
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


function checkBorders(sprite) {
   // vérifie le bord gauche du canvas
   if (sprite.position.x < 0) {
       sprite.position.x = 0;
   }

   // vérifie le bord droit du canvas
   if (sprite.position.x + sprite.width > canvas.width) {
       sprite.position.x = canvas.width - sprite.width;
   }

   // vérifie le bord supérieur du canvas
   if (sprite.position.y < 0) {
       sprite.position.y = 0;
   }

}


function rectCollision({ rect1, rect2}) {
    // return true si l'attack box à touché un joueur 
   return (
       rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x && 
       rect1.attackBox.position.x <=rect2.position.x + rect2.width && 
       rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y && 
       rect1.attackBox.position.y <=rect2.position.y + rect2.height
   )
}

function determineWinner({player, enemy}) {
    // determine le gagnant et affiche son nom
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

// fonction / boucle principale
function animate() {
    // formation de la boucle 
   window.requestAnimationFrame(animate)
   // fond de la fenêtre canva
   c.fillStyle = 'black'
   c.fillRect(0, 0, canvas.width, canvas.height)

   // fond barres de vies
   c.fillStyle = 'red'
   c.fillRect(0, 22.5, 432 , 35)

   c.fillStyle = 'red'
   c.fillRect(528, 22.5, 432 , 35)

   //timer
   c.fillStyle = 'blue'
   c.fillRect(432, 17.5, 96 , 45)

   // barres de vies
   c.fillStyle = 'yellow';
   c.fillRect(432, 22.5, yellowRect1width, 35);

   c.fillStyle = 'yellow';
   c.fillRect(528, 22.5, yellowRect2width, 35);
   
   // nom des joueurs 
    c.fillStyle = 'black';
    c.textAlign = 'center';
    c.font = '20px Arial';
    c.fillText(namePlayer, 60, 47)

    c.fillStyle = 'black';
    c.textAlign = 'center';
    c.font = '20px Arial';
    c.fillText(nameEnemy, 900 , 47)

    // MAJ de l'affichage des joueurs 
   player.update() 
   enemy.update()

   // vérifie les bords des joueurs
   checkBorders(player);
   checkBorders(enemy);

   // initialisation des vitesses des joueurs
   player.velocity.x = 0
   enemy.velocity.x =0

   // modification de la vitesse des joueurs une fois les commandes utilisées

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

   // détecte collision player --> enemy
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

   // détecte collision enemy  --> player
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

   // détecte joueurs au sol 
   if (player.position.y + player.height >= canvas.height) {
    isPlayerOnGround = true;
    }
    if (enemy.position.y + enemy.height >= canvas.height) {
    isEnemyOnGround = true;
    }

   // fin du jeu 
   if (enemy.health <= 0 || player.health <= 0) {
       determineWinner({player, enemy})
       commandsBlocked = true;
   }

   
   
}


// appel de la fonction animer 
animate()

// détecte touche préssées
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

// détecte touche relachées
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
