import dayjs from 'dayjs'
import PDFDocument from 'pdfkit-table'

function generateSOAPdf(data, dataCallback, endCallback) {
    let amountPaid = 0
    let totalAmountReceived = 0
    let currentBalance = 0
    let num = 0
    let finalItem = []
    let paymentHistory = []
    data.map((item)=>{
        totalAmountReceived = item.totalAmountReceived? item.totalAmountReceived : amountPaid
        finalItem.push({invoiceNumber: item.invoiceNumber, ...item.items[0], status: item.status, total: item.total, amountpaid: totalAmountReceived, balance: (item.total-totalAmountReceived) })
        currentBalance += (item.total-totalAmountReceived)
        paymentHistory.push(...item.paymentRecords)
    })


    
    const doc = new PDFDocument({ margin: 30, size: 'A4' })

    doc.on('data', dataCallback)
    doc.on('end', endCallback)

    doc
    .fontSize(16)
    .text('RDNAKS NETWORK AND DATA', 20, 50)
    .text('SOLUTION', 20, 75)
    .fontSize(12)
    .text('Block 156 lot 23 Southville 8B', 20, 100)
    .text('Phone: 09308127173 / 09267609934', 20, 125)
    .text('TIN: 495097258000', 20, 150)
    .fontSize(16)
    .text('STATEMENT OF ACCOUNT', 350, 50)
    .fontSize(12)
    .text('Date: ', 350, 75)
    .text(dayjs().format("MM/DD/YYYY"), 400, 75)
    .text('Account name: ', 350, 100)
    .text(data[0].client.name, 435, 100)
    .text('Account Number: ', 350, 125)
    .text(data[0].client.accountNumber, 450, 125)
    .text('Current Balance: ', 350, 150)
    .text(`PHP ${Number(currentBalance).toFixed(2)}`, 450, 150)
    .text('', 20, 200)

    const table = {
        title: "Invoice Summary",
        subtitle: "Below are the list of invoices that are generated to your account.",
        headers: [
          { label: "Invoice Number", property: 'invoiceNumber', width: 60, renderer: null },
          { label: "Description", property: 'description', width: 180, renderer: null }, 
          { label: "Status", property: 'status', width: 75, renderer: null }, 
          { label: "Total", property: 'total', width: 50, renderer: null }, 
          { label: "Amount Paid", property: 'amountpaid', width: 80, renderer: null }, 
          { label: "Balance", property: 'balance', width: 70, 
            renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => { return `PHP ${Number(value).toFixed(2)}` } 
          },
        ],
        // complex data
        datas: finalItem,
        // simeple data

        rows: [
          [
            "",
            "",
            "",
            "",
            "Account Current Balance",
            currentBalance,
          ],
          // [...],
        ],
      };
    const table2 = {
        title: "Payment History",
        subtitle: "Below are the list of payment history belong your account.",
        headers: [
          { label: "Date Paid", property: 'datePaid', width: 100, 
            renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => { return dayjs(value).format("MM/DD/YYYY") } 
          },
          { label: "Amount Paid", property: 'amountPaid', width: 100, 
            renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => { return `PHP ${Number(value).toFixed(2)}` } 
          },
          { label: "Payment Method", property: 'paymentMethod', width: 75, renderer: null }, 
        ],
        // complex data
        datas: paymentHistory,
      };


    doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("Helvetica").fontSize(12);
          indexColumn === 0 && doc.addBackground(rectRow, 'dodgerblue', 0.15);
        },
      });
    doc.table(table2, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("Helvetica").fontSize(12);
          indexColumn === 0 && doc.addBackground(rectRow, 'dodgerblue', 0.15);
        },
      });

    doc.end()
}

export default generateSOAPdf