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
                                .Column<string>(type: "longtext", nullable: false)
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
                                .Column<string>(
                                    type: "varchar(100)",
                                    maxLength: 100,
                                    nullable: false
                                )
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
                                .Column<string>(type: "longtext", nullable: false)
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
                    name: "Features",
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
                        table.PrimaryKey("PK_Features", x => x.Id);
                        table.ForeignKey(
                            name: "FK_Features_Epics_EpicId",
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
                    name: "Tasks",
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
                            FeatureId = table.Column<int>(type: "int", nullable: false),
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
                        table.PrimaryKey("PK_Tasks", x => x.Id);
                        table.ForeignKey(
                            name: "FK_Tasks_Features_FeatureId",
                            column: x => x.FeatureId,
                            principalTable: "Features",
                            principalColumn: "Id",
                            onDelete: ReferentialAction.Cascade
                        );
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Epics_ProjectId",
                table: "Epics",
                column: "ProjectId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Features_EpicId",
                table: "Features",
                column: "EpicId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Projects_OrganizationId",
                table: "Projects",
                column: "OrganizationId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_FeatureId",
                table: "Tasks",
                column: "FeatureId"
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Tasks");

            migrationBuilder.DropTable(name: "Features");

            migrationBuilder.DropTable(name: "Epics");

            migrationBuilder.DropTable(name: "Projects");

            migrationBuilder.DropTable(name: "Organizations");
        }
    }
}
