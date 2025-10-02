using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace adress_book_back.Models
{
    public class Adress
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; }

        // Foreign key for Job
        [Required]
        public int JobId { get; set; }

        [ForeignKey("JobId")]
        public Job? Job { get; set; }

        // Foreign key for Department
        [Required]
        public int DepartmentId { get; set; }

        [ForeignKey("DepartmentId")]
        public Department? Department { get; set; }

        [Required]
        [Phone]
        public string MobileNumber { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string AddressLine { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        public string Photo { get; set; }

        // Computed property, not mapped to DB
        [NotMapped]
        public int Age => CalculateAge();

        private int CalculateAge()
        {
            var today = DateTime.Today;
            var age = today.Year - DateOfBirth.Year;
            if (DateOfBirth.Date > today.AddYears(-age)) age--;
            return age;
        }
    }

    public class AddressDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string AddressLine { get; set; }
        public string Email { get; set; }
        public string MobileNumber { get; set; }
        public int Age { get; set; }
        public string JobName { get; set; }
        public string DepartmentName { get; set; }
        public DateTime DateOfBirth { get; set; }
    }

}
