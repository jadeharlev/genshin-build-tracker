public class UserInfo {
    public int UserID { get; set; }
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public int? AdventureRank { get; set; }
    public string? AccountName { get; set; }
    public bool IsNewUser { get; set; }
}