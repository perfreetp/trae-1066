import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(elementId: string, fileName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${fileName}.pdf`);
}

export function generateSimplePDF(title: string, content: string, leaderComments?: string): void {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text(title, 105, 20, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`生成时间：${new Date().toLocaleString('zh-CN')}`, 105, 30, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  
  let y = 40;
  
  const contentLines = pdf.splitTextToSize(content, 180);
  for (const line of contentLines) {
    if (y > 260) {
      pdf.addPage();
      y = 20;
    }
    pdf.text(line, 15, y);
    y += 7;
  }
  
  if (leaderComments && leaderComments.trim()) {
    y += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    if (y > 270) {
      pdf.addPage();
      y = 20;
    }
    pdf.text('领导批示：', 15, y);
    y += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    const commentLines = pdf.splitTextToSize(leaderComments, 170);
    for (const line of commentLines) {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, 20, y);
      y += 6;
    }
  }
  
  pdf.save(`${title}.pdf`);
}
