using System.ComponentModel.DataAnnotations;

public class GoogleSignInRequest {
    [Required] public string IdToken { get; set; } = string.Empty;
    public int? AdventureRank { get; set; }
    public string? AccountName { get; set; }
}