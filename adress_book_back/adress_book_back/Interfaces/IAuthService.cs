using adress_book_back.Models;
using adress_book_back.Response;

namespace adress_book_back.Interfaces
{
    public interface IAuthService
    {

        Task<ServiceResponse> Login(LoginDataModel model);
        Task<ServiceResponse> Register(User User);

    }
}
