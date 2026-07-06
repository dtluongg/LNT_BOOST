using Backend_LNT_BOOST.Dtos;
using Backend_LNT_BOOST.Dtos.AuthDto;
using Backend_LNT_BOOST.Helpers;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Backend_LNT_BOOST.DataConfig;

namespace Backend_LNT_BOOST.Services.Auth
{
    public class AuthServiceImplement : IAuthService
    {
        private readonly string _connectionString;
        private readonly IConfiguration _configuration;
        private readonly ProtectByJWT _jwtHelper;

        public AuthServiceImplement(IConfiguration configuration, ProtectByJWT jwtHelper)
        {
            _configuration = configuration;
            _jwtHelper = jwtHelper;
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException("Connection string 'DefaultConnection' not found.");
        }


        public Task<bool> ChangePasswordAsync(ChangePasswordRequest passwordRequest)
        {
            throw new NotImplementedException();
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest loginRequest)
        {
            using IDbConnection db = new SqlConnection(_connectionString);
            // 1. tìm user trong database:
            var userFind = await db.QueryFirstOrDefaultAsync<UserInfo>(
                    "SELECT * FROM tblMastUser WHERE Username = @Username",
                    new { Username = loginRequest.UserName }
                );
            if (userFind == null) return null;

            // 2. xác thực mật khẩu:
            if (string.IsNullOrEmpty(userFind.Password) || !PWHelperHash.VerifyPassword(loginRequest.Password, userFind.Password))
            {
                return null;
            }

            // Kiểm tra Authorized flag:
            if (userFind.Authorized == false) return null;

            // 3. Truy vấn liệt kê danh sách các Module mà User được phép truy cập:
            var authorizedSites = (await db.QueryAsync<SiteDto>(
                @"  SELECT a.CompanySiteID, b.SiteCode, b.SiteName
                    FROM tblCompanySiteUserLoginDetails a 
                    INNER JOIN tblCompanySiteInformation b ON a.CompanySiteID = b.CompanySiteID 
                    WHERE a.Username = @Username",
                new { Username = userFind.Username })).ToList();

            // 4. Truy vấn liệt kê danh sách các Module mà User được phép truy cập:
            var authorizedModules = (await db.QueryAsync<ModuleDto>(
                @"  SELECT a.CompanySiteID, a.ModuleMasterID, b.ModuleMasterName
                    FROM tblModuleMasterUsers a 
                    INNER JOIN tblModuleMaster b ON a.ModuleMasterID = b.ModuleMasterID 
                    WHERE a.Username = @Username",
                new { Username = userFind.Username })).ToList();

            // 5. Tạo JWT (Access Token và Refresh Token):
            var accessToken = _jwtHelper.GenerateJwtAccessToken(userFind);
            var refreshToken = _jwtHelper.GenerateJwtRefreshToken(userFind);

            // 6. Cập nhật refreshToken 
            await db.ExecuteAsync(
                @"UPDATE tblMastUser 
                SET RefreshToken = @RefreshToken, RefreshTokenExpiryTime = @RefreshTokenExpiryTime
                WHERE Username = @Username",
                new
                {
                    RefreshToken = refreshToken,
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(1),
                    Username = loginRequest.UserName
                }
            );

            // return 
            return new LoginResponse
            {
                Token = accessToken,
                RefreshToken = refreshToken,
                User = new UserInfoDto
                {
                    UserName = userFind.Username,
                    FullName = userFind.FullName,
                    Email = userFind.Email,
                    IsAdmin = userFind.Admin ?? false,
                    DefaultCompanyID = userFind.DefaultCompanyID,
                },
                AuthorizedSites = authorizedSites,
                AuthorizedModules = authorizedModules
            };
        }

        public Task<TokenModel> RefreshAsync(TokenModel tokenRequest)
        {
            throw new NotImplementedException();
        }

        public Task<bool> ResetPasswordAsync(ResetPasswordRequest resetPasswordRequest)
        {
            throw new NotImplementedException();
        }
    }
}
