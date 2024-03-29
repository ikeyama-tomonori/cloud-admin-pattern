﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Server.Repository.AppDb;

#nullable disable

namespace Server.Main.AppDbMigration.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Server.Repository.AppDb.Entity.Backlog", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("ActualEffort")
                        .HasColumnType("int");

                    b.Property<DateTime?>("ActualEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("ActualStart")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("EpicId")
                        .HasColumnType("int");

                    b.Property<int>("InitalEffort")
                        .HasColumnType("int");

                    b.Property<DateTime>("InitialEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("InitialStart")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("PlanedEffort")
                        .HasColumnType("int");

                    b.Property<DateTime>("PlanedEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("PlanedStart")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("EpicId", "Title")
                        .IsUnique();

                    b.ToTable("Backlogs");
                });

            modelBuilder.Entity("Server.Repository.AppDb.Entity.BacklogTask", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("ActualEffort")
                        .HasColumnType("int");

                    b.Property<DateTime?>("ActualEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("ActualStart")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("BacklogId")
                        .HasColumnType("int");

                    b.Property<int>("InitalEffort")
                        .HasColumnType("int");

                    b.Property<DateTime>("InitialEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("InitialStart")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("PlanedEffort")
                        .HasColumnType("int");

                    b.Property<DateTime>("PlanedEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("PlanedStart")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("BacklogId", "Title")
                        .IsUnique();

                    b.ToTable("BacklogTasks");
                });

            modelBuilder.Entity("Server.Repository.AppDb.Entity.Epic", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("ActualEffort")
                        .HasColumnType("int");

                    b.Property<DateTime?>("ActualEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("ActualStart")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("InitalEffort")
                        .HasColumnType("int");

                    b.Property<DateTime>("InitialEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("InitialStart")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("PlanedEffort")
                        .HasColumnType("int");

                    b.Property<DateTime>("PlanedEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("PlanedStart")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("ProjectId")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId", "Title")
                        .IsUnique();

                    b.ToTable("Epics");
                });

            modelBuilder.Entity("Server.Repository.AppDb.Entity.Organization", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Organizations");
                });

            modelBuilder.Entity("Server.Repository.AppDb.Entity.Project", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("ActualEffort")
                        .HasColumnType("int");

                    b.Property<DateTime?>("ActualEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("ActualStart")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("InitalEffort")
                        .HasColumnType("int");

                    b.Property<DateTime>("InitialEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("InitialStart")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<int>("PlanedEffort")
                        .HasColumnType("int");

                    b.Property<DateTime>("PlanedEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("PlanedStart")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId", "Name")
                        .IsUnique();

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("Server.Repository.AppDb.Entity.Backlog", b =>
                {
                    b.HasOne("Server.Repository.AppDb.Entity.Epic", "Epic")
                        .WithMany("Backlogs")
                        .HasForeignKey("EpicId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Epic");
                });

            modelBuilder.Entity("Server.Repository.AppDb.Entity.BacklogTask", b =>
                {
                    b.HasOne("Server.Repository.AppDb.Entity.Backlog", "Backlog")
                        .WithMany("BacklogTasks")
                        .HasForeignKey("BacklogId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Backlog");
                });

            modelBuilder.Entity("Server.Repository.AppDb.Entity.Epic", b =>
                {
                    b.HasOne("Server.Repository.AppDb.Entity.Project", "Project")
                        .WithMany("Epics")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("Server.Repository.AppDb.Entity.Project", b =>
                {
                    b.HasOne("Server.Repository.AppDb.Entity.Organization", "Organization")
                        .WithMany("Projects")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("Server.Repository.AppDb.Entity.Backlog", b =>
                {
                    b.Navigation("BacklogTasks");
                });

            modelBuilder.Entity("Server.Repository.AppDb.Entity.Epic", b =>
                {
                    b.Navigation("Backlogs");
                });

            modelBuilder.Entity("Server.Repository.AppDb.Entity.Organization", b =>
                {
                    b.Navigation("Projects");
                });

            modelBuilder.Entity("Server.Repository.AppDb.Entity.Project", b =>
                {
                    b.Navigation("Epics");
                });
#pragma warning restore 612, 618
        }
    }
}
