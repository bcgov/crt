using AutoMapper;
using Hangfire;
using Hangfire.SqlServer;
using Crt.Api.Authentication;
using Crt.Api.Authorization;
using Crt.Data.Database;
using Crt.Data.Database.Entities;
using Crt.Data.Mappings;
using Crt.Domain.Services;
using Crt.Model;
using Crt.Model.JsonConverters;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using NetCore.AutoRegisterDi;
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Crt.Api.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static void AddCrtApiVersioning(this IServiceCollection services)
        {
            services.AddApiVersioning(options =>
            {
                options.ReportApiVersions = true;
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.ApiVersionReader = new HeaderApiVersionReader("version");
                options.ApiVersionSelector = new CurrentImplementationApiVersionSelector(options);
            });
        }

        public static void AddCrtControllers(this IServiceCollection services)
        {
            services
                .AddControllers(options =>
                {
                    var policy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .Build();
                    options.Filters.Add(new AuthorizeFilter(policy));
                })
                .ConfigureApiBehaviorOptions(setupAction =>
                {
                    setupAction.InvalidModelStateResponseFactory = ValidationUtils.GetValidationErrorResult;
                })
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                    options.JsonSerializerOptions.WriteIndented = true;
                    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                    options.JsonSerializerOptions.Converters.Add(new LongToStringConverter());
                    options.JsonSerializerOptions.Converters.Add(new IntToStringConverter());
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
        }

        public static void AddCrtDbContext(this IServiceCollection services, string connectionString, bool isDev)
        {
            var warningBehaviour = isDev ? WarningBehavior.Log : WarningBehavior.Ignore;

            services.AddDbContext<AppDbContext>(options => options
                .UseSqlServer(connectionString, x => x.UseNetTopologySuite().CommandTimeout(1800))
                .ConfigureWarnings(warnings => 
                { 
                    warnings.Default(warningBehaviour);
                }));
        }

        public static void AddCrtAutoMapper(this IServiceCollection services)
        {
            var mappingConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new EntityToModelProfile());
                cfg.AddProfile(new ModelToEntityProfile());
            });

            var mapper = mappingConfig.CreateMapper();
            services.AddSingleton(mapper);
        }

        public static void AddCrtAuthentication(this IServiceCollection services, IConfiguration config)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Authority = config.GetValue<string>("JWT:Authority");
                options.Audience = config.GetValue<string>("JWT:Audience");
                options.IncludeErrorDetails = true;
                options.EventsType = typeof(CrtJwtBearerEvents);
            });
        }

        public static void AddCrtSwagger(this IServiceCollection services, IWebHostEnvironment env)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "CRT REST API",
                    Description = "CRT System"
                });

                var securitySchema = new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                };

                options.AddSecurityDefinition("Bearer", securitySchema);

                var securityRequirement = new OpenApiSecurityRequirement();
                securityRequirement.Add(securitySchema, new[] { "Bearer" });
                options.AddSecurityRequirement(securityRequirement);
            });
        }

        public static void AddCrtTypes(this IServiceCollection services)
        {
            var assemblies = Assembly.GetExecutingAssembly()
                .GetReferencedAssemblies()
                .Where(a => a.FullName.StartsWith("Crt"))
                .Select(Assembly.Load).ToArray();

            //Services
            services.RegisterAssemblyPublicNonGenericClasses(assemblies)
                 .Where(c => c.Name.EndsWith("Service"))
                 .AsPublicImplementedInterfaces(ServiceLifetime.Scoped);

            //Repository
            services.RegisterAssemblyPublicNonGenericClasses(assemblies)
                 .Where(c => c.Name.EndsWith("Repository"))
                 .AsPublicImplementedInterfaces(ServiceLifetime.Scoped);

            //Unit of Work
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            //SmHeaders
            services.AddScoped<CrtCurrentUser, CrtCurrentUser>();

            //Permission Handler
            services.AddSingleton<IAuthorizationHandler, PermissionHandler>();

            //FieldValidationService as Singleton
            services.AddSingleton<IFieldValidatorService, FieldValidatorService>();

            //RegexDefs as Singleton
            services.AddSingleton<RegexDefs>();

            //Jwt Bearer Handler
            services.AddScoped<CrtJwtBearerEvents>();
        }

        public static void AddCrtHangfire(this IServiceCollection services, string connectionString, bool runServer, int workerCount)
        {
            services.AddHangfire(configuration => configuration
                .UseSerilogLogProvider()
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage(connectionString, new SqlServerStorageOptions
                {
                    CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                    SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                    QueuePollInterval = TimeSpan.Zero,
                    UseRecommendedIsolationLevel = true,
                    UsePageLocksOnDequeue = true,
                    DisableGlobalLocks = true
                }));

            if (runServer)
            {
                services.AddHangfireServer(options =>
                {
                    options.WorkerCount = workerCount;
                });
            }
        }

        public static void AddCrtHealthCheck(this IServiceCollection services, string connectionString)
        {
            services.AddHealthChecks()
                .AddSqlServer(connectionString, name: "CRT-DB-Check", failureStatus: HealthStatus.Degraded, tags: new string[] { "sql", "db" });
        }
    }
}
