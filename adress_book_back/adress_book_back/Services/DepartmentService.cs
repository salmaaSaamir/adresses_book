using adress_book_back.Context;
using adress_book_back.Interfaces;
using adress_book_back.Models;
using adress_book_back.Response;
using Microsoft.EntityFrameworkCore;

namespace adress_book_back.Services
{
    public class DepartmentService:IDepartmentService
    {
        private readonly DBContext _dbContext;

        public DepartmentService(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: Paginated Departments
        public async Task<ServiceResponse> GetDepartments(int page = 1, int pageSize = 10)
        {
            var response = new ServiceResponse();
            try
            {
                var query = _dbContext.Departments.AsNoTracking();
                var total = await query.CountAsync();

                var departments = await query
                    .OrderBy(d => d.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                response.State = true;
                response.Data.Add(total);
                response.Data.Add(page);
                response.Data.Add(pageSize);
                response.Data.Add(departments);
            }
            catch (Exception ex)
            {
                response.State = false;
                response.ErrorMessage = $"Error retrieving Departments: {ex.Message}";
            }

            return response;
        }

        // GET: All Departments
        public async Task<ServiceResponse> GetAllDepartments()
        {
            var response = new ServiceResponse();
            try
            {
                var departments = await _dbContext.Departments.AsNoTracking().ToListAsync();
                response.State = true;
                response.Data.Add(departments);
            }
            catch (Exception ex)
            {
                response.State = false;
                response.ErrorMessage = $"Error retrieving Departments: {ex.Message}";
            }

            return response;
        }

        // DELETE: Department by Id
       
        public async Task<bool> Delete(int id)
        {
            var department = await _dbContext.Departments.FirstOrDefaultAsync(x => x.Id == id);
            if (department == null) return false;

            var isUsed = await _dbContext.Addresses.AnyAsync(a => a.DepartmentId == id);
            if (isUsed) return false;

            _dbContext.Departments.Remove(department);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        // SAVE: Insert or Update Department
        public async Task<ServiceResponse> Save(Department department)
        {
            var response = new ServiceResponse();
            try
            {
                if (department.Id == 0)
                    _dbContext.Departments.Add(department);
                else
                    _dbContext.Departments.Update(department);

                await _dbContext.SaveChangesAsync();

                response.State = true;
                response.Data.Add(department);
            }
            catch (Exception ex)
            {
                response.State = false;
                response.ErrorMessage = $"Error saving Department: {ex.Message}";
            }

            return response;
        }
    }
}
