function start() {
    $('#main').hide()

    $('#bgGame').append('<div id="player" class="anima1"></div>')
    $('#bgGame').append('<div id="enemy1" class="anima2"></div>')
    $('#bgGame').append('<div id="enemy2"></div>')
    $('#bgGame').append('<div id="friend" class="anima3"></div>')
    $('#bgGame').append('<div id="scoreboard"></div>')
    $('#bgGame').append('<div id="energy"></div>')

    const fireSound = document.getElementById('somDisparo')
    const explosionSound = document.getElementById('somExplosao')
    const music = document.getElementById('musica')
    const gamerOverSound = document.getElementById('somGameover')
    const rescueSound = document.getElementById('somResgate')
    const loseSound = document.getElementById('somPerdido')

    music.addEventListener('ended', function() {
        music.currentTime = 0
        music.play()
    }, false)
    music.play()

    var game = {}

    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    }
    var velocidade = 5
    var velocidade2 = 3
    var posicaoY = parseInt(Math.random() * 334)
    var podeAtirar = true
    
    var endGame = false;

    var points = 0
    var saves = 0
    var loses = 0

    var actualEnergy = 3

    game.press = []

    $(document).keydown(function(e) {
        game.press[e.which] = true
    })

    $(document).keyup(function(e) {
        game.press[e.which] = false
    })

    game.timer = setInterval(loop, 30)

    function loop () {
        moveBg()
        movePlayer()
        moveEnemy()
        moveEnemy2()
        moveFriend()
        collision()
        scoreboard()
        energy()
    }

    function movePlayer() {
        var topW = parseInt($('#player').css('top'))
    
        if (game.press[TECLA.W]) {
            $('#player').css('top', topW-10)
            if (topW <= 0) {
                $('#player').css('top', topW+20)
            }
        }
        if (game.press[TECLA.S]) {
            $('#player').css('top', topW+10)
            if (topW >= 437) {
                $('#player').css('top', topW-10)
            }
        }
        if (game.press[TECLA.D]) {
            fire()
        }
    }

    function moveEnemy() {
        posicaoX = parseInt($('#enemy1').css('left'))
        $('#enemy1').css('left', posicaoX-velocidade)
        $('#enemy1').css('top', posicaoY);

        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334)
            $('#enemy1').css('left', 694)
            $('#enemy1').css('top', posicaoY)
        }
    }

    function moveEnemy2() {
        posicaoX = parseInt($('#enemy2').css('left'))
        $('#enemy2').css('left', posicaoX-velocidade2)

        if (posicaoX <= 0) {
            $('#enemy2').css('left', 775)
        }
    }

    function moveFriend() {
        posicaoX = parseInt($('#friend').css('left'))
        $('#friend').css('left', posicaoX+1)

        if (posicaoX>906) {
            $('#friend').css('left', 0)
        }
    }

    function fire() {
        if (podeAtirar == true) {
            fireSound.play()
            podeAtirar = false

            topW = parseInt($('#player').css('top'))
            posicaoX = parseInt($('#player').css('left'))
            fireX = posicaoX + 190
            topFire = topW + 37
            $('#bgGame').append('<div id="fire"></div>')
            $('#fire').css('top', topFire)
            $('#fire').css('left', fireX)

            var fireTime = window.setInterval(shoots, 30)
        }

        function shoots() {
            posicaoX = parseInt($('#fire').css('left'))
            $('#fire').css('left', posicaoX+15)

            if (posicaoX>900) {
                window.clearInterval(fireTime)
                fireTime = null
                $('#fire').remove()
                podeAtirar=true
            }
        }
    }

    function moveBg() {
        let left = parseInt($('#bgGame').css('background-position'))
        $('#bgGame').css('background-position', left-1)
    }

    function collision() {
        var collision1 = ($('#player').collision($('#enemy1')))
        var collision2 = ($('#player').collision($('#enemy2')))
        var collision3 = ($('#fire').collision($('#enemy1')))
        var collision4 = ($('#fire').collision($('#enemy2')))
        var collision5 = ($('#player').collision($('#friend')))
        var collision6 = ($('#enemy2').collision($('#friend')))

        if (collision1.length>0) {
            actualEnergy--
            enemy1X = parseInt($('#enemy1').css('left'))
            enemy1Y = parseInt($('#enemy1').css('top'))

            boom(enemy1X, enemy1Y, 'explosion1')

            posicaoY = parseInt(Math.random() * 334)
            $('#enemy1').css('left', 694)
            $('#enemy1').css('top', posicaoY)
        }

        if (collision2.length > 0) {
            actualEnergy--
            enemy2X = parseInt($('#enemy2').css('left'))
            enemy2Y = parseInt($('#enemy2').css('top'))
            boom(enemy2X, enemy2Y, 'explosion2')

            $('#enemy2').remove()

            repositionEnemy()
        }

        if (collision3.length > 0) {
            points += 100
            velocidade+=0.3
            enemy1X = parseInt($('#enemy1').css('left'))
            enemy1Y = parseInt($('#enemy1').css('top'))

            boom(enemy1X, enemy1Y, 'explosion1')
            $('#disparo').css('left', 950)

            posicaoY = parseInt(Math.random() * 334)
            $('#enemy1').css('left', 694)
            $('#enemy1').css('top', posicaoY)
        }

        if (collision4.length > 0) {
            points+=50
            velocidade2+=0.3
            enemy2X = parseInt($('#enemy2').css('left'))
            enemy2Y = parseInt($('#enemy2').css('top'))
            $('#enemy2').remove()

            boom(enemy2X, enemy2Y, 'enemy2')
            $('#fire').css('left', 950)

            repositionEnemy()
        }

        if (collision5.length>0) {
            saves++
            rescueSound.play()
            repositionFriend()
            $('#friend').remove()
        }

        if (collision6.length > 0) {
            loses++
            friendX = parseInt($('#friend').css('left'))
            frienY = parseInt($('#friend').css('top'))

            boom3(friendX, frienY)

            $('#friend').remove()

            repositionFriend()
        }
    }

    function boom (enemy1X, enemy1Y, divid) {
        explosionSound.play()
        $('#bgGame').append(`<div id="${divid}"></div>`)
        var div = $(`#${divid}`)
        div.css('background-image', 'url(assets/imgs/explosao.png)')
        

        div.css('top', enemy1Y)
        div.css('left', enemy1X)
        div.animate({width:200, opacity: 0}, 'slow')

        var explosionTime = window.setInterval(removeExplosion, 1000)

        function removeExplosion() {
            div.remove()
            window.clearInterval(explosionTime)
            explosionTime = null
        }
    }

    function boom3 (enemy1X, enemy1Y) {
        loseSound.play()
        $('#bgGame').append(`<div id="explosion3" class="anima4"></div>`)
        var div = $(`#explosion3`)

        div.css('top', enemy1Y)
        div.css('left', enemy1X)

        var explosionTime = window.setInterval(resetExplosion, 1000)

        function resetExplosion() {
            div.remove()
            window.clearInterval(explosionTime)
            explosionTime = null
        }
    }

    function repositionEnemy() {
        var collisionTime4 = window.setInterval(reposition4, 5000)

        function reposition4() {
            window.clearInterval(collisionTime4)
            collisionTime4 = null

            if (endGame == false) {
                $('#bgGame').append('<div id="enemy2"></div>')
            }
        }
    }

    function repositionFriend() {
        var friendTime = window.setInterval(reposition6, 6000)

        function reposition6() {
            window.clearInterval(friendTime)
            friendTime = null

            if (endGame == false) {
                $('#bgGame').append('<div id="friend" class="anima3"></div>')
            }
        }
    }

    function scoreboard() {
        $('#scoreboard').html(`<h2> Pontos: ${points} Salvos: ${saves} Perdidos: ${loses}</h2>`)
    }

    function energy() {
        if (actualEnergy == 3) {
            $('#energy').css('background-image', 'url(assets/imgs/energia3.png)')
        }

        if (actualEnergy == 2) {
            $('#energy').css('background-image', 'url(assets/imgs/energia2.png)')
        }

        if (actualEnergy == 1) {
            $('#energy').css('background-image', 'url(assets/imgs/energia1.png)')
        }

        if (actualEnergy == 0) {
            $('#energy').css('background-image', 'url(assets/imgs/energia0.png)')
            gameOver()
        }
    }

    function gameOver() {
        endGame = true
        music.pause()
        gamerOverSound.play()

        window.clearInterval(game.timer)
        game.timer=null

        $('#player').remove()
        $('#enemy1').remove()
        $('#enemy2').remove()
        $('#friend').remove()

        $('#bgGame').append('<div id="end"></div>')

        $('#end').html(`<h1> Game Over </h1><p>Sua pontuação foi: ${points}</p><div id="reset" onClick="resetGame()"><h3>Jogar novamente</h3></div>`)
    }
}

function resetGame() {
    const gamerOverSound = document.getElementById('somGameover')
    gamerOverSound.pause()
    $('#end').remove()
    start()
}