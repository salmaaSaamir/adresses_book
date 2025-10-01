using System.ComponentModel.DataAnnotations;

namespace adress_book_back.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
