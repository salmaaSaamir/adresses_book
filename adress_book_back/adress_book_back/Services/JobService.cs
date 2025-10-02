using adress_book_back.Context;
using adress_book_back.Interfaces;
using adress_book_back.Models;
using adress_book_back.Response;
using Microsoft.EntityFrameworkCore;

namespace adress_book_back.Services
{
    public class JobService : IJobService
    {
        private readonly DBContext _dbContext;

        public JobService(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ServiceResponse> GetJobs(int page = 1, int pageSize = 10)
        {
            var response = new ServiceResponse();
            try
            {
                var query = _dbContext.Jobs.AsNoTracking();
                var total = await query.CountAsync();

                var jobs = await query
                    .OrderBy(u => u.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                response.State = true;
                response.Data.Add(total);
                response.Data.Add(page);
                response.Data.Add(pageSize);
                response.Data.Add(jobs);
            }
            catch (Exception ex)
            {
                response.State = false;
                response.ErrorMessage = $"Error retrieving Jobs: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse> GetAllJobs()
        {
            var response = new ServiceResponse();
            try
            {
                var jobs = await _dbContext.Jobs.AsNoTracking().ToListAsync();
                response.State = true;
                response.Data.Add(jobs);
            }
            catch (Exception ex)
            {
                response.State = false;
                response.ErrorMessage = $"Error retrieving Jobs: {ex.Message}";
            }

            return response;
        }
        public async Task<bool> Delete(int Id)
        {
            var job = await _dbContext.Jobs.FirstOrDefaultAsync(x => x.Id == Id);
            if (job == null) return false;

            var isUsed = await _dbContext.Addresses.AnyAsync(a => a.JobId == Id);
            if (isUsed) return false; 

            _dbContext.Jobs.Remove(job);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<ServiceResponse> Save(Job job)
        {
            var response = new ServiceResponse();
            try
            {
                if (job.Id == 0)
                    _dbContext.Jobs.Add(job);
                else
                    _dbContext.Jobs.Update(job);

                await _dbContext.SaveChangesAsync();

                response.State = true;
                response.Data.Add(job);
            }
            catch (Exception ex)
            {
                response.State = false;
                response.ErrorMessage = $"Error saving Job: {ex.Message}";
            }

            return response;
        }
    }
}
