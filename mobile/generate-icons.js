const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgFull = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#1E40AF"/>
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
  </defs>
  <path d="M 256 60 L 410 130 C 410 320 256 450 256 450 C 256 450 102 320 102 130 Z" fill="url(#shieldGrad)" stroke="#3B82F6" stroke-width="12"/>
  <path d="M 256 90 L 380 150 C 380 305 256 415 256 415 C 256 415 132 305 132 150 Z" fill="none" stroke="#93C5FD" stroke-width="4" stroke-dasharray="8 5" opacity="0.8"/>
  <text x="256" y="305" font-family="'Cinzel', 'Georgia', 'Times New Roman', serif" font-size="148" font-weight="900" fill="#FFFFFF" text-anchor="middle">P</text>
  <polygon points="256,120 264,138 284,138 270,149 276,168 256,156 236,168 242,149 228,138 248,138" fill="#FBBF24" stroke="#F59E0B" stroke-width="2"/>
</svg>`;

const svgForeground = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
  </defs>
  <g transform="scale(0.72) translate(100, 100)">
    <path d="M 256 60 L 410 130 C 410 320 256 450 256 450 C 256 450 102 320 102 130 Z" fill="url(#shieldGrad)" stroke="#60A5FA" stroke-width="14"/>
    <path d="M 256 90 L 380 150 C 380 305 256 415 256 415 C 256 415 132 305 132 150 Z" fill="none" stroke="#93C5FD" stroke-width="5" stroke-dasharray="8 5" opacity="0.85"/>
    <text x="256" y="305" font-family="'Cinzel', 'Georgia', 'Times New Roman', serif" font-size="148" font-weight="900" fill="#FFFFFF" text-anchor="middle">P</text>
    <polygon points="256,120 264,138 284,138 270,149 276,168 256,156 236,168 242,149 228,138 248,138" fill="#FBBF24" stroke="#F59E0B" stroke-width="2"/>
  </g>
</svg>`;

const svgSplash = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
  </defs>
  <path d="M 256 60 L 410 130 C 410 320 256 450 256 450 C 256 450 102 320 102 130 Z" fill="url(#shieldGrad)" stroke="#3B82F6" stroke-width="12"/>
  <path d="M 256 90 L 380 150 C 380 305 256 415 256 415 C 256 415 132 305 132 150 Z" fill="none" stroke="#93C5FD" stroke-width="4" stroke-dasharray="8 5" opacity="0.8"/>
  <text x="256" y="305" font-family="'Cinzel', 'Georgia', 'Times New Roman', serif" font-size="148" font-weight="900" fill="#FFFFFF" text-anchor="middle">P</text>
  <polygon points="256,120 264,138 284,138 270,149 276,168 256,156 236,168 242,149 228,138 248,138" fill="#FBBF24" stroke="#F59E0B" stroke-width="2"/>
</svg>`;

async function gen() {
  const assetsDir = path.join(__dirname, 'assets');
  await sharp(Buffer.from(svgFull)).resize(1024, 1024).png().toFile(path.join(assetsDir, 'icon.png'));
  await sharp(Buffer.from(svgForeground)).resize(512, 512).png().toFile(path.join(assetsDir, 'android-icon-foreground.png'));
  await sharp(Buffer.from(svgSplash)).resize(512, 512).png().toFile(path.join(assetsDir, 'splash-icon.png'));
  await sharp(Buffer.from(svgFull)).resize(192, 192).png().toFile(path.join(assetsDir, 'favicon.png'));

  // Android res mipmaps
  const resDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
  if (fs.existsSync(resDir)) {
    const densities = [
      { name: 'mipmap-mdpi', size: 48, fgSize: 108 },
      { name: 'mipmap-hdpi', size: 72, fgSize: 162 },
      { name: 'mipmap-xhdpi', size: 96, fgSize: 216 },
      { name: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
      { name: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
    ];
    for (const d of densities) {
      const targetDir = path.join(resDir, d.name);
      if (fs.existsSync(targetDir)) {
        await sharp(Buffer.from(svgFull)).resize(d.size, d.size).png().toFile(path.join(targetDir, 'ic_launcher.png'));
        await sharp(Buffer.from(svgFull)).resize(d.size, d.size).png().toFile(path.join(targetDir, 'ic_launcher_round.png'));
        await sharp(Buffer.from(svgForeground)).resize(d.fgSize, d.fgSize).png().toFile(path.join(targetDir, 'ic_launcher_foreground.png'));
      }
    }
    console.log('Updated Android native mipmap icons in res/');
  }

  console.log('App icons generated successfully from website shield logo!');
}

gen().catch(console.error);
