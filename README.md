NotesApp-Munchkin

A simple notes web application to display the features and functionality with Cardano Blockchain Technology. 
Built with React (frontend) and Spring Boot (backend) with MySQL as the database. Supports creating, reading, updating, and deleting notes (CRUD).

Requirements

Node.js (v18+ recommended)
npm or yarn
Java JDK 17+
Maven or Gradle
MySQL 8+
MySQL Workbench (optional, for database management)

Setup
1. Clone the repository
git clone https://github.com/your-username/NotesApp-Munchkin.git
cd NotesApp-Munchkin

2. Backend Setup (Spring Boot)
Open the backend project in your IDE (IntelliJ, VSCode, etc.)
Configure application.properties with your MySQL credentials:
spring.datasource.url=jdbc:mysql://localhost:3306/notes_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=<your username>
spring.datasource.password=<your password>
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

Build and run the backend:
./mvnw spring-boot:run

3. Frontend Setup (React)
cd frontend
npm install
npm run dev


MySQL Workbench DB Initialization(OPTIONAL)
CREATE DATABASE notes_db;
USE notes_db;

CREATE TABLE notes (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY (id)
);

