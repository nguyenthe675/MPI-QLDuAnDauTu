namespace G8.IPM.Data.Infrastructure
{
    public class DbFactory : Disposable, IDbFactory
    {
        private IPMDbContext dbContext;

        public IPMDbContext Init()
        {
            return dbContext ?? (dbContext = new IPMDbContext());
        }

        protected override void DisposeCore()
        {
            if (dbContext != null)
                dbContext.Dispose();
        }
    }
}