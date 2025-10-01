using System.ComponentModel.DataAnnotations;

namespace adress_book_back.Models
{
    public class Department
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
