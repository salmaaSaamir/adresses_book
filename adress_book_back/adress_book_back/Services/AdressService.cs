using adress_book_back.Context;
using adress_book_back.Interfaces;
using adress_book_back.Models;
using adress_book_back.Response;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace adress_book_back.Services
{
    public class AdressService: IAdressService
    {
        private readonly DBContext _dbContext;
        private readonly ImageHelper _imageHelper;

        public AdressService(DBContext dbContext,IWebHostEnvironment env)
        {
            _dbContext = dbContext;
            _imageHelper = new ImageHelper(env.WebRootPath); // wwwroot/images

        }

        // GET: Paginated Addresses
        public async Task<ServiceResponse> GetAdresses(int page = 1, int pageSize = 10)
        {
            var response = new ServiceResponse();
            try
            {
                var query = _dbContext.Addresses.Include(x=>x.Department).Include(x=>x.Job).AsNoTracking();
                var total = await query.CountAsync();

                var Addresses = await query
                    .OrderBy(d => d.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                response.State = true;
                response.Data.Add(total);
                response.Data.Add(page);
                response.Data.Add(pageSize);
                response.Data.Add(Addresses);
            }
            catch (Exception ex)
            {
                response.State = false;
                response.ErrorMessage = $"Error retrieving Addresses: {ex.Message}";
            }

            return response;
        }

        // GET: All Addresses
        public async Task<ServiceResponse> GetAllAddresses()
        {
            var response = new ServiceResponse();
            try
            {
                var addresses = await _dbContext.Addresses
                    .Include(x => x.Department)
                    .Include(x => x.Job)
                    .AsNoTracking()
                    .Select(x => new AddressDto
                    {
                        Id = x.Id,
                        FullName = x.FullName,
                        AddressLine = x.AddressLine,
                        Email = x.Email,
                        MobileNumber = x.MobileNumber,
                        DateOfBirth = x.DateOfBirth,
                        JobName = x.Job != null ? x.Job.Name : null,
                        DepartmentName = x.Department != null ? x.Department.Name : null,
                        Age = x.DateOfBirth != null
                            ? (int)((DateTime.Now - x.DateOfBirth).TotalDays / 365.25)
                            : 0
                    })
                    .ToListAsync();

                response.State = true;
                response.Data = addresses.Cast<object>().ToList();
            }
            catch (Exception ex)
            {
                response.State = false;
                response.ErrorMessage = $"Error retrieving Addresses: {ex.Message}";
            }

            return response;
        }


        // DELETE: Department by Id
        public async Task<bool> Delete(int id)
        {
            var department = await _dbContext.Addresses.FirstOrDefaultAsync(x => x.Id == id);
            if (department == null) return false;

            _dbContext.Addresses.Remove(department);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        // SAVE: Insert or Update Department
        public async Task<ServiceResponse> Save(Adress address)
        {
            var response = new ServiceResponse();

            try
            {
                if (!string.IsNullOrEmpty(address.Photo))
                {
                    if (address.Photo.StartsWith("data:"))
                    {
                        var fileName = await _imageHelper.SaveBase64ImageAsWebP(address.Photo);
                        address.Photo = $"/images/{fileName}";
                    }
                 
                }

                if (address.Id == 0)
                    _dbContext.Addresses.Add(address);
                else
                    _dbContext.Addresses.Update(address);

                await _dbContext.SaveChangesAsync();

                var res = await _dbContext.Addresses
                    .AsNoTracking()
                    .Include(x => x.Department)
                    .Include(x => x.Job)
                    .FirstOrDefaultAsync(x => x.Id == address.Id);

                response.State = true;
                response.Data.Add(res);
            }
            catch (Exception ex)
            {
                response.State = false;
                response.ErrorMessage = $"Error saving Address: {ex.Message}";
            }

            return response;
        }



    }
}
