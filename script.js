  // Think about controlling state in a more organized way next time.
    const grid = document.querySelector('.grid'); 
    const doodler = document.createElement('div'); 
    let doodlerLeftSpace = 0;
    let doodlerBottomSpace = 0;
    let doodlerBottomSpaceTmp = 350;
    let platformCount = 10;
    let isGameOver = false;
    let move = false;
    let platforms = [];
    let platformXY = {}; // {y: [x0,x1]}
    let upTimerId;
    let downTimerId;
    let score = 0;

    // platform has height of 15px and is 100px off the ground
    function createDoodler() { 
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodlerBottomSpace = platforms[0].bottom + 13; 
        doodler.style.left = doodlerLeftSpace + 'px'; // does it read from doodlerLeftSpace the whole program?
        doodler.style.bottom = doodlerBottomSpace + 'px';
    };

    class Platform { // we need to be adding platforms to the grid container not the body
        constructor(newPlatBottom, uniqueId) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');
            this.id = uniqueId;// platform id's

            const visual = this.visual;
            visual.classList.add(uniqueId)
            visual.classList.add('platform'); 
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual)
        }
    };

    function createPlatforms() {
        let uniqueId = 0;
        for(let i=0; i < platformCount; i++) {
            let platGap = 1300 / platformCount;
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom, uniqueId);
            platforms.push(newPlatform); 
            uniqueId+=1;
        }
    };

    function movePlatforms() { 
        if(move) { 
            platforms.forEach(platform => {
                platform.bottom -= 1;
                platform.visual.style.bottom = platform.bottom + 'px';
            });
        }
    };

    function jump() {
        clearInterval(downTimerId)
        upTimerId = setInterval(function() { 
            move = true; 
            doodlerBottomSpace += 10; // bezier curve?
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace > doodlerBottomSpaceTmp) { 
                doodlerBottomSpaceTmp += 10; 
                move = false;           

                fall();
            } 

        }, 30)
    };

    function fall() {
        clearInterval(upTimerId) 
        downTimerId = setInterval(function() {
            if(doodlerBottomSpace <= 0) {
                gameOver();
            }
            doodler.style.bottom = (doodlerBottomSpace -= 10) + 'px';

        },30);
    };

    // kill the 1 second gap between initital keypress and move
    function control() {
        function move(e) {
          let leftOrRight = {
            106: ((parseInt(doodler.style.left, 10)-5)+"px"),
            108: ((parseInt(doodler.style.left, 10)+5)+"px")
          };

          // Tests
          console.assert(typeof ((parseInt(doodler.style.left, 10)+3)+"px") == 'string');
          console.assert(e.key.charCodeAt() === 106 || e.key.charCodeAt() === 108, {message: "A key was pressed that isn't 106 or 108"});
          // T-End
          doodler.style.left = leftOrRight[e.key.charCodeAt()];
        };

        document.addEventListener("keydown", move)// while = true
        document.addEventListener("keyup", console.log('idk'));// on keyup while= false
    };


    function gameOver() {
        console.log('game over');
        isGameOver = true;
        clearInterval(upTimerId)
        clearInterval(downTimerId)
    };

    function start() {
        if(!isGameOver) {
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms, 10);
            control();
            jump();
        }
    } start();

