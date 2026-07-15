const fs = require('fs');

const files = ['app/print/page.js', 'app/design/page.js', 'app/admin/page.js'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Custom Banner
  content = content.replace(
    /src=\{content\.customHero\.image\.startsWith\('\/uploads'\) \? content\.customHero\.image : `\/api\/image\?path=\$\{content\.customHero\.image\}`\}/g,
    "src={content.customHero.image.startsWith('http') ? content.customHero.image : content.customHero.image.startsWith('/uploads') ? content.customHero.image : `/api/image?path=${content.customHero.image}`}"
  );

  // Categories
  content = content.replace(
    /src=\{category\.image\.startsWith\('\/uploads'\) \? category\.image : `\/api\/image\?path=\$\{category\.image\}`\}/g,
    "src={category.image.startsWith('http') ? category.image : category.image.startsWith('/uploads') ? category.image : `/api/image?path=${category.image}`}"
  );
  
  // Admin Hero slots
  content = content.replace(
    /src=\{img\.startsWith\('\/uploads'\) \? img : `\/api\/image\?path=\$\{img\}`\}/g,
    "src={img.startsWith('http') ? img : img.startsWith('/uploads') ? img : `/api/image?path=${img}`}"
  );

  // Print/Design Hero slider
  content = content.replace(
    /src=\{\(validImages\[currentImg\] \|\| validImages\[0\]\)\.startsWith\('\/uploads'\) \? \(validImages\[currentImg\] \|\| validImages\[0\]\) : `\/api\/image\?path=\$\{\(validImages\[currentImg\] \|\| validImages\[0\]\)\}`\}/g,
    "src={(validImages[currentImg] || validImages[0]).startsWith('http') ? (validImages[currentImg] || validImages[0]) : (validImages[currentImg] || validImages[0]).startsWith('/uploads') ? (validImages[currentImg] || validImages[0]) : `/api/image?path=${(validImages[currentImg] || validImages[0])}`}"
  );

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
