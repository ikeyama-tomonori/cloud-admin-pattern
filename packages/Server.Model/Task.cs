namespace Server.Model;

using System.ComponentModel;

[DisplayName("タスク")]
public class Task : ScheduleAndEffort
{
    [DisplayName("タスクID")]
    public int Id { get; set; }

    [DisplayName("タイトル")]
    public string Title { get; set; } = null!;

    [DisplayName("機能ID")]
    public int FeatureId { get; set; }

    [DisplayName("機能")]
    public Feature? Feature { get; set; }
}
