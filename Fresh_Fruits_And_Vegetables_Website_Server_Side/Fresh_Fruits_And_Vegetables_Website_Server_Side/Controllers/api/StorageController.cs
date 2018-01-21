using FinalProNewServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FinalProNewServer.Controllers.api
{
    public class StorageController : ApiController
    {
        ApplicationDbContext m_db = new ApplicationDbContext();

        [HttpGet]
        public IEnumerable<Storage> GetStorage()
        {
            return m_db.Storage;
        }

        [HttpGet]
        public IHttpActionResult GetStorage(int id)
        {
            Storage storage = m_db.Storage.Find(id);
            if (storage == null)
            {
                return NotFound();
            }
            return Ok(storage);
        }

        bool ValidationIsOk(Storage storage)
        {
            return string.IsNullOrEmpty(storage.ProductName) &&
                  string.IsNullOrEmpty(storage.Amount.ToString());
        }

        [HttpPost]
        public IHttpActionResult CreateStorage(Storage storage)
        {
            if ((storage == null) && (!ValidationIsOk(storage))) { return BadRequest(); }
            m_db.Storage.Add(storage);
            m_db.SaveChanges();
            return CreatedAtRoute("DefaultApi", new { id = storage.Id }, storage);
        }

        [HttpPut]
        public IHttpActionResult UpdateStorage(long id, Storage newStorage)
        {
            if ((newStorage == null) && ValidationIsOk(newStorage)) { return BadRequest(); }
            if (id != newStorage.Id) { return BadRequest(); }
            Storage storage = m_db.Storage.Find(id);
            if (storage == null) { return NotFound(); }
            storage.ProductName = newStorage.ProductName;
            storage.Amount = newStorage.Amount;

            m_db.SaveChanges();
            return StatusCode(HttpStatusCode.NoContent);
        }

        [HttpDelete]
        public IHttpActionResult DeleteStorage(int id)
        {
            Storage storage = m_db.Storage.Find(id);
            if (storage == null)
            {
                return NotFound();
            }
            m_db.Storage.Remove(storage);
            m_db.SaveChanges();
            return Ok(storage);
        }
    }
}
