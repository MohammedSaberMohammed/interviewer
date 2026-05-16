using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Interviewer.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedDefaultRoles : Migration
    {
        private static readonly string[] RoleNames = ["Learner", "Author", "Admin"];

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            for (var i = 0; i < RoleNames.Length; i++)
            {
                migrationBuilder.InsertData(
                    table: "AspNetRoles",
                    columns: ["Id", "Name", "NormalizedName", "ConcurrencyStamp"],
                    values: [(long)(i + 1), RoleNames[i], RoleNames[i].ToUpperInvariant(), Guid.NewGuid().ToString()]);
            }
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            for (var i = 0; i < RoleNames.Length; i++)
            {
                migrationBuilder.DeleteData(
                    table: "AspNetRoles",
                    keyColumn: "NormalizedName",
                    keyValue: RoleNames[i].ToUpperInvariant());
            }
        }
    }
}
