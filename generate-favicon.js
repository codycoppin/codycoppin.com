const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

registerFont(path.join(__dirname, 'fonts', 'BebasNeue-Regular.ttf'), { family: 'Bebas Neue' });

const SIZE = 256;
const BLUE = '#b0cde8';
const INK = '#111110';

const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext('2d');

// Blue background
ctx.fillStyle = BLUE;
ctx.fillRect(0, 0, SIZE, SIZE);

// Big "C" centered
ctx.fillStyle = INK;
ctx.font = '220px "Bebas Neue"';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('C', SIZE / 2, SIZE / 2 + 8);

// Write as PNG (GitHub Pages will serve it; browsers accept PNG favicons)
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, 'favicon.png'), buffer);
console.log('Generated favicon.png');
