import moment from 'moment'

export default function (
  { name,
    address,
    phone,
    email,
    accountNumber,
    dueDate,
    date,
    id,
    notes,
    subTotal,
    type,
    vat,
    total,
    items,
    status,
    totalAmountReceived,
    balanceDue,
    company
 }
) {
    const today = new Date();
return `
<!DOCTYPE html>
<html>
<head>
<style>

.invoice-container {
    margin: 0;
    padding: 0;
    padding-top: 10px;
    font-family: 'Roboto', sans-serif;
    width: 530px;
    margin: 0px auto;
    }

table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

table td, table th {
  border: 1px solid rgb(247, 247, 247);
  padding: 10px;
}

table tr:nth-child(even){background-color: #f8f8f8;}

table tr:hover {background-color: rgb(243, 243, 243);}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #FFFFFF;
  color: rgb(78, 78, 78);
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 5px;
    

}
.address {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 0px 15px 0px;
    line-height: 10px;
    font-size: 14px;
    margin-top: -20px

}

.status {
    text-align: right;
}
.receipt-id {
    text-align: right;
}

.title {
    font-weight: 100px;
    text-transform: uppercase;
    color: gray;
    letter-spacing: 2px;
    font-size: 10px;
    line-height: 5px;
}

.summary {
    margin-top: 2px;
    margin-right: 0px;
    margin-left: 50%;
    margin-bottom: 15px;
}

img {
    width: 100px;
   
}

</style>
</head>
<body>
<div class="invoice-container">
<section  class="header">
        <div>
          ${company?.logo ? `<img src=${company?.logo} />` : `<h2>Company Logo</h2>`}
        </div>
        <div class="receipt-id" style="margin-top: -120px 0 40px 0">
            
        </div>
</section>
<section class="address">

      <div>
          <p class="title">From:</p>
          <h4 style="font-size: 11px; line-height: 5px">${company.businessName ? company.businessName : company.name}</h4>
          <p style="font-size: 11px; line-height: 5px">Address: ${company.contactAddress}</p>
          <p style="font-size: 11px; line-height: 5px">Email: ${company.email}</p>
          <p style="font-size: 11px; line-height: 5px">Phone: ${company.phoneNumber}</p>
          <p style="font-size: 11px; line-height: 5px">Tin: ${company.Tin}</p>
      </div>

      <div style="margin-bottom: 100px; margin-top: 20px">
      <p class="title">Bill to:</p>
        <p style="font-size: 11px; line-height: 5px"><strong>Client Name:</strong> ${name}</p>
        <p style="font-size: 11px; line-height: 5px"><strong>Acount No.:</strong> ${accountNumber}</p>
        <p style="font-size: 11px; line-height: 5px"><strong>Email:</strong> ${email}</p>
        <p style="font-size: 11px; line-height: 5px"><strong>Phone:</strong> ${phone}</p>
        <p style="font-size: 11px; line-height: 5px"><strong>Address:</strong> ${address}</p>
      </div>

    <div class="status" style="margin-top: -320px">
        <h1 style="font-size: 16px">${Number(balanceDue) <= 0 ? 'Receipt' : type}</h1>
        <p style="font-size: 10px; margin-bottom: 10px">${id}</p>
        <p class="title" style="font-size: 10px">Status</p>
        <h3 style="font-size: 12px">${status}</h3>
        <p class="title" style="font-size: 10px">Date</p>
        <p  style="font-size: 11px" >${moment(date).format('ll')}</p>
        <p class="title"  style="font-size: 10px">Due Date</p>
        <p  style="font-size: 11px">${moment(dueDate).format('ll')}</p>
        <p class="title"  style="font-size: 10px">Amount</p>
        <h3 style="font-size: 14px">${total}</h3>
    </div>
</section>

<table>
  <tr>
    <th style="font-size: 11px">Item/Description</th>
    <th style="font-size: 11px">Price</th>
    <th style="font-size: 11px">Discount(%)</th>
    <th style="text-align: right; font-size: 11px">Amount</th>
  </tr>

  ${
   items.map((item) => (
 `  <tr>
    <td style="font-size: 11px">${item.description}</td>
    <td style="font-size: 11px">${item.price}</td>
    <td style="font-size: 11px">${item.discount}</td>
    <td style="text-align: right; font-size: 11px">${(item.price) - (item.price) * item.discount / 100}</td>
  </tr>`
   ))
  }


</table>

<section class="summary">
    <table>
        <tr>
          <th style="font-size: 11px">Invoice Summary</th>
          <th></th>
        </tr>
        <tr>
          <td style="font-size: 11px">Sub Total</td>
          <td style="text-align: right; font-size: 11px; font-weight: 700">${subTotal}</td>
        </tr>

        <tr>
            <td style="font-size: 12px">VAT</td>
            <td style="text-align: right; font-size: 11px; font-weight: 700">${vat}</td>
          </tr>

        <tr>
            <td style="font-size: 12px">Total</td>
            <td style="text-align: right; font-size: 11px; font-weight: 700">${total}</td>
          </tr>

        <tr>
            <td style="font-size: 12px" >Paid</td>
            <td style="text-align: right; font-size: 11px; font-weight: 700">${totalAmountReceived}</td>
          </tr>

          <tr>
          <td style="font-size: 11px">Balance Due</td>
          <td style="text-align: right; font-size: 11px; font-weight: 700">${balanceDue}</td>
        </tr>
        
      </table>
  </section>
  <div>
      <hr>
      <h4 style="font-size: 11px">Note</h4>
      <p style="font-size: 11px">${notes}</p>
  </div>
</div>
</body>
</html>`
;
};