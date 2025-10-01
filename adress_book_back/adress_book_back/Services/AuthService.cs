using adress_book_back.Context;
using adress_book_back.Interfaces;
using adress_book_back.Models;
using adress_book_back.Response;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace adress_book_back.Services
{
    public class AuthService : IAuthService
    {
        private readonly DBContext _dbContext;
        private readonly IConfiguration _configuration;

        public AuthService(DBContext context, IConfiguration configuration)
        {
            _dbContext = context;
            _configuration = configuration;
        }

        public async Task<ServiceResponse> Login(LoginDataModel model)
        {
            var response = new ServiceResponse();

            // Retrieve user by email
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == model.Email && x.Password== model.Password);
            if (user == null )
            {
                response.State = false;
                response.ErrorMessage = "Invalid credentials.";
                return response;
            }

            var token = GenerateJwtToken(user, model.IsRememberMe);

            response.State = true;
            response.Data.Add(token);
            response.token = token;
            response.SuccessMessage = "Logged in successfully";

            return response;
        }

        public async Task<ServiceResponse> Register(User user)
        {
            var response = new ServiceResponse();

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            response.State = true;
            response.Data.Add(user);
            response.SuccessMessage = "Registered successfully";
            return response;
        }

        private string GenerateJwtToken(User user, bool isRememberMe)
        {
            var claims = new List<Claim>
            {
                new Claim("Id", user.Id.ToString()),
                new Claim("Email", user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: isRememberMe ? DateTime.UtcNow.AddDays(3) : DateTime.UtcNow.AddHours(5),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
