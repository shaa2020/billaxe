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

  console.log('Generating PDF from element:', element);

  const options = {
    margin: 0.5,
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
      logging: false,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait'
    }
  };

  // Clone the element to avoid modifying the original
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // Remove no-print elements from the clone
  const noPrintElements = clonedElement.querySelectorAll('.no-print');
  noPrintElements.forEach(el => el.remove());

  console.log('Cloned element content:', clonedElement.textContent?.substring(0, 100));

  window.html2pdf().set(options).from(clonedElement).save();
}
