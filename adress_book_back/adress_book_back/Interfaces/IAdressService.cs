using adress_book_back.Models;
using adress_book_back.Response;

namespace adress_book_back.Interfaces
{
    public interface IAdressService
    {
        Task<ServiceResponse> GetAdresses(int page = 1, int pageSize = 10);
        Task<ServiceResponse> GetAllAddresses();
        Task<bool> Delete(int Id);
        Task<ServiceResponse> Save(Adress job);
    }
}