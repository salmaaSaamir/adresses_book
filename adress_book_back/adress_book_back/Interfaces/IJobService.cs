using adress_book_back.Models;
using adress_book_back.Response;

namespace adress_book_back.Interfaces
{
    public interface IJobService
    {
        Task<ServiceResponse> GetJobs(int page = 1, int pageSize = 10);
        Task<ServiceResponse> GetAllJobs();
        Task<bool> Delete(int Id);
        Task<ServiceResponse> Save(Job job);
    }
}
