using HomeworkMay29_RealTimeTasks.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace HomeworkMay29_RealTimeTasks.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly IHubContext<TaskHub> _hub;

        public TaskController(IConfiguration configuration, IHubContext<TaskHub> hub)
        {
            _connectionString = configuration.GetConnectionString("ConStr");
            _hub = hub;
        }
        [HttpGet("GetAll")]
        public List<TaskItem> GetTaskItems()
        {
            var repo = new TaskRepository(_connectionString);
            return repo.GetAllTasks();
        }
        [HttpPost("Add")]
        public void AddTask(TaskItem task)
        {
            if(task.Title == "")
            {
                return;
            }
            var repo = new TaskRepository(_connectionString);
            repo.AddTask(task);
            _hub.Clients.All.SendAsync("newTask", task);

        }
        [HttpPost("Assign")]
        public void AssignTask(TaskItem task)
        {
            var repo = new TaskRepository(_connectionString);
            repo.AssignTask(task.Id, task.UserID);
            _hub.Clients.All.SendAsync("taskUpdate", repo.GetAllTasks().ToList());
        }
        [HttpPost("Finish")]
        public void FinishTask(TaskItem task)
        {
            var repo = new TaskRepository(_connectionString);
            repo.FinishTask(task.Id);
            _hub.Clients.All.SendAsync("taskUpdate", repo.GetAllTasks().ToList());
        }
    }
}
