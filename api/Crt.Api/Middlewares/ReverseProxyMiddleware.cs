using Crt.Api.Extensions;
using Crt.HttpClients;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Crt.Api.Middlewares
{
    public class ReverseProxyMiddleware
    {
        private HttpClient _httpClient;
        private readonly RequestDelegate _nextMiddleware;
        private readonly ILogger _logger;

        public ReverseProxyMiddleware(RequestDelegate nextMiddleware, ILogger<ReverseProxyMiddleware> logger)
        {
            _nextMiddleware = nextMiddleware;
            _logger = logger;

        }

        public async Task Invoke(HttpContext context, IGeoServerApi geoServerApi)
        {
            _httpClient = geoServerApi.Client;

            var targetUri = BuildTargetUri(context.Request);

            if (targetUri != null)
            {
                _logger.LogInformation($"Proxy - {targetUri}");

                var targetRequestMessage = CreateTargetMessage(context, targetUri);

                using (var responseMessage = await _httpClient.SendAsync(targetRequestMessage, HttpCompletionOption.ResponseHeadersRead, context.RequestAborted))
                {
                    if (responseMessage.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                    {
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/json";

                        var problem = new ValidationProblemDetails()
                        {
                            Type = "https://crt.bc.gov.ca/exception",
                            Title = $"Access denied from {targetUri}",
                            Status = StatusCodes.Status401Unauthorized,
                            Detail = "Authentication failed.",
                            Instance = context.Request.Path
                        };

                        await context.Response.WriteJsonAsync(problem, "application/problem+json");
                    }
                    else
                    {
                        context.Response.StatusCode = (int)responseMessage.StatusCode;
                        CopyFromTargetResponseHeaders(context, responseMessage);
                        await responseMessage.Content.CopyToAsync(context.Response.Body);
                    }
                }
                return;
            }
            await _nextMiddleware(context);
        }

        private HttpRequestMessage CreateTargetMessage(HttpContext context, Uri targetUri)
        {
            var requestMessage = new HttpRequestMessage();
            CopyFromOriginalRequestContentAndHeaders(context, requestMessage);

            requestMessage.RequestUri = targetUri;
            requestMessage.Headers.Host = targetUri.Host;
            requestMessage.Method = GetMethod(context.Request.Method);

            return requestMessage;
        }

        private void CopyFromOriginalRequestContentAndHeaders(HttpContext context, HttpRequestMessage requestMessage)
        {
            var requestMethod = context.Request.Method;

            if (!HttpMethods.IsGet(requestMethod) &&
              !HttpMethods.IsHead(requestMethod) &&
              !HttpMethods.IsDelete(requestMethod) &&
              !HttpMethods.IsTrace(requestMethod))
            {
                var streamContent = new StreamContent(context.Request.Body);
                requestMessage.Content = streamContent;
            }

            foreach (var header in context.Request.Headers)
            {
                requestMessage.Content?.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
            }
        }

        private static void CopyFromTargetResponseHeaders(HttpContext context, HttpResponseMessage responseMessage)
        {
            foreach (var header in responseMessage.Headers)
            {
                context.Response.Headers[header.Key] = header.Value.ToArray();
            }

            foreach (var header in responseMessage.Content.Headers)
            {
                context.Response.Headers[header.Key] = header.Value.ToArray();
            }
            context.Response.Headers.Remove("transfer-encoding");
        }

        private static HttpMethod GetMethod(string method)
        {
            if (HttpMethods.IsDelete(method)) return HttpMethod.Delete;
            if (HttpMethods.IsGet(method)) return HttpMethod.Get;
            if (HttpMethods.IsHead(method)) return HttpMethod.Head;
            if (HttpMethods.IsOptions(method)) return HttpMethod.Options;
            if (HttpMethods.IsPost(method)) return HttpMethod.Post;
            if (HttpMethods.IsPut(method)) return HttpMethod.Put;
            if (HttpMethods.IsTrace(method)) return HttpMethod.Trace;
            return new HttpMethod(method);
        }

        private Uri BuildTargetUri(HttpRequest request)
        {
            Uri targetUri = null;

            if (request.Path.StartsWithSegments("/ogs-internal", out var remainingPath))
            {
                targetUri = new Uri(_httpClient.BaseAddress + remainingPath + request.QueryString);
            }

            return targetUri;
        }
    }
}
