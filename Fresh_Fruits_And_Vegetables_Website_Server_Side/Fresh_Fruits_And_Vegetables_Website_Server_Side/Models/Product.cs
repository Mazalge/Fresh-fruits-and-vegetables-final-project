using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinalProNewServer.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public string Category { get; set; }
        public double MarketPrice { get; set; }
        public double CustomerPrice { get; set; }
        public string ImgPath { get; set; }
    }
}