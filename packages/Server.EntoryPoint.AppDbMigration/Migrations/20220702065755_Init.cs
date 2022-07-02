using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.EntoryPoint.AppDbMigration.Migrations
{
    public partial class Init : Migration
    {
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
                    name: "Project",
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
                                .Column<string>(type: "longtext", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            OrganizationId = table.Column<int>(type: "int", nullable: true),
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
                        table.PrimaryKey("PK_Project", x => x.Id);
                        table.ForeignKey(
                            name: "FK_Project_Organizations_OrganizationId",
                            column: x => x.OrganizationId,
                            principalTable: "Organizations",
                            principalColumn: "Id"
                        );
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder
                .CreateTable(
                    name: "Epic",
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
                                .Column<string>(type: "longtext", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            ProjectId = table.Column<int>(type: "int", nullable: true),
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
                        table.PrimaryKey("PK_Epic", x => x.Id);
                        table.ForeignKey(
                            name: "FK_Epic_Project_ProjectId",
                            column: x => x.ProjectId,
                            principalTable: "Project",
                            principalColumn: "Id"
                        );
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder
                .CreateTable(
                    name: "Feature",
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
                                .Column<string>(type: "longtext", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            EpicId = table.Column<int>(type: "int", nullable: true),
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
                        table.PrimaryKey("PK_Feature", x => x.Id);
                        table.ForeignKey(
                            name: "FK_Feature_Epic_EpicId",
                            column: x => x.EpicId,
                            principalTable: "Epic",
                            principalColumn: "Id"
                        );
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder
                .CreateTable(
                    name: "BacklogTask",
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
                                .Column<string>(type: "longtext", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            FeatureId = table.Column<int>(type: "int", nullable: true),
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
                        table.PrimaryKey("PK_BacklogTask", x => x.Id);
                        table.ForeignKey(
                            name: "FK_BacklogTask_Feature_FeatureId",
                            column: x => x.FeatureId,
                            principalTable: "Feature",
                            principalColumn: "Id"
                        );
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_BacklogTask_FeatureId",
                table: "BacklogTask",
                column: "FeatureId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Epic_ProjectId",
                table: "Epic",
                column: "ProjectId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Feature_EpicId",
                table: "Feature",
                column: "EpicId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Organizations_Name",
                table: "Organizations",
                column: "Name",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_Project_OrganizationId",
                table: "Project",
                column: "OrganizationId"
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "BacklogTask");

            migrationBuilder.DropTable(name: "Feature");

            migrationBuilder.DropTable(name: "Epic");

            migrationBuilder.DropTable(name: "Project");

            migrationBuilder.DropTable(name: "Organizations");
        }
    }
}
