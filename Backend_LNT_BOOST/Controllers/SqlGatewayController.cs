using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace Backend_LNT_BOOST.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SqlGatewayController : ControllerBase
    {

        private readonly string _connectionString;

        private static readonly Dictionary<string, string> SqlQueries = new();
        public SqlGatewayController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException("Connection is missing!");
        }


        static SqlGatewayController()
        {
            try
            {
                var queriesFolder = Path.Combine(Directory.GetCurrentDirectory(), "SqlQueries");
                if (Directory.Exists(queriesFolder))
                {
                    var jsonFiles = Directory.GetFiles(queriesFolder, "*.json", SearchOption.AllDirectories);
                    foreach (var file in jsonFiles)
                    {
                        var fileContent = System.IO.File.ReadAllText(file);
                        var tempQueries = JsonSerializer.Deserialize<Dictionary<string, string>>(fileContent);
                        if (tempQueries != null)
                        {
                            foreach (var kvp in tempQueries)
                            {
                                SqlQueries[kvp.Key] = kvp.Value;
                            }
                        }
                    }
                }
            }
            catch (Exception ex) { }
        }


        public class GatewayRequest
        {
            public string QueryName { get; set; } = string.Empty;
            public Dictionary<string, object>? Parameters { get; set; }
        }

        [HttpPost("query")]
        public async Task<IActionResult> ExecuteQuery([FromBody] GatewayRequest request)
        {
            if (!SqlQueries.TryGetValue(request.QueryName, out var sql))
            { 
                return BadRequest(new { message = $"Không tìm thấy truy vấn: {request.QueryName}" }); 
            }

            try
            {
                using IDbConnection db = new SqlConnection(_connectionString);

                // Convert JsonElement to C# primitives before passing to Dapper
                var cleanedParams = ConvertJsonElements(request.Parameters);
                var parameters = new DynamicParameters(cleanedParams);

                var paramString = request.Parameters != null
                    ? string.Join(", ", request.Parameters.Select(p => $"{p.Key}={p.Value}"))
                    : "None";

                var result = (await db.QueryAsync<dynamic>(sql, parameters)).ToList();

                var logContent = $"[SUCCESS] Result Rows: {result.Count}\n";
                if (result.Count > 0)
                {
                    logContent += $"First Row Sample: {System.Text.Json.JsonSerializer.Serialize(result[0])}\n";
                }
                logContent += "--------------------------------------------------\n";

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }


        }
        private static Dictionary<string, object>? ConvertJsonElements(Dictionary<string, object>? parameters)
        {
            if (parameters == null) return null;

            var result = new Dictionary<string, object>();
            foreach (var kvp in parameters)
            {
                if (kvp.Value is System.Text.Json.JsonElement element)
                {
                    result[kvp.Key] = ConvertJsonElement(element);
                }
                else
                {
                    result[kvp.Key] = kvp.Value;
                }
            }
            return result;
        }

        private static object ConvertJsonElement(System.Text.Json.JsonElement element)
        {
            switch (element.ValueKind)
            {
                case System.Text.Json.JsonValueKind.String:
                    return element.GetString() ?? string.Empty;
                case System.Text.Json.JsonValueKind.Number:
                    if (element.TryGetInt32(out int i)) return i;
                    if (element.TryGetInt64(out long l)) return l;
                    return element.GetDouble();
                case System.Text.Json.JsonValueKind.True:
                    return true;
                case System.Text.Json.JsonValueKind.False:
                    return false;
                case System.Text.Json.JsonValueKind.Null:
                    return DBNull.Value;
                default:
                    return element.GetRawText();
            }
        }

    }
}
