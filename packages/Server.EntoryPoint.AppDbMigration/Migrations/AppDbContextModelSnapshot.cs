﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Server.Repository.AppDb;

#nullable disable

namespace Server.EntoryPoint.AppDbMigration.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Server.Model.Epic", b =>
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
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.ToTable("Epics");
                });

            modelBuilder.Entity("Server.Model.Feature", b =>
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
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("EpicId");

                    b.ToTable("Features");
                });

            modelBuilder.Entity("Server.Model.Organization", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Organizations");
                });

            modelBuilder.Entity("Server.Model.Project", b =>
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
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<int>("PlanedEffort")
                        .HasColumnType("int");

                    b.Property<DateTime>("PlanedEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("PlanedStart")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("Server.Model.Task", b =>
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

                    b.Property<int>("FeatureId")
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
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("FeatureId");

                    b.ToTable("Tasks");
                });

            modelBuilder.Entity("Server.Model.Epic", b =>
                {
                    b.HasOne("Server.Model.Project", "Project")
                        .WithMany("Epics")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("Server.Model.Feature", b =>
                {
                    b.HasOne("Server.Model.Epic", "Epic")
                        .WithMany("Features")
                        .HasForeignKey("EpicId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Epic");
                });

            modelBuilder.Entity("Server.Model.Project", b =>
                {
                    b.HasOne("Server.Model.Organization", "Organization")
                        .WithMany("Projects")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("Server.Model.Task", b =>
                {
                    b.HasOne("Server.Model.Feature", "Feature")
                        .WithMany("Tasks")
                        .HasForeignKey("FeatureId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Feature");
                });

            modelBuilder.Entity("Server.Model.Epic", b =>
                {
                    b.Navigation("Features");
                });

            modelBuilder.Entity("Server.Model.Feature", b =>
                {
                    b.Navigation("Tasks");
                });

            modelBuilder.Entity("Server.Model.Organization", b =>
                {
                    b.Navigation("Projects");
                });

            modelBuilder.Entity("Server.Model.Project", b =>
                {
                    b.Navigation("Epics");
                });
#pragma warning restore 612, 618
        }
    }
}
