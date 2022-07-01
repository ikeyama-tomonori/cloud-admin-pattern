namespace Server.Model;

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

public abstract class ScheduleAndEffort : IValidatableObject
{
    [DisplayName("当初開始日")]
    [Required]
    public DateTime InitialStart { get; set; }

    [DisplayName("当初終了日")]
    [Required]
    public DateTime InitialEnd { get; set; }

    [DisplayName("計画開始日")]
    [Required]
    public DateTime PlanedStart { get; set; }

    [DisplayName("計画終了日")]
    [Required]
    public DateTime PlanedEnd { get; set; }

    [DisplayName("実績開始日")]
    public DateTime? ActualStart { get; set; }

    [DisplayName("実績終了日")]
    public DateTime? ActualEnd { get; set; }

    [DisplayName("開始遅延日数")]
    [Description("実績開始日が計画開始日から何日遅れているかを出力する。実績開始日が未入力の場合は、現在日付と計画日との差を出力する。")]
    public int StartDelayDays => ((this.ActualStart ?? DateTime.Now) - this.PlanedStart).Days;

    [DisplayName("終了遅延日数")]
    [Description("実績終了が計画終了日から何日遅れているかを出力する。実績終了日が未入力の場合は、現在日付と計画日との差を出力する。")]
    public int EndDelayDays => ((this.ActualEnd ?? DateTime.Now) - this.PlanedEnd).Days;

    [DisplayName("当初工数")]
    [Required]
    public int InitalEffort { get; set; }

    [DisplayName("計画工数")]
    [Required]
    public int PlanedEffort { get; set; }

    [DisplayName("実績工数")]
    public int? ActualEffort { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (this.InitialEnd < this.InitialStart)
        {
            yield return new(
                $"当初終了日は当初開始日と同日か、未来である必要があります。",
                new[] { nameof(this.PlanedStart), nameof(this.PlanedEnd) }
            );
        }

        if (this.PlanedEnd < this.PlanedStart)
        {
            yield return new(
                $"計画終了日は計画開始日と同日か、未来である必要があります。",
                new[] { nameof(this.PlanedStart), nameof(this.PlanedEnd) }
            );
        }

        if (this.ActualEnd is DateTime end && (end < (this.ActualStart ?? DateTime.MaxValue)))
        {
            yield return new(
                $"実績終了日は実績開始日と同日か、未来である必要があります。",
                new[] { nameof(this.PlanedStart), nameof(this.PlanedEnd) }
            );
        }
    }
}
