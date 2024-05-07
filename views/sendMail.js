const nodemailer= require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.USER, //sender email
      pass: process.env.APP_PASSWORD,
    },
  });
  const mailOptions ={
  from: {
    name: 'Solo-Chef',
    address: process.env.USER
  },
  to: 'vv0660179@gmail.com',
  subject: "Your Recipe has been added✔..Thank you for adding your recipe! We're thrilled to have it as part of our collection at Solo-Chef, we're passionate about creating and sharing delicious recipes with our community. Your contribution is greatly appreciated, and we look forward to creating more culinary delights together. Your recipes not only enrich our platform but also inspire others to explore new flavors and techniques in the kitchen.As we embark on this culinary journey together, we wish you the best day filled with creativity and delicious discoveries. Thank you for being part of the Solo-Chef community!", 
  text: "Hello world?", 
  html: "<b>Hello world?</b>", //can also add attachments
  }
  const sendMail= async(transporter,mailOptions)=>{
    try{
      await transporter.sendMail(mailOptions);
      console.log('mail has been sent');
    }
    catch(error){
      console.error(error);
    }
  }
  sendMail(transporter, mailOptions);