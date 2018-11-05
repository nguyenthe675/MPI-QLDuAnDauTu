using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using G8.IPM.Common;
using G8.IPM.Data.Infrastructure;
using G8.IPM.Data.Repositories;
using G8.IPM.Model.Models;

namespace G8.IPM.Service
{
    public interface ICommonService
    {
        SystemConfig GetSystemConfig(string code);
    }
    public class CommonService : ICommonService
    {
        ISystemConfigRepository _systemConfigRepository;
        IUnitOfWork _unitOfWork;
        public CommonService(ISystemConfigRepository systemConfigRepository,IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _systemConfigRepository = systemConfigRepository;
        }

        public SystemConfig GetSystemConfig(string code)
        {
            return _systemConfigRepository.GetSingleByCondition(x => x.Code == code);
        }
    }
}
