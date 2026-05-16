using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Interviewer.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddLessonAggregateTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChallengeOptions",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChallengeId = table.Column<long>(type: "bigint", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Label = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChallengeOptions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Challenges",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LessonVersionId = table.Column<long>(type: "bigint", nullable: false),
                    Key = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Question = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Language = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: true),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Explanation = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Challenges", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PhaseId = table.Column<long>(type: "bigint", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Difficulty = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    ReadingTimeMinutes = table.Column<short>(type: "smallint", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CurrentVersionId = table.Column<long>(type: "bigint", nullable: true),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lessons_Phases_PhaseId",
                        column: x => x.PhaseId,
                        principalTable: "Phases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LessonVersions",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LessonId = table.Column<long>(type: "bigint", nullable: false),
                    VersionNumber = table.Column<int>(type: "int", nullable: false),
                    ContentMdx = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FrontmatterJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    PublishedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonVersions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LessonVersions_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChallengeOptions_ChallengeId_DisplayOrder",
                table: "ChallengeOptions",
                columns: new[] { "ChallengeId", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Challenges_LessonVersionId_Key",
                table: "Challenges",
                columns: new[] { "LessonVersionId", "Key" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_CurrentVersionId",
                table: "Lessons",
                column: "CurrentVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_PhaseId_DisplayOrder",
                table: "Lessons",
                columns: new[] { "PhaseId", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_PhaseId_Slug",
                table: "Lessons",
                columns: new[] { "PhaseId", "Slug" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LessonVersions_LessonId_Status",
                table: "LessonVersions",
                columns: new[] { "LessonId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_LessonVersions_LessonId_VersionNumber",
                table: "LessonVersions",
                columns: new[] { "LessonId", "VersionNumber" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ChallengeOptions_Challenges_ChallengeId",
                table: "ChallengeOptions",
                column: "ChallengeId",
                principalTable: "Challenges",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Challenges_LessonVersions_LessonVersionId",
                table: "Challenges",
                column: "LessonVersionId",
                principalTable: "LessonVersions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_LessonVersions_CurrentVersionId",
                table: "Lessons",
                column: "CurrentVersionId",
                principalTable: "LessonVersions",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_LessonVersions_CurrentVersionId",
                table: "Lessons");

            migrationBuilder.DropTable(
                name: "ChallengeOptions");

            migrationBuilder.DropTable(
                name: "Challenges");

            migrationBuilder.DropTable(
                name: "LessonVersions");

            migrationBuilder.DropTable(
                name: "Lessons");
        }
    }
}
