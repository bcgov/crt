FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copy solution and project files first for layer caching
COPY Crt.sln .
COPY Crt.Api/Crt.Api.csproj Crt.Api/
COPY Crt.Data/Crt.Data.csproj Crt.Data/
COPY Crt.Domain/Crt.Domain.csproj Crt.Domain/
COPY Crt.HttpClients/Crt.HttpClients.csproj Crt.HttpClients/
COPY Crt.Model/Crt.Model.csproj Crt.Model/
COPY Crt.Tests/Crt.Tests.csproj Crt.Tests/
COPY Serilog.Sinks.CrtPostgreSql/Serilog.Sinks.CrtPostgreSql.csproj Serilog.Sinks.CrtPostgreSql/

RUN dotnet restore

COPY . .
RUN dotnet publish Crt.Api/Crt.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Crt.Api.dll"]
