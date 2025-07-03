declare global {
  interface Window {
    html2pdf: any;
  }
}

export function generatePDF(element: HTMLElement, filename: string = 'invoice.pdf') {
  if (!window.html2pdf) {
    console.error('html2pdf library not loaded');
    return;
  }

  // Create a temporary container for PDF generation
  const pdfContainer = document.createElement('div');
  pdfContainer.style.position = 'absolute';
  pdfContainer.style.left = '-9999px';
  pdfContainer.style.top = '0';
  pdfContainer.style.width = '210mm';
  pdfContainer.style.minHeight = '297mm';
  pdfContainer.style.backgroundColor = 'white';
  pdfContainer.style.fontFamily = 'Arial, sans-serif';
  pdfContainer.style.color = 'black';
  pdfContainer.style.padding = '10mm';
  pdfContainer.style.boxSizing = 'border-box';
  
  document.body.appendChild(pdfContainer);

  // Clone and prepare the invoice content
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // Remove no-print elements
  const noPrintElements = clonedElement.querySelectorAll('.no-print');
  noPrintElements.forEach(el => el.remove());

  // Reset all styles for PDF
  clonedElement.style.cssText = `
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    color: black !important;
    font-family: Arial, sans-serif !important;
    font-size: 14px !important;
    line-height: 1.4 !important;
  `;

  // Style all child elements for PDF
  const allElements = clonedElement.querySelectorAll('*');
  allElements.forEach(el => {
    const element = el as HTMLElement;
    const computedStyle = window.getComputedStyle(element);
    
    // Preserve important styling while making it PDF-friendly
    element.style.color = element.classList.contains('text-white') ? 'white' : 'black';
    element.style.backgroundColor = element.classList.contains('bg-gray-900') || 
                                   element.classList.contains('bg-gray-700') || 
                                   element.classList.contains('bg-blue-500') ? 
                                   computedStyle.backgroundColor : 'transparent';
    element.style.border = computedStyle.border;
    element.style.borderRadius = computedStyle.borderRadius;
    element.style.fontWeight = computedStyle.fontWeight;
    element.style.fontSize = computedStyle.fontSize;
    element.style.textAlign = computedStyle.textAlign;
    element.style.margin = computedStyle.margin;
    element.style.padding = computedStyle.padding;
    element.style.display = computedStyle.display;
    element.style.flexDirection = computedStyle.flexDirection;
    element.style.justifyContent = computedStyle.justifyContent;
    element.style.alignItems = computedStyle.alignItems;
    element.style.gridTemplateColumns = computedStyle.gridTemplateColumns;
    element.style.gap = computedStyle.gap;
  });

  pdfContainer.appendChild(clonedElement);

  const options = {
    margin: [5, 5, 5, 5], // mm
    filename,
    image: { 
      type: 'jpeg', 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait'
    }
  };

  window.html2pdf().set(options).from(pdfContainer).save().then(() => {
    // Clean up the temporary container
    document.body.removeChild(pdfContainer);
  }).catch((error: any) => {
    console.error('PDF generation failed:', error);
    document.body.removeChild(pdfContainer);
  });
}
