import moment from 'moment'

export default function (
    { 
    email,
    verificationCode
   }) {
    // const today = new Date();

    const company= {
        businessName: "TELKOMSERVE NETWORK AND DATA SOLUTION",
        email: "telkomserve@zohomail.com",
        logo: 'https://rdnaksict.vercel.app/static/images/rdnaksLogo2.png',
        phoneNumber: "09308127173 / 09267609934",
        contactAddress: "Block 1 lot 5 San Antonio Village Brgy San Isidro Rodriguez Rizal",
        Tin: "495097258000",
        website: 'https://telkomserve.rdnaksnds.com'
      }

return `
<!DOCTYPE html>
<html>
    <head>
       <style>
           html, body {
    margin: 0 auto;
    padding: 0;
}

.layout {
    background-color: #EEEEEE;
    font-family: "Roboto";
    width: 100%;
    color: #484b5b;
    padding: 20px 0;
}

.content {
    text-align: center;
    background-color: white;
    width: 75%;
    margin: 0 auto;
    padding: 25px;
}

.name {
    line-height: 20px;
    font-size: 24px;
    
}

.logo {
    width: 150px;
    margin: 0px auto;
}

hr {
  border: 0;
  clear:both;
  display:block;
  width: 96%;               
  background-color: #d1d1d1;
  height: 1px;
  margin-top: 20px;
}


.link-container {
  padding: 25px; 
  margin: 0 auto;
}

.invoice-link {
    padding: 18px 30px;
    background-color: #1a64db;
    width: 50%;
    margin: 0 auto;
    border-radius: 50px;
    border: none;
    color: white;
    font-size: 18px;
    text-decoration: none;
    
}

.address {
    text-align: center
}

.address p {
    line-height: 7px;
    font-size: 15px
}

.address h2 {
    font-size: 17px
}


.footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
}

.footer-logo {
    width: 50px;
    margin: 20px auto;
    display: block
    
}

@media only screen and (max-width: 600px) {
  content {
    width: 100%;
  }

  invoice-link {
    width: 100%;
  }
}
       </style>
    </head>
    
    
    
    <body>
        <div class="layout">
        <div class="content">
            <img src=${company.logo} class="logo" />
            <h1 class="name">${company.businessName ? company.businessName : company.name}</h1>
            
              <hr>
              <div>
                  <p style="font-size: 18px">Hi ${email} Here is your verification code</p>
              </div>
              
              <div class="link-container">
                  <h1>${verificationCode}</h1>
              </div>
              
              <div class="address">
                  <h2>${company.businessName}</h2>
                  <p>${company.phoneNumber}</p>
                  <p>${company.website ? company?.website : ''}</p>
                  
              </div>
        </div>
        
      <div class"footer">
          <a href=${company.website}>
          <img class="footer-logo" src=${company.logo} alt="arc-invoice"/>
        </a>
      </div>
    <p style="text-align: center">Get the Internet that you deserve at affordable price at ${company.website}</p>
    </div>
    </body>
</html>`
;
};