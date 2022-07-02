namespace Server.Repository.AppDb.Entity;

public abstract class TaskBase
{
    public DateTime InitialStart { get; set; }

    public DateTime InitialEnd { get; set; }

    public DateTime PlanedStart { get; set; }

    public DateTime PlanedEnd { get; set; }

    public DateTime? ActualStart { get; set; }

    public DateTime? ActualEnd { get; set; }

    public int InitalEffort { get; set; }

    public int PlanedEffort { get; set; }

    public int? ActualEffort { get; set; }
}
