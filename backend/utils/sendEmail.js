import nodeMailer from 'nodemailer'

export const sendMail = async(option)=>{
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth:{
                user : process.env.SMTP_USER,
                pass : process.env.SMTP_PASSWORD,
            }
        })

        const mailOption = {
            from :process.env.SMTP_USER,
            to : option.email,
            subject :option.subject,
            text: option.message
        }
        
        const info = await transporter.sendMail(mailOption);
        console.log("Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("Email send error:", error.message);
        throw error;
    }
}