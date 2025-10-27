using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace project2.Migrations
{
    /// <inheritdoc />
    public partial class SeedSomeUniversityAndSubject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Universities",
                columns: new[] { "Id", "Name", "Suffix" },
                values: new object[,]
                {
                    { 1, "Eastern International University", "EIU" },
                    { 2, "Ho Chi Minh University of Technology", "HCMUT" }
                });

            migrationBuilder.InsertData(
                table: "Subjects",
                columns: new[] { "Id", "Code", "Name", "UniversityId" },
                values: new object[,]
                {
                    { 1, "CSE302", "Operating Systems", 1 },
                    { 2, "CSE301", "Database Systems", 1 },
                    { 3, "CSE201", "Data Structures and Algorithms", 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Universities",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
