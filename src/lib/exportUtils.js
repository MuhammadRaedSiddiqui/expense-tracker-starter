import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Convert transactions to CSV format and trigger download
 */
export function exportTransactionsToCSV(transactions, filename = 'transactions.csv') {
  if (!transactions || transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  // Define CSV headers
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Currency'];

  // Convert transactions to CSV rows
  const rows = transactions.map((t) => {
    return [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
      t.category,
      t.type,
      t.amount,
      t.currency || 'USD',
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export report as PDF
 */
export async function exportReportToPDF(elementId, filename = 'report.pdf', title = 'Financial Report') {
  try {
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error('Report element not found');
    }

    // Show loading state
    const originalContent = element.innerHTML;

    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Add title
    pdf.setFontSize(16);
    pdf.text(title, 15, 15);

    // Add date
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 15, 22);

    // Add image
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);

    // Save PDF
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Format date for filename
 */
export function getExportFilename(prefix, startDate, endDate) {
  const start = new Date(startDate).toISOString().split('T')[0];
  const end = new Date(endDate).toISOString().split('T')[0];
  return `${prefix}_${start}_to_${end}.csv`;
}

/**
 * Get PDF filename with date range
 */
export function getPDFFilename(startDate, endDate) {
  const start = new Date(startDate).toISOString().split('T')[0];
  const end = new Date(endDate).toISOString().split('T')[0];
  return `financial_report_${start}_to_${end}.pdf`;
}
