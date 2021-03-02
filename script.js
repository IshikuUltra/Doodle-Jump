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
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
    };

    class Platform { 
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

                platforms.forEach((p) => { 
                  px0 = p.visual.getBoundingClientRect().left,
                  px1 = p.visual.getBoundingClientRect().right,
                  py = p.visual.getBoundingClientRect().top;

                  platformXY[platformXY.length] = {py: [px0, px1]}; // Platform DS

                });             

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
            // destruct -> getBoundingClientRect?
            let dx0 = doodler.getBoundingClientRect().left, 
                dx1 = doodler.getBoundingClientRect().right,
                dy = doodler.getBoundingClientRect().bottom;

            platforms.forEach(platform => {
              if(doodlerBottomSpace >= platform.bottom && doodlerBottomSpace <= platform.bottom +15 && doodlerLeftSpace + 60 >= platform.left && doodlerLeftSpace <= platform.left + 85 && !move) {
                jump();
              }
            })

        },30);
    };

    // kill the 1 second gap between initital keypress and slide
    function control() {
        let w = getComputedStyle(grid).width, 
            d = {32: false},                          
            x = 15,                          
            v = doodlerLeftSpace;          
            // r = doodlerBottomSpace;
        
        function newv(v,a,b) { 
              let n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0); //this is genius
              return n < 0 ? 0 : n > w ? w : n;
            }

        function move() { //instead of setInterval, call this function when -> keydown?
            let doodlerLeftSpace = (v) => {return newv(v, 106, 108)}; //, //left and right (j,l)
            // doodlerBottomSpace = (r) => {return newv(r, 105, 107)}; // up and down ( i,k )
            
            doodler.style.left = doodlerLeftSpace(v)+"px"; 
            // doodler.style.top = doodlerBottomSpace(r)+"px";

            // reset left and bottom too new position
            v = doodlerLeftSpace(v);
            // r = doodlerBottomSpace(r);
            }

        document.addEventListener("keydown", (function(e) { console.log(d); d[e.key.charCodeAt()] = true; move()}));
        document.addEventListener("keyup", (function(e) { console.log(d); d[e.key.charCodeAt()] = false; }));
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

