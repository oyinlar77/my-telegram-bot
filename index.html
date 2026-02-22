import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const TEMP_DIR = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export async function generatePDF(content: string, title: string, service: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const filename = `${service}_${Date.now()}.pdf`;
    const filepath = path.join(TEMP_DIR, filename);
    
    const doc = new PDFDocument({
      size: 'A4',
      margin: 72,
      info: {
        Title: title,
        Author: 'Student Helper Bot',
        CreationDate: new Date()
      }
    });
    
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    // Header
    doc.rect(0, 0, doc.page.width, 80).fill('#1a73e8');
    doc.fillColor('white').fontSize(20).font('Helvetica-Bold')
      .text('Student Helper Bot', 40, 25, { align: 'center' });
    doc.fontSize(11).fillColor('white')
      .text(service === 'referat' ? '📝 Referat / Mustaqil Ish' : '📋 Test Savollari', 40, 52, { align: 'center' });
    
    doc.moveDown(3);
    
    // Title box
    doc.rect(40, 100, doc.page.width - 80, 50).fill('#e8f0fe').stroke('#1a73e8');
    doc.fillColor('#1a73e8').fontSize(16).font('Helvetica-Bold')
      .text(title, 50, 115, { width: doc.page.width - 100, align: 'center' });
    
    doc.moveDown(2);
    
    // Date line
    doc.fillColor('#666').fontSize(10).font('Helvetica')
      .text(`Yaratilgan sana: ${new Date().toLocaleDateString('uz-UZ')}`, { align: 'right' });
    
    doc.moveDown(1);
    
    // Divider
    doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke('#1a73e8');
    doc.moveDown(1);
    
    // Content
    const lines = content.split('\n');
    let isFirstHeading = true;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        doc.moveDown(0.4);
        continue;
      }
      
      // Detect headings (lines starting with # or all caps short lines)
      if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
        const headingText = trimmed.replace(/^#+\s*/, '');
        if (!isFirstHeading) doc.moveDown(0.8);
        doc.fillColor('#1a73e8').fontSize(14).font('Helvetica-Bold').text(headingText);
        doc.moveDown(0.3);
        isFirstHeading = false;
      } else if (trimmed.match(/^\d+\./)) {
        // Numbered list
        doc.fillColor('#333').fontSize(11).font('Helvetica').text(trimmed, { indent: 20 });
        doc.moveDown(0.2);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        // Bullet list
        const bulletText = '• ' + trimmed.slice(2);
        doc.fillColor('#333').fontSize(11).font('Helvetica').text(bulletText, { indent: 20 });
        doc.moveDown(0.2);
      } else {
        doc.fillColor('#222').fontSize(11).font('Helvetica').text(trimmed, {
          align: 'justify',
          lineGap: 3
        });
        doc.moveDown(0.3);
      }
    }
    
    // Footer on each page
    const pageCount = (doc as any)._pageBuffer?.length || 1;
    doc.on('pageAdded', () => {
      addFooter(doc);
    });
    addFooter(doc);
    
    doc.end();
    
    stream.on('finish', () => resolve(filepath));
    stream.on('error', reject);
  });
}

function addFooter(doc: PDFKit.PDFDocument) {
  const bottomY = doc.page.height - 50;
  doc.rect(0, bottomY, doc.page.width, 50).fill('#f8f9fa');
  doc.moveTo(40, bottomY).lineTo(doc.page.width - 40, bottomY).stroke('#dee2e6');
  doc.fillColor('#666').fontSize(9).font('Helvetica')
    .text('© Student Helper Bot — @StudentHelperUzBot', 40, bottomY + 18, { align: 'center' });
}

export function cleanupFile(filepath: string) {
  setTimeout(() => {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }, 60000); // Delete after 1 minute
}
