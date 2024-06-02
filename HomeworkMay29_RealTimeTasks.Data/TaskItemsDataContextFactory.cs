using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeworkMay29_RealTimeTasks.Data;

public class TaskItemsDataContextFactory : IDesignTimeDbContextFactory<TaskItemsDataContext>
{
    public TaskItemsDataContext CreateDbContext(string[] args)
    {
        var config = new ConfigurationBuilder()
           .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), 
           $"..{Path.DirectorySeparatorChar}HomeworkMay29_RealTimeTasks.Web"))
           .AddJsonFile("appsettings.json")
           .AddJsonFile("appsettings.local.json", optional: true, reloadOnChange: true).Build();

        return new TaskItemsDataContext(config.GetConnectionString("ConStr"));
    }
}