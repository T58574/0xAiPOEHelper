import fs from 'fs';
import path from 'path';

export interface PatchGemNote {
  gemName: string;
  changeType: 'BUFF' | 'NERF' | 'REWORK' | 'NEW' | 'NEUTRAL';
  summary: string;
  fullText: string;
}

const GEMS_MD_PATH = path.join(__dirname, '..', '..', '329patch', 'gems.md');

export function loadPatch329GemNotes(): PatchGemNote[] {
  if (!fs.existsSync(GEMS_MD_PATH)) {
    return [];
  }

  const content = fs.readFileSync(GEMS_MD_PATH, 'utf-8');
  const lines = content.split('\n');
  const notes: PatchGemNote[] = [];

  let currentGem = '';
  let currentText: string[] = [];

  for (const line of lines) {
    if (line.startsWith('### ') || line.startsWith('## ')) {
      if (currentGem && currentText.length > 0) {
        notes.push(classifyNote(currentGem, currentText.join('\n')));
      }
      currentGem = line.replace(/^[#]+\s*/, '').trim();
      currentText = [];
    } else {
      currentText.push(line);
    }
  }

  if (currentGem && currentText.length > 0) {
    notes.push(classifyNote(currentGem, currentText.join('\n')));
  }

  return notes;
}

function classifyNote(gemName: string, text: string): PatchGemNote {
  let changeType: PatchGemNote['changeType'] = 'NEUTRAL';
  const lower = text.toLowerCase();

  if (lower.includes('now deals') && (lower.includes('more damage') || lower.includes('increased damage') || lower.includes('buff'))) {
    changeType = 'BUFF';
  } else if (lower.includes('less damage') || lower.includes('reduced damage') || lower.includes('nerf')) {
    changeType = 'NERF';
  } else if (lower.includes('reworked') || lower.includes('redesigned')) {
    changeType = 'REWORK';
  } else if (lower.includes('new gem') || lower.includes('added')) {
    changeType = 'NEW';
  }

  const summary = text.split('\n').filter((l) => l.trim().length > 0)[0] || text.slice(0, 120);

  return {
    gemName,
    changeType,
    summary: summary.slice(0, 150),
    fullText: text.trim(),
  };
}

export function searchPatchNotes(query: string): PatchGemNote[] {
  const notes = loadPatch329GemNotes();
  if (!query) return notes;
  const q = query.toLowerCase();
  return notes.filter((n) => n.gemName.toLowerCase().includes(q) || n.fullText.toLowerCase().includes(q));
}
