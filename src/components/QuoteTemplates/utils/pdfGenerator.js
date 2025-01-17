import html2pdf from 'html2pdf.js';

    export const generatePDF = async ({ content, filename }) => {
      const element = document.createElement('div');
      element.innerHTML = content;
      document.body.appendChild(element);

      const opt = {
        margin: [15, 15],
        filename: filename,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          logging: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true,
          putOnlyUsedFonts: true
        },
        pagebreak: { mode: 'avoid-all' }
      };

      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        await html2pdf().set(opt).from(element).save();
      } finally {
        document.body.removeChild(element);
      }
    };
