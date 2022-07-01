namespace Server.Model;

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

[DisplayName("組織")]
public class Organization
{
    [DisplayName("組織ID")]
    [Required]
    public int Id { get; set; }

    [DisplayName("組織名")]
    [Required]
    public string Name { get; set; } = null!;

    [DisplayName("プロジェクト")]
    public List<Project>? Projects { get; set; }
}
