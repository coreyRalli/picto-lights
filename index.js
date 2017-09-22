const fetch = require('node-fetch');
const fileType = require('file-type');
const getPixels = require('get-pixels');
const rgbPalette = require('get-rgba-palette');

async function pictoLightsAsync(obj, lifxtoken, options) {
    const opt = (typeof options == "undefined") ? {} : options;
    if (typeof opt.selector == "undefined")
        opt.selector = "all";
    if (typeof opt.brightness == "undefined")
        opt.brightness = 0.5
    if (typeof opt.duration == "undefined")
        opt.duration = 1.0

    let b;
    if (obj instanceof Buffer) {
        b = obj
    } else {
        b = await downloadImageAsync(obj);
    }

    const pixelData = await getPixelDataAsync(b);
    const dominantColor = await getDominantColorAsync(pixelData);

    await validateColorAsync(dominantColor, lifxtoken);

    await setLightColorAsync(dominantColor, lifxtoken, opt.selector, opt.brightness, opt.duration);
}

async function setLightColorAsync(color, token, selector, brightness, duration) {
    try {
        const response = await fetch("https://api.lifx.com/v1/lights/" + selector + "/state", {
            headers: {
                'Authorization' : 'Bearer ' + token
            },
            method: 'PUT',
            body: JSON.stringify({
                power: 'on',
                color: color,
                brightness: brightness,
                duration: duration
            })
        });

        if (response.status != 200 && response.status != 207) {
            throw ("Somthing went wrong while making request");
        }
    }
    catch (ex) {
        throw new Error(ex);
    }
}

async function validateColorAsync(color, token) {
    try {
        const response = await fetch("https://api.lifx.com/v1/color?string=" + color, {
            headers: {
                'Authorization' : 'Bearer ' + token 
            }
        });

        const json = await response.json();

        if (response.status != 200) {
            throw "Color or request is not valid";
        }
    }
    catch (ex) {
        throw new Error(ex);
    }
}

// Image functions
async function getDominantColorAsync(pixelData) {
    try {
        const palette = await rgbPalette.bins(pixelData, 5);
        
        if (palette.length > 0) {
            palette.sort((a,b) => {
                return b.size - a.size;
            });

            const color = palette[0].color;

            return "rgb:" + color[0] + "," + color[1] + "," + color[2];
        }
    }
    catch (ex) {
        throw new Error(ex);
    }
}

function getPixelDataAsync(buffer) {
    return new Promise((complete, error) => {
        const ft = fileType(buffer);

        getPixels(buffer, ft.mime, (pixelError, pixels) => {
            if (pixelError) {
                error(pixelError);
            } else {
                complete(pixels.data);
            }
        })
    })
}

async function downloadImageAsync(url) {
    try {
        const response = await fetch(url);
        const buffer = await response.buffer();
    
        return buffer;
    }
    catch (ex) {
        throw new Error(ex);
    }
}

module.exports = pictoLightsAsync;