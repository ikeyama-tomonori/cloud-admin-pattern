namespace Server.Model;

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

[DisplayName("機能")]
public class Feature : ScheduleAndEffort
{
    [DisplayName("機能ID")]
    [Required]
    public int Id { get; set; }

    [DisplayName("タイトル")]
    [Required]
    public string Title { get; set; } = null!;

    [DisplayName("エピックID")]
    [Required]
    public int EpicId { get; set; }

    [DisplayName("エピック")]
    public Epic? Epic { get; set; }

    [DisplayName("タスク")]
    public List<Task>? Tasks { get; set; }
}
