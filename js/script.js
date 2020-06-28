
var loadContainer = window.document.getElementById('load-container');
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var w = canvas.width;
var h = canvas.height;
var spriteWidth = 64;
var spriteHeight = 64;
var offX = 0;
var offY = 0;

var optionWidth = window.document.getElementById('sprite-w');
var optionHeight = window.document.getElementById('sprite-h');
var optionOffX = window.document.getElementById('sprite-offx');
var optionOffY = window.document.getElementById('sprite-offy');

var lastValue = 0;

var sprites = [];

setInterval(drawSpriteSheet, 200);

function drawSpriteSheet() {

    let sprite_w = Number.parseInt(optionWidth.value);
    let sprite_h = Number.parseInt(optionHeight.value);
    let sprite_offx = Number.parseInt(optionOffX.value);
    let sprite_offy = Number.parseInt(optionOffY.value);
    //console.log(Number.isNaN(sprite_w) );
    sprite_w =  Number.isNaN(sprite_w) ? 64: sprite_w;
    sprite_h = Number.isNaN(sprite_h) ? 64: sprite_h;
    sprite_offx =  Number.isNaN(sprite_offx) ? 0: sprite_offx;
    sprite_offy = Number.isNaN(sprite_offy) ? 0: sprite_offy;
    //console.log(sprite_w);

    spriteWidth = sprite_w <= 0 ? 64: sprite_w;
    spriteHeight = sprite_h <= 0 ? 64: sprite_h;
    offX = sprite_offx < 0 ? 0: sprite_offx;
    offY = sprite_offy < 0 ? 0: sprite_offy;

    context.clearRect(0,0,w,h);
    for ( let i = 0; i < sprites.length; i++ ) {
        let sprite = sprites[i];
        let image = new Image();
        
        if ( sprite.img != null && sprite.img != undefined ) {
            image.src = sprite.img;
            context.drawImage(image, offX + ( offX * i) + (i * spriteWidth), offY + 0, spriteWidth, spriteHeight);
            console.log('off: ' + (offX + (i * spriteWidth)) );
        }
    }

}

function downloadImage() {

    if ( sprites.length == 0 ) { 
        alert('Create your sprite before downloading! ^^')
        return false;
    }

    let newCanvas = window.document.createElement('canvas');
    newCanvas.width = sprites.length * spriteWidth;
    newCanvas.height = spriteHeight;
    console.log(newCanvas.width);
    console.log(newCanvas.height);
    let newContext = newCanvas.getContext('2d');

    newContext.clearRect(0,0,w,h);
    for ( let i = 0; i < sprites.length; i++ ) {
        let sprite = sprites[i];
        let image = new Image();
        image.src = sprite.img;
        newContext.drawImage(image, offX + (i * spriteWidth), offY + 0, spriteWidth, spriteHeight);
    }

    let data = newContext.getImageData(0, 0, newCanvas.width, newCanvas.height);
    let img = newCanvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    window.location.href = img;
    newContext.clearRect (0,0, newCanvas.width, newCanvas.height);
    newContext.drawImage(new Image(sprites[0].img), 0, 0);
    newContext.putImageData(data, 0,0);
};

function openFile(event, img) {
    var input = event.target;
    console.log('input: ' + input.name );

    var reader = new FileReader();

    reader.onload = function() {
        var dataURL = reader.result;
        img.setAttribute('src', dataURL);
        
        var sprite = checkName(input.name);
        sprite.img = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
};

function checkName(name) {
    for ( let i = 0; i < sprites.length; i++ ) {
        
        if ( sprites[i].name == name) {
            return sprites[i];
        }
    }

    return null;
}


function createImageLoad() {
    lastValue += 1;
    let imageLoad = window.document.createElement('div');
    imageLoad.setAttribute('class', 'image-load');
    imageLoad.setAttribute('id', `load${lastValue}`)
    console.log('img: ' + imageLoad.id);
    let img = window.document.createElement('img');
    let lbl = window.document.createElement('label');
    lbl.setAttribute('for', `sprite${lastValue}`);
    lbl.innerText = `Sprite ${lastValue}`;
    let input = window.document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('id', `sprite${lastValue}`);
    input.setAttribute('accept', 'file/*');
    input.setAttribute('name', `sprite${lastValue}`)
    let bnt = window.document.createElement('button');
    bnt.setAttribute('name', input.name);
    bnt.innerText = "x";
    bnt.addEventListener('click', (event) => {
        loadContainer.removeChild(imageLoad);
        for ( let i = 0; i < sprites.length; i++ ) {
            if ( sprites[i].name == input.name) {
                sprites.splice(i, 1);
            }
        }
    })

    sprites.push({
        name: input.name,
        img: undefined
    })

    input.addEventListener('change', (event) => {
        openFile(event, img);
    });

    imageLoad.appendChild(bnt);
    imageLoad.appendChild(img);
    imageLoad.appendChild(lbl);
    imageLoad.appendChild(input);
    loadContainer.appendChild(imageLoad);
    return imageLoad;
}

function newSprite() {
    var load = createImageLoad();
}