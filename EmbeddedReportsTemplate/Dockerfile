FROM <Your -image-name>
ARG source
WORKDIR /app
ENV NODE_PATH=/app/.npm-global/lib/node_modules
EXPOSE 80
COPY ${source:-obj/Docker/publish} .
COPY ${source:-dist/out-tsc/PdfGenerator.js} .
ENTRYPOINT ["dotnet", "EmbeddedReportsTemplate.dll"]
