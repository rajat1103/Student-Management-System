# Stage 1: Build the JAR file using Maven and JDK
# We use a Maven image that includes the JDK for compilation.
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and source code into the container
COPY pom.xml .
COPY src ./src

# Run the Maven package command to build the JAR
# -DskipTests is used to skip running JUnit tests during the build
RUN mvn clean package -DskipTests

# --- Stage 2: Create the final, smaller runtime image ---
# We switch to a lighter JRE (Java Runtime Environment) image to run the app.
FROM eclipse-temurin:21-jre-alpine

# Set the port the application will listen on
EXPOSE 8080

# Set the working directory
WORKDIR /app

# Copy the generated JAR file from the 'build' stage into the 'runtime' stage
COPY --from=build /app/target/studentmanagement-0.0.1-SNAPSHOT.jar app.jar

# Define the command to run the application when the container starts
# The app.jar name matches the final file copied above
ENTRYPOINT ["java", "-jar", "app.jar"]