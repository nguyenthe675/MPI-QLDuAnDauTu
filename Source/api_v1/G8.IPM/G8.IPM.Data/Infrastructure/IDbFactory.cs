using System;

namespace G8.IPM.Data.Infrastructure
{
    public interface IDbFactory : IDisposable
    {
        IPMDbContext Init();
    }
}