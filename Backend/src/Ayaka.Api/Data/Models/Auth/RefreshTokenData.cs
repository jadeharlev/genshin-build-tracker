public class RefreshTokenData {
    public int UserID { get; set; }
    public string GoogleID { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}