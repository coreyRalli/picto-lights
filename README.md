# Picto-Lights
### Change one or more [LIFX](https://www.lifx.com/) bulb(s) to the dominant colour of a given image.

## Useage
```require('picto-lights')(img, LIFXToken, options)```

```img``` (string or Buffer) - URL or Buffer object of the image.

```LIFXToken``` (string) - Your LIFX access token, generated through the [account settings](https://cloud.lifx.com/settings) page on the LIFX site.

```options``` (Options) - An object containing optional parameters (see below).

#### Options

```selector``` (string) - The [selector](https://api.developer.lifx.com/v1/docs/selectors) for the light(s) you want to change colour. Defaults to "all".

```brightness``` (double) - The brightness of the bulb. Defaults to 0.5

```duration``` (double) - How long (in seconds) to transition when going from off to on. Default is 1.0

## Example

```javascript
const pictolights = require('picto-lights');

pictolights("http://url-of-image-here", "your-lifx-token", options)
.then(() => {  })
```

Due to the use of async/await, requires Node v7.6+.

## Notes

For best results, avoid text heavy images as well as dark/black images which can turn a light white because of the way the LIFX lights handle RGB.