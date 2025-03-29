# Getting Started

## Required software

* Git [download](https://git-scm.com/download)
* Mysql [download](https://dev.mysql.com/downloads/installer/)
* Java 17
* Node version manager like nvm or asdf [windows](https://github.com/coreybutler/nvm-windows#installation--upgrades)
* Node version from .nvmrc

## Configuration

* Create a mysql user + password for the application
* Copy `src/main/resource/application.example.properties` to `src/main/resource/application.properties` and insert database credentials you created.
* Import the database schema `./schema.ps1` maybe needs some editing, it's not quite environmentally friendly.

## Running and testing

### Backend

* `./gradlew.bat bootRun`
* In a browser go to "localhost:8080/api/recipes/all"

### Frontend

* `cd web`
* `npm install`
* `yarn watch`

## Troubleshooting

### First time windows use
Windows blocks npm scripts by default you'll get an error message like
```
PS C:\code\recipes\web> yarn
yarn : File C:\Program Files\nodejs\yarn.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:1
+ yarn
+ ~~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

It can be fixed by `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted`

# Gradle
## Reference Documentation
For further reference, please consider the following sections:

* [Official Gradle documentation](https://docs.gradle.org)
* [Spring Boot Gradle Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/3.3.0-SNAPSHOT/gradle-plugin/reference/html/)
* [Create an OCI image](https://docs.spring.io/spring-boot/docs/3.3.0-SNAPSHOT/gradle-plugin/reference/html/#build-image)

## Additional Links
These additional references should also help you:

* [Gradle Build Scans – insights for your project's build](https://scans.gradle.com#gradle)
