using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinalProNewServer.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public int OrderNumber { get; set; }
        public double OrderSum { get; set; }
        public string OrderDate { get; set; }
        public string DeliveryDate { get; set; }
        public string DeliveryTime { get; set; }
        public string DeliveryAddress { get; set; }
        public string Business { get; set; }
        public string DeliveryCity { get; set; }
        public string Phone { get; set; }
    }
}