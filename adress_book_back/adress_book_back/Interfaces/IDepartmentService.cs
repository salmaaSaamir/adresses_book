using adress_book_back.Models;
using adress_book_back.Response;

namespace adress_book_back.Interfaces
{
    public interface IDepartmentService
    {
        Task<ServiceResponse> GetDepartments(int page = 1, int pageSize = 10);
        Task<ServiceResponse> GetAllDepartments();
        Task<bool> Delete(int id);
        Task<ServiceResponse> Save(Department department);
    }
}