namespace Backend_LNT_BOOST.Dtos.AuthDto
{
    // class is used to send login info to server
    public class LoginRequest
    {
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
