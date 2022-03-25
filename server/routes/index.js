const express = require("express")
const router = express.Router()
const User = require('../models/User')
const pdfService = require('../service/pdf-service')


router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200)
})

router.get('/invoice/:customerId', async (req, res, next) => {
  const {customerId} = req.params
  
  const user = await User.findOne({customerId: customerId})
  let invoice = user
  // const user = await User.findOne({customerId: customerId})
  // const invoice = {
  //   shipping: {
  //     name: "John Doe",
  //     address: "1234 Main Street",
  //     city: "San Francisco",
  //     state: "CA",
  //     country: "US",
  //     postal_code: 94111
  //   },
  //   items: [
  //     {
  //       item: "TC 100",
  //       description: "Toner Cartridge",
  //       quantity: 2,
  //       amount: 6000
  //     },
  //     {
  //       item: "USB_EXT",
  //       description: "USB Cable Extender",
  //       quantity: 1,
  //       amount: 2000
  //     }
  //   ],
  //   subtotal: 8000,
  //   paid: 0,
  //   invoice_nr: 1234
  // };
  // createInvoice(invoice, "invoice.pdf")
  const stream = res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment;filename=invoice.pdf`,
  });
  pdfService.buildPDF(invoice,
    (chunk) => stream.write(chunk),
    () => stream.end()
  );
  
});

module.exports = router