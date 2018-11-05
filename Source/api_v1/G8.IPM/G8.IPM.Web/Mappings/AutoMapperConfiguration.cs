using AutoMapper;
using G8.IPM.Model.Models;
using G8.IPM.Web.Models;

namespace G8.IPM.Web.Mappings
{
    public class AutoMapperConfiguration
    {
        public static void Configure()
        {
            
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<ApplicationGroup, ApplicationGroupViewModel>();
                cfg.CreateMap<ApplicationRole, ApplicationRoleViewModel>();
                cfg.CreateMap<ApplicationUser, ApplicationUserViewModel>();
            });
        }

    }
}