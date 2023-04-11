using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Main.AppDbMigration.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase().Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder
                .CreateTable(
                    name: "Organizations",
                    columns: table =>
                        new
                        {
                            Id = table
                                .Column<int>(type: "int", nullable: false)
                                .Annotation(
                                    "MySql:ValueGenerationStrategy",
                                    MySqlValueGenerationStrategy.IdentityColumn
                                ),
                            Name = table
                                .Column<string>(type: "varchar(255)", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4")
                        },
                    constraints: table =>
                    {
                        table.PrimaryKey("PK_Organizations", x => x.Id);
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder
                .CreateTable(
                    name: "Projects",
                    columns: table =>
                        new
                        {
                            Id = table
                                .Column<int>(type: "int", nullable: false)
                                .Annotation(
                                    "MySql:ValueGenerationStrategy",
                                    MySqlValueGenerationStrategy.IdentityColumn
                                ),
                            Name = table
                                .Column<string>(type: "varchar(255)", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            OrganizationId = table.Column<int>(type: "int", nullable: false),
                            InitialStart = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            InitialEnd = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            PlanedStart = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            PlanedEnd = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            ActualStart = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: true
                            ),
                            ActualEnd = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                            InitalEffort = table.Column<int>(type: "int", nullable: false),
                            PlanedEffort = table.Column<int>(type: "int", nullable: false),
                            ActualEffort = table.Column<int>(type: "int", nullable: true)
                        },
                    constraints: table =>
                    {
                        table.PrimaryKey("PK_Projects", x => x.Id);
                        table.ForeignKey(
                            name: "FK_Projects_Organizations_OrganizationId",
                            column: x => x.OrganizationId,
                            principalTable: "Organizations",
                            principalColumn: "Id",
                            onDelete: ReferentialAction.Cascade
                        );
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder
                .CreateTable(
                    name: "Epics",
                    columns: table =>
                        new
                        {
                            Id = table
                                .Column<int>(type: "int", nullable: false)
                                .Annotation(
                                    "MySql:ValueGenerationStrategy",
                                    MySqlValueGenerationStrategy.IdentityColumn
                                ),
                            Title = table
                                .Column<string>(type: "varchar(255)", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            ProjectId = table.Column<int>(type: "int", nullable: false),
                            InitialStart = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            InitialEnd = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            PlanedStart = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            PlanedEnd = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            ActualStart = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: true
                            ),
                            ActualEnd = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                            InitalEffort = table.Column<int>(type: "int", nullable: false),
                            PlanedEffort = table.Column<int>(type: "int", nullable: false),
                            ActualEffort = table.Column<int>(type: "int", nullable: true)
                        },
                    constraints: table =>
                    {
                        table.PrimaryKey("PK_Epics", x => x.Id);
                        table.ForeignKey(
                            name: "FK_Epics_Projects_ProjectId",
                            column: x => x.ProjectId,
                            principalTable: "Projects",
                            principalColumn: "Id",
                            onDelete: ReferentialAction.Cascade
                        );
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder
                .CreateTable(
                    name: "Backlogs",
                    columns: table =>
                        new
                        {
                            Id = table
                                .Column<int>(type: "int", nullable: false)
                                .Annotation(
                                    "MySql:ValueGenerationStrategy",
                                    MySqlValueGenerationStrategy.IdentityColumn
                                ),
                            Title = table
                                .Column<string>(type: "varchar(255)", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            EpicId = table.Column<int>(type: "int", nullable: false),
                            InitialStart = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            InitialEnd = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            PlanedStart = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            PlanedEnd = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            ActualStart = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: true
                            ),
                            ActualEnd = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                            InitalEffort = table.Column<int>(type: "int", nullable: false),
                            PlanedEffort = table.Column<int>(type: "int", nullable: false),
                            ActualEffort = table.Column<int>(type: "int", nullable: true)
                        },
                    constraints: table =>
                    {
                        table.PrimaryKey("PK_Backlogs", x => x.Id);
                        table.ForeignKey(
                            name: "FK_Backlogs_Epics_EpicId",
                            column: x => x.EpicId,
                            principalTable: "Epics",
                            principalColumn: "Id",
                            onDelete: ReferentialAction.Cascade
                        );
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder
                .CreateTable(
                    name: "BacklogTasks",
                    columns: table =>
                        new
                        {
                            Id = table
                                .Column<int>(type: "int", nullable: false)
                                .Annotation(
                                    "MySql:ValueGenerationStrategy",
                                    MySqlValueGenerationStrategy.IdentityColumn
                                ),
                            Title = table
                                .Column<string>(type: "varchar(255)", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            BacklogId = table.Column<int>(type: "int", nullable: false),
                            InitialStart = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            InitialEnd = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            PlanedStart = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            PlanedEnd = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: false
                            ),
                            ActualStart = table.Column<DateTime>(
                                type: "datetime(6)",
                                nullable: true
                            ),
                            ActualEnd = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                            InitalEffort = table.Column<int>(type: "int", nullable: false),
                            PlanedEffort = table.Column<int>(type: "int", nullable: false),
                            ActualEffort = table.Column<int>(type: "int", nullable: true)
                        },
                    constraints: table =>
                    {
                        table.PrimaryKey("PK_BacklogTasks", x => x.Id);
                        table.ForeignKey(
                            name: "FK_BacklogTasks_Backlogs_BacklogId",
                            column: x => x.BacklogId,
                            principalTable: "Backlogs",
                            principalColumn: "Id",
                            onDelete: ReferentialAction.Cascade
                        );
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Backlogs_EpicId_Title",
                table: "Backlogs",
                columns: new[] { "EpicId", "Title" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_BacklogTasks_BacklogId_Title",
                table: "BacklogTasks",
                columns: new[] { "BacklogId", "Title" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_Epics_ProjectId_Title",
                table: "Epics",
                columns: new[] { "ProjectId", "Title" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_Organizations_Name",
                table: "Organizations",
                column: "Name",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_Projects_OrganizationId_Name",
                table: "Projects",
                columns: new[] { "OrganizationId", "Name" },
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "BacklogTasks");

            migrationBuilder.DropTable(name: "Backlogs");

            migrationBuilder.DropTable(name: "Epics");

            migrationBuilder.DropTable(name: "Projects");

            migrationBuilder.DropTable(name: "Organizations");
        }
    }
}
