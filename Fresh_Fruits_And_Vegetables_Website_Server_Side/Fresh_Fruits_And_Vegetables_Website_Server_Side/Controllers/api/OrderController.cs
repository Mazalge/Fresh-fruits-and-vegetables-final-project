using FinalProNewServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FinalProNewServer.Controllers
{
    public class OrderController : ApiController
    {

        ApplicationDbContext m_db = new ApplicationDbContext();

        [HttpGet]
        public IEnumerable<Order> GetOrders()
        {
            return m_db.Orders;
        }

        [HttpGet]
        public IHttpActionResult GetOrder(int id)
        {
            Order order = m_db.Orders.Find(id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        bool ValidationIsNotOk(Order order)
        {
            return string.IsNullOrEmpty(order.Email) &&
                string.IsNullOrEmpty(order.OrderNumber.ToString()) &&
                string.IsNullOrEmpty(order.OrderSum.ToString()) &&
                string.IsNullOrEmpty(order.OrderDate) &&
                string.IsNullOrEmpty(order.DeliveryDate) &&
                string.IsNullOrEmpty(order.DeliveryTime) &&
                string.IsNullOrEmpty(order.DeliveryAddress) &&
                string.IsNullOrEmpty(order.Business) &&
                string.IsNullOrEmpty(order.DeliveryCity) &&
                string.IsNullOrEmpty(order.Phone);
        }

        [HttpPost]
        public IHttpActionResult CreateOrder(Order order)
        {
            if ((order != null) && (ValidationIsNotOk(order))) { return BadRequest(); }
            m_db.Orders.Add(order);
            m_db.SaveChanges();
            return CreatedAtRoute("DefaultApi", new { id = order.Id }, order);
        }
    }
}
