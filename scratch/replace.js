const fs = require('fs');
let content = fs.readFileSync('C:\\Users\\user\\Documents\\Prysal Printhub\\app\\print\\page.js', 'utf8');

// Main Backgrounds
content = content.replace(/bg-orange-50\/90/g, 'bg-[#fafafa]/90');
content = content.replace(/bg-orange-50\/5/g, 'bg-zinc-900/5');
content = content.replace(/bg-orange-50\/50/g, 'bg-[#fafafa]/50');
content = content.replace(/bg-orange-50/g, 'bg-[#fafafa]');
content = content.replace(/bg-orange-100\/30/g, 'bg-white');
content = content.replace(/bg-orange-100/g, 'bg-white');

// Text Colors
content = content.replace(/text-orange-950/g, 'text-zinc-900');
content = content.replace(/text-orange-900/g, 'text-zinc-900');
content = content.replace(/text-orange-800/g, 'text-zinc-500');
content = content.replace(/hover:text-orange-950/g, 'hover:text-zinc-900');

// Borders
content = content.replace(/border-orange-200/g, 'border-zinc-200');

// Hover states
content = content.replace(/group-hover:text-amber-400/g, 'group-hover:text-zinc-900');

// Phone hover fix (was hover:bg-neutral-800 but text remained dark)
content = content.replace(/hover:bg-neutral-800/g, 'hover:bg-zinc-100');

// Gradient buttons (make them solid black for premium feel)
content = content.replace(/bg-gradient-to-r from-amber-500 to-orange-600 text-orange-950/g, 'bg-zinc-900 text-white hover:bg-zinc-800');
content = content.replace(/bg-gradient-to-r from-amber-500 to-orange-600/g, 'bg-zinc-900 text-white');
content = content.replace(/text-amber-500/g, 'text-zinc-900');

fs.writeFileSync('C:\\Users\\user\\Documents\\Prysal Printhub\\app\\print\\page.js', content);
console.log('Colors replaced successfully');
