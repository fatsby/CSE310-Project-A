using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace project2.Migrations
{
    /// <inheritdoc />
    public partial class DocumentRefactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Url",
                table: "DocumentFiles");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "DocumentFiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
