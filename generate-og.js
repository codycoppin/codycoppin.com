const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

registerFont(path.join(__dirname, 'fonts', 'BebasNeue-Regular.ttf'), { family: 'Bebas Neue' });
registerFont(path.join(__dirname, 'fonts', 'SpaceMono-Regular.ttf'), { family: 'Space Mono' });

const WIDTH = 1200;
const HEIGHT = 630;
const COL_WIDTH = 340;
const INK = '#111110';
const WHITE = '#fafaf8';
const MUTED = '#888';
const LIGHT_GREY = '#bbb';
const RIGHT_X = 392;
const RIGHT_EDGE = 1148;

async function generate() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Left column — transparent (clear it)
  ctx.clearRect(0, 0, COL_WIDTH, HEIGHT);

  // Load and draw portrait
  const portrait = await loadImage(path.join(__dirname, 'portrait.png'));
  const imgAspect = portrait.width / portrait.height;
  const colAspect = COL_WIDTH / HEIGHT;
  let sx, sy, sw, sh;
  if (imgAspect > colAspect) {
    sh = portrait.height;
    sw = sh * colAspect;
    sx = (portrait.width - sw) / 2;
    sy = 0;
  } else {
    sw = portrait.width;
    sh = sw / colAspect;
    sx = 0;
    sy = (portrait.height - sh) / 2;
  }
  ctx.drawImage(portrait, sx, sy, sw, sh, 0, 0, COL_WIDTH, HEIGHT);

  // Vertical divider
  ctx.fillStyle = INK;
  ctx.fillRect(COL_WIDTH, 0, 2, HEIGHT);

  // "CODY" and "COPPIN"
  ctx.fillStyle = INK;
  ctx.font = '128px "Bebas Neue"';
  ctx.textBaseline = 'top';
  ctx.fillText('CODY', RIGHT_X, 55);
  ctx.fillText('COPPIN', RIGHT_X, 190);

  // Horizontal rule
  ctx.fillStyle = INK;
  ctx.fillRect(RIGHT_X, 338, RIGHT_EDGE - RIGHT_X, 2);

  // Subtitle
  ctx.fillStyle = MUTED;
  ctx.font = '20px "Space Mono"';
  ctx.textBaseline = 'top';
  ctx.fillText('Builder & Creative — Austin, TX', RIGHT_X, 358);

  // Tags
  const tags = ['AI', 'Music', 'Software', 'Full-Stack'];
  const tagFont = '15px "Space Mono"';
  const tagPadX = 12;
  const tagPadY = 6;
  const tagGap = 12;
  let tagX = RIGHT_X;
  const tagY = 400;

  ctx.font = tagFont;
  tags.forEach(tag => {
    const metrics = ctx.measureText(tag);
    const boxW = metrics.width + tagPadX * 2;
    const boxH = 15 + tagPadY * 2;

    ctx.strokeStyle = INK;
    ctx.lineWidth = 1;
    ctx.strokeRect(tagX, tagY, boxW, boxH);

    ctx.fillStyle = INK;
    ctx.textBaseline = 'top';
    ctx.fillText(tag, tagX + tagPadX, tagY + tagPadY);

    tagX += boxW + tagGap;
  });

  // URL
  ctx.fillStyle = LIGHT_GREY;
  ctx.font = '15px "Space Mono"';
  ctx.textBaseline = 'top';
  ctx.fillText('codycoppin.com', RIGHT_X, 594);

  // Write file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, 'og-image.png'), buffer);
  console.log('Generated og-image.png');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
