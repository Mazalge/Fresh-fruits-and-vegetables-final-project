using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace FinalProNewServer.Controllers.api
{
    public class UploadFileController : ApiController
    {
        [HttpPost]
        public HttpResponseMessage UploadJsonFile()
        {
            HttpResponseMessage response = new HttpResponseMessage();
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    // var filePath = HttpContext.Current.Server.MapPath
                    //("C:\\Users\\user\\Desktop\\rar_Angular\\Yesterday_project_14_9_2017\\final_project_in_angular_8_9_17\\src\\img\\"
                    //+ postedFile.FileName);
                    postedFile.SaveAs("C:\\Final_Project\\mazal 23-10-17\\FinalProClient\\src\\assets\\"
                   + postedFile.FileName);
                }
            }
            return response;

        }
    }
}
