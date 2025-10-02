using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using adress_book_back.Models;

namespace adress_book_back.Context
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> dbContextOptions) : base(dbContextOptions)
        {
            try
            {
                var database = Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;
                if (database != null)
                {
                    if (!database.CanConnect())
                        database.Create();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Adress> Addresses { get; set; }


    }
}