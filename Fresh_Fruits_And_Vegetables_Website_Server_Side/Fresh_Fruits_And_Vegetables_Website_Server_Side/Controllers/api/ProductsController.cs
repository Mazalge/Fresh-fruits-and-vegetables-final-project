using FinalProNewServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FinalProNewServer.Controllers.api
{
    public class ProductsController : ApiController
    {
        ApplicationDbContext m_db = new ApplicationDbContext();

        [HttpGet]
        public IEnumerable<Product> GetProducts()
        {
            return m_db.Products;
        }

        [HttpGet]
        public IHttpActionResult GetProduct(int id)
        {
            Product product = m_db.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        bool ValidationIsOk(Product product)
        {
            return string.IsNullOrEmpty(product.ProductName) &&
                string.IsNullOrEmpty(product.Category) &&
                string.IsNullOrEmpty(product.MarketPrice.ToString()) &&
                string.IsNullOrEmpty(product.CustomerPrice.ToString()) &&
                string.IsNullOrEmpty(product.ImgPath);
        }

        bool IsProductExsist(Product newProduct)
        {
            var Products = GetProducts();
            foreach (var product in Products)
            {
                if (product.ProductName == newProduct.ProductName ||
                      product.ImgPath == newProduct.ImgPath)
                    return true;
            }
            return false;

        }

        [HttpPost]
        public IHttpActionResult CreateProduct(Product product)
        {
            if ((product == null) || (IsProductExsist(product)) || (ValidationIsOk(product)))
            {
                return BadRequest();
            }
            m_db.Products.Add(product);
            m_db.SaveChanges();
            return CreatedAtRoute("DefaultApi", new { id = product.Id }, product);
        }

        [HttpPut]
        public IHttpActionResult UpdateProduct(long id, Product newProduct)
        {
            if ((newProduct == null) && IsProductExsist(newProduct)) { return BadRequest(); }
            if (id != newProduct.Id) { return BadRequest(); }
            Product product = m_db.Products.Find(id);
            if (product == null) { return NotFound(); }
            product.ProductName = newProduct.ProductName;
            product.MarketPrice = newProduct.MarketPrice;
            product.CustomerPrice = newProduct.CustomerPrice;

            m_db.SaveChanges();
            return StatusCode(HttpStatusCode.NoContent);
        }

        [HttpDelete]
        public IHttpActionResult DeleteProduct(int id)
        {
            Product product = m_db.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }
            m_db.Products.Remove(product);
            m_db.SaveChanges();
            return Ok(product);
        }
    }
}
