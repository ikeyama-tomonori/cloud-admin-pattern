namespace Server.Model;

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

[DisplayName("エピック")]
public class Epic : ScheduleAndEffort
{
    [DisplayName("エピックID")]
    [Required]
    public int Id { get; set; }

    [DisplayName("タイトル")]
    [Required]
    public string Title { get; set; } = null!;

    [DisplayName("プロジェクトID")]
    [Required]
    public int ProjectId { get; set; }

    [DisplayName("プロジェクト")]
    public Project? Project { get; set; }

    [DisplayName("機能")]
    public List<Feature>? Features { get; set; }
}
