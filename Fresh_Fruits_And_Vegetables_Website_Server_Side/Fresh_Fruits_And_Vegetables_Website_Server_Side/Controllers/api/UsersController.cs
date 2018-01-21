using FinalProNewServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FinalProNewServer.Controllers.api
{
    public class UsersController : ApiController
    {
        ApplicationDbContext m_db = new ApplicationDbContext();

        [HttpGet]
        public IEnumerable<MUser> GetUsers()
        {
            return m_db.MUsers;
        }

        [HttpGet]
        public IHttpActionResult GetUser(int id)
        {
            MUser user = m_db.MUsers.Find(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        bool ValidationIsNotOk(MUser user)
        {
            return string.IsNullOrEmpty(user.FirstName) &&
                string.IsNullOrEmpty(user.LastName) &&
                string.IsNullOrEmpty(user.City) &&
                string.IsNullOrEmpty(user.Adress) &&
                string.IsNullOrEmpty(user.Business) &&
                string.IsNullOrEmpty(user.Email) &&
                string.IsNullOrEmpty(user.Phone) &&
                string.IsNullOrEmpty(user.Registration.ToString());
        }

        [HttpPost]
        public IHttpActionResult CreateUser(MUser user)
        {
            if ((user != null) && (ValidationIsNotOk(user))) { return BadRequest(); }
            m_db.MUsers.Add(user);
            m_db.SaveChanges();
            return CreatedAtRoute("DefaultApi", new { id = user.Id }, user);
        }

        [HttpPut]
        public IHttpActionResult UpdateUser(long id, MUser newUser)
        {
            if ((newUser == null) && ValidationIsNotOk(newUser)) { return BadRequest(); }
            if (id != newUser.Id) { return BadRequest(); }
            MUser user = m_db.MUsers.Find(id);
            if (user == null) { return NotFound(); }
            user.FirstName = newUser.FirstName;
            user.LastName = newUser.LastName;
            user.City = newUser.City;
            user.Adress = newUser.Adress;
            user.Business = newUser.Business;
            user.Email = newUser.Email;
            user.Phone = newUser.Phone;
            user.Registration = newUser.Registration;

            m_db.SaveChanges();
            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
