import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "3.4.2"
	id("io.spring.dependency-management") version "1.1.4"
	kotlin("jvm") version "1.9.23"
	kotlin("plugin.spring") version "1.9.23"
	kotlin("plugin.jpa") version "1.9.23"
}

sourceSets {
	create("integrationTest") {
		project
			.extensions
			.getByType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmProjectExtension>()
			.sourceSets
			.getByName(name)
			.apply {
				kotlin.srcDir(file("src/integrationTest/kotlin"))
				resources.srcDir("src/integrationTest/resources")
				compileClasspath += sourceSets["main"].output + configurations["testRuntimeClasspath"]
				runtimeClasspath += output + compileClasspath + sourceSets["test"].runtimeClasspath
			}
	}
}

group = "nl.rmspek"
version = "1.0.0"

java {
	sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
	mavenCentral()
	maven { url = uri("https://repo.spring.io/milestone") }
	maven { url = uri("https://repo.spring.io/snapshot") }
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.mysql:mysql-connector-j")

	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-noarg")
	implementation("org.liquibase:liquibase-core:4.26.0")

	implementation("org.springdoc:springdoc-openapi-data-rest:1.6.0")
	implementation("org.springdoc:springdoc-openapi-ui:1.6.0")
	implementation("org.springdoc:springdoc-openapi-kotlin:1.6.0")

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.junit.jupiter:junit-jupiter-engine")
	testImplementation("com.h2database:h2")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs += "-Xjsr305=strict"
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.withType<ProcessResources> {
	duplicatesStrategy = DuplicatesStrategy.INCLUDE
}

tasks {
	register<Test>("integrationTest") {
		description = "Runs the integration tests"
		testClassesDirs = sourceSets["integrationTest"].output.classesDirs
		classpath = sourceSets["integrationTest"].runtimeClasspath
	}
}

configurations.all {
	exclude(group = "org.webjars", module = "webjars-locator-core")
}
