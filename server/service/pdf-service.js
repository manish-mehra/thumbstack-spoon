const fs = require("fs");
const PDFDocument = require('pdfkit')


function buildPDF(invoice, dataCallback, endCallback) {
  const doc = new PDFDocument({ bufferPages: true, font: 'Courier' });

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  generateHeader(doc);
  generateCustomerInformation(doc, invoice)
  generateInvoiceTable(doc, invoice);

  doc.end();
}

module.exports = { buildPDF }

function generateHeader(doc) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Thumbstack Spoon", 110, 57)
    .fontSize(10)
    .text("Thumbstack Spoon", 200, 50, { align: "right" })
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("New Delhi, Delhi, 10092", 200, 80, { align: "right" })
    .moveDown();
}


function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Dish Name",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.orders.length; i++) {
    const item = invoice.orders[i]
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.dishName,
      item.price,
      item.qty,
      item.total
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal(Rs)",
    invoice.subTotal
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Tip %",
    invoice.tip
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Total(Rs)",
    invoice.total
  );
  doc.font("Helvetica");
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.customerId, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)


    .font("Helvetica")
    .text("Customer Name: "+ invoice.customerName, 300, customerInformationTop)
    .font("Helvetica")
    .text("Customer ID: "+invoice.customerId, 300, customerInformationTop + 15)
    .moveDown();

  generateHr(doc, 252);
}

function generateTableRow(
  doc,
  y,
  dishName,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(dishName, 50, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" })
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

