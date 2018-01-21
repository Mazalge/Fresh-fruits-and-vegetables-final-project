using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinalProNewServer.Models
{
    public class MRole
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public bool IsAdmin { get; set; }
    }
}