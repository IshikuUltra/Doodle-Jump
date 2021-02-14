
    const grid = document.querySelector('.grid'); // pane
    const doodler = document.createElement('div'); // doodler
    let doodlerLeftSpace = 0;
    let doodlerBottomSpace = 0;
    let doodlerBottomSpaceTmp = 200;// this changes with spacebar tap += 200
    let platformCount = 10;
    let isGameOver = false;
    let move = false;
    let platforms = [];
    let upTimerId;
    let downTimerId;

    // platform has height of 15px and is 100px off the ground
    function createDoodler() { // doodler is just a div
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodlerBottomSpace = platforms[0].bottom + 13;
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
        // a refreshing .getBoundingClientRect()

    }

    class Platform { //construct a platform for the grid
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            // To set doodler on platform: use .left and .bottom of the bottom platform.
            // set doodler on platform 0
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for(let i=0; i < platformCount; i++) {
            let platGap = 1300 / platformCount;
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom);
            platforms.push(newPlatform); // [{key:[x,y]}]
        }
    }

    function movePlatforms() { 
        if(move) { 
    // since all platforms are named .platform cant we move all at once instead of looping?
            platforms.forEach(platform => {
                platform.bottom -= 1;
                platform.visual.style.bottom = platform.bottom + 'px';
            })
        }
    // if the platformBottomSpace is 0 make it fade off the screen
    }


    function jump() {
        clearInterval(downTimerId)
        upTimerId = setInterval(function() { 
            move = true; // starts moving the platforms
            doodlerBottomSpace += 25; // bezier curve?
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace > doodlerBottomSpaceTmp) { 
                // make the platforms stop moving 
                doodlerBottomSpaceTmp += 200; 
                move = false; // stops the platforms from moving
                //update x,y coordinates here:
                fall();
            } 

        }, 30)
    }   

    function fall() {
        clearInterval(upTimerId) 
        downTimerId = setInterval(function() {
        // you only need to get the platform list once since they are stopped:      
            if(doodlerBottomSpace <= 0) {
                gameOver();
            }
            doodler.style.bottom = (doodlerBottomSpace -= 5) + 'px';

            // Do platform hit calculations here:


        },30);
    }

    function control() { //.grid .doodler
        let w = getComputedStyle(grid).width, // grid.width
            d = {},                           //keys down ds
            x = 3,                            // pixels to move on keydown
            v = doodlerLeftSpace,             // last place left
            r = doodlerBottomSpace;
        
            function newv(v,a,b) { 
                var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0); //this is genius
                return n < 0 ? 0 : n > w ? w : n;
            }
                                                      //combine "newv" function on keydown? 
            document.addEventListener("keydown", (function(e) { console.log(d); d[e.key.charCodeAt()] = true; }));
            document.addEventListener("keyup", (function(e) { console.log(d); d[e.key.charCodeAt()] = false; }));
            
            //setInterval(
            function() { //instead of setInterval, call this function when -> keydown?
                let doodlerLeftSpace = (v) => {return newv(v, 106, 108)}, //left and right (j,l)
                    doodlerBottomSpace = (r) => {return newv(r, 105, 107)}; // up and down ( i,k )
            
                doodler.style.left = doodlerLeftSpace(v)+"px"; 
                doodler.style.top = doodlerBottomSpace(r)+"px";
            
                v = doodlerLeftSpace(v);
                r = doodlerBottomSpace(r);

                console.log(doodlerLeftSpace(v));
                console.log(doodlerBottomSpace(r))
            }
            //, 20);  

    } 


    function gameOver() {
        console.log('game over');
        isGameOver = true;
        clearInterval(upTimerId)
        clearInterval(downTimerId)
    }

    function start() {
        if(!isGameOver) {
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms, 10);
            control();
        }
    } start()


