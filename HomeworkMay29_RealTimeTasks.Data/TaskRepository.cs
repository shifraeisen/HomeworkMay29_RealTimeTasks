using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeworkMay29_RealTimeTasks.Data
{
    public class TaskRepository
    {
        private readonly string _connectionString;

        public TaskRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public List<TaskItem> GetAllTasks()
        {
            using var context = new TaskItemsDataContext(_connectionString);
            return context.Tasks.Include(t => t.User).ToList();
        }
        public void AddTask(TaskItem task)
        {
            if (task == null)
            {
                return;
            }
            using var context = new TaskItemsDataContext(_connectionString);
            context.Tasks.Add(task);
            context.SaveChanges();
        }
        public void AssignTask(int taskId, int? userId)
        {
            using var context = new TaskItemsDataContext(_connectionString);
            context.Tasks.First(t => t.Id == taskId).UserID = userId;
            context.SaveChanges();
        }
        public void FinishTask(int taskId)
        {
            using var context = new TaskItemsDataContext(_connectionString);
            context.Tasks.Remove(context.Tasks.Where(t => t.Id == taskId).First());
            context.SaveChanges();
        }
    }
}
