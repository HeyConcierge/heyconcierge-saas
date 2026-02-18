const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const htmlPath = path.join(__dirname, 'hc-pixar.html');
  const framesDir = path.join(__dirname, 'frames');
  const outputPath = path.join(__dirname, 'hc-pixar.mp4');

  // Clean/create frames dir
  if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true });
  fs.mkdirSync(framesDir);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080 });
  await page.goto(`file://${htmlPath}`);

  // Capture 6 seconds at 30fps = 180 frames
  const fps = 30;
  const duration = 6;
  const totalFrames = fps * duration;

  console.log(`Capturing ${totalFrames} frames...`);

  for (let i = 0; i < totalFrames; i++) {
    const frameNum = String(i).padStart(4, '0');
    await page.screenshot({ path: path.join(framesDir, `frame-${frameNum}.png`), type: 'png' });
    // Wait ~33ms for next frame
    await page.evaluate(() => new Promise(r => setTimeout(r, 33)));
    if (i % 30 === 0) console.log(`Frame ${i}/${totalFrames}`);
  }

  await browser.close();
  console.log('Frames captured. Encoding video...');

  // Encode with ffmpeg
  const cmd = `ffmpeg -y -framerate ${fps} -i "${framesDir}/frame-%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast "${outputPath}"`;
  
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error('ffmpeg error:', err.message);
      return;
    }
    console.log(`Video saved: ${outputPath}`);
    // Clean up frames
    fs.rmSync(framesDir, { recursive: true });
    console.log('Frames cleaned up. Done!');
  });
})();
