using Ayaka.Api.Controllers;
using Ayaka.Api.Data.Models;
using Ayaka.Api.Repositories;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Ayaka.Api.Tests;

public class CharactersControllerTests {
    private readonly Mock<ICharacterRepository> mockRepository;
    private readonly CharactersController controller;

    public CharactersControllerTests() {
        mockRepository = new Mock<ICharacterRepository>();
        controller = new CharactersController(mockRepository.Object);
    }

    [Fact]
    public async Task GetAllReturnsOkResult() {
        mockRepository.Setup(repository => repository.GetAllAsync()).ReturnsAsync(new List<Character>());
        var result = await controller.GetAll();
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.IsType<List<Character>>(okResult.Value);
    }

    [Fact]
    public async Task GetByIDReturnsNotFoundWhenCharacterDoesNotExist() {
        mockRepository.Setup(repository => repository.GetByIDAsync(It.IsAny<int>()))
            .ReturnsAsync((Character?)null);
        var result = await controller.GetByID(1);
        Assert.IsType<NotFoundResult>(result);
    }
    
    [Fact]
    public async Task GetByIDReturnsOkResultAndCharacterWhenCharacterExists() {
        var expectedCharacter = new Character
        {
            CharacterID = 1,
            Name = "Yanfei"
        };
        mockRepository.Setup(repository => repository.GetByIDAsync(1)).ReturnsAsync(expectedCharacter);
        var result = await controller.GetByID(1);
        var okResult = Assert.IsType<OkObjectResult>(result);
        
        var actualCharacter = Assert.IsType<Character>(okResult.Value);
        Assert.Equal(expectedCharacter, actualCharacter);
    }

    [Fact]
    public async Task CreateReturnsCreatedAtActionWithNewCharacter() {
        var CharacterToCreate = new Character
        {
            CharacterID = 1,
            Name = "Yanfei",
            Ascension = 6,
            BaseCharacterKey = "yanfei",
            ConstellationLevel = 0,
            Level = 80,
            Rarity = "5",
            TalentLevel1 = 7,
            TalentLevel2 = 7,
            TalentLevel3 = 7
        };
        mockRepository.Setup(repository => repository.CreateAsync(CharacterToCreate)).ReturnsAsync(1);
        var result = await controller.Create(CharacterToCreate);
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        var createdCharacter = Assert.IsType<Character>(createdAtActionResult.Value);
        Assert.Equal(CharacterToCreate, createdCharacter);
        Assert.Equal(nameof(CharactersController.GetByID), createdAtActionResult.ActionName);
        Assert.Equal(1, createdAtActionResult.RouteValues["characterID"]);
    }

    [Fact]
    public async Task UpdateReturnsBadRequestWhenCharacterIDIsInvalid() {
        var result = await controller.Update(1, new Character()); 
        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async Task UpdateReturnsNotFoundWhenCharacterDoesNotExist() {
        var matchingCharacter = new Character
        {
            CharacterID = 1,
            Name = "Yanfei",
            Ascension = 6,
            BaseCharacterKey = "yanfei",
            ConstellationLevel = 0,
            Level = 80,
            Rarity = "5",
            TalentLevel1 = 7,
            TalentLevel2 = 7,
            TalentLevel3 = 7
        };
        mockRepository.Setup(repository => repository.UpdateAsync(matchingCharacter)).ReturnsAsync(false);
        var result = await controller.Update(1, matchingCharacter);
        Assert.IsType<NotFoundResult>(result);
    }
    
    [Fact]
    public async Task UpdateReturnsNoContentWhenCharacterExists() {
        var character = new Character
        {
            CharacterID = 1,
            Name = "Yanfei",
            Ascension = 6,
            BaseCharacterKey = "yanfei",
            ConstellationLevel = 0,
            Level = 80,
            Rarity = "5",
            TalentLevel1 = 7,
            TalentLevel2 = 7,
            TalentLevel3 = 7
        };
        mockRepository.Setup(repository => repository.UpdateAsync(character)).ReturnsAsync(true);
        var result = await controller.Update(1, character); 
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteReturnsNotFoundWhenCharacterDoesNotExist() {
        var character = new Character
        {
            CharacterID = 1,
            Name = "Yanfei",
            Ascension = 6,
            BaseCharacterKey = "yanfei",
            ConstellationLevel = 0,
            Level = 80,
            Rarity = "5",
            TalentLevel1 = 7,
            TalentLevel2 = 7,
            TalentLevel3 = 7
        };
        mockRepository.Setup(repository => repository.DeleteAsync(character.CharacterID)).ReturnsAsync(false);
        var result = await controller.Delete(1);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task DeleteReturnsNoContentWhenCharacterExists() {
        mockRepository.Setup(repository => repository.DeleteAsync(1)).ReturnsAsync(true);
        var result = await controller.Delete(1);
        Assert.IsType<NoContentResult>(result);
    }
}