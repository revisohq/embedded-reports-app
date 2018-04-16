using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using EmbeddedReportsTemplate.DataProtection;
using EmbeddedReportsTemplate.Filters;
using EmbeddedReportsTemplate.Middleware;
using EmbeddedReportsTemplate.Services;
using System;

namespace EmbeddedReportsTemplate
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        public IConfiguration Configuration { get; }

        public IHostingEnvironment Environment { get; }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IAntiforgery antiforgery)
        {
            app.Use(next => context =>
            {
                if (string.Equals(context.Request.Path.Value, "/", StringComparison.OrdinalIgnoreCase)
                    || string.Equals(context.Request.Path.Value, "/index.html", StringComparison.OrdinalIgnoreCase))
                {
                    // We can send the request token as a JavaScript-readable cookie, and Angular will use it by default.
                    var tokens = antiforgery.GetAndStoreTokens(context);
                    var cookieOptions = new CookieOptions()
                    {
                        HttpOnly = false,
                        SameSite = SameSiteMode.None // Required by chrome to work
                    };
                    context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, cookieOptions);
                }
                return next(context);
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            DefaultFilesOptions options = new DefaultFilesOptions();
            options.DefaultFileNames.Clear();
            options.DefaultFileNames.Add("index.html");
            app.UseDefaultFiles(options);
            app.UseStaticFiles();
            app.UseRevisoAgreement();
            app.UseMvcWithDefaultRoute();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddNodeServices();

            services
                .AddMvc(options =>
                {
                    options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
                    options.Filters.Add<UnderMaintenanceAttribute>();
                })
                .AddJsonOptions(options => options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Local);

            services
                .AddAuthentication(
                    options =>
                    {
                        options.DefaultScheme = RevisoAuthenticationHandler.REVISO_AUTHENTICATION_SCHEME;
                    })
                .AddScheme<RevisoAuthenticationSchemeOptions, RevisoAuthenticationHandler>(
                    RevisoAuthenticationHandler.REVISO_AUTHENTICATION_SCHEME,
                    options => { });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("AuthenticatedUser", policy => policy.RequireAuthenticatedUser());
            });

            services.AddAntiforgery(options =>
            {
                options.Cookie.SameSite = SameSiteMode.None; // Required by chrome to work
                options.SuppressXFrameOptionsHeader = true;
                // Angular's default header name for sending the XSRF token.
                options.HeaderName = "X-XSRF-TOKEN";
            });

            services.AddSingleton<IGrantToken, GrantToken>();
            services.AddSingleton<IGrantTokenProtection, GrantTokenProtection>();
            services.AddSingleton<IRevisoRestClientService, RevisoRestClientService>();
            services.AddSingleton<ITempDataProvider, CookieTempDataProvider>();
        }
    }
}