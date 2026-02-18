const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel } = require('docx');
const fs = require('fs');

// Read the markdown file
const md = fs.readFileSync('/Users/jacobnorby/.openclaw/workspace/heyconcierge-saas/legal/aksjonaravtale-utkast.md', 'utf8');

const children = [];

// Title
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
  new TextRun({ text: "AKSJONÆRAVTALE", bold: true, size: 36, font: "Calibri" })
]}));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [
  new TextRun({ text: "HeyConcierge AS", bold: true, size: 28, font: "Calibri" })
]}));

// Parse markdown sections
const lines = md.split('\n');
for (const line of lines) {
  if (line.startsWith('# AKSJONÆRAVTALE') || line.startsWith('# Aksjonæravtale')) continue;
  if (line.trim() === '---') continue;
  if (line.trim() === '') {
    children.push(new Paragraph({ spacing: { after: 50 }, children: [] }));
    continue;
  }
  
  if (line.startsWith('## ')) {
    children.push(new Paragraph({ 
      heading: HeadingLevel.HEADING_2, 
      spacing: { before: 400, after: 200 }, 
      children: [new TextRun({ text: line.replace('## ', ''), bold: true, size: 24 })]
    }));
  } else if (line.startsWith('### ')) {
    children.push(new Paragraph({ 
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 }, 
      children: [new TextRun({ text: line.replace('### ', ''), bold: true, size: 22 })]
    }));
  } else if (line.startsWith('- ') || line.startsWith('* ')) {
    const text = line.replace(/^[-*] /, '').replace(/\*\*(.*?)\*\*/g, '$1');
    children.push(new Paragraph({ 
      spacing: { after: 50 },
      bullet: { level: 0 },
      children: [new TextRun({ text: text, size: 22, font: "Calibri" })]
    }));
  } else if (line.startsWith('  - ') || line.startsWith('  * ')) {
    const text = line.replace(/^\s+[-*] /, '').replace(/\*\*(.*?)\*\*/g, '$1');
    children.push(new Paragraph({ 
      spacing: { after: 50 },
      bullet: { level: 1 },
      children: [new TextRun({ text: text, size: 22, font: "Calibri" })]
    }));
  } else if (line.startsWith('|')) {
    // Skip table formatting lines
    if (line.includes('---')) continue;
    // Simple text for table rows
    const text = line.replace(/\|/g, ' | ').replace(/^\s*\|\s*/, '').replace(/\s*\|\s*$/, '').trim();
    children.push(new Paragraph({ 
      spacing: { after: 50 },
      children: [new TextRun({ text: text, size: 20, font: "Calibri" })]
    }));
  } else {
    // Bold handling
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    const cleanLine = line.trim();
    
    while ((match = regex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(new TextRun({ text: cleanLine.slice(lastIndex, match.index), size: 22, font: "Calibri" }));
      }
      parts.push(new TextRun({ text: match[1], bold: true, size: 22, font: "Calibri" }));
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < cleanLine.length) {
      parts.push(new TextRun({ text: cleanLine.slice(lastIndex), size: 22, font: "Calibri" }));
    }
    if (parts.length === 0) {
      parts.push(new TextRun({ text: cleanLine, size: 22, font: "Calibri" }));
    }
    
    children.push(new Paragraph({ spacing: { after: 100 }, children: parts }));
  }
}

// Signature section
children.push(new Paragraph({ spacing: { before: 600, after: 200 }, children: [
  new TextRun({ text: "UNDERSKRIFTER", bold: true, size: 24, font: "Calibri" })
]}));
children.push(new Paragraph({ spacing: { after: 100 }, children: [
  new TextRun({ text: "Dato: ________________________________", size: 22 })
]}));
for (const name of ["Jacob Nørby", "Erik Austheim", "Lars Jakobsen"]) {
  children.push(new Paragraph({ spacing: { before: 400, after: 50 }, children: [
    new TextRun({ text: "________________________________", size: 22 })
  ]}));
  children.push(new Paragraph({ spacing: { after: 200 }, children: [
    new TextRun({ text: name, size: 22 })
  ]}));
}

const doc = new Document({
  sections: [{
    properties: { page: { margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 } } },
    children
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/Users/jacobnorby/.openclaw/workspace/heyconcierge-saas/legal/aksjonaravtale-heyconcierge.docx', buf);
  console.log('DONE');
});
