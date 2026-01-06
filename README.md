
# Student Record Management System (SRMS)

A simple web app to manage student records using **HTML, CSS, and JavaScript**.  
It focuses on basic CRUD operations, array handling, and localStorage.

## Project Overview

This project is a frontend‑only Student Record Management System.  
It lets you add, view, update, delete, search, filter, and sort student records stored in a JavaScript array and saved in the browser using localStorage. [web:109][web:111]

## Features

- Create: Add a new student with roll, name, department, semester, and marks/CGPA  
- Read: Display all students in a simple HTML table  
- Update: Edit any existing student record  
- Delete: Remove a student from the list  
- Search:  
  - By roll number  
  - By name (partial match)  
- Filter:  
  - By department / branch  
  - By semester  
- Sort:  
  - By roll number (ascending)  
  - By marks / CGPA (descending)  
- Data Persistence: All data is stored in `localStorage`, so records stay after page refresh [web:93][web:103]

## Tech Stack

- HTML – structure and layout  
- CSS – basic styling for form and table  
- JavaScript – CRUD logic, search/filter/sort, and localStorage [web:109]

## Project Structure

```text
srms-project/
│
├── index.html    # Main UI (form, controls, table)
├── style.css     # Styling for layout, form, and table
├── script.js     # CRUD logic + localStorage + DOM handling
└── README.md     # Project documentation
