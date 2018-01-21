using FinalProNewServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FinalProNewServer.Controllers.api
{
    public class RoleController : ApiController
    {
        ApplicationDbContext m_db = new ApplicationDbContext();

        [HttpGet]
        public IEnumerable<MRole> GetRoles()
        {
            return m_db.MRoles;
        }

        [HttpGet]
        public IHttpActionResult GetRols(string email)
        {
            bool isRole = false;
            var listOfRoles = GetRoles();
            if (email != null)
            {
                foreach (var item in listOfRoles)
                {
                    if (email == item.Email)
                    {
                        isRole = item.IsAdmin;
                    }
                }


                return Ok(isRole);
            }
            return BadRequest();
        }

        bool ValidationIsNotOk(MRole role)
        {
            return string.IsNullOrEmpty(role.Email);
        }

        [HttpPost]
        public IHttpActionResult CreateRols(MRole role)
        {
            IEnumerable<MRole> listOfRoles = GetRoles();

            bool exist = false;
            foreach (var item in listOfRoles)
            {
                if (role.Email == item.Email)
                {
                    exist = true;
                }

            }

            if ((role != null) && (ValidationIsNotOk(role))) { return BadRequest(); }
            if (!exist)
            {
                m_db.MRoles.Add(role);
                m_db.SaveChanges();
                return CreatedAtRoute("DefaultApi", new { id = role.Id }, role);
            }
            return Ok();
        }
    }
}
