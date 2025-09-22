// import PDFDocument from 'pdfkit';
// import fs from 'fs';
// import path from 'path';

// export const generatePDF = async (job)=>{
//     return new Promise((resolve, reject) => {
//         const doc = new PDFDocument();
//         const filePath = path.join('pdfs',`Job_Completion_Certificate_${job._id}.pdf`);
//         const writeStream = fs.createWriteStream(filePath);
//         doc.pipe(writeStream);
//         doc.fontSize(20).text('Job Completion Certificate', { align: 'center' });
//         doc.moveDown();
//         doc.fontSize(16).text(`Job Title: ${job.title}`, { align: 'left' });
//         doc.text(`Job Description: ${job.description}`, { align: 'left' });
//         doc.text(`status: ${job.status}`, { align: 'left' });
//         doc.text(`Completed by: ${job.assignedFreelancer.name}`, { align: 'left' });
//         doc.moveDown();
//         doc.text(`Completion Date: ${new Date().toLocaleDateString()}`, { align: 'left' });
//         doc.end();
//         writeStream.on('finish', () => {
//             resolve(filePath);
//         });
//         writeStream.on('error', (error) => {
//             console.error("Error writing PDF file:", error);
//             reject(error);
//         });
//     });
// }









// import PDFDocument from 'pdfkit';
// import fs from 'fs';
// import path from 'path';

// export const generatePDF = async (job) => {
//     return new Promise((resolve, reject) => {
//         const doc = new PDFDocument();
//         const filePath = path.join('pdfs', `Job_Completion_Certificate_${job._id}.pdf`);
//         const writeStream = fs.createWriteStream(filePath);
//         doc.pipe(writeStream);

//         // Header Section
//         doc.fontSize(18).text('------------------------------------------------------------', { align: 'center' });
//         doc.fontSize(20).text('FREELANCING SaaS PLATFORM', { align: 'center' });
//         doc.fontSize(18).text('JOB COMPLETION CERTIFICATE', { align: 'center' });
//         doc.fontSize(18).text('------------------------------------------------------------', { align: 'center' });
//         doc.moveDown();

//         // Body Section
//         doc.fontSize(14).text('This is to certify that', { align: 'center' });
//         doc.moveDown(0.5);
//         doc.fontSize(18).text(`**${job.assignedFreelancer.name}**`, { align: 'center' });
//         doc.moveDown(1);

//         doc.fontSize(14).text('has successfully completed the job titled:', { align: 'center' });
//         doc.moveDown(0.5);
//         doc.fontSize(16).text(`"${job.title}"`, { align: 'center' });
//         doc.moveDown(1);

//         doc.fontSize(14).text('Assigned by:', { align: 'center' });
//         doc.moveDown(0.5);
//         doc.fontSize(16).text(`**${job.poster.name}**`, { align: 'center' });
//         doc.moveDown(1);

//         doc.fontSize(12).text(`Job ID: ${job._id}`, { align: 'center' });
//         doc.text(`Completed On: ${new Date().toLocaleDateString()}`, { align: 'center' });
//         doc.moveDown(1);

//         // Task Completion Note
//         doc.fontSize(12).text('All associated tasks have been completed and approved', { align: 'center' });
//         doc.text('to the satisfaction of the client.', { align: 'center' });
//         doc.moveDown();

//         doc.fontSize(12).text('------------------------------------------------------------', { align: 'center' });
//         doc.text('We appreciate your professional commitment and contribution.', { align: 'center' });
//         doc.text('Keep up the great work!', { align: 'center' });
//         doc.moveDown(1);

//         doc.text('Sincerely,', { align: 'center' });
//         doc.moveDown(0.5);
//         doc.text('Freelancing SaaS Team', { align: 'center' });
//         doc.fontSize(12).text('------------------------------------------------------------', { align: 'center' });

//         doc.end();

//         writeStream.on('finish', () => {
//             resolve(filePath);
//         });

//         writeStream.on('error', (error) => {
//             console.error("Error writing PDF file:", error);
//             reject(error);
//         });
//     });
// };


import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const generatePDF = async (job) => {
  const templatePath = path.join('template', 'Template certificate.pdf');
  const outputPath = path.join('pdfs', `Job_Completion_Certificate_${job._id}.pdf`);

  const existingPdfBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Add dynamic fields (You can adjust coordinates according to your template)
  firstPage.drawText(job.assignedFreelancer.name, {
    x: 340,
    y: 360,
    size: 36,
    font,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(job.title, {
    x: 410,
    y: 305,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(`${job._id}`, {
    x: 150,
    y: 285,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(`${new Date().toLocaleDateString()}`, {
    x: 210,
    y: 260,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  return outputPath; // You can upload this to Cloudinary or send via email
};
