using System.ComponentModel.DataAnnotations;

namespace adress_book_back.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MinLength(6)]

        public string Password { get; set; }
        [Required]
        [EmailAddress]

        public string Email { get; set; } 
    }
    public class LoginDataModel
    {
        public int Id { get; set; }
        [Required]

        public string Password { get; set; }
        [Required]

        public string Email { get; set; }
        public bool IsRememberMe { get; set; }
    }

}
