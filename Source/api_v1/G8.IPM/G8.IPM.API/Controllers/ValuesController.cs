using AutoMapper;
using G8.IPM.API.App_Start;
using G8.IPM.API.Infrastructure.Core;
using G8.IPM.API.Models;
using G8.IPM.Model.Models;
using G8.IPM.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace G8.IPM.API.Controllers
{
    public class ValuesController : ApiControllerBase
    {
        private ApplicationUserManager _userManager;
        public ValuesController(
            ApplicationUserManager userManager,
            IErrorService errorService)
            : base(errorService)
        {
            _userManager = userManager;
        }

        [Route("getlistpaging")]
        [HttpGet]
        //[Authorize(Roles ="ViewUser")]
        public HttpResponseMessage GetListPaging(HttpRequestMessage request, int page, int pageSize, string filter = null)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                int totalRow = 0;
                var model = _userManager.Users;
                IEnumerable<ApplicationUserViewModel> modelVm = Mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<ApplicationUserViewModel>>(model);

                PaginationSet<ApplicationUserViewModel> pagedSet = new PaginationSet<ApplicationUserViewModel>()
                {
                    Page = page,
                    TotalCount = totalRow,
                    TotalPages = (int)Math.Ceiling((decimal)totalRow / pageSize),
                    Items = modelVm
                };

                response = request.CreateResponse(HttpStatusCode.OK, pagedSet);

                return response;
            });
        }
        // GET api/values
        public PaginationSet<ApplicationUserViewModel> Get()
        {
            int totalRow = 0;
            var model = _userManager.Users;
            IEnumerable<ApplicationUserViewModel> modelVm = Mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<ApplicationUserViewModel>>(model);

            PaginationSet<ApplicationUserViewModel> pagedSet = new PaginationSet<ApplicationUserViewModel>()
            {
                Page = 1,
                TotalCount = totalRow,
                TotalPages = (int)Math.Ceiling((decimal)totalRow / 10),
                Items = modelVm
            };
            return pagedSet;
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
