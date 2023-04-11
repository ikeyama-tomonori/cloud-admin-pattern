# マニュアル

## VSCode

DevContaierを利用する

## パッケージの更新方法

### pnpm

> pnpm -r update -Li

### dotnet

> dotnet outdated -u:Prompt
> dotnet tool update csharpier
> dotnet tool update dotnet-ef
> dotnet tool update dotnet-coverage
> dotnet tool update dotnet-sonarscanner
> dotnet tool update dotnet-outdated-tool

## 実行方法

データベースの起動

> docker compose up

アプリケーションの起動

> pnpm start
