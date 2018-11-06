using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace G8.IPM.Web.Api
{
    [RoutePrefix("api/test")]
    [AllowAnonymous]
    public class TestController : ApiController
    {
        [HttpGet]
        [Route("TestMethod")]
        public string TestMethod()
        {
            return "Hello, IPM Member. ";
        }
    }
}
