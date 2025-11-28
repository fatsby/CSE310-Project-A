using System;

namespace project2.DTOs.CartDto;

public class CartItemDto
{
    public string DocumentName { get; set; }
    public int DocumentId { get; set; }
    public decimal DocumentPrice { get; set; }
    public string UniversityName { get; set; }
    public string SubjectName { get; set; }
    public string? ImageUrl { get; set; }
}