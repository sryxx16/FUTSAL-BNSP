const fs = require('fs');
const path = require('path');

const filesToConvert = [
  'src/admin/views/ReservationsView.tsx',
  'src/admin/views/UsersView.tsx',
  'src/admin/views/ReportsView.tsx',
  'src/admin/views/SettingsView.tsx'
];

filesToConvert.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Batch color replacements for Light Theme
    content = content
      .replace(/bg-slate-900/g, 'bg-white')
      .replace(/bg-slate-950\/80/g, 'bg-black/60')
      .replace(/bg-slate-950\/50/g, 'bg-slate-50')
      .replace(/bg-slate-950/g, 'bg-white')
      .replace(/border-slate-800/g, 'border-slate-200')
      .replace(/border-slate-700/g, 'border-slate-300')
      .replace(/text-white/g, 'text-slate-900')
      .replace(/text-slate-400/g, 'text-slate-500')
      .replace(/text-slate-300/g, 'text-slate-600')
      .replace(/bg-slate-800/g, 'bg-white')
      .replace(/hover:bg-slate-800/g, 'hover:bg-slate-50')
      .replace(/hover:bg-slate-700/g, 'hover:bg-slate-100')
      .replace(/bg-slate-700/g, 'bg-slate-100')
      .replace(/text-emerald-400/g, 'text-emerald-600')
      .replace(/bg-emerald-400\/10/g, 'bg-emerald-50')
      .replace(/text-blue-400/g, 'text-blue-600')
      .replace(/bg-blue-400\/10/g, 'bg-blue-50')
      .replace(/text-red-400/g, 'text-red-600')
      .replace(/bg-red-400\/10/g, 'bg-red-50')
      .replace(/text-yellow-400/g, 'text-orange-500')
      .replace(/bg-yellow-400\/10/g, 'bg-orange-50')
      .replace(/bg-purple-500\/10/g, 'bg-purple-50')
      .replace(/text-purple-400/g, 'text-purple-600')
      .replace(/hover:bg-purple-500\/20/g, 'hover:bg-purple-100')
      .replace(/bg-blue-500\/10/g, 'bg-blue-50')
      .replace(/hover:bg-blue-500\/20/g, 'hover:bg-blue-100')
      .replace(/bg-red-500\/10/g, 'bg-red-50')
      .replace(/hover:bg-red-500\/20/g, 'hover:bg-red-100');

    fs.writeFileSync(fullPath, content);
    console.log('Converted:', file);
  } else {
    console.log('File not found:', file);
  }
});
