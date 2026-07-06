using Microsoft.EntityFrameworkCore;

namespace Backend_LNT_BOOST.DataConfig
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    }
}
