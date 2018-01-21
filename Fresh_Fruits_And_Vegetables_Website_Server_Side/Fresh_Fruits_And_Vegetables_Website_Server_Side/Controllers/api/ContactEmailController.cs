using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web.Helpers;
using System.Net.Http;
using System.Web.Http;
using FinalProNewServer.Models;

namespace FinalProNewServer.Controllers.api
{
    public class ContactEmailController : ApiController
    {
        [HttpPost]
        public IHttpActionResult CreateNewEmail(ContactM email)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls;
            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");
            mail.From = new MailAddress(email.From);
            mail.To.Add("freshfruits8989@gmail.com");
            mail.Subject = email.Subject;
            mail.Body = email.Body;
            SmtpServer.Port = 25;
            SmtpServer.Credentials = new System.Net.NetworkCredential("freshfruits8989@gmail.com", "Fruits_456");
            SmtpServer.EnableSsl = true;
            SmtpServer.Send(mail);
            return Ok();
        }
    }
}
