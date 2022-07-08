namespace Server.Model;

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

[DisplayName("プロジェクト")]
public class Project : ScheduleAndEffort
{
    [DisplayName("プロジェクトID")]
    [Required]
    public int Id { get; set; }

    [DisplayName("プロジェクト名")]
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [DisplayName("組織ID")]
    [Required]
    public int OrganizationId { get; set; }

    [DisplayName("組織")]
    public Organization? Organization { get; set; }

    [DisplayName("エピック")]
    public List<Epic>? Epics { get; set; }
}
