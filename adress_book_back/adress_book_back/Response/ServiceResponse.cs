namespace adress_book_back.Response
{
    public class ServiceResponse
    {
        public bool State { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public string SuccessMessage { get; set; } = string.Empty;
        public List<object> Data { get; set; } = new List<object> { };
        public string? token { get; set; }

    }
}
