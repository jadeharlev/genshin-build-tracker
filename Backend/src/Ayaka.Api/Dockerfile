# Base image is the dotnet 8 SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set directory to /source
WORKDIR /source

# Copy the csproject file from local machine into container
COPY *.csproj .

# Restore NuGet packages
RUN dotnet restore

# Copy rest of source code into the container
COPY . .

# Compile & publish in release configuration -> /app/publish in the container
RUN dotnet publish -c Release -o /app/publish

# New image which doesn't include the SDK
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

# Set working directory to /app
WORKDIR /app

# Copy from the build stage into the final image
COPY --from=build /app/publish .

# Set the entry point; calls dotnet Ayaka.Api.dll
ENTRYPOINT ["dotnet", "Ayaka.Api.dll"]