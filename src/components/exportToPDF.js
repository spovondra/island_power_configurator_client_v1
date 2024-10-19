import html2pdf from 'html2pdf.js';

/**
 * Function to export the FinalStep content to PDF
 * @param {string} elementId The ID of the element to be converted to PDF
 */
export const exportToPDF = (elementId) => {
    const element = document.getElementById(elementId);  // Get the element to convert to PDF

    const opt = {
        margin: 0.5,
        filename: 'final_system_overview.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },  // Ensure sharp output for charts
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate the PDF
    html2pdf().from(element).set(opt).save();
};
