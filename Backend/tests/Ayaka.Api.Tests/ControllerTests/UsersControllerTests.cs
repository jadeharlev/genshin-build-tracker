using Ayaka.Api.Controllers;
using Ayaka.Api.Data.Models;
using Ayaka.Api.Repositories;
using Microsoft.AspNetCore.Mvc;
using Moq;

public class UsersControllerTests {
    private readonly Mock<IUserRepository> mockRepository;
    private readonly UsersController controller;

    public UsersControllerTests() {
        mockRepository = new Mock<IUserRepository>();
        controller = new UsersController(mockRepository.Object);
    }
    
    [Fact]
    public async Task GetByIDReturnsNotFoundWhenUserDoesNotExist() {
        mockRepository.Setup(repository => repository.GetByIDAsync(It.IsAny<int>()))
            .ReturnsAsync((User?)null);
        var result = await controller.GetByID(1);
        Assert.IsType<NotFoundResult>(result);
    }
    
    [Fact]
    public async Task GetByIDReturnsOkResultAndUserWhenUserExists() {
        var expectedUser = new User
        {
            UserID = 1,
            AccountName = "Wave",
            AdventureRank = 60
        };
        mockRepository.Setup(repository => repository.GetByIDAsync(1)).ReturnsAsync(expectedUser);
        var result = await controller.GetByID(1);
        var okResult = Assert.IsType<OkObjectResult>(result);
        
        var actualUser = Assert.IsType<User>(okResult.Value);
        Assert.Equal(expectedUser, actualUser);
    }

    [Fact]
    public async Task UpdateReturnsBadRequestWhenUserIDIsInvalid() {
        var result = await controller.Update(1, new User()); 
        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async Task UpdateReturnsNotFoundWhenUserDoesNotExist() {
        var matchingUser = new User
        {
            UserID = 1,
            AccountName = "Wave",
            AdventureRank = 60
        };
        mockRepository.Setup(repository => repository.UpdateAsync(matchingUser)).ReturnsAsync(false);
        var result = await controller.Update(1, matchingUser);
        Assert.IsType<NotFoundResult>(result);
    }
    
    [Fact]
    public async Task UpdateReturnsNoContentWhenUserExists() {
        var character = new User
        {
            UserID = 1,
            AccountName = "Wave",
            AdventureRank = 60
        };
        mockRepository.Setup(repository => repository.UpdateAsync(character)).ReturnsAsync(true);
        var result = await controller.Update(1, character); 
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteReturnsNotFoundWhenUserDoesNotExist() {
        var character = new User
        {
            UserID = 1,
            AccountName = "Wave",
            AdventureRank = 60
        };
        mockRepository.Setup(repository => repository.DeleteAsync(character.UserID)).ReturnsAsync(false);
        var result = await controller.Delete(1);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task DeleteReturnsNoContentWhenUserExists() {
        mockRepository.Setup(repository => repository.DeleteAsync(1)).ReturnsAsync(true);
        var result = await controller.Delete(1);
        Assert.IsType<NoContentResult>(result);
    }
}