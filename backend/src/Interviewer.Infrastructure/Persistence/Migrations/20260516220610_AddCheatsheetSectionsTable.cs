using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Interviewer.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCheatsheetSectionsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CheatsheetSections",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TechSlug = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    SectionId = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    ContentJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CheatsheetSections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CheatsheetSections_Technologies_TechSlug",
                        column: x => x.TechSlug,
                        principalTable: "Technologies",
                        principalColumn: "Slug",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GlossaryEntries",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TechSlug = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Term = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Definition = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GlossaryEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GlossaryEntries_Technologies_TechSlug",
                        column: x => x.TechSlug,
                        principalTable: "Technologies",
                        principalColumn: "Slug",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CheatsheetSections_TechSlug_DisplayOrder",
                table: "CheatsheetSections",
                columns: new[] { "TechSlug", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_CheatsheetSections_TechSlug_SectionId",
                table: "CheatsheetSections",
                columns: new[] { "TechSlug", "SectionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GlossaryEntries_TechSlug_Term",
                table: "GlossaryEntries",
                columns: new[] { "TechSlug", "Term" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CheatsheetSections");

            migrationBuilder.DropTable(
                name: "GlossaryEntries");
        }
    }
}
